// hooks/useInstantDB.ts
import { init, tx, id } from '@instantdb/react';
import { Baby, Book, Coffee, Heart, Home, Shirt, ShoppingCart, Utensils, Zap } from 'lucide-react';



export type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Category = {
  id: string;
  name: string;
  icon: any;
};

export const useInstantDB = () => {

    const db = init({
    appId: '8d8f5941-3c7b-4f08-a523-3cd8ff015948',
    });

  const { isLoading, error, data } = db.useQuery({
    products: { categories: {} },
    categories: {},
  });

  const products: any[] = data?.products || [];
  const categories: any[] = data?.categories || [];

  const addProduct = (product: Omit<Product, "id">) =>
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

  const deleteProduct = (productId: string) =>
    db.transact([tx.products[productId].delete()]);

  const addCategory = (category: Omit<Category, "id">) =>
    db.transact([
      tx.categories[id()].update({
        ...category,
      }),
    ]);

    const getCategoryIcon = (iconType: string) => {
  const iconMap : any = {
    grain: ShoppingCart,
    cooking: Utensils,
    sugar: Coffee,
    coffee: Coffee,
    snacks: Heart,
    cleaning: Zap,
    personal: Heart,
    baby: Baby,
    home: Home,
    book: Book,
    shirt: Shirt
  };
  
  return iconMap[iconType] || ShoppingCart;
};

  const getCategoryName = (categoryId: String) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak ada kategori';
  };

  return {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    getCategoryName,
    getCategoryIcon,
    isLoading,
    error,
  };
};
