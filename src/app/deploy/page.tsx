"use client";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

export default function DeployPage() {
    return (
        <div>
            <ModuleHeader
                title="Deploy"
                subtitle="Route ETC into productive on-chain use. Preview routes, execute transactions, and track resulting positions."
                chips={[
                    { label: "ETC mainnet", tone: "good" },
                    { label: "Routes: preview-first", tone: "neutral" },
                    { label: "Tx lifecycle: scaffold", tone: "neutral" },
                ]}
            />

            <RequirementGate mode="ETC_ONLY">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Source" description="Select wallet balance or routed rewards source.">
                        <EmptyState
                            title="No sources configured"
                            body="Wallet sources are available once connected. Routed reward sources require a mining adapter."
                        />
                    </Panel>

                    <Panel title="Route Preview" description="Inputs, fees, and expected outputs (explicit).">
                        <EmptyState
                            title="No route adapters configured"
                            body="This environment has no deploy route adapters configured yet. The preview panel will become active when adapters are added."
                        />
                    </Panel>
                </div>

                <div className="mt-4">
                    <Panel title="Execution" description="Transaction confirmation, pending state, receipt, and revert handling.">
                        <EmptyState
                            title="Execution disabled"
                            body="No route adapter is configured in this environment. Connect an adapter to enable execution."
                        />
                    </Panel>
                </div>
            </RequirementGate>
        </div>
    );
}
