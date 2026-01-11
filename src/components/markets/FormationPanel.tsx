"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function FormationPanel() {
    return (
        <Panel title="Formation" description="Market creation and initialization">
            <EmptyState
                title="No markets available"
                body="Market formation flows will appear here when supported."
            />
        </Panel>
    );
}
