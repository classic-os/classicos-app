import type { LucideIcon } from "lucide-react";
import { Home, Pickaxe, Route, Layers, Wallet } from "lucide-react";

export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    description: string;
};

export const NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home", icon: Home, description: "Workspace status and available modules." },
    { href: "/produce", label: "Produce", icon: Pickaxe, description: "Production mode by network (mine or stake)." },
    { href: "/portfolio", label: "Portfolio", icon: Wallet, description: "Balances, positions, and activity views." },
    { href: "/deploy", label: "Deploy", icon: Route, description: "Route capital into available strategies." },
    { href: "/markets", label: "Markets", icon: Layers, description: "Asset creation and market formation surfaces." },
];
