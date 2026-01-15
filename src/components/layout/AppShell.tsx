"use client";

import type { ReactNode } from "react";
import BackgroundSystem from "@/components/layout/BackgroundSystem";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { FooterStatus } from "@/components/layout/FooterStatus";
import { useSyncActiveChain } from "@/hooks/useSyncActiveChain";

export function AppShell({ children }: { children: ReactNode }) {
    // Automatically sync active workspace chain to match wallet's connected chain
    useSyncActiveChain();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <BackgroundSystem />

            {/* OS frame */}
            <div className="relative z-10 min-h-screen">
                <div className="mx-auto w-full max-w-7xl px-3 py-3 md:px-5 md:py-5">
                    <div className="cos-window grid min-h-[calc(100vh-24px)] grid-cols-1 overflow-hidden md:grid-cols-[260px_1fr]">
                        {/* Sidebar */}
                        <aside className="hidden border-r border-white/10 bg-black/25 md:block">
                            <Sidebar />
                        </aside>

                        {/* Main column */}
                        <div className="flex min-w-0 flex-col">
                            <TopBar />

                            <main className="min-w-0 flex-1 p-4 md:p-6">
                                {children}
                            </main>

                            <footer className="border-t border-white/10 bg-black/18 px-4 py-3 text-xs text-white/55 md:px-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div>Economic Operating System</div>
                                    <FooterStatus />
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
