'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Product = {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    createdAt?: Date;
    updatedAt?: Date;
};

type Category = {
    id: string;
    name: string;
    icon: any;
};

type Props = {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    categories: Category[];
    updateProduct: (id: string, updates: Partial<Product>) => void;
    onAddCategory?: () => void;
};

const EditProductModal: React.FC<Props> = ({ open, onClose, product, categories, updateProduct, onAddCategory }) => {
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // Sync ketika modal dibuka
    useEffect(() => {
        if (product) setEditProduct(product);
    }, [product]);

    useEffect(() => {
        if (open) {
            // Lock body scroll when modal is open
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = '0';

            // Handle viewport height changes (keyboard show/hide)
            const handleResize = () => {
                // Force recalculation of viewport height
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };

            handleResize();
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('orientationchange', handleResize);
            };
        } else {
            // Restore body scroll when modal is closed
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        }
    }, [open]);

    const handleSave = () => {
        if (!editProduct) return;
        if (!editProduct.name.trim()) {
            toast.error('Nama produk wajib diisi');
            return;
        }
        if (!editProduct.price || editProduct.price <= 0) {
            toast.error('Harga harus lebih dari 0');
            return;
        }
        if (!editProduct.categoryId) {
            toast.error('Pilih kategori terlebih dahulu');
            return;
        }

        updateProduct(editProduct.id, {
            name: editProduct.name,
            price: editProduct.price,
            categoryId: editProduct.categoryId,
        });

        toast.success('Produk berhasil diperbarui');
        onClose();
    };

    if (!editProduct) return null;

    return (
        <Dialog open={open} onOpenChange={onClose} modal={true}>
            <DialogContent
                className="min-h-screen w-screen max-w-none overflow-y-auto rounded-none p-6 focus:outline-none"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    maxHeight: 'calc(var(--vh, 1vh) * 100)',
                }}
                showCloseButton={false}
                onOpenAutoFocus={(e) => {
                    // Prevent auto focus that might trigger keyboard
                    e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                    // Optional: Add haptic feedback or visual indication
                    // that the modal can't be closed by tapping outside
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                    onClose();
                }}
            >
                {/* Header - Fixed */}
                <DialogHeader className="bg-background flex-shrink-0 border-b p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Edit Produk</DialogTitle>
                        <Button size="icon" variant="ghost" onClick={onClose} className="h-10 w-10">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                </DialogHeader>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-6">
                    <div className="space-y-6 py-6">
                        {/* Nama Produk */}
                        <div>
                            <Label htmlFor="edit-name" className="mb-2 block text-base font-medium">
                                Nama Produk<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={editProduct.name}
                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                placeholder="Masukkan nama produk"
                                className="h-12 text-base"
                                onFocus={(e) => {
                                    // Scroll into view when focused to ensure visibility above keyboard
                                    setTimeout(() => {
                                        e.target.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center',
                                        });
                                    }, 300);
                                }}
                            />
                        </div>

                        {/* Harga Produk */}
                        <div>
                            <Label htmlFor="edit-price" className="mb-2 block text-base font-medium">
                                Harga<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-price"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                value={editProduct.price === 0 ? '' : editProduct.price}
                                onChange={(e) =>
                                    setEditProduct({
                                        ...editProduct,
                                        price: e.target.value === '' ? 0 : Number(e.target.value),
                                    })
                                }
                                placeholder="Masukkan harga"
                                className="h-12 text-base"
                                onFocus={(e) => {
                                    setTimeout(() => {
                                        e.target.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center',
                                        });
                                    }, 300);
                                }}
                            />
                        </div>

                        {/* Pilih Kategori */}
                        <div>
                            <Label className="mb-2 block text-base font-medium">
                                Kategori<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <div className="bg-muted/20 mt-2 grid max-h-64 grid-cols-2 gap-3 overflow-y-auto rounded-lg border p-3">
                                {categories.map((category) => {
                                    const Icon = getCategoryIcon(category.icon);
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={editProduct.categoryId === category.id ? 'default' : 'outline'}
                                            onClick={() => setEditProduct({ ...editProduct, categoryId: category.id })}
                                            className="flex h-16 flex-col items-center justify-center gap-2 p-3"
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="truncate text-xs font-medium">{category.name}</span>
                                        </Button>
                                    );
                                })}
                            </div>

                            {onAddCategory && (
                                <Button
                                    variant="outline"
                                    onClick={onAddCategory}
                                    className="border-primary text-primary hover:bg-primary/5 mt-3 h-12 w-full border-dashed"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kategori Baru
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="bg-background flex-shrink-0 border-t p-6 pt-4">
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="h-12 flex-1">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="h-12 flex-1"
                            disabled={!editProduct.name.trim() || !editProduct.price || !editProduct.categoryId}
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
