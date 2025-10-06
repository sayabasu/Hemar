# Changelog

## Unreleased
- Added initial Prisma migration to provision PostgreSQL tables during deployment.
- Marked product names as unique to align with seed upserts.
- Delivered admin console UI for managing catalog entries and documented seeded admin credentials.
- Enabled secure product image uploads backed by MinIO presigned URLs and wired the admin console to use them instead of manual
  image links.

## 1.0.0 - 2024-05-07
- Initial release of Hemar Mobile Store platform.
- Added Express API with Prisma + PostgreSQL and Mongoose + MongoDB integration.
- Implemented JWT authentication, product catalog, cart checkout, and order history endpoints.
- Delivered React + Material UI storefront with authentication, catalog, cart, and orders pages.
- Added Docker Compose stack with automatic migrations and seed data.
