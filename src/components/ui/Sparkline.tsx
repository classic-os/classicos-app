"use client";

import { useMemo } from "react";

/**
 * Sparkline Chart Component
 *
 * Displays a simple SVG line chart for price trends.
 * Follows CoinGecko sparkline pattern with smooth curves and gradient fill.
 *
 * Features:
 * - Automatic scaling to fit container
 * - Smooth curve interpolation
 * - Gradient fill below line
 * - Color-coded by trend (green/red)
 * - Responsive width, fixed height
 */

export type SparklineProps = {
    data: number[]; // Array of price values
    width?: number; // SVG width (default: 100%)
    height?: number; // SVG height (default: 60)
    color?: "green" | "red" | "gray"; // Line color
    showGradient?: boolean; // Show gradient fill
};

export function Sparkline({
    data,
    width = 200,
    height = 60,
    color = "green",
    showGradient = true,
}: SparklineProps) {
    // Calculate min/max for scaling
    const { min, max, range } = useMemo(() => {
        if (data.length === 0) return { min: 0, max: 1, range: 1 };
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        return { min, max, range };
    }, [data]);

    // Generate SVG path
    const { linePath, areaPath } = useMemo(() => {
        if (data.length === 0) return { linePath: "", areaPath: "" };

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * (height - 10) - 5;
            return { x, y };
        });

        // Create smooth curve using quadratic bezier
        const linePath = points.reduce((path, point, index) => {
            if (index === 0) {
                return `M ${point.x},${point.y}`;
            }
            const prevPoint = points[index - 1];
            const midX = (prevPoint.x + point.x) / 2;
            return `${path} Q ${prevPoint.x},${prevPoint.y} ${midX},${(prevPoint.y + point.y) / 2} T ${point.x},${point.y}`;
        }, "");

        // Create area path (for gradient fill)
        const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

        return { linePath, areaPath };
    }, [data, width, height, min, range]);

    // Color classes
    const strokeColor = {
        green: "#4ade80",
        red: "#f87171",
        gray: "rgba(255, 255, 255, 0.3)",
    }[color];

    const gradientColor = {
        green: { start: "rgba(74, 222, 128, 0.2)", end: "rgba(74, 222, 128, 0)" },
        red: { start: "rgba(248, 113, 113, 0.2)", end: "rgba(248, 113, 113, 0)" },
        gray: { start: "rgba(255, 255, 255, 0.1)", end: "rgba(255, 255, 255, 0)" },
    }[color];

    if (data.length === 0) {
        return (
            <div
                className="flex items-center justify-center text-xs text-white/40"
                style={{ width, height }}
            >
                No data
            </div>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
            preserveAspectRatio="none"
        >
            {showGradient && (
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={gradientColor.start} />
                        <stop offset="100%" stopColor={gradientColor.end} />
                    </linearGradient>
                </defs>
            )}

            {/* Area fill */}
            {showGradient && (
                <path
                    d={areaPath}
                    fill={`url(#gradient-${color})`}
                    opacity="0.5"
                />
            )}

            {/* Line */}
            <path
                d={linePath}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
