// Malawi Kwacha currency utilities

export function formatMWK(amount: number): string {
  return `MK ${amount.toLocaleString('en-MW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function convertToMWK(usdAmount: number): number {
  // Current exchange rate USD to MWK (approximate)
  const USD_TO_MWK = 1630; // This should come from a real exchange rate API
  return Math.round(usdAmount * USD_TO_MWK);
}

// Convert all our current USD prices to MWK
export function convertMenuItem<T extends { price: number }>(item: T): T & { price: number } {
  return {
    ...item,
    price: convertToMWK(item.price)
  };
}