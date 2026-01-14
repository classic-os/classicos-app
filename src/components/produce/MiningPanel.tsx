"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function MiningPanel() {
    return (
        <Panel title="Mining" description="Mining OS for capital production">
            <EmptyState
                title="Mining OS surfaces coming in Phase 2"
                body="Payout detection, earnings tracking, and mining-to-strategy pathways will appear here when Mining OS features are implemented."
            />
        </Panel>
    );
}
