// import type {User} from '@prisma/client';

import {crawlDiscounts, crawlSpecialDays} from 'crawler';

import {prisma} from '.';

async function seedDiscount() {
  await prisma.discount.deleteMany({});
  const discounts = await crawlDiscounts();
  await prisma.discount.createMany({data: discounts});
  console.log(`Seed ${discounts.length} discounts`);
}

async function seedSpecialBookDay() {
  await prisma.specialBookDay.deleteMany({});
  const specialBookDays = await crawlSpecialDays();
  await prisma.specialBookDay.createMany({data: specialBookDays});
  console.log(`Seed ${specialBookDays.length} specialBookDays`);
}

async function main() {
  try {
    await seedDiscount();
    await seedSpecialBookDay();
  } catch (error) {
    console.error(JSON.stringify(error));
    process.exit(1);
  }
  await prisma.$disconnect();
}

main();
