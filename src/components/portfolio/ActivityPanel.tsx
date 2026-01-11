"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function ActivityPanel() {
    return (
        <Panel title="Activity" description="Recent transactions and events">
            <EmptyState
                title="No activity yet"
                body="When you deploy capital, create markets, or receive rewards, events will appear here."
            />
        </Panel>
    );
}
