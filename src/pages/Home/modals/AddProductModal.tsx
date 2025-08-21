'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="h-screen w-screen max-w-none overflow-y-auto rounded-none p-6"
                showCloseButton={false}
            >
                <DialogHeader className="mt-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Tambah Produk Baru</DialogTitle>
                        <DialogClose asChild>
                            <Button
                                size={'icon'}
                                onClick={() => {
                                    setNewProduct({
                                        name: '',
                                        price: 0,
                                        categoryId: 'ac9928a9-cdd5-4d8e-b145-ab6353fb1440',
                                    });
                                    onClose();
                                }}
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="-mt-12 space-y-4">
                    {/* Nama Produk */}
                    <div>
                        <Label htmlFor="product-name" className="mb-4">
                            Nama Produk<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            autoFocus
                            id="product-name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Masukkan nama produk"
                        />
                    </div>

                    {/* Harga Produk */}
                    <div>
                        <Label htmlFor="product-price" className="mb-4">
                            Harga<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="product-price"
                            type="number"
                            min={0}
                            value={newProduct.price || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            placeholder="Masukkan harga"
                        />
                    </div>

                    {/* Pilih Kategori */}
                    <div>
                        <Label>
                            Pilih Kategori<span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category.icon);
                                return (
                                    <Button
                                        key={category.id}
                                        variant={newProduct.categoryId === category.id ? 'default' : 'outline'}
                                        onClick={() => setNewProduct({ ...newProduct, categoryId: category.id })}
                                        className="flex h-auto flex-col items-center justify-start gap-2 p-3"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="truncate text-sm font-medium">{category.name}</span>
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            onClick={onAddCategory}
                            className="border-primary text-primary hover:bg-primary/5 mt-2 w-full border-dashed"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kategori Baru
                        </Button>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex gap-3">
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
                        className="flex-1"
                    >
                        Batal
                    </Button>
                    <Button onClick={handleAdd} className="flex-1">
                        Tambah
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductModal;
