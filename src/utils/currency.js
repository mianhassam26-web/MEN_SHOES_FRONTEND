// USD to PKR exchange rate (approx.)
export const USD_TO_PKR = 278;

// Converts a USD number into a formatted PKR string, e.g. 49.99 -> "Rs. 13,897"
export function formatPKR(usdAmount) {
  const amount = Number(usdAmount) || 0;
  const pkr = amount * USD_TO_PKR;
  return `Rs. ${pkr.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}
