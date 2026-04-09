"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanjiData } from "@/data/kanji";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, BookText, GraduationCap, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface KanjiDetailProps {
    data: KanjiData;
    currentIndex: number;
    total: number;
    isLearned: boolean;
    masks: { reading: boolean; meaning: boolean };
    onToggleLearned: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function KanjiDetail({
    data,
    currentIndex,
    total,
    isLearned,
    masks,
    onToggleLearned,
    onNext,
    onPrev,
}: KanjiDetailProps) {
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
                        {/* Left Column: Kanji Display */}
                        <div className="flex flex-col items-center justify-center bg-stone-50/50 p-8 lg:w-1/3 lg:border-r border-stone-100">
                            <div className="relative">
                                <span className="font-kanji text-[10rem] font-black leading-none text-stone-900">
                                    {data.kanji}
                                </span>
                            </div>

                            <h2 className="mt-4 text-3xl font-black tracking-tighter text-primary uppercase">
                                {data.han}
                            </h2>
                            {data.meaning && (
                                <p className="mt-1 text-sm font-medium text-stone-500 italic">
                                    ({data.meaning})
                                </p>
                            )}

                            <div className="mt-8 flex w-full flex-col gap-3">
                                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-primary/20">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                        Âm On
                                    </span>
                                    <p className="font-kanji text-lg font-bold text-stone-800">{data.on}</p>
                                </div>
                                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-primary/20">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                        Âm Kun
                                    </span>
                                    <p className="font-kanji text-lg font-bold text-stone-800">{data.kun}</p>
                                </div>
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
                                {isLearned ? "Đã thuộc chữ này" : "Đánh dấu đã thuộc"}
                            </Button>
                        </div>

                        {/* Right Column: Information Tabs */}
                        <div className="flex-1 p-6 lg:p-10">
                            <Tabs defaultValue="memory" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-stone-100 p-1 mb-8">
                                    <TabsTrigger
                                        value="memory"
                                        className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary"
                                    >
                                        <Lightbulb className="mr-2 h-4 w-4" /> Ghi nhớ
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="vocab"
                                        className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary"
                                    >
                                        <BookText className="mr-2 h-4 w-4" /> Từ vựng
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="memory"
                                    className="space-y-8 animate-in fade-in slide-in-from-bottom-2"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-stone-400">
                                            <GraduationCap size={18} />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Cấu tạo chi tiết
                                            </span>
                                        </div>
                                        <div className="rounded-2xl bg-stone-50 p-5 text-stone-700 leading-relaxed border border-stone-100">
                                            <div dangerouslySetInnerHTML={{ __html: data.component }} />
                                        </div>
                                    </div>

                                    <Separator className="bg-stone-100" />

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Lightbulb size={18} />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Câu chuyện ghi nhớ
                                            </span>
                                        </div>
                                        <Card className="border-primary/20 bg-primary/5 rounded-2xl overflow-hidden">
                                            <CardContent className="p-6">
                                                <p
                                                    className="text-xl font-medium italic leading-relaxed text-stone-800 prose prose-stone prose-strong:text-primary prose-strong:font-bold"
                                                    dangerouslySetInnerHTML={{ __html: data.story }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="vocab" className="animate-in fade-in slide-in-from-bottom-2">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {data.vocab.map((v, i) => (
                                            <Card
                                                key={i}
                                                className="group border-stone-100 hover:border-primary/30 transition-all duration-300 rounded-2xl overflow-hidden"
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-baseline justify-between border-b border-stone-50 pb-2 mb-2">
                                                        <span className="font-kanji text-2xl font-bold text-primary group-hover:scale-110 transition-transform origin-left duration-300">
                                                            {v.word}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                "text-xs font-bold text-stone-400 cursor-help transition-all duration-300",
                                                                masks.reading
                                                                    ? "blur-sm hover:blur-none bg-stone-100 px-2 rounded"
                                                                    : "",
                                                            )}
                                                        >
                                                            {v.reading}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={cn(
                                                            "text-sm font-medium text-stone-600 transition-all duration-300",
                                                            masks.meaning
                                                                ? "blur-sm hover:blur-none bg-stone-100 inline-block px-2 rounded"
                                                                : "",
                                                        )}
                                                    >
                                                        {v.meaning}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
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
                                KANJI {currentIndex + 1} OF {total}
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

