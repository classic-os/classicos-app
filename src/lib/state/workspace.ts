import { DEFAULT_ACTIVE_CHAIN_ID } from "@/lib/networks/registry";

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

export function getActiveChainId(): number {
    if (typeof window === "undefined") return DEFAULT_ACTIVE_CHAIN_ID;
    const raw = window.localStorage.getItem(KEY_ACTIVE);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : DEFAULT_ACTIVE_CHAIN_ID;
}

export function setActiveChainId(chainId: number) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY_ACTIVE, String(chainId));
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
