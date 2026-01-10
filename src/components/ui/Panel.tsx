"use client";

import type { ReactNode } from "react";

export function Panel({
    title,
    description,
    children,
    className = "",
}: {
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`cos-panel p-4 md:p-5 ${className}`}>
            {(title || description) && (
                <header className="mb-3">
                    {title ? (
                        <div className="text-sm font-semibold text-white/90">{title}</div>
                    ) : null}
                    {description ? (
                        <div className="mt-1 text-xs text-white/55">{description}</div>
                    ) : null}
                </header>
            )}
            <div>{children}</div>
        </section>
    );
}
