import type { LucideIcon } from "lucide-react";
import { Home, Pickaxe, Route, Layers, Wallet } from "lucide-react";

export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    description: string;
};

export const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home", icon: Home, description: "Start screen and system status." },
    { href: "/produce", label: "Produce", icon: Pickaxe, description: "Mining entry + reward routing." },
    { href: "/deploy", label: "Deploy", icon: Route, description: "Route ETC into productive use." },
    { href: "/markets", label: "Markets", icon: Layers, description: "Create assets and form markets." },
    { href: "/portfolio", label: "Portfolio", icon: Wallet, description: "Balances, positions, activity." },
];
