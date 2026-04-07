"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanjiData } from "@/data/kanji";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanjiGridProps {
    data: KanjiData[];
    currentIndex: number | null;
    learned: Set<number>;
    onSelect: (id: number) => void;
}

export default function KanjiGrid({ data, currentIndex, learned, onSelect }: KanjiGridProps) {
    return (
        <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">Danh sách 10 chữ mới</h3>
                <Badge variant="secondary" className="font-mono text-[10px]">
                    {learned.size} / {data.length} Đã học
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
                {data.map((item, index) => {
                    const isSelected = currentIndex === item.id;
                    const isLearned = learned.has(item.id);

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden transition-all duration-300",
                                    "aspect-square flex flex-col items-center justify-center border-2",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                        : "border-stone-100 hover:border-primary/30 bg-white",
                                    isLearned && !isSelected && "bg-stone-50/50",
                                )}
                                onClick={() => onSelect(item.id)}
                            >
                                {isLearned && (
                                    <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm" />
                                )}

                                <CardContent className="flex flex-col items-center justify-center p-0">
                                    <span
                                        className={cn(
                                            "font-kanji text-5xl font-bold transition-colors duration-300 mb-1",
                                            isSelected ? "text-primary" : "text-stone-800",
                                            isLearned && !isSelected && "text-stone-400",
                                        )}
                                    >
                                        {item.kanji}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                                            isSelected ? "text-primary" : "text-stone-400",
                                        )}
                                    >
                                        {item.han}
                                    </span>
                                </CardContent>

                                {/* Decorative background element for active card */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute inset-0 bg-primary/5 z-[-1]"
                                    />
                                )}
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

