import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Undo2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import AddCategoryModal from '@/components/modals/AddCategoryModal';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { id, init, tx } from '@instantdb/react';

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

const EditProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const db = init({
        appId: '8d8f5941-3c7b-4f08-a523-3cd8ff015948',
    });

    const { data } = db.useQuery({
        products: {
            $: {
                where: {
                    id: productId,
                },
            },
            categories: {},
        },
        categories: {},
    });

    const product: any = data?.products[0] || [];

    // console.log(product);
    const categories: any[] = data?.categories || [];

    const [editProduct, setEditProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (product) {
            setEditProduct({
                id: product.id,
                name: product.name,
                price: product.price,
                categoryId: product.categoryId,
            });
        }
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

        db.transact([
            tx.products[editProduct.id].update({
                ...editProduct,
                updatedAt: new Date(),
            }),
        ]);

        toast.success('Produk berhasil diperbarui');
        navigate('/');
    };
    const addCategory = (category: Omit<Category, 'id'>) =>
        db.transact([
            tx.categories[id()].create({
                ...category,
            }),
        ]);

    if (!editProduct) {
        return (
            <div className="bg-background min-h-screen">
                <div className="p-10 text-center">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-background sticky top-0 z-40 border-b p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Produk</h1>
                    <Button size="icon" onClick={() => navigate('/')}>
                        <Undo2 />
                        <span className="sr-only">Kembali</span>
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="space-y-6">
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
                            autoFocus
                        />
                    </div>

                    {/* Pilih Kategori */}
                    <div>
                        <Label className="mb-2 block text-base font-medium">
                            Kategori<span className="ml-1 text-red-500">*</span>
                        </Label>
                        <div className="bg-muted/20 mt-2 grid grid-cols-3 gap-3 rounded-lg border p-3">
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

                        <Button
                            variant="outline"
                            onClick={() => {
                                // TODO: Implement add category functionality
                                toast.info('Fitur tambah kategori akan segera hadir');
                            }}
                            className="border-primary text-primary hover:bg-primary/5 mt-3 h-12 w-full border-dashed"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kategori Baru
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/')} className="h-12 flex-1">
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="h-12 flex-1"
                        // disabled={!editProduct.name.trim() || !editProduct.price || !editProduct.categoryId}
                    >
                        Simpan
                    </Button>
                </div>
            </div>
            <AddCategoryModal
                open={showAddCategoryModal}
                onClose={() => setShowAddCategoryModal(false)}
                addCategory={addCategory}
            />
        </div>
    );
};

export default EditProductPage;
