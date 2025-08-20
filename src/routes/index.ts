import { Github, Home, Settings } from 'lucide-react';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

const routes: Routes = [
    {
        component: asyncComponentLoader(() => import('@/pages/Welcome')),
        path: '/',
        title: 'Welcome',
        icon: Home,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/Page1')),
        path: '/page-1',
        title: 'Page 1',
        icon: Github,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/Setting')),
        path: '/setting',
        title: 'Settings',
        icon: Settings,
    },

    {
        component: asyncComponentLoader(() => import('@/pages/NotFound')),
        path: '*',
    },
];

export default routes;
