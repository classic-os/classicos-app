/**
 * Currency Registry
 *
 * Defines supported fiat currencies for portfolio display.
 * Uses ISO 4217 currency codes.
 */

export type CurrencyCode =
    | "USD" // United States Dollar
    | "EUR" // Euro
    | "GBP" // British Pound Sterling
    | "JPY" // Japanese Yen
    | "CNY" // Chinese Yuan
    | "KRW" // South Korean Won
    | "AUD" // Australian Dollar
    | "CAD" // Canadian Dollar
    | "CHF" // Swiss Franc
    | "INR" // Indian Rupee
    | "BRL" // Brazilian Real
    | "RUB" // Russian Ruble
    | "MXN" // Mexican Peso
    | "SGD" // Singapore Dollar
    | "HKD"; // Hong Kong Dollar

export type CurrencyInfo = {
    code: CurrencyCode;
    symbol: string;
    name: string;
    decimals: number;
    locale: string; // BCP 47 locale for number formatting
};

/**
 * Registry of supported currencies
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
    USD: {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        decimals: 2,
        locale: "en-US",
    },
    EUR: {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        decimals: 2,
        locale: "en-GB",
    },
    GBP: {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        decimals: 2,
        locale: "en-GB",
    },
    JPY: {
        code: "JPY",
        symbol: "¥",
        name: "Japanese Yen",
        decimals: 0,
        locale: "ja-JP",
    },
    CNY: {
        code: "CNY",
        symbol: "¥",
        name: "Chinese Yuan",
        decimals: 2,
        locale: "zh-CN",
    },
    KRW: {
        code: "KRW",
        symbol: "₩",
        name: "South Korean Won",
        decimals: 0,
        locale: "ko-KR",
    },
    AUD: {
        code: "AUD",
        symbol: "A$",
        name: "Australian Dollar",
        decimals: 2,
        locale: "en-AU",
    },
    CAD: {
        code: "CAD",
        symbol: "C$",
        name: "Canadian Dollar",
        decimals: 2,
        locale: "en-CA",
    },
    CHF: {
        code: "CHF",
        symbol: "CHF",
        name: "Swiss Franc",
        decimals: 2,
        locale: "de-CH",
    },
    INR: {
        code: "INR",
        symbol: "₹",
        name: "Indian Rupee",
        decimals: 2,
        locale: "en-IN",
    },
    BRL: {
        code: "BRL",
        symbol: "R$",
        name: "Brazilian Real",
        decimals: 2,
        locale: "pt-BR",
    },
    RUB: {
        code: "RUB",
        symbol: "₽",
        name: "Russian Ruble",
        decimals: 2,
        locale: "ru-RU",
    },
    MXN: {
        code: "MXN",
        symbol: "MX$",
        name: "Mexican Peso",
        decimals: 2,
        locale: "es-MX",
    },
    SGD: {
        code: "SGD",
        symbol: "S$",
        name: "Singapore Dollar",
        decimals: 2,
        locale: "en-SG",
    },
    HKD: {
        code: "HKD",
        symbol: "HK$",
        name: "Hong Kong Dollar",
        decimals: 2,
        locale: "en-HK",
    },
};

/**
 * Default currency (USD)
 */
export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/**
 * Get currency info by code
 */
export function getCurrencyInfo(code: CurrencyCode): CurrencyInfo {
    return CURRENCIES[code];
}

/**
 * Get all supported currencies as array
 */
export function getAllCurrencies(): CurrencyInfo[] {
    return Object.values(CURRENCIES);
}

/**
 * Validate currency code
 */
export function isValidCurrency(code: string): code is CurrencyCode {
    return code in CURRENCIES;
}
