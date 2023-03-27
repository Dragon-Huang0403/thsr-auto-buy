import {crawlDiscounts, crawlSpecialDays} from 'crawler';

import {prisma, PrismaClient} from './client';

async function seedDiscount(prisma: PrismaClient) {
  await prisma.discount.deleteMany({});
  const discounts = await crawlDiscounts();
  await prisma.discount.createMany({data: discounts});
  console.log(`Seed ${discounts.length} discounts`);
}

async function seedSpecialBookDay(prisma: PrismaClient) {
  await prisma.specialBookDay.deleteMany({});
  const specialBookDays = await crawlSpecialDays();
  await prisma.specialBookDay.createMany({data: specialBookDays});
  console.log(`Seed ${specialBookDays.length} specialBookDays`);
}

async function main() {
  try {
    await seedDiscount(prisma);
    await seedSpecialBookDay(prisma);
  } catch (error) {
    console.error(JSON.stringify(error));
    process.exit(1);
  }
  await prisma.$disconnect();
}

main();
