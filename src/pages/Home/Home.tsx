import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { id, init, tx } from '@instantdb/react';
import { Edit, MoreHorizontal, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ModeToggle } from '@/components/mode-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useOrientation from '@/hooks/useOrientation';
import { getCategoryIcon } from '@/lib/categoryIcons';
import AddCategoryModal from './modals/AddCategoryModal';
import AddProductModal from './modals/AddProductModal';
import EditProductModal from './modals/EditProductModal';

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
const ProductListPage = () => {
    const isPotrait = useOrientation();

    const db = init({
        appId: '8d8f5941-3c7b-4f08-a523-3cd8ff015948',
    });

    const { isLoading, error, data } = db.useQuery({
        products: { categories: {} },
        categories: {},
    });

    const products: any[] = data?.products || [];
    const categories: any[] = data?.categories || [];

    const addProduct = (product: Omit<Product, 'id'>) =>
        db.transact([
            tx.products[id()].update({
                ...product,
                createdAt: new Date(),
            }),
        ]);

    const updateProduct = (productId: string, updates: Partial<Product>) =>
        db.transact([
            tx.products[productId].update({
                ...updates,
                updatedAt: new Date(),
            }),
        ]);

    const deleteProduct = (productId: string) => db.transact([tx.products[productId].delete()]);

    const addCategory = (category: Omit<Category, 'id'>) =>
        db.transact([
            tx.categories[id()].create({
                ...category,
            }),
        ]);

    const getCategoryName = (categoryId: String) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'Tidak ada kategori';
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = useMemo(
        () => products.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
        [products, searchQuery, addProduct, editingProduct],
    );

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            deleteProduct(id);
            toast.success('Produk berhasil dihapus');
        }
    };

    if (isLoading) return <div className="p-10">Loading...</div>;
    if (error) return <div className="p-10 text-red-500">Error memuat data</div>;

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-background sticky top-0 z-40 border-b p-4">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-bold">Daftar Harga Produk</h1>
                    <ModeToggle />
                </div>
                <div className="relative flex gap-2">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                    <Input
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-primary border pl-8"
                    />
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-2 p-4">
                {filteredProducts.map((product: any, index: number) => {
                    const category = categories.find((cat: any) => cat.id === product.categoryId);
                    const IconComponent = getCategoryIcon(category?.icon);
                    const isEven = index % 2 === 0;

                    return (
                        <Card
                            key={product.id}
                            className={`transition-all duration-200 hover:shadow-md ${
                                isEven
                                    ? 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                            }`}
                        >
                            <CardContent className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-accent/80 rounded-lg p-2">
                                        <IconComponent className="text-accent-foreground h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3
                                            className={`text-foreground ${isPotrait && 'text-md w-25'} truncate font-semibold`}
                                        >
                                            {product.name}
                                        </h3>

                                        <p className="text-muted-foreground text-md">
                                            {getCategoryName(product.categoryId)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-primary text-md font-bold">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingProduct(product as any);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(product.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {filteredProducts.length === 0 && (
                    <div className="text-muted-foreground p-10 text-center">
                        <ShoppingCart className="mx-auto mb-2" />
                        {searchQuery ? 'Tidak ada produk cocok' : 'Belum ada produk'}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddProductModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                categories={categories}
                addProduct={addProduct}
                onAddCategory={() => setShowAddCategoryModal(true)}
            />

            <EditProductModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                product={editingProduct}
                categories={categories}
                updateProduct={updateProduct}
                onAddCategory={() => setShowAddCategoryModal(true)}
            />
            <AddCategoryModal
                open={showAddCategoryModal}
                onClose={() => setShowAddCategoryModal(false)}
                addCategory={addCategory}
            />
        </div>
    );
};

export default ProductListPage;
