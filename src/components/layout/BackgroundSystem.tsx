"use client";

import { motion } from "framer-motion";

/**
 * ClassicOS Background System
 * Industrial, restrained, always-on execution surface.
 */
export default function BackgroundSystem() {
    return (
        <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            aria-hidden="true"
        >
            {/* base */}
            <div className="absolute inset-0 bg-neutral-950" />

            {/* atmosphere */}
            <motion.div
                className="absolute inset-0 [background:radial-gradient(900px_520px_at_18%_12%,rgba(0,255,136,0.10),transparent_62%),radial-gradient(780px_520px_at_84%_18%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(900px_520px_at_60%_86%,rgba(0,255,136,0.06),transparent_64%)]"
                animate={{ opacity: [0.72, 0.88, 0.72] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* grid */}
            <div className="absolute inset-0 opacity-[0.045] bg-grid" />

            {/* diagonals */}
            <div className="absolute inset-0 opacity-[0.08] [background:repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_72px)]" />

            {/* conduits */}
            <div className="absolute inset-0 opacity-35">
                <div className="absolute left-[-20%] top-[18%] h-px w-[140%] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                <div className="absolute left-[-20%] top-[48%] h-px w-[140%] bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                <div className="absolute left-[-20%] top-[72%] h-px w-[140%] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="absolute top-[-20%] left-[22%] h-[140%] w-px bg-gradient-to-b from-transparent via-white/12 to-transparent" />
                <div className="absolute top-[-20%] left-[58%] h-[140%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <div className="absolute top-[-20%] left-[82%] h-[140%] w-px bg-gradient-to-b from-transparent via-white/12 to-transparent" />
            </div>

            {/* active flows */}
            <motion.div
                className="absolute left-[-35%] top-[48%] h-[2px] w-[32%] bg-gradient-to-r from-transparent via-emerald-400/55 to-transparent"
                animate={{ x: ["0%", "300%"] }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute left-[-45%] top-[22%] h-[2px] w-[26%] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
                animate={{ x: ["0%", "340%"] }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 2 }}
            />
            <motion.div
                className="absolute left-[62%] top-[-35%] h-[26%] w-[2px] bg-gradient-to-b from-transparent via-emerald-400/45 to-transparent"
                animate={{ y: ["0%", "340%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 1.2 }}
            />

            {/* vignette */}
            <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.70)_100%)]" />
        </div>
    );
}
