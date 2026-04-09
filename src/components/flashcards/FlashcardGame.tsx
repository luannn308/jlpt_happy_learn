"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { VocabularyItem } from "@/data/vocabulary";

import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Sparkles, BookOpen, Languages, BookA } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FlashcardGame() {
    const { kanjiData, vocabularyData, isLoading } = useData();
    const [mode, setMode] = useState<"vocab" | "kanji">("vocab");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState<(VocabularyItem | any)[]>([]);
    const [showAll, setShowAll] = useState(false);

    const [direction, setDirection] = useState(0);

    // Reset game when mode or showAll changes
    useEffect(() => {
        if (isLoading) return;
        const data = mode === "vocab" ? vocabularyData : kanjiData;
        const filtered = showAll ? data : data.filter((item) => !item.isLearned);
        setCards(filtered);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [mode, isLoading, vocabularyData, kanjiData, showAll]);

    const handleNext = useCallback(() => {
        if (cards.length === 0) return;
        setDirection(1);
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 100);
    }, [cards.length]);

    const handlePrev = useCallback(() => {
        if (cards.length === 0) return;
        setDirection(-1);
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 100);
    }, [cards.length]);

    const handleShuffle = () => {
        const data = mode === "vocab" ? vocabularyData : kanjiData;
        const filtered = data.filter((item) => !item.isLearned);
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleReset = () => {
        const data = mode === "vocab" ? vocabularyData : kanjiData;
        const filtered = data.filter((item) => !item.isLearned);
        setCards(filtered);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

    // Keyboard controls
    const toggleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault();
                toggleFlip();
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                handleNext();
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                handlePrev();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleFlip, handleNext, handlePrev]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-8 py-10">
                <div className="h-14 w-full max-w-md bg-stone-100 rounded-2xl animate-pulse" />
                <div className="w-full h-[500px] bg-white rounded-[3rem] animate-pulse shadow-xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-8 py-10">
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-stone-100 p-1 rounded-2xl h-14 shadow-inner">
                        <TabsTrigger
                            value="vocab"
                            className="rounded-[0.9rem] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400"
                        >
                            <BookA className="mr-2 h-4 w-4" /> Từ vựng
                        </TabsTrigger>
                        <TabsTrigger
                            value="kanji"
                            className="rounded-[0.9rem] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400"
                        >
                            <Languages className="mr-2 h-4 w-4" /> Hán tự
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Show All Toggle */}
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-100">
                    <input
                        type="checkbox"
                        id="showAll"
                        checked={showAll}
                        onChange={(e) => setShowAll(e.target.checked)}
                        className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="showAll" className="text-sm font-bold text-stone-600 cursor-pointer">
                        Ôn tập tất cả (bao gồm từ đã thuộc)
                    </label>
                </div>
            </div>

            {cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full min-h-[400px] text-stone-400 bg-white/50 rounded-[3rem] border-2 border-dashed border-stone-200">
                    <Sparkles size={48} className="mb-4 text-primary/30" />
                    <p className="font-bold text-xl text-stone-600">Tuyệt vời! Bạn đã thuộc hết rồi.</p>
                    <p className="text-sm mt-2">Bật "Ôn tập tất cả" để xem lại các thẻ cũ.</p>
                    <Button
                        onClick={() => setShowAll(true)}
                        className="mt-6 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        Ôn tập lại ngay
                    </Button>
                </div>
            ) : (
                <>
                    <div className="w-full max-w-md space-y-4 text-center">
                        <div className="flex items-center justify-between text-sm font-black uppercase tracking-widest text-stone-400">
                            <span className="flex items-center gap-2">
                                <BookOpen size={16} /> Thẻ {currentIndex + 1} / {cards.length}
                            </span>
                        </div>
                    </div>

                    <div className="relative w-full flex items-center justify-center min-h-[500px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={cards[currentIndex].id}
                                custom={direction}
                                initial={{ opacity: 0, x: direction * 100, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: direction * -100, scale: 0.9 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="w-full flex justify-center"
                            >
                                <Flashcard
                                    data={cards[currentIndex]}
                                    isFlipped={isFlipped}
                                    onFlip={() => setIsFlipped(!isFlipped)}
                                    mode={mode}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrev}
                            className="rounded-2xl h-14 w-14 p-0 border-stone-200 hover:bg-white hover:text-primary transition-all shadow-sm"
                        >
                            <ChevronLeft size={24} />
                        </Button>

                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleShuffle}
                            className="rounded-2xl h-14 px-8 bg-primary text-white hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 flex gap-2"
                        >
                            <Shuffle size={20} /> Xáo trộn
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleReset}
                            className="rounded-2xl h-14 w-14 p-0 border-stone-200 hover:bg-white hover:text-primary transition-all shadow-sm"
                        >
                            <RotateCcw size={20} />
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleNext}
                            className="rounded-2xl h-14 w-14 p-0 border-stone-200 hover:bg-white hover:text-primary transition-all shadow-sm"
                        >
                            <ChevronRight size={24} />
                        </Button>
                    </div>
                </>
            )}

            <div className="flex flex-col items-center gap-4 text-stone-400">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-center px-4">
                    <Sparkles size={14} className="text-primary flex-shrink-0" />
                    <span>Mẹo: Nhấn [Khoảng cách] hoặc [↑][↓] để lật, [←][→] để chuyển thẻ</span>
                </p>
            </div>
        </div>
    );
}

