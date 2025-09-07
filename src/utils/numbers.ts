// utils/numbers.ts
export const toInt = (v: any, def: number | null = null) => {
  if (v === undefined || v === null || v === '') return def;
  const n = Number(String(v).replace(',', '.'));
  if (Number.isNaN(n)) return def;
  return Math.trunc(n);
};
