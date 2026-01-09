"use client";

import Link from "next/link";

export function EmptyState({
    title,
    body,
    actionLabel,
    actionHref,
}: {
    title: string;
    body: string;
    actionLabel?: string;
    actionHref?: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/16 p-4 text-sm text-white/70">
            <div className="text-sm font-semibold text-white/85">{title}</div>
            <div className="mt-2 text-sm text-white/65">{body}</div>
            {actionLabel && actionHref ? (
                <div className="mt-3">
                    <Link
                        href={actionHref}
                        className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        {actionLabel}
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
