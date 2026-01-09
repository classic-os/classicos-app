"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/NavItems";
import { cn } from "@/lib/utils/cn";

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 pt-4 text-[11px] font-semibold tracking-wider text-white/45">
            {children}
        </div>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
                <div className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_18px_rgba(0,255,136,0.35)]" />
                <div className="flex flex-col leading-tight">
                    <div className="text-sm font-semibold text-white/90">Classic OS</div>
                    <div className="text-xs text-white/45">App v0.1</div>
                </div>
            </div>

            {/* Navigation */}
            <SectionTitle>MODULES</SectionTitle>
            <nav className="mt-2 flex flex-col gap-1 px-2">
                {NAV_ITEMS.map((it) => {
                    const active = pathname === it.href;
                    const Icon = it.icon;

                    return (
                        <Link
                            key={it.href}
                            href={it.href}
                            className={cn(
                                "group flex items-start gap-3 rounded-xl px-3 py-3 transition",
                                active
                                    ? "bg-white/10 text-white cos-ring"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn("mt-0.5 h-4 w-4", active ? "text-white" : "text-white/60 group-hover:text-white")} />
                            <div className="min-w-0">
                                <div className="text-sm font-semibold">{it.label}</div>
                                <div className="mt-0.5 truncate text-xs text-white/50 group-hover:text-white/60">
                                    {it.description}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* External */}
            <SectionTitle>RESOURCES</SectionTitle>
            <div className="mt-2 px-2">
                <a
                    href="https://classicos.org/docs"
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                    <span>Docs</span>
                    <span className="text-xs text-white/40">external</span>
                </a>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer strip */}
            <div className="border-t border-white/10 px-4 py-3 text-xs text-white/45">
                <div className="flex items-center justify-between">
                    <span>Classic OS</span>
                    <span className="text-white/35">v0.1</span>
                </div>
            </div>
        </div>
    );
}
