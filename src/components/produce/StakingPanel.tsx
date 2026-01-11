"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function StakingPanel() {
    return (
        <Panel title="Staking" description="Protocol-native capital creation (PoS)">
            <EmptyState
                title="Staking not configured"
                body="Staking and delegation surfaces will appear here when supported."
            />
        </Panel>
    );
}
