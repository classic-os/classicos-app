import { ETCSWAP_V2_METADATA, ETCSWAP_V3_METADATA } from "@/lib/protocols/etcswap-contracts";

export type Protocol = "etcswap-v2" | "etcswap-v3";

type ProtocolBadgeProps = {
    protocol: Protocol;
    size?: "sm" | "md";
    showLink?: boolean;
    chainId?: number;
};

const PROTOCOL_CONFIG: Record<
    Protocol,
    {
        name: string;
        color: string;
        getUrl: (chainId?: number) => string;
    }
> = {
    "etcswap-v2": {
        name: "ETCswap V2",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        getUrl: (chainId) =>
            chainId === 63
                ? ETCSWAP_V2_METADATA.url.mordor
                : ETCSWAP_V2_METADATA.url.mainnet,
    },
    "etcswap-v3": {
        name: "ETCswap V3",
        color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        getUrl: () => ETCSWAP_V3_METADATA.url,
    },
};

/**
 * Protocol Badge Component
 *
 * Visual indicator for DeFi protocols with optional link.
 * Used in position cards to show which protocol a position belongs to.
 */
export function ProtocolBadge({ protocol, size = "md", showLink = false, chainId }: ProtocolBadgeProps) {
    const config = PROTOCOL_CONFIG[protocol];

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
    };

    const badge = (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md border ${config.color} ${sizeClasses[size]} font-medium`}
        >
            {config.name}
        </span>
    );

    if (showLink) {
        const url = config.getUrl(chainId);
        return (
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-block transition hover:opacity-80"
                title={`Open ${config.name}`}
            >
                {badge}
            </a>
        );
    }

    return badge;
}
