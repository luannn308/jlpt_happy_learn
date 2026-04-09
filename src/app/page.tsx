"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Sparkles,
    BookOpenCheck,
    Settings,
    LayoutGrid,
    Info,
    Keyboard,
    Languages,
    BookA,
    PenTool,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProgressChart from "@/components/kanji/ProgressChart";
import KanjiGrid from "@/components/kanji/KanjiGrid";
import KanjiDetail from "@/components/kanji/KanjiDetail";
import VocabGrid from "@/components/kanji/VocabGrid";
import VocabDetail from "@/components/kanji/VocabDetail";
import { useData } from "@/context/DataContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
    const { kanjiData, vocabularyData, isLoading, updateLearnedStatus } = useData();
    const [activeTab, setActiveTab] = useState<string>("kanji");


    // Kanji States
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [learned, setLearned] = useState<Set<number>>(new Set());

    // Vocabulary States
    const [vocabIndex, setVocabIndex] = useState<number | null>(null);
    const [learnedVocab, setLearnedVocab] = useState<Set<number>>(new Set());

    const [masks, setMasks] = useState({ reading: false, meaning: false });

    // Load all learned data from localStorage
    useEffect(() => {
        const savedKanji = localStorage.getItem("jlpt_learned_kanji");
        if (savedKanji) {
            try {
                setLearned(new Set(JSON.parse(savedKanji)));
            } catch (e) {
                console.error("Failed to parse learned kanji", e);
            }
        }

        const savedVocab = localStorage.getItem("jlpt_learned_vocab");
        if (savedVocab) {
            try {
                setLearnedVocab(new Set(JSON.parse(savedVocab)));
            } catch (e) {
                console.error("Failed to parse learned vocabulary", e);
            }
        }
    }, []);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem("jlpt_learned_kanji", JSON.stringify(Array.from(learned)));
    }, [learned]);

    useEffect(() => {
        localStorage.setItem("jlpt_learned_vocab", JSON.stringify(Array.from(learnedVocab)));
    }, [learnedVocab]);

    const selectKanji = useCallback((id: number) => {
        setCurrentIndex(id);
        scrolltoStudyArea();
    }, []);

    const selectVocab = useCallback((id: number) => {
        setVocabIndex(id);
        scrolltoStudyArea();
    }, []);

    const scrolltoStudyArea = () => {
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
    };

    const toggleLearned = useCallback(async () => {
        if (activeTab === "kanji") {
            if (currentIndex === null) return;
            const isCurrentlyLearned = learned.has(currentIndex);
            const newStatus = !isCurrentlyLearned;
            
            // 1. Cập nhật local state
            setLearned((prev) => {
                const next = new Set(prev);
                if (next.has(currentIndex)) next.delete(currentIndex);
                else next.add(currentIndex);
                return next;
            });

            // 2. Cập nhật lên Google Sheets
            await updateLearnedStatus("kanji", currentIndex, newStatus);
            
        } else {
            if (vocabIndex === null) return;
            const isCurrentlyLearned = learnedVocab.has(vocabIndex);
            const newStatus = !isCurrentlyLearned;

            // 1. Cập nhật local state
            setLearnedVocab((prev) => {
                const next = new Set(prev);
                if (next.has(vocabIndex)) next.delete(vocabIndex);
                else next.add(vocabIndex);
                return next;
            });

            // 2. Cập nhật lên Google Sheets
            await updateLearnedStatus("vocab", vocabIndex, newStatus);
        }
    }, [currentIndex, vocabIndex, activeTab, learned, learnedVocab, updateLearnedStatus]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (activeTab === "kanji") {
                if (currentIndex === null) return;
                const currentIdx = kanjiData.findIndex((k) => k.id === currentIndex);
                if (e.key === "ArrowLeft" && currentIdx > 0) {
                    e.preventDefault();
                    selectKanji(kanjiData[currentIdx - 1].id);
                }
                if (e.key === "ArrowRight" && currentIdx < kanjiData.length - 1) {
                    e.preventDefault();
                    selectKanji(kanjiData[currentIdx + 1].id);
                }
            } else {
                if (vocabIndex === null) return;
                const currentIdx = vocabularyData.findIndex((v) => v.id === vocabIndex);
                if (e.key === "ArrowLeft" && currentIdx > 0) {
                    e.preventDefault();
                    selectVocab(vocabularyData[currentIdx - 1].id);
                }
                if (e.key === "ArrowRight" && currentIdx < vocabularyData.length - 1) {
                    e.preventDefault();
                    selectVocab(vocabularyData[currentIdx + 1].id);
                }
            }
        },
        [currentIndex, vocabIndex, activeTab, selectKanji, selectVocab, kanjiData, vocabularyData],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Calculate totals and progress for Dashboard/ProgressChart
    const kanjiProgress = useMemo(() => {
        const dataLearnedIds = kanjiData.filter((k) => k.isLearned).map((k) => k.id);
        const allLearned = new Set([...dataLearnedIds, ...Array.from(learned)]);
        return {
            learned: allLearned.size,
            total: kanjiData.length,
        };
    }, [learned, kanjiData]);

    const vocabProgress = useMemo(() => {
        const dataLearnedIds = vocabularyData.filter((v) => v.isLearned).map((v) => v.id);
        const allLearned = new Set([...dataLearnedIds, ...Array.from(learnedVocab)]);
        return {
            learned: allLearned.size,
            total: vocabularyData.length,
        };
    }, [learnedVocab, vocabularyData]);

    const currentProgress = activeTab === "kanji" ? kanjiProgress : vocabProgress;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafafa] font-sans text-stone-900">
                <Header learnedCount={0} totalCount={0} level="Đang tải..." />
                <main className="container mx-auto px-4 max-w-7xl mt-20">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-10">
                        <div className="lg:col-span-2 h-[300px] bg-white rounded-3xl animate-pulse" />
                        <div className="h-[300px] bg-white rounded-3xl animate-pulse" />
                    </div>
                    <div className="flex justify-center mb-10">
                        <div className="h-16 w-full max-w-md bg-stone-100 rounded-2xl animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-stone-900 selection:bg-primary/10 selection:text-primary">
            <Header learnedCount={currentProgress.learned} totalCount={currentProgress.total} level="JLPT N3" />


            <main className="container mx-auto px-4 max-w-7xl mt-20">
                {/* Dashboard Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-10">
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
                                    Hôm nay bạn cần chinh phục hệ thống từ vựng và Kanji N3. Mỗi mục tiêu đều được tối
                                    ưu hóa để giúp bạn ghi nhớ nhanh và lâu hơn qua ví dụ thực tế.
                                </p>

                                <div className="flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                            Tổng chữ Kanji
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-stone-900">
                                                {kanjiData.length}
                                            </span>
                                            <span className="text-sm font-bold text-stone-400 uppercase">Chữ</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block w-[1px] bg-stone-100" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                            Tổng từ vựng
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-stone-900">
                                                {vocabularyData.length}
                                            </span>
                                            <span className="text-sm font-bold text-stone-400 uppercase">Từ</span>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block w-[1px] bg-stone-100 mx-4" />
                                    <nav className="flex flex-wrap items-center gap-3 mt-6 sm:mt-0">
                                        <Link href="/flashcards" className="group flex-1 min-w-[140px] sm:flex-none">
                                            <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 hover:bg-primary/90">
                                                <Sparkles className="h-5 w-5 fill-white/20 transition-transform group-hover:rotate-12" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Ôn tập</span>
                                            </div>
                                        </Link>
                                        <Link href="/quiz" className="group flex-1 min-w-[140px] sm:flex-none">
                                            <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-primary/10 text-primary transition-all hover:scale-105 active:scale-95 hover:bg-primary/5 hover:border-primary/20">
                                                <BookOpenCheck className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Trắc nghiệm</span>
                                            </div>
                                        </Link>
                                        <Link href="/writing" className="group flex-1 min-w-[140px] sm:flex-none">
                                            <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-primary/10 text-primary transition-all hover:scale-105 active:scale-95 hover:bg-primary/5 hover:border-primary/20">
                                                <PenTool className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Tự luận</span>
                                            </div>
                                        </Link>
                                    </nav>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full border-none shadow-xl shadow-stone-200/40 bg-white rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-stone-400">
                                    Tiến độ {activeTab === "kanji" ? "Kanji" : "Từ Vựng"}
                                </CardTitle>
                            </CardHeader>
                            <ProgressChart learned={currentProgress.learned} total={currentProgress.total} />
                        </Card>
                    </motion.div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
                    <div className="flex justify-center mb-10">
                        <TabsList className="bg-stone-100 p-1 rounded-2xl h-14 md:h-16 w-full max-w-md shadow-inner">
                            <TabsTrigger
                                value="kanji"
                                className="rounded-[0.9rem] flex-1 font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400"
                            >
                                <Languages className="mr-2 h-5 w-5" />
                                Kanji
                            </TabsTrigger>
                            <TabsTrigger
                                value="vocab"
                                className="rounded-[0.9rem] flex-1 font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400"
                            >
                                <BookA className="mr-2 h-5 w-5" />
                                Từ Vựng
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="kanji" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-20">
                            <KanjiGrid
                                data={kanjiData.filter((item) => !item.isLearned)}
                                currentIndex={currentIndex}
                                learned={learned}
                                onSelect={selectKanji}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="vocab" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-20">
                            <VocabGrid
                                data={vocabularyData.filter((item) => !item.isLearned)}
                                currentIndex={vocabIndex}
                                learned={learnedVocab}
                                onSelect={selectVocab}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Detailed Study Area */}
                <section id="studyArea" className="relative scroll-mt-32 min-h-[600px] mb-32">
                    <AnimatePresence mode="wait">
                        {(activeTab === "kanji" && currentIndex === null) ||
                        (activeTab === "vocab" && vocabIndex === null) ? (
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
                                <h3 className="text-2xl font-bold text-stone-600 mb-2">
                                    Bạn muốn học {activeTab === "kanji" ? "chữ Kanji" : "từ vựng"} nào?
                                </h3>
                                <p className="text-stone-400 font-medium mb-8">
                                    Chọn một mục bên trên để bắt đầu khám phá chi tiết
                                </p>

                                <div className="flex flex-wrap justify-center gap-6 text-stone-400 text-center">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                        <Keyboard size={16} /> Dùng phím mũi tên để chuyển nhanh
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                        <Info size={16} /> Click và giữ để xem nhanh nghĩa
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detail-container"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                                    <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter text-stone-800">
                                        <Sparkles size={24} className="text-primary fill-primary/20" />
                                        Học chi tiết - {activeTab === "kanji" ? "Kanji" : "Từ Vựng"}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 border-none px-5"
                                            onClick={() => setMasks((prev) => ({ ...prev, reading: !prev.reading }))}
                                        >
                                            {masks.reading ? "Hiện Cách Đọc" : "Ẩn Cách Đọc"}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 border-none px-5"
                                            onClick={() => setMasks((prev) => ({ ...prev, meaning: !prev.meaning }))}
                                        >
                                            {masks.meaning ? "Hiện Nghĩa" : "Ẩn Nghĩa"}
                                        </Button>
                                    </div>
                                </div>

                                {activeTab === "kanji" && currentIndex !== null ? (
                                    (() => {
                                        const kanjiItem = kanjiData.find(k => k.id === currentIndex);
                                        const kanjiIdx = kanjiData.findIndex(k => k.id === currentIndex);
                                        if (!kanjiItem) return null;
                                        return (
                                            <KanjiDetail
                                                data={kanjiItem}
                                                currentIndex={kanjiIdx}
                                                total={kanjiData.length}
                                                isLearned={learned.has(currentIndex)}
                                                masks={masks}
                                                onToggleLearned={toggleLearned}
                                                onNext={() => kanjiIdx < kanjiData.length - 1 && selectKanji(kanjiData[kanjiIdx + 1].id)}
                                                onPrev={() => kanjiIdx > 0 && selectKanji(kanjiData[kanjiIdx - 1].id)}
                                            />
                                        );
                                    })()
                                ) : activeTab === "vocab" && vocabIndex !== null ? (
                                    (() => {
                                        const vocabItem = vocabularyData.find(v => v.id === vocabIndex);
                                        const vocabIdx = vocabularyData.findIndex(v => v.id === vocabIndex);
                                        if (!vocabItem) return null;
                                        return (
                                            <VocabDetail
                                                data={vocabItem}
                                                currentIndex={vocabIdx}
                                                total={vocabularyData.length}
                                                isLearned={learnedVocab.has(vocabIndex)}
                                                masks={masks}
                                                onToggleLearned={toggleLearned}
                                                onNext={() => vocabIdx < vocabularyData.length - 1 && selectVocab(vocabularyData[vocabIdx + 1].id)}
                                                onPrev={() => vocabIdx > 0 && selectVocab(vocabularyData[vocabIdx - 1].id)}
                                            />
                                        );
                                    })()
                                ) : null}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <Footer />
        </div>
    );
}

