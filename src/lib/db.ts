import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient, reusing the instance in development
// or creating a new one in production
const prisma = global.prisma || new PrismaClient({
  // Optional: Add logging configuration if needed
  // log: ['query', 'info', 'warn', 'error'],
});

// Prevent multiple instances in development due to hot-reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; 