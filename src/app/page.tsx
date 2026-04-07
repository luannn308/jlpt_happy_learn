"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Sparkles, BookOpenCheck, Settings, LayoutGrid, Info, Keyboard, Languages, BookA } from "lucide-react";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProgressChart from "@/components/kanji/ProgressChart";
import KanjiGrid from "@/components/kanji/KanjiGrid";
import KanjiDetail from "@/components/kanji/KanjiDetail";
import VocabGrid from "@/components/kanji/VocabGrid";
import VocabDetail from "@/components/kanji/VocabDetail";
import { kanjiData } from "@/data/kanji";
import { vocabularyData } from "@/data/vocabulary";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
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
        if (id < 0) id = 0;
        if (id >= kanjiData.length) id = kanjiData.length - 1;
        setCurrentIndex(id);
        scrolltoStudyArea();
    }, []);

    const selectVocab = useCallback((id: number) => {
        if (id < 0) id = 0;
        if (id >= vocabularyData.length) id = vocabularyData.length - 1;
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

    const toggleLearned = useCallback(() => {
        if (activeTab === "kanji") {
            if (currentIndex === null) return;
            setLearned((prev) => {
                const next = new Set(prev);
                if (next.has(currentIndex)) next.delete(currentIndex);
                else next.add(currentIndex);
                return next;
            });
        } else {
            if (vocabIndex === null) return;
            setLearnedVocab((prev) => {
                const next = new Set(prev);
                if (next.has(vocabIndex)) next.delete(vocabIndex);
                else next.add(vocabIndex);
                return next;
            });
        }
    }, [currentIndex, vocabIndex, activeTab]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (activeTab === "kanji") {
                if (currentIndex === null) return;
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    selectKanji(currentIndex - 1);
                }
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    selectKanji(currentIndex + 1);
                }
            } else {
                if (vocabIndex === null) return;
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    selectVocab(vocabIndex - 1);
                }
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    selectVocab(vocabIndex + 1);
                }
            }
        },
        [currentIndex, vocabIndex, activeTab, selectKanji, selectVocab],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Calculate totals
    const totalVocabInKanji = useMemo(() => {
        return kanjiData.reduce((acc, kanji) => acc + kanji.vocab.length, 0);
    }, []);

    const currentDataCount = activeTab === "kanji" ? kanjiData.length : vocabularyData.length;
    const currentLearnedCount = activeTab === "kanji" ? learned.size : learnedVocab.size;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-stone-900 selection:bg-primary/10 selection:text-primary">
            <Header learnedCount={currentLearnedCount} totalCount={currentDataCount} level="JLPT N3" />

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
                                    Hôm nay bạn cần chinh phục hệ thống từ vựng và Kanji N3. Mỗi mục tiêu đều được tối ưu hóa để giúp bạn ghi nhớ nhanh và lâu hơn qua ví dụ thực tế.
                                </p>

                                <div className="flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                            Tổng chữ Kanji
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-stone-900">{kanjiData.length}</span>
                                            <span className="text-sm font-bold text-stone-400 uppercase">Chữ</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block w-[1px] bg-stone-100" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                            Tổng từ vựng
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-stone-900">{vocabularyData.length}</span>
                                            <span className="text-sm font-bold text-stone-400 uppercase">Từ</span>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block w-[1px] bg-stone-100 mx-4" />
                                    <div className="self-center mt-4 sm:mt-0">
                                        <Link href="/flashcards">
                                            <Button 
                                                variant="default"
                                                size="lg"
                                                className="bg-primary text-white hover:bg-primary/90 font-bold px-8 py-7 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Sparkles className="fill-white/20" /> Bắt đầu ôn tập
                                            </Button>
                                        </Link>
                                    </div>
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
                            <ProgressChart learned={currentLearnedCount} total={currentDataCount} />
                        </Card>
                    </motion.div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
                    <div className="flex justify-center mb-10">
                        <TabsList className="bg-stone-100 p-1 rounded-2xl h-14 md:h-16 w-full max-w-md shadow-inner">
                            <TabsTrigger value="kanji" className="rounded-[0.9rem] flex-1 font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400">
                                <Languages className="mr-2 h-5 w-5" />
                                Kanji
                            </TabsTrigger>
                            <TabsTrigger value="vocab" className="rounded-[0.9rem] flex-1 font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400">
                                <BookA className="mr-2 h-5 w-5" />
                                Từ Vựng
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="kanji" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-20">
                            <KanjiGrid data={kanjiData} currentIndex={currentIndex} learned={learned} onSelect={selectKanji} />
                        </div>
                    </TabsContent>

                    <TabsContent value="vocab" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-20">
                            <VocabGrid data={vocabularyData} currentIndex={vocabIndex} learned={learnedVocab} onSelect={selectVocab} />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Detailed Study Area */}
                <section id="studyArea" className="relative scroll-mt-32 min-h-[600px] mb-32">
                    <AnimatePresence mode="wait">
                        {((activeTab === "kanji" && currentIndex === null) || (activeTab === "vocab" && vocabIndex === null)) ? (
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
                                ) : activeTab === "vocab" && vocabIndex !== null ? (
                                    <VocabDetail
                                        data={vocabularyData[vocabIndex]}
                                        currentIndex={vocabIndex}
                                        total={vocabularyData.length}
                                        isLearned={learnedVocab.has(vocabIndex)}
                                        masks={masks}
                                        onToggleLearned={toggleLearned}
                                        onNext={() => selectVocab(vocabIndex + 1)}
                                        onPrev={() => selectVocab(vocabIndex - 1)}
                                    />
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


