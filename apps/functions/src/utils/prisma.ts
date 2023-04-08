import database from 'database';

const {PrismaClient} = database;

export const prisma = new PrismaClient({
  log: ['error'],
});

export type PrismaWithoutPgBouncer = database.PrismaClient;
export function createPrismaClientWithoutPgBouncer(): PrismaWithoutPgBouncer {
  const prismaWithoutPgBouncer = new PrismaClient({
    datasources: {db: {url: process.env.DATABASE_DIRECT_URL}},
  });
  return prismaWithoutPgBouncer;
}
