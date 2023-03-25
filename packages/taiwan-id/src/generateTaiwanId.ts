import {checkTaiwanId} from './checkTaiwanId';
import {firstLetters, genders, numbers} from './utils/constants';
import {getRandomItem} from './utils/helper';

const genRestNumbers = () => {
  return Array.from({length: 8}, () => getRandomItem(numbers)).join('');
};

/**
 * @param sex 1=男生, 2=女生
 */
export const getRandomTaiwanId = (sex?: 1 | 2): string => {
  // gen first letter
  const firstLetter = getRandomItem(firstLetters);

  // gen second number 1 or 2
  const firstNum = sex ?? getRandomItem(genders);

  const id = `${firstLetter}${firstNum}${genRestNumbers()}`;

  const {success} = checkTaiwanId(id);
  return success ? id : getRandomTaiwanId();
};
