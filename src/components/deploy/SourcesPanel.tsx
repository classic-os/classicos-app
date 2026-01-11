"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function SourcesPanel() {
    return (
        <Panel title="Capital Sources" description="Where capital enters the system">
            <EmptyState
                title="No capital sources configured"
                body="Select a source of capital to deploy. External chains and onramps will appear here when supported."
            />
        </Panel>
    );
}
