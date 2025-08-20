"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { availableIcons } from "@/lib/categoryIcons";

export type Category = {
  id: string;
  name: string;
  icon: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  addCategory: (category: Omit<Category, "id">) => void;
};

const AddCategoryModal: React.FC<Props> = ({ open, onClose, addCategory }) => {
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });

  const handleAdd = () => {
    if (!newCategory.name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    if (!newCategory.icon) {
      toast.error("Pilih ikon kategori terlebih dahulu");
      return;
    }

    addCategory(newCategory);
    toast.success("Kategori berhasil ditambahkan");
    setNewCategory({ name: "", icon: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cat-name">Nama Kategori</Label>
            <Input
              id="cat-name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Masukkan nama kategori"
            />
          </div>

          <div>
            <Label>Pilih Icon</Label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mt-2">
              {availableIcons.map((iconOption) => {
                const Icon = iconOption.component;
                return (
                  <Button
                    key={iconOption.key}
                    variant={
                      newCategory.icon === iconOption.key ? "default" : "outline"
                    }
                    onClick={() =>
                      setNewCategory({ ...newCategory, icon: iconOption.key })
                    }
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-center">
                      {iconOption.name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setNewCategory({ name: "", icon: "" });
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

export default AddCategoryModal;
