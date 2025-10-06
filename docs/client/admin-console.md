# Admin Console

- **Route:** `/admin/products`
- **Purpose:** Allow administrators to add catalog entries and monitor inventory levels.
- **Data sources:**
  - `GET /api/products` for listing existing items.
  - `POST /api/products` for creating new products.
- **Access control:** Route guard enforces authenticated `ADMIN` role users only.
- **UI notes:** Uses `AdminProductForm` for submissions and a Material UI table for quick inventory insight.
