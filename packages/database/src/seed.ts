// import type {User} from '@prisma/client';

import {crawlDiscounts} from 'crawler';

import {prisma} from '.';

async function seedDiscount() {
  await prisma.discount.deleteMany({});
  const discounts = await crawlDiscounts();
  await prisma.discount.createMany({data: discounts});
  console.log(`Seed ${discounts.length} discounts`);
}

async function main() {
  try {
    await seedDiscount();
  } catch (error) {
    console.error(JSON.stringify(error));
    process.exit(1);
  }
  await prisma.$disconnect();
}

main();
