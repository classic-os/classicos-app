"use client";

export function StatusPill({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/75">
            <span className="text-white/45">{label}</span>
            <span className="text-white/85">{value}</span>
        </div>
    );
}
