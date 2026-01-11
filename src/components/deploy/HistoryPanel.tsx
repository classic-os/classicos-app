"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function HistoryPanel() {
    return (
        <Panel title="Execution History" description="Completed and pending deployments">
            <EmptyState
                title="No deployment history"
                body="Executed deployments and their outcomes will appear here."
            />
        </Panel>
    );
}
