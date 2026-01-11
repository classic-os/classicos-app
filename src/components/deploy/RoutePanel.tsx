"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function RoutePanel() {
    return (
        <Panel title="Routing & Preview" description="Preview how capital will be allocated">
            <EmptyState
                title="No routing preview available"
                body="Routing and execution previews will appear here before capital is deployed."
            />
        </Panel>
    );
}
