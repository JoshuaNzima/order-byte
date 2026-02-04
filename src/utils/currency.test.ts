import { convertMenuItem, convertToMWK, formatMWK } from './currency';

describe('currency utilities', () => {
  it('formatMWK prefixes MK and includes 2 decimal places', () => {
    expect(formatMWK(1234.5)).toBe('MK 1,234.50');
  });

  it('convertToMWK uses the expected fixed exchange rate', () => {
    expect(convertToMWK(10)).toBe(16300);
  });

  it('convertMenuItem converts item price', () => {
    const item = { id: 'x', price: 2 };
    const converted = convertMenuItem(item);
    expect(converted.price).toBe(convertToMWK(2));
    expect(converted.id).toBe('x');
  });
});
