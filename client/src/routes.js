import { lazy } from 'react';

export const routes = [
  {
    path: '/',
    Component: lazy(() => import('./features/catalog/CatalogPage.jsx')),
  },
  {
    path: '/login',
    Component: lazy(() => import('./features/auth/LoginPage.jsx')),
  },
  {
    path: '/register',
    Component: lazy(() => import('./features/auth/RegisterPage.jsx')),
  },
  {
    path: '/cart',
    Component: lazy(() => import('./features/cart/CartPage.jsx')),
  },
  {
    path: '/orders',
    Component: lazy(() => import('./features/orders/OrdersPage.jsx')),
    requiresAuth: true,
  },
];
