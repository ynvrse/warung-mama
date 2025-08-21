import { Edit2, Github, Home, Plus } from 'lucide-react';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

const routes: Routes = [
    {
        component: asyncComponentLoader(() => import('@/pages/Home')),
        path: '/',
        title: 'Home',
        icon: Home,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/Home')),
        path: '/home',
        title: 'Home',
        icon: Github,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/AddProductPage')),
        path: '/add-product',
        title: 'Tambah Produk',
        icon: Plus,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/EditProductPage')),
        path: '/edit-product/:productId',
        title: 'Edit Produk',
        icon: Edit2,
    },

    {
        component: asyncComponentLoader(() => import('@/pages/NotFound')),
        path: '*',
    },
];

export default routes;
