"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressChartProps {
    learned: number;
    total: number;
}

export default function ProgressChart({ learned, total }: ProgressChartProps) {
    const percentage = total > 0 ? (learned / total) * 100 : 0;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const isLarge = learned >= 100 || total >= 100;
    const isVeryLarge = learned >= 1000 || total >= 1000;

    return (
        <div className="relative h-40 w-40 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-stone-100"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    strokeLinecap="round"
                    className="text-green-500"
                />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-4">
                <div className="flex items-baseline justify-center whitespace-nowrap gap-0.5">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "font-black text-stone-900 tabular-nums leading-none tracking-tight",
                            isVeryLarge ? "text-lg" : isLarge ? "text-xl" : "text-4xl"
                        )}
                    >
                        {learned}
                    </motion.span>
                    <span className={cn(
                        "font-bold text-stone-300 tabular-nums leading-none",
                        isVeryLarge ? "text-[10px]" : isLarge ? "text-xs" : "text-xl"
                    )}>
                        /{total}
                    </span>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-stone-400 Vietnamese-Content mt-1 block">
                    Tiến độ học
                </span>
            </div>
        </div>
    );
}

