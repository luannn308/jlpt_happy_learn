"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeMode {
    id: string;
    label: string;
}

interface PracticeHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    modes: PracticeMode[];
    activeMode: string;
    onModeChange: (modeId: any) => void;
    currentIndex: number;
    total: number;
}

export default function PracticeHeader({
    icon: Icon,
    title,
    description,
    modes,
    activeMode,
    onModeChange,
    currentIndex,
    total
}: PracticeHeaderProps) {
    const progress = (currentIndex / total) * 100;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <Badge
                        variant="outline"
                        className="w-fit bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1 rounded-full flex gap-2"
                    >
                        <Icon size={14} /> <span className="Vietnamese-Content">{title}</span>
                    </Badge>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest px-1 Vietnamese-Content">
                        {description}
                    </p>
                </div>

                <div className="flex bg-stone-100 p-1 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                    {modes.map((mode) => (
                        <Button
                            key={mode.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-xl font-bold whitespace-nowrap px-4 tracking-tight",
                                activeMode === mode.id ? "bg-white shadow-sm text-primary" : "text-stone-500",
                            )}
                            onClick={() => onModeChange(mode.id)}
                        >
                            <span className="Vietnamese-Content">{mode.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black tracking-widest text-stone-400 uppercase">
                    <span className="Vietnamese-Content">Tiến trình</span>
                    <span>
                        {currentIndex + 1} / {total}
                    </span>
                </div>
                <Progress value={progress} className="h-2 bg-stone-100" />
            </div>
        </div>
    );
}
