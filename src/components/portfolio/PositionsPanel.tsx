"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function PositionsPanel() {
    return (
        <Panel title="Positions" description="Deployed capital and exposures">
            <EmptyState
                title="No active positions"
                body="Capital deployed through ClassicOS will appear here as positions. Use Deploy to allocate capital into strategies."
                actionLabel="Go to Deploy"
                actionHref="/deploy"
            />
        </Panel>
    );
}
