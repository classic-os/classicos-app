"use client";

import { Panel } from "@/components/ui/Panel";
import { NativeBalanceDisplay } from "@/components/portfolio/NativeBalanceDisplay";

export function BalancesPanel() {
    return (
        <Panel title="Balances" description="Assets visible to this workspace">
            <NativeBalanceDisplay />
        </Panel>
    );
}
