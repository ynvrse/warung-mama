import { ShoppingCart, Utensils, Coffee, Heart, Zap, Baby, Home, Book, Shirt } from "lucide-react";

export const getCategoryIcon = (iconType: string) => {
  const iconMap: Record<string, any> = {
    grain: ShoppingCart,
    cooking: Utensils,
    coffee: Coffee,
    snacks: Heart,
    cleaning: Zap,
    baby: Baby,
    home: Home,
    book: Book,
    shirt: Shirt,
  };
  return iconMap[iconType] || ShoppingCart;
};

export const availableIcons = [
  { key: "grain", name: "Belanja", component: ShoppingCart },
  { key: "cooking", name: "Masak", component: Utensils },
  { key: "coffee", name: "Minuman", component: Coffee },
  { key: "snacks", name: "Camilan", component: Heart },
  { key: "cleaning", name: "Pembersih", component: Zap },
  { key: "baby", name: "Bayi", component: Baby },
  { key: "home", name: "Rumah", component: Home },
  { key: "book", name: "Buku", component: Book },
  { key: "shirt", name: "Pakaian", component: Shirt },
];
