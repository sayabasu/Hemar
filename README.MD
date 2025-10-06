# Hemar Mobile Store

Hemar Mobile Store is a full-stack e-commerce experience for selling mobile phones. The project ships with a Node.js/Express API backed by PostgreSQL (via Prisma) and MongoDB (via Mongoose) plus a React + Material UI storefront. A Docker Compose stack is provided for local development with seeded sample data.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Running with Docker Compose
```bash
docker compose up --build
```
This command starts the following services:
- **postgres** – relational database for users, products, and orders.
- **mongo** – MongoDB instance used for activity logs.
- **server** – Express API exposed on `http://localhost:4000` with Swagger docs at `/docs`.
- **client** – React storefront served on `http://localhost:3000`.

The server service automatically applies Prisma migrations and seeds default data (admin user plus sample products).

### Environment Configuration
Copy the sample environment files if you need to customize values:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Update the environment variables as required before starting the stack.

### Admin Access
The seed process provisions an administrator account using the credentials defined in `server/.env` (defaults shown below):

- **Admin email:** `admin@hemar.test`
- **Admin password:** `SuperSecure123!`

Log in with these credentials at `http://localhost:3000/login` to reach the admin console located at `http://localhost:3000/admin/products`.
From there you can add new products and review the catalog inventory. Remember to change the default password in production.

### NPM Scripts
Each package exposes helpful scripts:

**Server**
- `npm run dev` – run the API with file watching.
- `npm run lint` – lint server source files.
- `npm run seed` – seed the database manually.
- `npm test` – execute Jest tests.

**Client**
- `npm run dev` – start Vite dev server on port 3000.
- `npm run build` – generate production build.
- `npm run lint` – lint client source files.

## Features
- Customer registration and login with JWT-based authentication.
- Admin-protected CRUD APIs for managing phone catalog entries.
- React-based admin console for adding products and reviewing inventory.
- Shopping cart and checkout flow that creates orders and updates stock.
- Order history for authenticated customers.
- Mongo-backed activity log capturing catalog and order events.
- Swagger/OpenAPI documentation for all routes.

## Testing
Navigate into `server/` and run `npm test` to execute backend unit tests. Frontend testing can be extended using React Testing Library (not included by default).

## License
MIT
