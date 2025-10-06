# Products Module

Provides CRUD APIs for managing mobile phone catalog entries and exposing them to the storefront.
The admin console uses the same endpoints to create new products and review inventory.

## Uploads
- `POST /api/products/images/upload` issues presigned URLs backed by MinIO so the frontend can upload product photography securely
  before creating or updating catalog entries.
