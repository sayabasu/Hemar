import { prisma } from '../src/libs/prisma.js';
import { env } from '../src/config/env.js';
import { hashPassword } from '../src/modules/auth/auth.service.js';
import { connectMongo } from '../src/libs/mongoose.js';
import mongoose from 'mongoose';
import { Activity } from '../src/modules/activities/activity.model.js';

const sampleProducts = [
  {
    name: 'Hemar One X',
    description: '6.5\" AMOLED display, 128GB storage, and adaptive refresh for fluid performance.',
    price: 699.99,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    brand: 'Hemar',
    stock: 25,
  },
  {
    name: 'Hemar Pixelate 12 Pro',
    description: 'AI-enhanced triple camera with night fusion optics and cinematic stabilization.',
    price: 929.5,
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35f8?auto=format&fit=crop&w=1200&q=80',
    brand: 'Hemar',
    stock: 30,
  },
  {
    name: 'Hemar Flex Fold 2',
    description: 'Next-gen foldable OLED with FlexCanvas multitasking and precision stylus support.',
    price: 1349.0,
    imageUrl: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&w=1200&q=80',
    brand: 'Hemar',
    stock: 18,
  },
  {
    name: 'Aurora Prism 2',
    description: 'Crystal HDR display paired with a 200MP prism sensor for luminous photography.',
    price: 849.0,
    imageUrl: 'https://images.unsplash.com/photo-1529336953121-497c3c5c37a3?auto=format&fit=crop&w=1200&q=80',
    brand: 'Aurora',
    stock: 20,
  },
  {
    name: 'Nimbus Edge Ultra',
    description: 'Featherlight titanium frame with 48-hour intelligent battery endurance.',
    price: 779.0,
    imageUrl: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80',
    brand: 'Nimbus',
    stock: 28,
  },
  {
    name: 'Vellum Note Air',
    description: 'Productivity powerhouse featuring stylus-ready LTPO display and quad speakers.',
    price: 999.0,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-d8cbf1120779?auto=format&fit=crop&w=1200&q=80',
    brand: 'Vellum',
    stock: 22,
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
