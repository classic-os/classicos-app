"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function LiquidityPanel() {
    return (
        <Panel title="Liquidity" description="Seed and adjust liquidity">
            <EmptyState
                title="No liquidity pools available"
                body="Liquidity formation and adjustment surfaces will appear here when supported."
            />
        </Panel>
    );
}
