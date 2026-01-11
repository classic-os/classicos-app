"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function BalancesPanel() {
    return (
        <Panel title="Balances" description="Assets visible to this workspace">
            <EmptyState
                title="No balances to display yet"
                body="Connect a wallet to view native assets, tokens, and supported position balances."
            />
        </Panel>
    );
}
