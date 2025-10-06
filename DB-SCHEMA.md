# Database Schema

## PostgreSQL (Prisma)

### User
| Column | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| email | String | Unique |
| password | String | Bcrypt hash |
| name | String |  |
| role | Enum(`ADMIN`, `CUSTOMER`) | Defaults to `CUSTOMER` |
| createdAt | DateTime | Auto timestamp |
| updatedAt | DateTime | Auto updated |

### Product
| Column | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| name | String |  |
| description | String |  |
| price | Decimal(10,2) |  |
| imageUrl | String |  |
| brand | String |  |
| stock | Int | Defaults to 0 |
| createdAt | DateTime | Auto timestamp |
| updatedAt | DateTime | Auto updated |

### Order
| Column | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| userId | Int | FK -> User |
| total | Decimal(10,2) | Calculated sum |
| status | Enum(`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`) | Defaults to `PENDING` |
| shippingName | String |  |
| shippingPhone | String |  |
| shippingAddr | String |  |
| createdAt | DateTime | Auto timestamp |
| updatedAt | DateTime | Auto updated |

### OrderItem
| Column | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| orderId | Int | FK -> Order |
| productId | Int | FK -> Product |
| quantity | Int |  |
| price | Decimal(10,2) | Snapshot of sale price |

## MongoDB (Mongoose)

### Activity
| Field | Type | Notes |
| --- | --- | --- |
| type | String | Event type (e.g., `product.created`) |
| message | String | Human readable description |
| metadata | Object | Optional structured context |
| createdAt | Date | Timestamp |
| updatedAt | Date | Timestamp |
