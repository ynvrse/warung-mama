'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { availableIcons } from '@/lib/categoryIcons';
import { env } from '@/lib/env';
import { id, init, tx } from '@instantdb/react';
import { AlertTriangle, Edit3, Plus, Trash2, Undo2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type Category = {
    id: string;
    name: string;
    icon: string;
};

type Props = {
    addCategory?: (category: Omit<Category, 'id'>) => void;
};

const AddCategoryPage: React.FC<Props> = () => {
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: 'default' });
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const db = init({
        appId: env.instantDbAppId,
    });

    // Query all categories from InstantDB
    const { data } = db.useQuery({
        categories: {},
    });

    const categories = data?.categories.filter((c: any) => c.name !== 'Default') || [];

    const addCategory = (category: Omit<Category, 'id'>) =>
        db.transact([
            tx.categories[id()].create({
                ...category,
            }),
        ]);

    const updateCategory = (categoryId: string, updates: Partial<Category>) =>
        db.transact([
            tx.categories[categoryId].update({
                ...updates,
            }),
        ]);

    const deleteCategory = (categoryId: string) => db.transact([tx.categories[categoryId].delete()]);

    const handleAdd = () => {
        if (!newCategory.name.trim()) {
            toast.error('Nama kategori wajib diisi');
            return;
        }
        if (!newCategory.icon) {
            toast.error('Pilih ikon kategori terlebih dahulu');
            return;
        }

        addCategory({
            name: newCategory.name.trim(),
            icon: newCategory.icon,
        });
        toast.success('Kategori berhasil ditambahkan');
        setNewCategory({ name: '', icon: 'default' });
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        setNewCategory({
            name: category.name,
            icon: category.icon,
        });
    };

    const handleUpdateCategory = () => {
        if (!editingCategory) return;

        if (!newCategory.name.trim()) {
            toast.error('Nama kategori wajib diisi');
            return;
        }
        if (!newCategory.icon) {
            toast.error('Pilih ikon kategori terlebih dahulu');
            return;
        }

        updateCategory(editingCategory.id, {
            name: newCategory.name.trim(),
            icon: newCategory.icon,
        });
        toast.success('Kategori berhasil diperbarui');
        setEditingCategory(null);
        setNewCategory({ name: '', icon: 'default' });
    };

    const handleDeleteCategory = (category: any) => {
        toast.custom((t) => (
            <div className="bg-background w-full space-y-4 rounded-md border p-4 shadow-lg">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Hapus kategori ini?</span>
                        <span className="text-muted-foreground text-xs">{category.name}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            deleteCategory(category.id);
                            toast.dismiss(t);
                            toast.success('Kategori berhasil dihapus');

                            if (editingCategory?.id === category.id) {
                                setEditingCategory(null);
                                setNewCategory({ name: '', icon: 'default' });
                            }
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            </div>
        ));
    };

    const handleCancel = () => {
        if (editingCategory) {
            setEditingCategory(null);
            setNewCategory({ name: '', icon: 'default' });
        } else {
            navigate(-1);
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setEditingCategory(null);
        setNewCategory({ name: '', icon: 'default' });
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-background sticky top-0 z-40 border-b p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isEditMode ? 'Kelola Kategori' : 'Tambah Kategori Baru'}</h1>
                    <div className="flex gap-2">
                        <Button size="icon" variant={isEditMode ? 'default' : 'outline'} onClick={toggleEditMode}>
                            {isEditMode ? <Plus /> : <Edit3 />}
                            <span className="sr-only">{isEditMode ? 'Mode Tambah' : 'Mode Edit'}</span>
                        </Button>
                        <Button size="icon" onClick={() => navigate(-1)}>
                            <Undo2 />
                            <span className="sr-only">Kembali</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-4">
                {/* Edit Mode - Categories List */}
                {isEditMode && (
                    <div>
                        <Label className="mb-3 block text-base font-medium">
                            Kategori yang Tersedia ({categories.length})
                        </Label>
                        {categories.length === 0 ? (
                            <div className="text-muted-foreground py-8 text-center">
                                <p>Belum ada kategori yang tersedia</p>
                                <p className="mt-1 text-sm">Klik tombol + untuk beralih ke mode tambah kategori</p>
                            </div>
                        ) : (
                            <div className="max-h-[400px] space-y-2 overflow-y-auto">
                                {categories.map((category) => {
                                    const IconComponent = availableIcons.find(
                                        (icon) => icon.key === category.icon,
                                    )?.component;
                                    const isSelected = editingCategory?.id === category.id;

                                    return (
                                        <div
                                            key={category.id}
                                            className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:bg-muted/50'
                                            }`}
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {IconComponent && <IconComponent className="h-5 w-5" />}
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(category);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Form - Show when not in edit mode OR when editing a category */}
                {(!isEditMode || editingCategory) && (
                    <>
                        {/* Nama Kategori */}
                        <div>
                            <Label htmlFor="cat-name" className="mb-2 block text-base font-medium">
                                Nama Kategori<span className="ml-1 text-red-500">*</span>
                            </Label>
                            <Input
                                autoFocus
                                id="cat-name"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                placeholder="Masukkan nama kategori"
                                className="h-12 text-base"
                            />
                        </div>

                        {/* Pilih Icon */}
                        <div>
                            <Label className="mb-2 block text-base font-medium">Pilih Icon</Label>
                            <div className="bg-muted/20 grid max-h-[300px] grid-cols-3 gap-3 overflow-y-auto rounded-lg border p-3">
                                {availableIcons.map((iconOption) => {
                                    const Icon = iconOption.component;
                                    return (
                                        <Button
                                            key={iconOption.key}
                                            variant={newCategory.icon === iconOption.key ? 'default' : 'outline'}
                                            onClick={() => setNewCategory({ ...newCategory, icon: iconOption.key })}
                                            className="flex h-16 flex-col items-center justify-center gap-2 p-3"
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="truncate text-xs font-medium">{iconOption.name}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Show current editing info */}
                        {editingCategory && (
                            <div className="bg-background rounded-lg border border-gray-500 p-3">
                                <p className="text-sm">
                                    <span className="font-medium">Sedang mengedit:</span> {editingCategory.name}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer - Only show when form is visible */}
            {(!isEditMode || editingCategory) && (
                <div className="flex gap-3 p-4">
                    <Button variant="outline" onClick={handleCancel} className="h-12 flex-1">
                        {editingCategory ? 'Batal Edit' : 'Batal'}
                    </Button>
                    <Button
                        onClick={editingCategory ? handleUpdateCategory : handleAdd}
                        className="h-12 flex-1"
                        disabled={!newCategory.name.trim() || !newCategory.icon}
                    >
                        {editingCategory ? 'Perbarui' : 'Tambah'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AddCategoryPage;
