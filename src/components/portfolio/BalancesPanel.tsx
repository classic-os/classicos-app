"use client";

import { Panel } from "@/components/ui/Panel";
import { NativeBalanceDisplay } from "@/components/portfolio/NativeBalanceDisplay";
import { TokenBalancesDisplay } from "@/components/portfolio/TokenBalancesDisplay";

export function BalancesPanel() {
    return (
        <Panel title="Balances" description="Assets visible to this workspace">
            <div className="space-y-6">
                {/* Native Balance (ETC/ETH) */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-white/70">Native Asset</h3>
                    <NativeBalanceDisplay />
                </div>

                {/* ERC20 Tokens */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-white/70">ERC20 Tokens</h3>
                    <TokenBalancesDisplay />
                </div>
            </div>
        </Panel>
    );
}
