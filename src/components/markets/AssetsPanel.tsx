"use client";

import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";

export function AssetsPanel() {
    return (
        <Panel title="Assets" description="Token and asset issuance">
            <EmptyState
                title="No assets available"
                body="Asset creation surfaces will appear here when supported."
            />
        </Panel>
    );
}
