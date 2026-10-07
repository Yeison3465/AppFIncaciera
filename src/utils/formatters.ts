/**
 * Utilidades de formateo para Aura Financial V2.5
 */

/**
 * Formatea un número a moneda USD ($ X,XXX.XX)
 */
export function formatCurrency(amount: number, minimumFractionDigits = 2): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$ 0.00';
  }
  return `$ ${amount.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  })}`;
}

/**
 * Formatea un número entero a moneda ($ X,XXX)
 */
export function formatCurrencyInt(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$ 0';
  }
  return `$ ${amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Formatea porcentaje con decimales especificados
 */
export function formatPercentage(pct: number, decimals = 2): string {
  if (typeof pct !== 'number' || isNaN(pct)) {
    return '0.00 %';
  }
  return `${pct.toFixed(decimals)} %`;
}
