"use client";

import { useSyncExternalStore } from "react";
import { getCurrency, setCurrency, subscribeWorkspace } from "@/lib/state/workspace";
import { getAllCurrencies, type CurrencyCode } from "@/lib/currencies/registry";

type CurrencySelectorProps = {
    variant?: "compact" | "full";
};

/**
 * Currency Selector Component
 *
 * Allows users to select their preferred display currency.
 * Persists selection in workspace state (localStorage).
 */
export function CurrencySelector({ variant = "compact" }: CurrencySelectorProps) {
    const currency = useSyncExternalStore(
        subscribeWorkspace,
        getCurrency,
        getCurrency
    );

    const currencies = getAllCurrencies();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value as CurrencyCode);
    };

    if (variant === "compact") {
        return (
            <select
                id="currency-selector-compact"
                name="currency"
                value={currency}
                onChange={handleChange}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-white/90 transition hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="Select display currency"
                aria-label="Select display currency"
            >
                {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-black/90">
                        {c.symbol} {c.code}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor="currency-selector-full" className="text-xs font-medium text-white/70">
                Display Currency
            </label>
            <select
                id="currency-selector-full"
                name="currency"
                value={currency}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 transition hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Select display currency"
            >
                {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-black/90">
                        {c.symbol} {c.code} - {c.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
