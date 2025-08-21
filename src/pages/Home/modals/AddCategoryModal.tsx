'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { availableIcons } from '@/lib/categoryIcons';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export type Category = {
    id: string;
    name: string;
    icon: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    addCategory: (category: Omit<Category, 'id'>) => void;
};

const AddCategoryModal: React.FC<Props> = ({ open, onClose, addCategory }) => {
    const [newCategory, setNewCategory] = useState({ name: '', icon: 'default' });

    const handleAdd = () => {
        if (!newCategory.name.trim()) {
            toast.error('Nama kategori wajib diisi');
            return;
        }
        if (!newCategory.icon) {
            toast.error('Pilih ikon kategori terlebih dahulu');
            return;
        }

        addCategory(newCategory);
        toast.success('Kategori berhasil ditambahkan');
        setNewCategory({ name: '', icon: 'default' });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="min-h-screen w-screen max-w-none overflow-y-auto rounded-none p-6"
                onInteractOutside={(e) => {
                    e.preventDefault();
                    onClose();
                }}
                showCloseButton={false}
            >
                <DialogHeader className="mt-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Tambah Kategori Baru</DialogTitle>
                        <Button size={'icon'} onClick={onClose}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                </DialogHeader>

                <div className="-mt-12 space-y-4">
                    <div>
                        <Label htmlFor="cat-name" className="mb-4">
                            Nama Kategori<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cat-name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Masukkan nama kategori"
                        />
                    </div>

                    <div>
                        <Label>Pilih Icon</Label>
                        <div className="mt-2 grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
                            {availableIcons.map((iconOption) => {
                                const Icon = iconOption.component;
                                return (
                                    <Button
                                        key={iconOption.key}
                                        variant={newCategory.icon === iconOption.key ? 'default' : 'outline'}
                                        onClick={() => setNewCategory({ ...newCategory, icon: iconOption.key })}
                                        className="flex h-auto flex-col items-center gap-2 p-3"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="text-center text-xs font-medium">{iconOption.name}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setNewCategory({ name: '', icon: '' });
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
