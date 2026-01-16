import { useState } from "react";
import Image from "next/image";

type TokenLogoProps = {
    logoURI?: string;
    symbol: string;
    size?: "sm" | "md" | "lg";
};

/**
 * Token Logo Component
 *
 * Displays token logo with fallback to symbol initial if image fails to load.
 * Sizes: sm (24px), md (32px), lg (48px)
 */
export function TokenLogo({ logoURI, symbol, size = "md" }: TokenLogoProps) {
    const [hasError, setHasError] = useState(false);

    const sizeMap = {
        sm: 24,
        md: 32,
        lg: 48,
    };

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-12 w-12 text-base",
    };

    const sizePx = sizeMap[size];
    const sizeClass = sizeClasses[size];

    // If no logo or logo failed to load, show fallback
    if (!logoURI || hasError) {
        return (
            <div
                className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold text-white/70`}
            >
                {symbol[0]?.toUpperCase() || "?"}
            </div>
        );
    }

    return (
        <Image
            src={logoURI}
            alt={`${symbol} logo`}
            width={sizePx}
            height={sizePx}
            className={`${sizeClass} shrink-0 rounded-full`}
            onError={() => setHasError(true)}
        />
    );
}
