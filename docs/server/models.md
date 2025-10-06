# Server Models

## User
- `id`: integer (auto increment)
- `email`: unique email address
- `password`: bcrypt hash
- `name`: display name
- `role`: `ADMIN` or `CUSTOMER`
- `createdAt` / `updatedAt`

## Product
- `id`
- `name`
- `description`
- `price`: decimal(10,2)
- `imageUrl`
- `brand`
- `stock`
- timestamps

## Order
- `id`
- `userId`
- `total`: decimal(10,2)
- `status`: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- `shippingName`
- `shippingPhone`
- `shippingAddr`
- timestamps

## OrderItem
- `id`
- `orderId`
- `productId`
- `quantity`
- `price`: decimal snapshot

## Activity (MongoDB)
- `type`: event identifier
- `message`: description
- `metadata`: optional JSON payload
- `createdAt` / `updatedAt`
