"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useSyncExternalStore } from "react";

import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";
import { CapabilityBadge } from "@/components/ui/CapabilityBadge";

import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";
import { getActiveChainId, subscribeWorkspace } from "@/lib/state/workspace";
import { getEcosystem } from "@/lib/ecosystems/registry";

const tiles = [
  { href: "/produce", title: "Produce", body: "Production mode by network (mine or stake)." },
  { href: "/deploy", title: "Deploy", body: "Route capital into available strategies." },
  { href: "/markets", title: "Markets", body: "Asset creation and market formation surfaces." },
  { href: "/portfolio", title: "Portfolio", body: "Balances, positions, and activity views." },
];

function consensusLabel(produce: "mine" | "stake" | "none") {
  if (produce === "mine") return "Proof-of-Work";
  if (produce === "stake") return "Proof-of-Stake";
  return "—";
}

export default function Home() {
  const activeChainId = useSyncExternalStore(
    subscribeWorkspace,
    getActiveChainId,
    () => DEFAULT_ACTIVE_CHAIN_ID
  );

  const chain = CHAINS_BY_ID[activeChainId];
  const ecosystem = useMemo(() => getEcosystem(activeChainId), [activeChainId]);

  const environment = ecosystem.kind === "testnet" ? "Test environment" : "Mainnet";
  const consensus = consensusLabel(ecosystem.capabilities.produce);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Classic OS</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Workspace console for network selection, capability surfaces, and execution gating.
        </p>
      </div>

      <Panel title="Workspace Status" description="Active network and execution context">
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Active" value={chain?.name ?? `Chain ${activeChainId}`} />
          <StatusPill label="Environment" value={environment} />
          <StatusPill label="Consensus" value={consensus} />
        </div>

        <div className="mt-4 text-sm text-white/65">
          Modules are enabled per network. Execution is gated to the active network.
        </div>
      </Panel>

      <Panel title="Capabilities" description="Module availability on the active network">
        <div className="grid gap-2 md:grid-cols-2">
          <CapabilityBadge label="Deploy" enabled={ecosystem.capabilities.deploy} />
          <CapabilityBadge label="Markets" enabled={ecosystem.capabilities.markets} />
          <CapabilityBadge label="Portfolio" enabled={ecosystem.capabilities.portfolio} />
          <CapabilityBadge label="Monitoring" enabled={ecosystem.capabilities.monitoring} />
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm transition hover:border-white/15 hover:bg-black/28"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: "rgb(var(--accent))",
                  boxShadow: "0 0 14px rgba(0,0,0,0.0)",
                }}
              />
              <div className="text-sm font-semibold text-white/90 group-hover:text-white">
                {t.title}
              </div>
            </div>
            <div className="mt-2 text-sm text-white/65 group-hover:text-white/75">{t.body}</div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
