import {authMultiplier, firstLetterMapping} from './utils/constants';

/**
 * Reference: https://gist.github.com/chochinlu/2b305dfd1ede28a27fe21c833215d019
 */

export const checkTaiwanId = (
  pid: string,
): {success: true} | {success: false; msg: string} => {
  // 長度要為10
  if (pid.length !== 10) return {success: false, msg: '身分證字號長度不正確'};

  // 開頭第一個為英文字母, 後為9個阿拉伯數字, 第一個數字拿來區分性別，男性為1、女性為2
  const re = /^[A-Za-z][12]\d{8}/;
  if (!re.test(pid)) return {success: false, msg: '身分證格式錯誤'};

  // 驗證規則
  const [first, ...numbers] = [...pid];
  const source = [
    ...firstLetterMapping[
      first?.toUpperCase() as keyof typeof firstLetterMapping
    ],
    ...numbers,
  ]
    .map((value, i) => Number(value) * (authMultiplier[i] as number))
    .reduce((a, b) => a + b, 0);

  if (source % 10 !== 0) return {success: false, msg: '驗證失敗'};

  return {success: true};
};
