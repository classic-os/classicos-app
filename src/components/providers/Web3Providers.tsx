"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeWagmiConfig } from "@/lib/chain/wagmi";
import { getTestnetsEnabled } from "@/lib/state/testnets";

export function Web3Providers({ children }: { children: ReactNode }) {
    const [testnetsEnabled, setTestnetsEnabled] = useState(false);

    useEffect(() => {
        setTestnetsEnabled(getTestnetsEnabled());
    }, []);

    const config = useMemo(() => makeWagmiConfig(testnetsEnabled), [testnetsEnabled]);

    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
