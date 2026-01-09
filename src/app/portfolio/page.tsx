"use client";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

export default function PortfolioPage() {
    return (
        <div>
            <ModuleHeader
                title="Portfolio"
                subtitle="Observe balances, positions, and recent activity. This is the operational record of the surface."
                chips={[
                    { label: "Local history", tone: "neutral" },
                    { label: "Indexers: optional later", tone: "neutral" },
                ]}
            />

            <RequirementGate>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Balances" description="Wallet and routed balances (explicit).">
                        <EmptyState
                            title="No balances available"
                            body="Connect a wallet to view balances. Routed balances appear once mining adapters are configured."
                        />
                    </Panel>

                    <Panel title="Positions" description="Deployed capital, LP, lending, and market positions.">
                        <EmptyState
                            title="No positions detected"
                            body="Positions will appear after you execute a deploy or market action. In v0.1, local history is used before indexers are added."
                        />
                    </Panel>
                </div>

                <div className="mt-4">
                    <Panel title="Recent Activity" description="Local-first activity log (will later swap to indexer).">
                        <EmptyState
                            title="No activity yet"
                            body="Once you execute an on-chain action, receipts and transactions will appear here."
                        />
                    </Panel>
                </div>
            </RequirementGate>
        </div>
    );
}
