const WHOLE_RUPEE_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Formats rupees with Indian digit grouping — single source of truth for currency display. */
export function formatCurrency(value: number, symbol: string): string {
  return `${symbol}${WHOLE_RUPEE_FORMATTER.format(value)}`;
}

const FIXED_ONE_DECIMAL_FORMATTER = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Like formatCurrency but always one decimal, so mixed columns line up on the decimal point. */
export function formatCurrencyFixed1(value: number, symbol: string): string {
  return `${symbol}${FIXED_ONE_DECIMAL_FORMATTER.format(value)}`;
}
