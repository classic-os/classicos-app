const KEY = "classicos:testnetsEnabled";

export function getTestnetsEnabled(): boolean {
    if (typeof window === "undefined") return false;
    try {
        return window.localStorage.getItem(KEY) === "true";
    } catch {
        return false;
    }
}

export function setTestnetsEnabled(v: boolean) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, v ? "true" : "false");
    } catch {
        // ignore
    }
}
