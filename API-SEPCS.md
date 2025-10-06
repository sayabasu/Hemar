# API Specifications

## Authentication
- `POST /api/auth/register` – Create a new customer account.
- `POST /api/auth/login` – Authenticate and retrieve JWT credentials.
- `GET /api/auth/profile` – Fetch the authenticated user profile.

## Products
- `GET /api/products` – List available phones (supports `search` query).
- `GET /api/products/:id` – Retrieve a single phone.
- `POST /api/products/images/upload` – Upload a product image to the shared `/images` storage (admin only).
- `POST /api/products` – Create a phone (admin only).
- `PUT /api/products/:id` – Update a phone (admin only).
- `DELETE /api/products/:id` – Remove a phone (admin only).

## Orders
- `POST /api/orders` – Create an order from the customer cart.
- `GET /api/orders/mine` – List orders for the authenticated customer.
- `GET /api/orders` – List all orders (admin only).
- `PATCH /api/orders/:id/status` – Update order status (admin only).

## Activities
- `GET /api/admin/activities` – List recent activity log entries (admin only).

Refer to the live Swagger documentation at `http://localhost:4000/docs` when running the stack for request/response schemas.
