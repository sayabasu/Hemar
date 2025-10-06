import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './config/env.js';
import { requestLogger } from './middlewares/logging.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/products.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';
import { authenticate, authorize } from './middlewares/auth.js';
import { activitiesRoutes } from './modules/activities/activities.controller.js';

const app = express();

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hemar Mobile Store API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/modules/**/*.routes.js'],
});

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: env.corsOrigins }));
app.use(requestLogger);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
const adminRouter = express.Router();
adminRouter.use(authorize('ADMIN'));
activitiesRoutes(adminRouter);
app.use('/api/admin', authenticate, adminRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
