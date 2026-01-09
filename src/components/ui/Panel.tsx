"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Panel({
    title,
    description,
    right,
    children,
    className,
}: {
    title?: string;
    description?: string;
    right?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                "rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm",
                className
            )}
        >
            {(title || right) && (
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {title ? <div className="text-sm font-semibold text-white/85">{title}</div> : null}
                        {description ? <div className="mt-0.5 text-xs text-white/50">{description}</div> : null}
                    </div>
                    {right ? <div className="shrink-0">{right}</div> : null}
                </div>
            )}
            {children}
        </section>
    );
}
