'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getCategoryIcon } from '@/lib/categoryIcons';

type Category = {
    id: string;
    name: string;
    icon: any;
};
// pisahkan mapping icon ke file utils biar rapi

type Props = {
    open: boolean;
    onClose: () => void;
    categories: Category[];
    addProduct: (product: { name: string; price: number; categoryId: string }) => void;
    onAddCategory: () => void;
};

const AddProductModal: React.FC<Props> = ({ open, onClose, categories, addProduct, onAddCategory }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        categoryId: 'ac9928a9-cdd5-4d8e-b145-ab6353fb1440',
    });

    const handleAdd = () => {
        if (!newProduct.name.trim()) {
            toast.error('Nama produk wajib diisi');
            return;
        }
        if (!newProduct.price || newProduct.price <= 0) {
            toast.error('Harga harus lebih dari 0');
            return;
        }
        if (!newProduct.categoryId) {
            toast.error('Pilih kategori terlebih dahulu');
            return;
        }

        addProduct(newProduct);
        toast.success('Produk berhasil ditambahkan');
        setNewProduct({ name: '', price: 0, categoryId: 'ac9928a9-cdd5-4d8e-b145-ab6353fb1440' });
        onClose();
    };

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
        <Dialog open={open} onOpenChange={onClose} modal={true}>
            <DialogContent
                className="min-h-screen w-screen max-w-none overflow-y-auto rounded-none p-6 focus:outline-none"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    maxHeight: 'calc(var(--vh, 1vh) * 100)',
                }}
                showCloseButton={false}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                    onClose();
                }}
            >
                {/* Header - Fixed */}
                <DialogHeader className="bg-background flex-shrink-0 border-b p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Tambah Produk Baru</DialogTitle>
                        <Button
                            size="icon"
                            onClick={() => {
                                setNewProduct({
                                    name: '',
                                    price: 0,
                                    categoryId: 'ac9928a9-cdd5-4d8e-b145-ab6353fb1440',
                                });
                                onClose();
                            }}
                            className="h-10 w-10"
                        >
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
                            <Label htmlFor="product-name" className="mb-2 block text-base font-medium">
                                Nama Produk<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                id="product-name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                            <Label htmlFor="product-price" className="mb-2 block text-base font-medium">
                                Harga<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                id="product-price"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                value={newProduct.price || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
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
                                Pilih Kategori<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <div className="bg-muted/20 mt-2 grid max-h-64 grid-cols-2 gap-3 overflow-y-auto rounded-lg border p-3">
                                {categories.map((category) => {
                                    const Icon = getCategoryIcon(category.icon);
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={newProduct.categoryId === category.id ? 'default' : 'outline'}
                                            onClick={() => setNewProduct({ ...newProduct, categoryId: category.id })}
                                            className="flex h-16 flex-col items-center justify-center gap-2 p-3"
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="truncate text-xs font-medium">{category.name}</span>
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={onAddCategory}
                                className="border-primary text-primary hover:bg-primary/5 mt-3 h-12 w-full border-dashed"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Kategori Baru
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="bg-background flex-shrink-0 border-t p-6 pt-4">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNewProduct({
                                    name: '',
                                    price: 0,
                                    categoryId: 'ac9928a9-cdd5-4d8e-b145-ab6353fb1440',
                                });
                                onClose();
                            }}
                            className="h-12 flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAdd}
                            className="h-12 flex-1"
                            disabled={!newProduct.name.trim() || !newProduct.price || !newProduct.categoryId}
                        >
                            Tambah
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductModal;
