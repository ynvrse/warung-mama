import { Github, Home } from 'lucide-react';

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
        component: asyncComponentLoader(() => import('@/pages/NotFound')),
        path: '*',
    },
];

export default routes;
