"use client";

export function CapabilityBadge({
    label,
    enabled,
}: {
    label: string;
    enabled: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs">
            <span className="text-white/70">{label}</span>

            <span
                className={[
                    "inline-flex items-center gap-2 rounded-md px-2 py-1 text-[11px] font-semibold",
                    enabled
                        ? "bg-white/[0.06] text-white/85"
                        : "bg-black/20 text-white/45",
                ].join(" ")}
            >
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                        backgroundColor: enabled ? "rgb(var(--accent))" : "rgba(255,255,255,0.25)",
                        boxShadow: enabled ? "0 0 12px rgba(0,0,0,0.0)" : "none",
                    }}
                    aria-hidden="true"
                />
                {enabled ? "Available" : "Not supported"}
            </span>
        </div>
    );
}
