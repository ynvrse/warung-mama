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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="min-h-screen w-screen max-w-none overflow-y-auto rounded-none p-6"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    maxHeight: 'calc(var(--vh, 1vh) * 100)',
                }}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    document.getElementById('edit-price')?.focus();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                    onClose();
                }}
                showCloseButton={false}
            >
                <DialogHeader className="mt-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Tambah Produk Baru</DialogTitle>
                        {/* <DialogClose asChild> */}
                        <Button size={'icon'} onClick={onClose}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                        {/* </DialogClose> */}
                    </div>
                </DialogHeader>

                <div className="-mt-12 space-y-4">
                    {/* Nama Produk */}
                    <div>
                        <Label htmlFor="edit-name" className="mb-4">
                            Nama Produk
                        </Label>
                        <Input
                            id="edit-name"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        />
                    </div>

                    {/* Harga Produk */}
                    <div>
                        <Label htmlFor="edit-price" className="mb-4">
                            Harga
                        </Label>
                        <Input
                            id="edit-price"
                            type="number"
                            min={0}
                            value={editProduct.price === 0 ? '' : editProduct.price}
                            onChange={(e) =>
                                setEditProduct({
                                    ...editProduct,
                                    price: e.target.value === '' ? 0 : Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    {/* Pilih Kategori */}
                    <div>
                        <Label>Kategori</Label>
                        <div className="mt-2 grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category.icon);
                                return (
                                    <Button
                                        key={category.id}
                                        variant={editProduct.categoryId === category.id ? 'default' : 'outline'}
                                        onClick={() => setEditProduct({ ...editProduct, categoryId: category.id })}
                                        className="flex h-auto flex-col items-center justify-start gap-2 p-3"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="truncate text-sm font-medium">{category.name}</span>
                                    </Button>
                                );
                            })}
                        </div>
                        {onAddCategory && (
                            <Button
                                variant="outline"
                                onClick={onAddCategory}
                                className="border-primary text-primary hover:bg-primary/5 mt-2 w-full border-dashed"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Kategori Baru
                            </Button>
                        )}
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button onClick={handleSave} className="flex-1">
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
