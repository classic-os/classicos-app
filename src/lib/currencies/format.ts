import { getCurrencyInfo, type CurrencyCode } from "./registry";
import type { ExchangeRates } from "./exchange-rates";
import { convertUSDToCurrency } from "./exchange-rates";

/**
 * Format a fiat value with appropriate currency formatting
 *
 * @param usdValue - Value in USD (base currency)
 * @param currency - Target currency code
 * @param rates - Exchange rates (optional, if not provided will display in USD)
 * @returns Formatted currency string (e.g., "$1,234.56", "€1.052,34")
 */
export function formatCurrencyValue(
    usdValue: number,
    currency: CurrencyCode,
    rates?: ExchangeRates
): string {
    const currencyInfo = getCurrencyInfo(currency);

    // Convert USD to target currency if rates provided
    const value = rates
        ? convertUSDToCurrency(usdValue, currency, rates)
        : usdValue;

    // Handle very small values
    if (value < 0.01 && value > 0) {
        return `<${currencyInfo.symbol}0.01`;
    }

    // Use Intl.NumberFormat for proper currency formatting
    return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currencyInfo.code,
        minimumFractionDigits: currencyInfo.decimals,
        maximumFractionDigits: currencyInfo.decimals,
    }).format(value);
}

/**
 * Format USD value (backwards compatibility helper)
 *
 * This maintains the old API for existing code that expects USD formatting.
 * New code should use formatCurrencyValue directly.
 *
 * @param value - USD value
 * @returns Formatted USD string (e.g., "$1,234.56")
 */
export function formatUSDValue(value: number): string {
    if (value < 0.01) {
        return "<$0.01";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
