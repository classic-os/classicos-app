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
 * Convert scientific notation exponent to superscript
 *
 * @param exp - Exponent value (e.g., -7)
 * @returns Superscript string (e.g., "⁻⁷")
 *
 * @example
 * toSuperscript(-7) // "⁻⁷"
 * toSuperscript(12) // "¹²"
 */
function toSuperscript(exp: number): string {
    const superscripts: Record<string, string> = {
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
        "-": "⁻", "+": "⁺"
    };
    return exp.toString().split("").map(c => superscripts[c] || c).join("");
}

/**
 * Format a token balance with appropriate precision
 *
 * - For values >= 1: Show up to 4 decimals
 * - For values < 1: Show up to 6 decimals
 * - For very small values < 0.000001: Show scientific notation with superscript exponent
 *
 * @param value - Balance value as string or number
 * @returns Formatted balance string
 *
 * @example
 * formatTokenBalance("1000.123456") // "1,000.1235"
 * formatTokenBalance("0.000123456") // "0.000123"
 * formatTokenBalance("0.0000001") // "1.41×10⁻⁷"
 */
export function formatTokenBalance(value: string | number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num) || num === 0) return "0";

    // For very small numbers, use scientific notation with superscript
    if (Math.abs(num) < 0.000001) {
        const exp = Math.floor(Math.log10(Math.abs(num)));
        const mantissa = num / Math.pow(10, exp);
        return `${mantissa.toFixed(2)}×10${toSuperscript(exp)}`;
    }

    // For numbers >= 1, show up to 4 decimals
    if (Math.abs(num) >= 1) {
        return formatNumber(num, 4, 0);
    }

    // For numbers between 0.000001 and 1, show up to 6 decimals
    return formatNumber(num, 6, 0);
}

/**
 * Format LP token balance with consistent scientific notation
 *
 * LP tokens are arbitrary units representing pool share, so we always use
 * scientific notation for values < 1 to standardize the display.
 *
 * @param value - LP token balance as string or number
 * @returns Formatted balance string with scientific notation for values < 1
 *
 * @example
 * formatLPTokenBalance("1000.123456") // "1,000.1235"
 * formatLPTokenBalance("0.000004") // "4.00×10⁻⁶"
 * formatLPTokenBalance("0.5") // "5.00×10⁻¹"
 */
export function formatLPTokenBalance(value: string | number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num) || num === 0) return "0";

    // For numbers >= 1, show up to 4 decimals as normal
    if (Math.abs(num) >= 1) {
        return formatNumber(num, 4, 0);
    }

    // For numbers < 1, always use scientific notation for consistency
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exp);
    return `${mantissa.toFixed(2)}×10${toSuperscript(exp)}`;
}
