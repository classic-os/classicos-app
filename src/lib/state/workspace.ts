import { CHAINS_BY_ID, DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";

const KEY_ACTIVE = "classicos:activeChainId";
const KEY_SHOW_TESTNETS = "classicos:showTestnets";
const EVENT_NAME = "classicos:workspace";

function emitWorkspaceChange() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeWorkspace(callback: () => void) {
    if (typeof window === "undefined") return () => { };

    const handler = () => callback();

    // Fires when another tab updates localStorage
    window.addEventListener("storage", handler);
    // Fires when *this* tab updates workspace via setters below
    window.addEventListener(EVENT_NAME, handler);

    return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(EVENT_NAME, handler);
    };
}

function normalizeChainId(raw: string | null): number {
    const n = raw ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return DEFAULT_ACTIVE_CHAIN_ID;
    return CHAINS_BY_ID[n] ? n : DEFAULT_ACTIVE_CHAIN_ID;
}

export function getActiveChainId(): number {
    if (typeof window === "undefined") return DEFAULT_ACTIVE_CHAIN_ID;
    return normalizeChainId(window.localStorage.getItem(KEY_ACTIVE));
}

export function setActiveChainId(chainId: number) {
    if (typeof window === "undefined") return;

    // Only persist known chains (prevents stale/invalid values from bricking UI)
    const safe = CHAINS_BY_ID[chainId] ? chainId : DEFAULT_ACTIVE_CHAIN_ID;

    window.localStorage.setItem(KEY_ACTIVE, String(safe));
    emitWorkspaceChange();
}

export function getShowTestnets(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(KEY_SHOW_TESTNETS) === "true";
}

export function setShowTestnets(v: boolean) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY_SHOW_TESTNETS, v ? "true" : "false");
    emitWorkspaceChange();
}
