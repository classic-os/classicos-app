"use client";

import { useState } from "react";

/**
 * Copy Button Component
 *
 * Displays a button that copies text to clipboard with visual feedback.
 * Shows "Copied!" message briefly after successful copy.
 *
 * Follows 2025 DeFi patterns with clean iconography and toast-like feedback.
 */

export type CopyButtonProps = {
    text: string; // Text to copy
    label?: string; // Button label (default: "Copy")
    size?: "sm" | "md" | "lg";
    variant?: "default" | "ghost" | "outline";
};

export function CopyButton({ text, label = "Copy", size = "md", variant = "default" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            // Reset after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`${getVariantClasses(variant)} ${getSizeClasses(size)} inline-flex items-center gap-1.5 rounded-lg font-medium transition-all`}
            aria-label={copied ? "Copied!" : `Copy ${label}`}
        >
            {copied ? (
                <>
                    <svg
                        className={getIconSizeClasses(size)}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13.5 4L6 11.5L2.5 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg
                        className={getIconSizeClasses(size)}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="5"
                            y="5"
                            width="9"
                            height="9"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M3 10.5V3C3 2.17157 3.67157 1.5 4.5 1.5H10.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}

/**
 * Get variant-specific button classes
 */
function getVariantClasses(variant: "default" | "ghost" | "outline"): string {
    switch (variant) {
        case "default":
            return "bg-white/10 hover:bg-white/15 text-white/90 border border-white/20";
        case "ghost":
            return "hover:bg-white/5 text-white/70 hover:text-white/90";
        case "outline":
            return "border border-white/30 hover:border-white/50 text-white/70 hover:text-white/90";
        default:
            return "bg-white/10 hover:bg-white/15 text-white/90 border border-white/20";
    }
}

/**
 * Get size-specific button classes
 */
function getSizeClasses(size: "sm" | "md" | "lg"): string {
    switch (size) {
        case "sm":
            return "px-2 py-1 text-xs";
        case "md":
            return "px-3 py-1.5 text-sm";
        case "lg":
            return "px-4 py-2 text-base";
        default:
            return "px-3 py-1.5 text-sm";
    }
}

/**
 * Get size-specific icon classes
 */
function getIconSizeClasses(size: "sm" | "md" | "lg"): string {
    switch (size) {
        case "sm":
            return "h-3 w-3";
        case "md":
            return "h-4 w-4";
        case "lg":
            return "h-5 w-5";
        default:
            return "h-4 w-4";
    }
}
