"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Category, Product } from "@/hooks/useInstantDB";



type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  onAddCategory?: () => void;
};

const EditProductModal: React.FC<Props> = ({
  open,
  onClose,
  product,
  categories,
  updateProduct,
  onAddCategory,
}) => {
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Sync ketika modal dibuka
  useEffect(() => {
    if (product) setEditProduct(product);
  }, [product]);

  const handleSave = () => {
    if (!editProduct) return;
    if (!editProduct.name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (!editProduct.price || editProduct.price <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }
    if (!editProduct.categoryId) {
      toast.error("Pilih kategori terlebih dahulu");
      return;
    }

    updateProduct(editProduct.id, {
      name: editProduct.name,
      price: editProduct.price,
      categoryId: editProduct.categoryId,
    });

    toast.success("Produk berhasil diperbarui");
    onClose();
  };

  if (!editProduct) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nama Produk */}
          <div>
            <Label htmlFor="edit-name" className="mb-4">Nama Produk</Label>
            <Input
              id="edit-name"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
          </div>

          {/* Harga Produk */}
          <div>
            <Label htmlFor="edit-price" className="mb-4">Harga</Label>
            <Input
              id="edit-price"
              type="number"
              min={0}
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  price: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Pilih Kategori */}
          <div>
            <Label>Kategori</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mt-2">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.icon);
                return (
                  <Button
                    key={category.id}
                    variant={
                      editProduct.categoryId === category.id ? "default" : "outline"
                    }
                    onClick={() =>
                      setEditProduct({ ...editProduct, categoryId: category.id })
                    }
                    className="h-auto p-3 flex items-center gap-2 justify-start"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium truncate">
                      {category.name}
                    </span>
                  </Button>
                );
              })}
            </div>
            {onAddCategory && (
              <Button
                variant="outline"
                onClick={onAddCategory}
                className="mt-2 w-full border-dashed border-primary text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori Baru
              </Button>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex gap-3 mt-6">
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
