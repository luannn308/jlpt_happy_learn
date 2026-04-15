"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, VolumeX, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeMode {
    id: string;
    label: string;
}

interface PracticeHeaderProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    modes: PracticeMode[];
    activeMode: string;
    onModeChange: (modeId: string) => void;
    currentIndex: number;
    total: number;
    showAll?: boolean;
    onShowAllChange?: (show: boolean) => void;
    isMuted?: boolean;
    onMuteToggle?: () => void;
}

export default function PracticeHeader({
    title,
    description,
    icon,
    modes,
    activeMode,
    onModeChange,
    currentIndex,
    total,
    showAll = false,
    onShowAllChange,
    isMuted,
    onMuteToggle,
}: PracticeHeaderProps) {
    const progress = total > 0 ? (currentIndex / total) * 100 : 0;
    const isInitial = currentIndex === 0;

    return (
        <div className="flex flex-col w-full space-y-6">
            {/* Row 1: Title Badge & Subtle Controls */}
            <div className="flex items-center justify-between px-2">
                <Badge
                    variant="outline"
                    className="border-primary/20 text-primary bg-primary/5 font-bold px-4 py-1.5 rounded-full flex gap-2 shadow-sm"
                >
                    {icon || <BrainCircuit size={14} />}
                    <span className="Vietnamese-Content uppercase tracking-wider text-[10px] md:text-xs">{title}</span>
                </Badge>

                <div className="flex items-center gap-2 md:gap-4">
                    <AnimatePresence>
                        {onShowAllChange && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-stone-100 shadow-sm hover:bg-white transition-all group"
                            >
                                <input
                                    type="checkbox"
                                    id="headerShowAll"
                                    checked={showAll}
                                    onChange={(e) => onShowAllChange(e.target.checked)}
                                    className="w-3.5 h-3.5 rounded-full border-stone-300 text-primary focus:ring-primary cursor-pointer transition-all"
                                />
                                <label
                                    htmlFor="headerShowAll"
                                    className="text-[9px] font-black text-stone-400 cursor-pointer uppercase tracking-[0.1em] Vietnamese-Content whitespace-nowrap group-hover:text-stone-600 transition-colors"
                                >
                                    Ôn tập tất cả
                                </label>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {onMuteToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMuteToggle}
                            className="rounded-full h-8 w-8 md:h-9 md:w-9 hover:bg-stone-100 text-stone-400 hover:text-primary transition-colors"
                        >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </Button>
                    )}

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest leading-none">
                            Tiến độ
                        </span>
                        <span className="text-xs font-black text-stone-500 uppercase">
                            {currentIndex}/{total}
                        </span>
                    </div>
                </div>
            </div>

            {/* Row 2: Progress Bar - Motion Optimized */}
            <div className="relative h-2.5 w-full bg-stone-100/50 rounded-full overflow-hidden shadow-inner border border-stone-50">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(184,92,92,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} // Spring-like feel
                />
            </div>

            {/* Row 2.5: Optional Description */}
            {description && (
                <div className="flex justify-center -mt-2">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10 Vietnamese-Content">
                        {description}
                    </span>
                </div>
            )}

            {/* Row 3: Quiz Mode Tabs - Refined Floating Style */}
            <AnimatePresence mode="wait">
                {isInitial && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center gap-4 w-full"
                    >
                        <Tabs value={activeMode} onValueChange={onModeChange} className="w-full flex justify-center">
                            <TabsList className="bg-stone-100/40 backdrop-blur-sm p-1.5 h-auto gap-1 md:gap-2 flex flex-wrap justify-center rounded-full border border-stone-200/50 shadow-sm">
                                {modes.map((mode) => (
                                    <TabsTrigger
                                        key={mode.id}
                                        value={mode.id}
                                        className={cn(
                                            "rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all Vietnamese-Content",
                                            "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md",
                                            "text-stone-400 hover:text-stone-600 hover:bg-white/50",
                                        )}
                                    >
                                        {mode.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Sparkles size={10} className="text-primary" />
                            Chọn chế độ học để bắt đầu
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

