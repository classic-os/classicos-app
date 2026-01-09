"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Panel } from "@/components/ui/Panel";

const tiles = [
  { href: "/produce", title: "Produce", body: "Mining entry + reward routing." },
  { href: "/deploy", title: "Deploy", body: "Route ETC into productive on-chain use." },
  { href: "/markets", title: "Markets", body: "Create assets and form markets." },
  { href: "/portfolio", title: "Portfolio", body: "Balances, positions, activity." },
];

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/75">
      <span className="text-white/45">{label}</span>
      <span className="text-white/85">{value}</span>
    </div>
  );
}

export default function Home() {
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
          System ready. Select an operation. Classic OS is ETC-first with explicit, auditable states.
        </p>
      </div>

      <Panel title="System Status" description="Local surface • scaffolded adapters • explicit state model">
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Mode" value="Operational" />
          <StatusPill label="Network" value="ETC-first" />
          <StatusPill label="Adapters" value="Scaffold" />
          <StatusPill label="History" value="Local" />
        </div>
        <div className="mt-4 text-sm text-white/65">
          Start with <span className="text-white/85">Markets</span> to wire a first transaction flow,
          then expand into <span className="text-white/85">Deploy</span> and <span className="text-white/85">Produce</span>.
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
              <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_14px_rgba(0,255,136,0.25)]" />
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
