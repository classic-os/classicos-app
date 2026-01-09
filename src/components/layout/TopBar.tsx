"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/NavItems";
import { TestnetToggle } from "@/components/primitives/TestnetToggle";
import { NetworkStatus } from "@/components/primitives/NetworkStatus";
import { WalletConnector } from "@/components/primitives/WalletConnector";

export function TopBar() {
    const pathname = usePathname();
    const current = NAV_ITEMS.find((x) => x.href === pathname);

    return (
        <header className="border-b border-white/10 bg-black/22 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white/90">
                        {current?.label ?? "Classic OS"}
                    </div>
                    <div className="truncate text-xs text-white/50">
                        {current?.description ?? "Operating surface for Ethereum Classic."}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TestnetToggle />
                    <NetworkStatus />
                    <WalletConnector />
                </div>
            </div>
        </header>
    );
}
