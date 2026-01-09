"use client";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

export default function MarketsPage() {
    return (
        <div>
            <ModuleHeader
                title="Markets"
                subtitle="Create assets and form markets. Deploy contracts with explicit parameters and receipts."
                chips={[
                    { label: "ETC mainnet", tone: "good" },
                    { label: "Create Asset: next", tone: "warn" },
                    { label: "Receipts: required", tone: "neutral" },
                ]}
            />

            <RequirementGate>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Create Asset" description="ERC-20 deployment via minimal web form.">
                        <EmptyState
                            title="Asset deployment not wired"
                            body="This module will host the first real on-chain action (ERC-20 deploy). UI scaffolding is in place; transaction adapters will be added next."
                            actionLabel="View Portfolio"
                            actionHref="/portfolio"
                        />
                    </Panel>

                    <Panel title="Form Market" description="Create a pool/market and seed initial liquidity.">
                        <EmptyState
                            title="Market adapters not configured"
                            body="No DEX/market adapters are configured in this environment. Once connected, this panel will create markets with explicit parameters."
                        />
                    </Panel>
                </div>
            </RequirementGate>
        </div>
    );
}
