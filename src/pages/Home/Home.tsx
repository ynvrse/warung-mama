import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { init, tx } from '@instantdb/react';
import {
    AlertTriangle,
    ArrowDown,
    ArrowDownAZ,
    ArrowUp,
    ArrowUpDown,
    Calendar,
    CheckCircle,
    DollarSign,
    Edit,
    Filter,
    FunnelPlus,
    FunnelX,
    MoreHorizontal,
    Plus,
    Search,
    ShoppingCart,
    SortAsc,
    SortDesc,
    Trash2,
    X,
    XCircle,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useOrientation from '@/hooks/useOrientation';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { env } from '@/lib/env';

type SortField = 'name' | 'price' | 'createdAt' | 'category';
type SortOrder = 'asc' | 'desc';
type PriceRange = 'all' | 'under-50k' | '50k-100k' | '100k-500k' | 'over-500k';

interface FilterState {
    search: string;
    categoryId: string;
    sortField: SortField;
    sortOrder: SortOrder;
    priceRange: PriceRange;
}

const ProductListPage = () => {
    const navigate = useNavigate();
    const isPotrait = useOrientation();

    const db = init({
        appId: env.instantDbAppId,
    });

    const { isLoading, error, data } = db.useQuery({
        products: {
            $: {
                order: {
                    serverCreatedAt: 'desc',
                },
            },
            categories: {},
        },
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
        return category ? category.name : null;
    };

    // Advanced Filter State
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categoryId: '',
        sortField: 'createdAt',
        sortOrder: 'desc',
        priceRange: 'all',
    });

    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);

    // Price range helper
    const getPriceRangeFilter = (price: number, range: PriceRange): boolean => {
        switch (range) {
            case 'under-50k':
                return price < 50000;
            case '50k-100k':
                return price >= 50000 && price < 100000;
            case '100k-500k':
                return price >= 100000 && price < 500000;
            case 'over-500k':
                return price >= 500000;
            default:
                return true;
        }
    };

    // Advanced filtering and sorting
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter((p: any) => {
            const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = filters.categoryId === '' || p.categoryId === filters.categoryId;
            const matchesPriceRange = getPriceRangeFilter(p.price, filters.priceRange);
            return matchesSearch && matchesCategory && matchesPriceRange;
        });

        // Sorting
        filtered.sort((a: any, b: any) => {
            let comparison = 0;

            switch (filters.sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'createdAt':
                    comparison = new Date(a.serverCreatedAt).getTime() - new Date(b.serverCreatedAt).getTime();
                    break;
                case 'category':
                    const categoryA = getCategoryName(a.categoryId) || '';
                    const categoryB = getCategoryName(b.categoryId) || '';
                    comparison = categoryA.localeCompare(categoryB);
                    break;
            }

            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [products, filters]);

    // Statistics
    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        products.forEach((product: any) => {
            stats[product.categoryId] = (stats[product.categoryId] || 0) + 1;
        });
        return stats;
    }, [products]);

    const priceStats = useMemo(() => {
        const ranges = {
            'under-50k': 0,
            '50k-100k': 0,
            '100k-500k': 0,
            'over-500k': 0,
        };

        products.forEach((product: any) => {
            const price = product.price;
            if (price < 50000) ranges['under-50k']++;
            else if (price < 100000) ranges['50k-100k']++;
            else if (price < 500000) ranges['100k-500k']++;
            else ranges['over-500k']++;
        });

        return ranges;
    }, [products]);

    const handleDelete = (id: string, productName?: string) => {
        toast.custom(
            (t) => (
                <div className="bg-background w-full rounded-md border border-gray-500 p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Hapus produk ini?</span>
                            {productName && <span className="text-muted-foreground text-xs">{productName}</span>}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toast.dismiss(t)}
                            className="h-8 border border-gray-500 px-3"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                                try {
                                    toast.dismiss(t);

                                    const loadingToast = toast.loading('Menghapus produk...');

                                    await deleteProduct(id);

                                    toast.dismiss(loadingToast);
                                    toast.success(
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Produk berhasil dihapus</span>
                                        </div>,
                                    );
                                } catch (error) {
                                    toast.error(
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <span>Gagal menghapus produk</span>
                                        </div>,
                                    );
                                }
                            }}
                            className="h-8 px-3"
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            ),
            {
                duration: 5000,
                position: 'top-center',
            },
        );
    };

    const updateFilter = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            search: '',
            categoryId: '',
            sortField: 'createdAt',
            sortOrder: 'desc',
            priceRange: 'all',
        });
    };

    const toggleSort = (field: SortField) => {
        if (filters.sortField === field) {
            updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            updateFilter('sortField', field);
            updateFilter('sortOrder', 'asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (filters.sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
        return filters.sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.categoryId) count++;
        if (filters.priceRange !== 'all') count++;
        if (filters.sortField !== 'createdAt' || filters.sortOrder !== 'desc') count++;
        return count;
    };

    const selectedCategory = categories.find((cat) => cat.id === filters.categoryId);
    const activeFiltersCount = getActiveFiltersCount();

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

                    {/* Search and Basic Controls */}
                    <div className="space-y-3">
                        <div className="relative flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                className="border-primary relative rounded-sm border"
                            >
                                <FunnelPlus className="h-4 w-4" />
                                {activeFiltersCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                                    >
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                            </Button>

                            <Search className="text-muted-foreground absolute top-1/2 left-13 h-5 w-5 -translate-y-1/2 transform" />
                            <Input
                                placeholder="Cari produk..."
                                value={filters.search}
                                onChange={(e) => updateFilter('search', e.target.value)}
                                className="border-primary border pl-8"
                            />

                            <Button onClick={() => navigate('/add-product')}>
                                <Plus className="h-4 w-4" />
                                Tambah
                            </Button>
                        </div>

                        {/* Active Filters Display */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-muted-foreground text-sm">Filter aktif:</span>

                                {/* Search Filter */}
                                {filters.search && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Search className="h-3 w-3" />"{filters.search}"
                                        <button
                                            onClick={() => updateFilter('search', '')}
                                            className="hover:bg-secondary/80 ml-1 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                {/* Category Filter */}
                                {selectedCategory && (
                                    <Badge variant="secondary" className="gap-1">
                                        {(() => {
                                            const Icon = getCategoryIcon(selectedCategory.icon);
                                            return <Icon className="h-3 w-3" />;
                                        })()}
                                        {selectedCategory.name}
                                        <button
                                            onClick={() => updateFilter('categoryId', '')}
                                            className="hover:bg-secondary/80 ml-1 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                {/* Price Range Filter */}
                                {filters.priceRange !== 'all' && (
                                    <Badge variant="secondary" className="gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {filters.priceRange === 'under-50k' && 'Di bawah 50k'}
                                        {filters.priceRange === '50k-100k' && '50k - 100k'}
                                        {filters.priceRange === '100k-500k' && '100k - 500k'}
                                        {filters.priceRange === 'over-500k' && 'Di atas 500k'}
                                        <button
                                            onClick={() => updateFilter('priceRange', 'all')}
                                            className="hover:bg-secondary/80 ml-1 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                {/* Sort Filter */}
                                {(filters.sortField !== 'createdAt' || filters.sortOrder !== 'desc') && (
                                    <Badge variant="secondary" className="gap-1">
                                        {filters.sortOrder === 'asc' ? (
                                            <SortAsc className="h-3 w-3" />
                                        ) : (
                                            <SortDesc className="h-3 w-3" />
                                        )}
                                        {filters.sortField === 'name' && 'Nama'}
                                        {filters.sortField === 'price' && 'Harga'}
                                        {filters.sortField === 'createdAt' && 'Tanggal'}
                                        {filters.sortField === 'category' && 'Kategori'}
                                        <button
                                            onClick={() => {
                                                updateFilter('sortField', 'createdAt');
                                                updateFilter('sortOrder', 'desc');
                                            }}
                                            className="hover:bg-secondary/80 ml-1 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}

                                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                                    <FunnelX className="mr-1 h-4 w-4" />
                                    Hapus Semua
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Advanced Filter Panel */}
                {showAdvancedFilter && (
                    <div className="bg-muted/30 border-t p-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Filter & Pengurutan Lanjutan</h3>
                                <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilter(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Sorting Options */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Urutkan Berdasarkan</label>
                                    <div className="space-y-1">
                                        <Button
                                            variant={filters.sortField === 'name' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => toggleSort('name')}
                                        >
                                            <span className="flex items-center gap-2">
                                                <ArrowDownAZ className="h-4 w-4" />
                                                Nama
                                            </span>
                                            {getSortIcon('name')}
                                        </Button>
                                        <Button
                                            variant={filters.sortField === 'price' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => toggleSort('price')}
                                        >
                                            <span className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                Harga
                                            </span>
                                            {getSortIcon('price')}
                                        </Button>
                                        <Button
                                            variant={filters.sortField === 'createdAt' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => toggleSort('createdAt')}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Tanggal
                                            </span>
                                            {getSortIcon('createdAt')}
                                        </Button>
                                        <Button
                                            variant={filters.sortField === 'category' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => toggleSort('category')}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Filter className="h-4 w-4" />
                                                Kategori
                                            </span>
                                            {getSortIcon('category')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rentang Harga</label>
                                    <div className="space-y-1">
                                        <Button
                                            variant={filters.priceRange === 'all' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => updateFilter('priceRange', 'all')}
                                        >
                                            Semua Harga
                                            <span className="text-xs">({products.length})</span>
                                        </Button>
                                        <Button
                                            variant={filters.priceRange === 'under-50k' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => updateFilter('priceRange', 'under-50k')}
                                        >
                                            &lt; Rp 50.000
                                            <span className="text-xs">({priceStats['under-50k']})</span>
                                        </Button>
                                        <Button
                                            variant={filters.priceRange === '50k-100k' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => updateFilter('priceRange', '50k-100k')}
                                        >
                                            Rp 50k - 100k
                                            <span className="text-xs">({priceStats['50k-100k']})</span>
                                        </Button>
                                        <Button
                                            variant={filters.priceRange === '100k-500k' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => updateFilter('priceRange', '100k-500k')}
                                        >
                                            Rp 100k - 500k
                                            <span className="text-xs">({priceStats['100k-500k']})</span>
                                        </Button>
                                        <Button
                                            variant={filters.priceRange === 'over-500k' ? 'default' : 'outline'}
                                            size="sm"
                                            className="w-full justify-between"
                                            onClick={() => updateFilter('priceRange', 'over-500k')}
                                        >
                                            &gt; Rp 500.000
                                            <span className="text-xs">({priceStats['over-500k']})</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-sm font-medium">Statistik</label>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-card rounded-lg border p-3">
                                            <div className="text-primary text-2xl font-bold">
                                                {filteredAndSortedProducts.length}
                                            </div>
                                            <div className="text-muted-foreground">Produk Ditampilkan</div>
                                        </div>
                                        <div className="bg-card rounded-lg border p-3">
                                            <div className="text-2xl font-bold text-green-600">
                                                Rp{' '}
                                                {filteredAndSortedProducts
                                                    .reduce((sum, p) => sum + p.price, 0)
                                                    .toLocaleString('id-ID')}
                                            </div>
                                            <div className="text-muted-foreground">Total Nilai</div>
                                        </div>
                                        <div className="bg-card rounded-lg border p-3">
                                            <div className="text-2xl font-bold text-blue-600">
                                                Rp{' '}
                                                {filteredAndSortedProducts.length > 0
                                                    ? Math.round(
                                                          filteredAndSortedProducts.reduce(
                                                              (sum, p) => sum + p.price,
                                                              0,
                                                          ) / filteredAndSortedProducts.length,
                                                      ).toLocaleString('id-ID')
                                                    : 0}
                                            </div>
                                            <div className="text-muted-foreground">Harga Rata-rata</div>
                                        </div>
                                        <div className="bg-card rounded-lg border p-3">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {categories.filter((c) => c.name !== 'Default').length}
                                            </div>
                                            <div className="text-muted-foreground">Kategori Aktif</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Filter Panel */}
                {showCategoryFilter && (
                    <div className="bg-muted/30 border-t p-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Filter berdasarkan Kategori</h3>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant={activeFiltersCount > 0 ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => {
                                            setShowAdvancedFilter(!showAdvancedFilter);
                                            setShowCategoryFilter(false);
                                        }}
                                        className="border-primary relative rounded-sm border"
                                    >
                                        <Zap className="h-4 w-4" />
                                    </Button>

                                    <Button variant="ghost" size="sm" onClick={() => setShowCategoryFilter(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
                                {/* Semua Kategori */}
                                <button
                                    onClick={() => updateFilter('categoryId', '')}
                                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:shadow-sm ${
                                        filters.categoryId === ''
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
                                                onClick={() => updateFilter('categoryId', category.id)}
                                                className={`flex flex-col items-center gap-2 rounded-md border-2 p-3 transition-all hover:shadow-sm ${
                                                    filters.categoryId === category.id
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
            {activeFiltersCount > 0 && (
                <div className="bg-muted/20 px-4 py-2">
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <span>
                            Menampilkan {filteredAndSortedProducts.length} dari {products.length} produk
                        </span>
                        {filteredAndSortedProducts.length > 0 && (
                            <span>
                                Total: Rp{' '}
                                {filteredAndSortedProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="space-y-2 p-4">
                {filteredAndSortedProducts.map((product: any, index: number) => {
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
                                                onClick={() => handleDelete(product.id, product.name)}
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
                {filteredAndSortedProducts.length === 0 && (
                    <div className="text-muted-foreground space-y-4 p-10 text-center">
                        <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                            <ShoppingCart className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-foreground mb-2 text-lg font-medium">
                                {activeFiltersCount > 0 ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
                            </h3>
                            <p className="mb-4 text-sm">
                                {activeFiltersCount > 0
                                    ? 'Coba ubah filter atau kata kunci pencarian'
                                    : 'Mulai tambahkan produk untuk melihat daftar harga'}
                            </p>
                            {activeFiltersCount > 0 && (
                                <Button variant="outline" onClick={clearAllFilters}>
                                    Hapus Filter
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
