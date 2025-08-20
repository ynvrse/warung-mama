import {
    Apple,
    Baby,
    Book,
    Bubbles,
    Carrot,
    Cigarette,
    Coffee,
    Droplet,
    Fish,
    Home,
    LayoutGrid,
    Milk,
    Package,
    Popcorn,
    Shirt,
    Utensils,
} from 'lucide-react';

export const getCategoryIcon = (iconType: string) => {
    const iconMap: Record<string, any> = {
        default: Home,
        cooking: Utensils, // Bumbu dapur, masakan
        coffee: Coffee, // Kopi, teh, minuman
        snacks: Popcorn, // Camilan
        cleaning: Bubbles, // Sabun, deterjen
        baby: Baby, // Produk bayi
        cigarette: Cigarette, // Rokok
        book: Book, // Buku / bacaan
        shirt: Shirt, // Pakaian
        rice: Package, // Beras, sembako utama
        oil: Droplet, // Minyak goreng
        fruit: Apple, // Buah
        vegetable: Carrot, // Sayuran
        milk: Milk, // Susu, olahan susu
        fish: Fish, // Ikan, protein
    };
    return iconMap[iconType] || LayoutGrid;
};

export const availableIcons = [
    { key: 'default', name: 'Default', component: LayoutGrid },
    { key: 'cooking', name: 'Bumbu & Masakan', component: Utensils },
    { key: 'coffee', name: 'Minuman', component: Coffee },
    { key: 'snacks', name: 'Camilan', component: Popcorn },
    { key: 'cleaning', name: 'Pembersih', component: Bubbles },
    { key: 'baby', name: 'Produk Bayi', component: Baby },
    { key: 'cigarette', name: 'Rokok', component: Cigarette },
    { key: 'book', name: 'Buku', component: Book },
    { key: 'shirt', name: 'Pakaian', component: Shirt },
    { key: 'rice', name: 'Beras', component: Package },
    { key: 'oil', name: 'Minyak', component: Droplet },
    { key: 'fruit', name: 'Buah', component: Apple },
    { key: 'vegetable', name: 'Sayuran', component: Carrot },
    { key: 'milk', name: 'Susu & Olahan', component: Milk },
    { key: 'fish', name: 'Ikan & Laut', component: Fish },
];
