"use client";

import { useState } from "react";

/**
 * Refresh Button Component
 *
 * Generic refresh button with loading state and visual feedback.
 * Can be used to manually trigger data refetches.
 *
 * Features:
 * - Loading spinner during refresh
 * - Disabled state while refreshing
 * - Success feedback animation
 * - Flexible sizing and styling
 */

export type RefreshButtonProps = {
    onRefresh: () => Promise<void> | void;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "outline" | "ghost";
    label?: string;
    showLabel?: boolean;
};

export function RefreshButton({
    onRefresh,
    size = "md",
    variant = "outline",
    label = "Refresh",
    showLabel = true,
}: RefreshButtonProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        setShowSuccess(false);

        try {
            await onRefresh();

            // Show success feedback briefly
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1500);
        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Size classes
    const sizeClasses = {
        sm: "px-2 py-1 text-xs gap-1.5",
        md: "px-3 py-1.5 text-sm gap-2",
        lg: "px-4 py-2 text-base gap-2.5",
    }[size];

    const iconSizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    }[size];

    // Variant classes
    const variantClasses = {
        primary: "bg-blue-500/20 border-blue-500/40 text-blue-300 hover:bg-blue-500/30",
        outline: "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
        ghost: "bg-transparent border-transparent text-white/60 hover:bg-white/5",
    }[variant];

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
                flex items-center justify-center rounded-lg border font-medium
                transition-all duration-200
                disabled:cursor-not-allowed disabled:opacity-50
                ${sizeClasses}
                ${variantClasses}
            `}
            title={label}
        >
            {/* Icon */}
            <svg
                className={`
                    ${iconSizeClasses}
                    ${isRefreshing ? "animate-spin" : ""}
                    ${showSuccess ? "text-green-400" : ""}
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                {showSuccess ? (
                    // Check mark on success
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                    // Refresh icon
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                )}
            </svg>

            {/* Label */}
            {showLabel && <span>{isRefreshing ? "Refreshing..." : label}</span>}
        </button>
    );
}
