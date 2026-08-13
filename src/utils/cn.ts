/** 合併 className，過濾掉 false / undefined / null / ''。 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
