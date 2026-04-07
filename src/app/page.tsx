"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Sparkles, BookOpenCheck, Settings, LayoutGrid, Info, Keyboard } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProgressChart from "@/components/kanji/ProgressChart";
import KanjiGrid from "@/components/kanji/KanjiGrid";
import KanjiDetail from "@/components/kanji/KanjiDetail";
import { kanjiData } from "@/data/kanji";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [learned, setLearned] = useState<Set<number>>(new Set());
    const [masks, setMasks] = useState({ reading: false, meaning: false });

    // Load learned data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("jlpt_learned_kanji");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLearned(new Set(parsed));
            } catch (e) {
                console.error("Failed to parse learned kanji", e);
            }
        }
    }, []);

    // Save to localStorage whenever learned set changes
    useEffect(() => {
        localStorage.setItem("jlpt_learned_kanji", JSON.stringify(Array.from(learned)));
    }, [learned]);

    const selectKanji = useCallback((id: number) => {
        if (id < 0) id = 0;
        if (id >= kanjiData.length) id = kanjiData.length - 1;
        setCurrentIndex(id);

        // Auto scroll to detail area with offset for header
        setTimeout(() => {
            const detailElement = document.getElementById("studyArea");
            if (detailElement) {
                const rect = detailElement.getBoundingClientRect();
                const offset = 100; // Header height + padding
                window.scrollTo({
                    top: rect.top + window.scrollY - offset,
                    behavior: "smooth",
                });
            }
        }, 100);
    }, []);

    const toggleLearned = useCallback(() => {
        if (currentIndex === null) return;
        setLearned((prev) => {
            const next = new Set(prev);
            if (next.has(currentIndex)) next.delete(currentIndex);
            else next.add(currentIndex);
            return next;
        });
    }, [currentIndex]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (currentIndex === null) return;
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                selectKanji(currentIndex - 1);
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                selectKanji(currentIndex + 1);
            }
        },
        [currentIndex, selectKanji],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Calculate total vocabulary
    const totalVocab = useMemo(() => {
        return kanjiData.reduce((acc, kanji) => acc + kanji.vocab.length, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-stone-900 selection:bg-primary/10 selection:text-primary">
            <Header learnedCount={learned.size} totalCount={kanjiData.length} level="JLPT N3" />

            <main className="container mx-auto px-4 max-w-7xl mt-20">
                {/* Dashboard Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
                    {/* Welcome Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2"
                    >
                        <Card className="h-full border-none shadow-xl shadow-stone-200/40 bg-white rounded-3xl overflow-hidden">
                            <CardContent className="p-8 md:p-12 flex flex-col justify-center h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Target className="text-primary h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                                        Mục tiêu học tập N3
                                    </h2>
                                </div>

                                <p className="text-stone-500 text-lg leading-relaxed mb-10 max-w-2xl">
                                    Hôm nay bạn có{" "}
                                    <span className="font-bold text-primary italic">10 chữ Kanji mới</span> cần chinh
                                    phục. Mỗi chữ đều đi kèm phân tích bộ thủ, câu chuyện gợi nhớ và từ vựng thực tế.
                                    Hãy bắt đầu ngay nhé!
                                </p>

                                <div className="flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                            Tổng số chữ
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-stone-900">10</span>
                                            <span className="text-sm font-bold text-stone-400">KANJI</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block w-[1px] bg-stone-100" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                            Từ vựng đi kèm
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-stone-900">{totalVocab}</span>
                                            <span className="text-sm font-bold text-stone-400">TỪ</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full border-none shadow-xl shadow-stone-200/40 bg-white rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-stone-400">
                                    Tiến độ hôm nay
                                </CardTitle>
                            </CardHeader>
                            <ProgressChart learned={learned.size} total={kanjiData.length} />
                        </Card>
                    </motion.div>
                </div>

                {/* Kanji Selector Grid */}
                <div className="mb-20">
                    <KanjiGrid data={kanjiData} currentIndex={currentIndex} learned={learned} onSelect={selectKanji} />
                </div>

                {/* Detailed Study Area */}
                <section id="studyArea" className="relative scroll-mt-32 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {currentIndex === null ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="flex flex-col items-center justify-center py-24 px-6 rounded-[3rem] border-2 border-dashed border-stone-200 bg-stone-50/30"
                            >
                                <div className="mb-8 p-6 bg-white rounded-full shadow-lg shadow-stone-200/50">
                                    <LayoutGrid className="h-16 w-16 text-stone-200" />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-600 mb-2">Sẵn sàng vươn tới N3?</h3>
                                <p className="text-stone-400 font-medium mb-8">
                                    Chọn một chữ Kanji bên trên để bắt đầu khám phá chi tiết
                                </p>

                                <div className="flex flex-wrap justify-center gap-6 text-stone-400">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                        <Keyboard size={16} /> Dùng phím mũi tên để chuyển nhanh
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                        <Info size={16} /> Click vào từ vựng để ẩn/hiện nghĩa
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                                    <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-tighter text-stone-800">
                                        <Sparkles size={20} className="text-primary fill-primary" />
                                        Học chi tiết chữ {kanjiData[currentIndex].kanji}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 border-none"
                                            onClick={() => setMasks((prev) => ({ ...prev, reading: !prev.reading }))}
                                        >
                                            {masks.reading ? "Hiện Cách Đọc" : "Ẩn Cách Đọc"}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 border-none"
                                            onClick={() => setMasks((prev) => ({ ...prev, meaning: !prev.meaning }))}
                                        >
                                            {masks.meaning ? "Hiện Nghĩa" : "Ẩn Nghĩa"}
                                        </Button>
                                    </div>
                                </div>

                                <KanjiDetail
                                    data={kanjiData[currentIndex]}
                                    currentIndex={currentIndex}
                                    total={kanjiData.length}
                                    isLearned={learned.has(currentIndex)}
                                    masks={masks}
                                    onToggleLearned={toggleLearned}
                                    onNext={() => selectKanji(currentIndex + 1)}
                                    onPrev={() => selectKanji(currentIndex - 1)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <Footer />
        </div>
    );
}

