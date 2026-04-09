"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Bookmark } from "lucide-react";
import { VocabularyItem } from "@/data/vocabulary";
import { cn } from "@/lib/utils";

interface VocabGridProps {
    data: VocabularyItem[];
    currentIndex: number | null;
    learned: Set<number>;
    onSelect: (id: number) => void;
}

export default function VocabGrid({ data, currentIndex, learned, onSelect }: VocabGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {data.map((item, idx) => {
                const isActive = currentIndex === item.id;
                const isLearned = learned.has(item.id);

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(item.id)}
                        className={cn(
                            "group relative flex flex-col p-4 rounded-2xl cursor-pointer transition-all duration-300",
                            "border-2",
                            isActive
                                ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
                                : isLearned
                                  ? "bg-emerald-50/10 border-emerald-100 hover:border-emerald-200"
                                  : "bg-white border-stone-100 hover:border-stone-200 shadow-sm",
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span
                                className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    isLearned ? "text-emerald-500" : "text-stone-300",
                                )}
                            >
                                #{String(item.id + 1).padStart(2, "0")}
                            </span>
                            {isLearned && <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-50" />}
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 py-1">
                            <span
                                className={cn(
                                    "text-2xl font-black text-stone-800 transition-colors duration-300 mb-1",
                                    isActive && "text-primary",
                                )}
                            >
                                {item.word}
                            </span>
                            <span className="text-[10px] font-bold text-stone-400">{item.reading}</span>
                        </div>

                        {/* Hover Overlay */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                                isActive && "opacity-0",
                            )}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}

