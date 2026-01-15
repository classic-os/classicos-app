/**
 * Price Change Indicator Component
 *
 * Displays 24h price change percentage with color coding:
 * - Green for positive changes
 * - Red for negative changes
 * - Gray for no change or unavailable data
 *
 * Follows 2025 DeFi patterns with subtle color gradients and clean typography.
 */

export type PriceChangeProps = {
    change24h: number | undefined; // Percentage change (e.g., 5.2 for +5.2%)
    size?: "sm" | "md" | "lg";
};

export function PriceChange({ change24h, size = "md" }: PriceChangeProps) {
    // Handle missing data
    if (change24h === undefined || change24h === null || isNaN(change24h)) {
        return (
            <span className={`text-white/40 ${getSizeClasses(size)}`}>
                --
            </span>
        );
    }

    // Determine color based on change direction
    const isPositive = change24h > 0;
    const isNegative = change24h < 0;

    // Color classes
    let colorClasses = "text-white/40"; // Neutral/zero
    if (isPositive) {
        colorClasses = "text-green-400";
    } else if (isNegative) {
        colorClasses = "text-red-400";
    }

    // Format percentage
    const sign = isPositive ? "+" : "";
    const formattedChange = `${sign}${change24h.toFixed(2)}%`;

    return (
        <span className={`font-mono ${colorClasses} ${getSizeClasses(size)}`}>
            {formattedChange}
        </span>
    );
}

/**
 * Get size-specific text classes
 */
function getSizeClasses(size: "sm" | "md" | "lg"): string {
    switch (size) {
        case "sm":
            return "text-xs";
        case "md":
            return "text-sm";
        case "lg":
            return "text-base";
        default:
            return "text-sm";
    }
}
