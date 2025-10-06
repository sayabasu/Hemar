import { prisma } from '../src/libs/prisma.js';
import { env } from '../src/config/env.js';
import { hashPassword } from '../src/modules/auth/auth.service.js';
import { connectMongo } from '../src/libs/mongoose.js';
import mongoose from 'mongoose';
import { Activity } from '../src/modules/activities/activity.model.js';

const sampleProducts = [
  {
    name: 'Hemar One X',
    description: '6.5\" AMOLED display, 128GB storage, 5G enabled smartphone.',
    price: 699.99,
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Hemar+One+X',
    brand: 'Hemar',
    stock: 25,
  },
  {
    name: 'Hemar Pixelate 12',
    description: 'AI-enhanced camera system with 108MP sensor and 120Hz display.',
    price: 899.5,
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Hemar+Pixelate+12',
    brand: 'Hemar',
    stock: 30,
  },
  {
    name: 'Hemar Flex Fold',
    description: 'Foldable OLED phone with multitasking experience and stylus support.',
    price: 1299.0,
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Hemar+Flex+Fold',
    brand: 'Hemar',
    stock: 15,
  },
];

const run = async () => {
  await connectMongo();
  await prisma.$connect();

  const adminEmail = env.adminEmail || 'admin@hemar.test';
  const adminPassword = env.adminPassword || 'Admin123!';
  const hashed = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Hemar Admin',
      password: hashed,
      role: 'ADMIN',
    },
  });

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
  }

  await Activity.create({
    type: 'seed',
    message: 'Initial database seeded with admin user and sample products',
    metadata: { products: sampleProducts.length },
  });

  await prisma.$disconnect();
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
