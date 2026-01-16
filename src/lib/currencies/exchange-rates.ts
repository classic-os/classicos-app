import type { CurrencyCode } from "./registry";

/**
 * Exchange Rate Data
 *
 * Rates are relative to USD (base currency)
 * Example: If EUR rate is 0.85, then 1 USD = 0.85 EUR
 */
export type ExchangeRates = {
    base: "USD";
    rates: Record<CurrencyCode, number>;
    timestamp: number;
};

/**
 * Fetch exchange rates from API
 *
 * Uses exchangerate-api.com free tier:
 * - 1,500 requests/month free
 * - No API key required for free tier
 * - Updates daily
 *
 * @returns Exchange rates relative to USD
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
    const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        base: "USD",
        rates: {
            USD: 1.0,
            EUR: data.rates.EUR || 0.85,
            GBP: data.rates.GBP || 0.73,
            JPY: data.rates.JPY || 110.0,
            CNY: data.rates.CNY || 6.45,
            KRW: data.rates.KRW || 1200.0,
            AUD: data.rates.AUD || 1.35,
            CAD: data.rates.CAD || 1.25,
            CHF: data.rates.CHF || 0.92,
            INR: data.rates.INR || 74.0,
            BRL: data.rates.BRL || 5.25,
            RUB: data.rates.RUB || 75.0,
            MXN: data.rates.MXN || 20.0,
            SGD: data.rates.SGD || 1.35,
            HKD: data.rates.HKD || 7.75,
        },
        timestamp: data.time_last_updated
            ? new Date(data.time_last_updated * 1000).getTime()
            : Date.now(),
    };
}

/**
 * Convert USD value to target currency
 *
 * @param usdValue - Value in USD
 * @param targetCurrency - Target currency code
 * @param rates - Exchange rates
 * @returns Converted value in target currency
 */
export function convertUSDToCurrency(
    usdValue: number,
    targetCurrency: CurrencyCode,
    rates: ExchangeRates
): number {
    if (targetCurrency === "USD") {
        return usdValue;
    }

    const rate = rates.rates[targetCurrency];
    if (!rate) {
        console.warn(`Exchange rate not found for ${targetCurrency}, using USD`);
        return usdValue;
    }

    return usdValue * rate;
}

/**
 * Check if exchange rates are stale (older than 24 hours)
 */
export function areRatesStale(rates: ExchangeRates): boolean {
    const now = Date.now();
    const ageMs = now - rates.timestamp;
    const oneDayMs = 24 * 60 * 60 * 1000;
    return ageMs > oneDayMs;
}
