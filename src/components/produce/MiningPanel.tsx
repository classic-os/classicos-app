"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function MiningPanel() {
    return (
        <Panel title="Mining" description="Protocol-native capital creation (PoW)">
            <EmptyState
                title="Mining not configured"
                body="Mining configuration and hashrate routing will appear here when supported."
            />
        </Panel>
    );
}
