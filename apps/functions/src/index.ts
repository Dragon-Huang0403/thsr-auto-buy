import crawler from 'crawler';
import database from 'database';
import * as functions from 'firebase-functions';

const {PrismaClient} = database;
const {crawlDiscounts} = crawler;

import {asiaEast, secrets} from './utils/constants';

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

export const crawlDiscountsAndUpdate = functions
  .region(asiaEast)
  .runWith({secrets: [secrets.DATABASE_URL]})
  .https.onRequest(async (_, response) => {
    const prisma = new PrismaClient();

    const [discounts] = await Promise.all([
      crawlDiscounts(),
      prisma.discount.deleteMany({}),
    ]);

    await prisma.discount.createMany({data: discounts});
    response.json({data: discounts, counts: discounts.length});
    await prisma.$disconnect();
  });

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    const prisma = new PrismaClient();
    const data = await prisma.reservation.findMany({});
    functions.logger.info('Hello logs!', {structuredData: true});
    response.json(data);
    await prisma.$disconnect();
  },
);
