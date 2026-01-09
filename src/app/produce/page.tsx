"use client";

import { ModuleHeader } from "@/components/ui/ModuleHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementGate } from "@/components/ui/RequirementGate";

export default function ProducePage() {
    return (
        <div>
            <ModuleHeader
                title="Produce"
                subtitle="Mining entry and reward routing. Configure destinations and observe routing state."
                chips={[
                    { label: "ETC-first", tone: "good" },
                    { label: "Adapters: scaffold", tone: "neutral" },
                    { label: "Explicit states", tone: "neutral" },
                ]}
            />

            <RequirementGate>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Mining Destination" description="Select direct, pool, or distributed routing.">
                        <EmptyState
                            title="No pool adapter configured"
                            body="This environment has no mining/pool adapter configured yet. You can still set preferences once adapters are wired."
                        />
                    </Panel>

                    <Panel title="Reward Routing" description="Route rewards to wallet or deployment module.">
                        <EmptyState
                            title="Routing state unavailable"
                            body="Reward routing state is not connected in this environment. Once adapters are wired, this panel will show active routes and balances."
                        />
                    </Panel>
                </div>

                <div className="mt-4">
                    <Panel title="Accumulation" description="Informational view of rewards and routing over time.">
                        <EmptyState
                            title="No reward stream detected"
                            body="ClassicOS will show reward accumulation once a mining adapter is connected or a routed stream is detected."
                        />
                    </Panel>
                </div>
            </RequirementGate>
        </div>
    );
}
