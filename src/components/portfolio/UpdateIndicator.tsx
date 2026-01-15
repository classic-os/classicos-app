/**
 * Update Indicator Component
 *
 * Shows subtle visual feedback for real-time data updates.
 * Displays "Updated X ago" timestamp and optional fetching indicator.
 *
 * Following 2025 DeFi patterns with subtle, non-intrusive update feedback.
 */

type UpdateIndicatorProps = {
    /** Timestamp when data was last updated (from React Query dataUpdatedAt) */
    dataUpdatedAt: number;
    /** Whether data is currently being fetched in background */
    isFetching?: boolean;
};

/**
 * Format timestamp as relative time (e.g., "2m ago", "30s ago")
 */
function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 10) {
        return "just now";
    } else if (diffSeconds < 60) {
        return `${diffSeconds}s ago`;
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffSeconds / 86400);
        return `${days}d ago`;
    }
}

export function UpdateIndicator({ dataUpdatedAt, isFetching }: UpdateIndicatorProps) {
    const relativeTime = formatRelativeTime(dataUpdatedAt);

    return (
        <div className="flex items-center gap-2 text-xs text-white/40">
            {/* Fetching indicator dot */}
            {isFetching && (
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400/60" />
            )}

            {/* Last update timestamp */}
            <span suppressHydrationWarning>Updated {relativeTime}</span>
        </div>
    );
}
