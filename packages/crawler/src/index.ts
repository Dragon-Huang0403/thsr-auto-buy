import type {CrawledDiscount} from './discount';
import {crawlDiscounts} from './discount';
import {crawlSpecialDays} from './specialDay';

export {CrawledDiscount, crawlDiscounts, crawlSpecialDays};

const crawler = {
  crawlDiscounts,
  crawlSpecialDays,
};

export default crawler;
