"use client";

import { ReactNode, useState } from "react";

type CollapsiblePanelProps = {
    title: string;
    description?: string;
    defaultExpanded?: boolean;
    children: ReactNode;
};

/**
 * Collapsible Panel Component
 *
 * A panel with expand/collapse functionality. Useful for organizing
 * large amounts of information in a compact, user-controlled way.
 */
export function CollapsiblePanel({
    title,
    description,
    defaultExpanded = true,
    children,
}: CollapsiblePanelProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="rounded-xl border border-white/10 bg-black/20">
            {/* Header - Always visible, clickable to toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-white/5"
                aria-expanded={isExpanded}
            >
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white/90">{title}</h3>
                    {description && (
                        <p className="mt-0.5 text-xs text-white/50">{description}</p>
                    )}
                </div>
                <div className="ml-3 shrink-0">
                    <svg
                        className={`h-5 w-5 text-white/60 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            {/* Content - Collapsible */}
            {isExpanded && (
                <div className="border-t border-white/10 p-4">{children}</div>
            )}
        </div>
    );
}
