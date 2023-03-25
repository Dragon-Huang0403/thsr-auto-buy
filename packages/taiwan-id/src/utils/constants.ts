// wiki 身分證驗證規則  https://zh.wikipedia.org/wiki/%E4%B8%AD%E8%8F%AF%E6%B0%91%E5%9C%8B%E5%9C%8B%E6%B0%91%E8%BA%AB%E5%88%86%E8%AD%89#%E7%B7%A8%E8%99%9F%E8%A6%8F%E5%89%87

import {objectKeys} from './helper';

// 中華民國身分證字號英文字首的編號規則數字
export const firstLetterMapping = {
  A: '10',
  B: '11',
  C: '12',
  D: '13',
  E: '14',
  F: '15',
  G: '16',
  H: '17',
  I: '34',
  J: '18',
  K: '19',
  M: '21',
  N: '22',
  O: '35',
  P: '23',
  Q: '24',
  T: '27',
  U: '28',
  V: '29',
  W: '32',
  X: '30',
  Z: '33',
  L: '20',
  R: '25',
  S: '26',
  Y: '31',
} as const;

export const firstLetters = objectKeys(firstLetterMapping);

// 驗證規則需要相乘的數
export const authMultiplier = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1] as const;

export const numbers = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const;

export const genders = [1, 2] as const;
