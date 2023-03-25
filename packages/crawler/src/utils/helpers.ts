export function objectKeys<
  T extends Record<string, unknown>,
  Key extends keyof T,
>(object: T) {
  const keys = Object.keys(object) as Key[];
  return keys;
}

export function isValidateDate(dateString: string) {
  const isMatched = dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  if (!isMatched) {
    return false;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date)) {
    return false;
  }
  return date.toISOString().slice(0, 10) === dateString;
}
