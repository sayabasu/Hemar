# Application Routes

## Frontend
- `/` – Product catalog grid.
- `/login` – Customer login page.
- `/register` – Customer registration page.
- `/cart` – Shopping cart & checkout form.
- `/orders` – Authenticated order history.
- `/admin/products` – Admin console for managing the catalog (admin only).

## Backend API
- `/api/auth/*` – Authentication endpoints.
- `/api/products/*` – Catalog management endpoints.
- `/api/products/images/upload` – Persist product images to the shared `/images` storage (admin only).
- `/api/orders/*` – Checkout and order management endpoints.
- `/api/admin/activities` – Administrative activity logs.
- `/docs` – Swagger UI.
