/**
 * Number formatting utilities for portfolio display
 */

/**
 * Format a number with commas and appropriate decimal places
 *
 * @param value - Number or string to format
 * @param decimals - Maximum decimal places (default: 4)
 * @param minDecimals - Minimum decimal places (default: 0)
 * @returns Formatted number string with commas
 *
 * @example
 * formatNumber("1000.5") // "1,000.5"
 * formatNumber("0.000001234567", 6) // "0.000001"
 * formatNumber("10000", 2) // "10,000"
 */
export function formatNumber(
    value: string | number,
    decimals: number = 4,
    minDecimals: number = 0
): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num)) return "0";

    return num.toLocaleString("en-US", {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format a token balance with appropriate precision
 *
 * - For values >= 1: Show up to 4 decimals
 * - For values < 1: Show up to 6 decimals
 * - For very small values < 0.000001: Show scientific notation
 *
 * @param value - Balance value as string or number
 * @returns Formatted balance string
 *
 * @example
 * formatTokenBalance("1000.123456") // "1,000.1235"
 * formatTokenBalance("0.000123456") // "0.000123"
 * formatTokenBalance("0.0000001") // "1e-7"
 */
export function formatTokenBalance(value: string | number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num) || num === 0) return "0";

    // For very small numbers, use scientific notation
    if (Math.abs(num) < 0.000001) {
        return num.toExponential(2);
    }

    // For numbers >= 1, show up to 4 decimals
    if (Math.abs(num) >= 1) {
        return formatNumber(num, 4, 0);
    }

    // For numbers between 0.000001 and 1, show up to 6 decimals
    return formatNumber(num, 6, 0);
}
