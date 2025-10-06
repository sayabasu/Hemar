# Products Module

Provides CRUD APIs for managing mobile phone catalog entries and exposing them to the storefront.
The admin console uses the same endpoints to create new products and review inventory.

## Uploads
- `POST /api/products/images/upload` saves catalog photography to the shared `/images` volume before creating or updating entries.
