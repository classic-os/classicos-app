"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ChipTone = "neutral" | "good" | "warn" | "bad";

function Chip({
    tone = "neutral",
    children,
}: {
    tone?: ChipTone;
    children: ReactNode;
}) {
    const toneClass =
        tone === "good"
            ? "border-emerald-400/25 bg-emerald-400/10 text-white"
            : tone === "warn"
                ? "border-amber-400/30 bg-amber-400/10 text-white"
                : tone === "bad"
                    ? "border-rose-400/30 bg-rose-400/10 text-white"
                    : "border-white/10 bg-white/5 text-white/80";

    return (
        <div className={cn("inline-flex items-center rounded-lg border px-2 py-1 text-xs", toneClass)}>
            {children}
        </div>
    );
}

export function ModuleHeader({
    title,
    subtitle,
    right,
    chips,
}: {
    title: string;
    subtitle: ReactNode;
    right?: ReactNode;
    chips?: Array<{ label: string; tone?: ChipTone }>;
}) {
    return (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-white/90">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm text-white/65">{subtitle}</p>

                {chips?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {chips.map((c, idx) => (
                            <Chip key={idx} tone={c.tone}>
                                {c.label}
                            </Chip>
                        ))}
                    </div>
                ) : null}
            </div>

            {right ? <div className="shrink-0">{right}</div> : null}
        </div>
    );
}
