"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyItem } from "@/data/vocabulary";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, BookText, Info, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface VocabDetailProps {
    data: VocabularyItem;
    currentIndex: number;
    total: number;
    isLearned: boolean;
    masks: { reading: boolean; meaning: boolean };
    onToggleLearned: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function VocabDetail({
    data,
    currentIndex,
    total,
    isLearned,
    masks,
    onToggleLearned,
    onNext,
    onPrev,
}: VocabDetailProps) {
    if (!data) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={data.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
            >
                <Card className="overflow-hidden border-stone-200 shadow-2xl shadow-stone-200/50 rounded-3xl">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Column: Word Display */}
                        <div className="flex flex-col items-center justify-center bg-stone-50/50 p-8 lg:w-1/3 lg:border-r border-stone-100 text-center">
                            <Badge
                                variant="outline"
                                className="mb-4 border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                            >
                                {data.category || "Từ vựng"}
                            </Badge>

                            <div className="relative mb-2">
                                <span
                                    className={cn(
                                        "font-kanji text-7xl font-black leading-tight text-stone-900 transition-all duration-300",
                                    )}
                                >
                                    {data.word}
                                </span>
                            </div>

                            <h2
                                className={cn(
                                    "mb-4 text-2xl font-black tracking-tighter text-primary uppercase transition-all duration-300",
                                    masks.meaning && "blur-md select-none",
                                )}
                            >
                                {data.han}
                            </h2>

                            <div
                                className={cn(
                                    "mb-8 flex flex-col gap-1 transition-all duration-300",
                                    masks.reading && "blur-md select-none",
                                )}
                            >
                                <span className="text-sm font-bold uppercase tracking-widest text-stone-400">
                                    Cách đọc
                                </span>
                                <p className="font-kanji text-3xl font-black text-primary">{data.reading}</p>
                            </div>

                            <Button
                                variant={isLearned ? "outline" : "default"}
                                size="lg"
                                className={cn(
                                    "mt-8 w-full rounded-2xl font-bold py-7 transition-all duration-300",
                                    isLearned
                                        ? "border-green-500 bg-green-50 text-green-600 hover:bg-green-100 ring-2 ring-green-100"
                                        : "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20",
                                )}
                                onClick={onToggleLearned}
                            >
                                {isLearned ? <CheckCircle2 className="mr-2" /> : <Circle className="mr-2" />}
                                {isLearned ? "Đã thuộc từ này" : "Đánh dấu đã thuộc"}
                            </Button>
                        </div>

                        {/* Right Column: Information & Example */}
                        <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center">
                            <div className="space-y-10">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <BookText size={24} className="fill-primary/10" />
                                        <span className="text-xs font-black uppercase tracking-widest">
                                            Ý Nghĩa (意味)
                                        </span>
                                    </div>
                                    <div
                                        className={cn(
                                            "rounded-[2rem] border-2 border-stone-100 bg-white p-8 shadow-sm transition-all hover:border-primary/20",
                                            masks.meaning && "blur-md select-none",
                                        )}
                                    >
                                        <p className="text-2xl font-black text-stone-800 leading-tight Vietnamese-Content">
                                            {data.meaning}
                                        </p>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Quote size={24} className="fill-primary/10" />
                                        <span className="text-xs font-black uppercase tracking-widest">
                                            Câu ví dụ (例文)
                                        </span>
                                    </div>
                                    <Card className="border-stone-100 bg-white shadow-sm rounded-[2rem] overflow-hidden border-2">
                                        <CardContent className="p-8 space-y-6">
                                            <p className="text-2xl md:text-3xl font-bold leading-relaxed text-stone-800 font-kanji">
                                                {data.example}
                                            </p>
                                            <Separator className="bg-stone-50" />
                                            <p className="text-lg md:text-xl font-medium italic text-stone-500 leading-relaxed Vietnamese-Content">
                                                "{data.exampleMeaning}"
                                            </p>
                                        </CardContent>
                                    </Card>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Bar */}
                    <CardFooter className="flex items-center justify-between border-t border-stone-100 bg-stone-50/30 px-8 py-5">
                        <Button
                            variant="ghost"
                            onClick={onPrev}
                            className="font-bold text-stone-500 hover:text-primary hover:bg-white rounded-xl"
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" /> Trước
                        </Button>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 pt-1">
                                VOCABULARY {currentIndex + 1} OF {total}
                            </span>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={onNext}
                            className="font-bold text-stone-500 hover:text-primary hover:bg-white rounded-xl"
                        >
                            Tiếp <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}

