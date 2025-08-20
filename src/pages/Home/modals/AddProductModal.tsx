"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { getCategoryIcon } from "@/lib/categoryIcons";
import { Category } from "@/hooks/useInstantDB";

 // pisahkan mapping icon ke file utils biar rapi

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  addProduct: (product: { name: string; price: number; categoryId: string }) => void;
  onAddCategory: () => void; // trigger untuk buka modal kategori
};

const AddProductModal: React.FC<Props> = ({
  open,
  onClose,
  categories,
  addProduct,
  onAddCategory,
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    categoryId: "",
  });

  const handleAdd = () => {
    if (!newProduct.name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      toast.error("Harga harus lebih dari 0");
      return;
    }
    if (!newProduct.categoryId) {
      toast.error("Pilih kategori terlebih dahulu");
      return;
    }

    addProduct(newProduct);
    toast.success("Produk berhasil ditambahkan");
    setNewProduct({ name: "", price: 0, categoryId: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nama Produk */}
          <div>
            <Label htmlFor="product-name" className="mb-4">Nama Produk</Label>
            <Input
              id="product-name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Masukkan nama produk"
            />
          </div>

          {/* Harga Produk */}
          <div>
            <Label htmlFor="product-price" className="mb-4">Harga</Label>
            <Input
              id="product-price"
              type="number"
              min={0}
              value={newProduct.price || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
              placeholder="Masukkan harga"
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
                      newProduct.categoryId === category.id ? "default" : "outline"
                    }
                    onClick={() =>
                      setNewProduct({ ...newProduct, categoryId: category.id })
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

            <Button
              variant="outline"
              onClick={onAddCategory}
              className="mt-2 w-full border-dashed border-primary text-primary hover:bg-primary/5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori Baru
            </Button>
          </div>
        </div>

        {/* Action */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setNewProduct({ name: "", price: 0, categoryId: "" });
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
