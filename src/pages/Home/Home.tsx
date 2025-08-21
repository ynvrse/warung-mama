import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { init, tx } from '@instantdb/react';
import { Edit, Filter, FunnelPlus, FunnelX, MoreHorizontal, Plus, Search, ShoppingCart, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ProductListPage = () => {
    const navigate = useNavigate();
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

    const deleteProduct = (productId: string) => db.transact([tx.products[productId].delete()]);

    const getCategoryName = (categoryId: String) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category?.name === 'Default') {
            return;
        }
        return category ? category.name : 'Tidak ada kategori';
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);

    // Filter products berdasarkan search dan kategori
    const filteredProducts = useMemo(() => {
        return products.filter((p: any) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategoryId === '' || p.categoryId === selectedCategoryId;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategoryId]);

    // Hitung jumlah produk per kategori
    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        products.forEach((product: any) => {
            stats[product.categoryId] = (stats[product.categoryId] || 0) + 1;
        });
        return stats;
    }, [products]);

    const handleDelete = (id: string) => {
        toast.info('Yakin ingin menghapus produk ini?', {
            action: {
                label: 'Hapus',
                onClick: () => {
                    deleteProduct(id);
                    toast.success('Produk berhasil dihapus');
                },
            },
        });
    };

    const clearFilters = () => {
        setSelectedCategoryId('');
        setSearchQuery('');
    };

    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

    if (isLoading) return <div className="p-10">Loading...</div>;
    if (error) return <div className="p-10 text-red-500">Error memuat data</div>;

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-background sticky top-0 z-40 border-b">
                <div className="p-4">
                    <div className="-mt-4 flex items-center justify-between py-4">
                        <h1 className="text-2xl font-bold">Daftar Harga Produk</h1>
                        <ModeToggle />
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="space-y-3">
                        <div className="relative flex gap-2">
                            {selectedCategoryId ? (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={clearFilters}
                                    className="border-primary bg-primary/20 rounded-sm border"
                                >
                                    <FunnelX className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size={'icon'}
                                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                    className="border-primary bg-background rounded-sm border"
                                >
                                    <FunnelPlus className="h-4 w-4" />
                                </Button>
                            )}
                            <Search className="text-muted-foreground absolute top-1/2 left-14 h-5 w-5 -translate-y-1/2 transform" />
                            <Input
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-primary border pl-8"
                            />

                            <Button onClick={() => navigate('/add-product')}>
                                <Plus className="h-4 w-4" />
                                Tambah
                            </Button>
                        </div>

                        {/* Active Filters Display */}
                        {(selectedCategoryId || searchQuery) && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-muted-foreground text-sm">Filter aktif:</span>
                                {selectedCategory && (
                                    <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-1 text-sm">
                                        {(() => {
                                            const Icon = getCategoryIcon(selectedCategory.icon);
                                            return <Icon className="h-3 w-3" />;
                                        })()}
                                        <span>{selectedCategory.name}</span>
                                        <button
                                            onClick={() => setSelectedCategoryId('')}
                                            className="hover:bg-primary/20 ml-1 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                {searchQuery && (
                                    <div className="bg-secondary flex items-center gap-1 rounded-full px-2 py-1 text-sm">
                                        <Search className="h-3 w-3" />
                                        <span>"{searchQuery}"</span>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="hover:bg-secondary/80 ml-1 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Filter Panel */}
                {showCategoryFilter && (
                    <div className="bg-muted/30 border-t p-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Filter berdasarkan Kategori</h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowCategoryFilter(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
                                {/* Semua Kategori */}
                                <button
                                    onClick={() => setSelectedCategoryId('')}
                                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:shadow-sm ${
                                        selectedCategoryId === ''
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                >
                                    <div className="bg-accent flex items-center rounded-lg border border-gray-500 p-2">
                                        <Filter className="text-accent-foreground h-6 w-6" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-medium">Semua</div>
                                        <div className="text-muted-foreground text-xs">{products.length} produk</div>
                                    </div>
                                </button>

                                {/* Kategori Individual */}
                                {categories
                                    .filter((cat) => cat.name !== 'Default')
                                    .map((category) => {
                                        const Icon = getCategoryIcon(category.icon);
                                        const count = categoryStats[category.id] || 0;

                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategoryId(category.id)}
                                                className={`flex flex-col items-center gap-2 rounded-md border-2 p-3 transition-all hover:shadow-sm ${
                                                    selectedCategoryId === category.id
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border hover:border-primary/50'
                                                }`}
                                            >
                                                <div className="bg-accent flex items-center rounded-lg border border-gray-500 p-2">
                                                    <Icon className="text-accent-foreground h-6 w-6" />
                                                </div>
                                                <div className="text-center">
                                                    <div className="max-w-[80px] truncate text-sm font-medium">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">{count} produk</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            {(selectedCategoryId || searchQuery) && (
                <div className="bg-muted/20 px-4 py-2">
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <span>
                            Menampilkan {filteredProducts.length} dari {products.length} produk
                        </span>
                        {filteredProducts.length > 0 && (
                            <span>
                                Total: Rp{' '}
                                {filteredProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="space-y-2 p-4">
                {filteredProducts.map((product: any, index: number) => {
                    const category = categories.find((cat: any) => cat.id === product.categoryId);
                    const IconComponent = getCategoryIcon(category?.icon);
                    const isEven = index % 2 === 0;

                    return (
                        <Card
                            key={product.id}
                            className={`border border-gray-500 transition-all duration-200 hover:shadow-md ${
                                isEven
                                    ? 'bg-secondary hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800'
                                    : 'bg-accent/50 hover:bg-accent dark:bg-gray-800 dark:hover:bg-gray-700'
                            }`}
                        >
                            <CardContent className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`${isEven ? 'bg-accent' : 'bg-secondary'} rounded-lg border border-gray-500 p-2`}
                                    >
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
                                            <DropdownMenuItem onClick={() => navigate(`/edit-product/${product.id}`)}>
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

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-muted-foreground space-y-4 p-10 text-center">
                        <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                            <ShoppingCart className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-foreground mb-2 text-lg font-medium">
                                {searchQuery || selectedCategoryId ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
                            </h3>
                            <p className="mb-4 text-sm">
                                {searchQuery || selectedCategoryId
                                    ? 'Coba ubah filter atau kata kunci pencarian'
                                    : 'Mulai tambahkan produk untuk melihat daftar harga'}
                            </p>
                            {(searchQuery || selectedCategoryId) && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Hapus Filter
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {/* <AddProductModal
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
            /> */}
        </div>
    );
};

export default ProductListPage;
