const WHOLE_RUPEE_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/**
 * Formats a rupee amount for display with Indian digit grouping, e.g.
 * 1499 -> "₹1,499". The single source of truth for currency formatting so
 * the same figure can never render grouped in one place (e.g. "₹1,499") and
 * ungrouped in another (e.g. "₹1499") on the same page.
 */
export function formatCurrency(value: number, symbol: string): string {
  return `${symbol}${WHOLE_RUPEE_FORMATTER.format(value)}`;
}

const FIXED_ONE_DECIMAL_FORMATTER = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Same as formatCurrency, but always renders exactly one decimal place, e.g.
 * 1 -> "₹1.0". Intended for columns of figures that mix whole numbers and
 * one-decimal values (like a per-minute rate column) so every row lines up
 * on the decimal point instead of the column drifting between 0 and 1
 * fraction digits.
 */
export function formatCurrencyFixed1(value: number, symbol: string): string {
  return `${symbol}${FIXED_ONE_DECIMAL_FORMATTER.format(value)}`;
}
