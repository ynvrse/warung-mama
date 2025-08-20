import { useState, useMemo } from "react";
import { Search, Plus, ShoppingCart, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import AddProductModal from "./modals/AddProductModal";
import EditProductModal from "./modals/EditProductModal";
import AddCategoryModal from "./modals/AddCategoryModal";
import { useInstantDB } from "@/hooks/useInstantDB";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ProductListPage = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    getCategoryIcon,
    getCategoryName,
    isLoading,
    error,
  } = useInstantDB();



  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // ✅ pakai useMemo biar tidak re-render terus
  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      deleteProduct(id);
      toast.success("Produk berhasil dihapus");
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">Error memuat data</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 z-40">
        <h1 className="text-2xl font-bold mb-2">Daftar Produk</h1>
        <div className="flex gap-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 " />
            <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 border border-primary"
          />
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-2">
        {filteredProducts.map((product, index) => {
             const category = categories.find(cat => cat.id === product.categoryId);
             const IconComponent = getCategoryIcon(category?.icon);
             const isEven = index % 2 === 0;
             
             return (
               <Card 
                 key={product.id} 
                 className={`transition-all duration-200 hover:shadow-md ${
                   isEven 
                     ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800' 
                     : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                 }`}
               >
                 <CardContent className="px-4  flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-accent/20 rounded-lg">
                       <IconComponent className="h-6 w-6 text-accent-foreground" />
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                       <p className="text-muted-foreground">{getCategoryName(product.categoryId)}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <span className="text-xl font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</span>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <MoreHorizontal className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => {
                    setEditingProduct(product);
                    setShowEditModal(true);
                  }}>
                           <Edit className="h-4 w-4 mr-2" />
                           Edit
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                         onClick={() => handleDelete(product.id)}
                           className="text-destructive"
                         >
                           <Trash2 className="h-4 w-4 mr-2" />
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
          <div className="text-center p-10 text-muted-foreground">
            <ShoppingCart className="mx-auto mb-2" />
            {searchQuery ? "Tidak ada produk cocok" : "Belum ada produk"}
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
