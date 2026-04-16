"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Languages, BookA } from "lucide-react";
import { useData } from "@/context/DataContext";
import StudyDashboard from "@/components/dashboard/StudyDashboard";
import StudyAreaPlaceholder from "@/components/common/StudyAreaPlaceholder";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import KanjiGrid from "@/components/kanji/KanjiGrid";
import KanjiDetail from "@/components/kanji/KanjiDetail";
import VocabGrid from "@/components/kanji/VocabGrid";
import VocabDetail from "@/components/kanji/VocabDetail";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export default function Home() {
    const { kanjiData, vocabularyData, isLoading, updateLearnedStatus, bulkUpdateLearnedStatus } = useData();
    const [activeTab, setActiveTab] = useState<string>("kanji");

    // Kanji States
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [learned, setLearned] = useState<Set<number>>(new Set());

    // Vocabulary States
    const [vocabIndex, setVocabIndex] = useState<number | null>(null);
    const [learnedVocab, setLearnedVocab] = useState<Set<number>>(new Set());

    const [masks, setMasks] = useState({ reading: false, meaning: false });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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

    const handleMarkAllAsLearned = useCallback(() => {
        setShowConfirmModal(true);
    }, []);

    const confirmMarkAllAsLearned = useCallback(async () => {
        if (activeTab === "kanji") {
            const unlearnedKanjiIds = kanjiData.filter((k) => !k.isLearned).map((k) => k.id);

            if (unlearnedKanjiIds.length === 0) return;

            // 1. Cập nhật local state (Set)
            setLearned((prev) => {
                const next = new Set(prev);
                unlearnedKanjiIds.forEach((id) => next.add(id));
                return next;
            });

            // 2. Cập nhật trong Context & Backend
            await bulkUpdateLearnedStatus("kanji", unlearnedKanjiIds, true);
            setCurrentIndex(null); // Reset detail view
        } else {
            const unlearnedVocabIds = vocabularyData.filter((v) => !v.isLearned).map((v) => v.id);

            if (unlearnedVocabIds.length === 0) return;

            // 1. Cập nhật local state (Set)
            setLearnedVocab((prev) => {
                const next = new Set(prev);
                unlearnedVocabIds.forEach((id) => next.add(id));
                return next;
            });

            // 2. Cập nhật trong Context & Backend
            await bulkUpdateLearnedStatus("vocab", unlearnedVocabIds, true);
            setVocabIndex(null); // Reset detail view
        }
    }, [activeTab, kanjiData, vocabularyData, bulkUpdateLearnedStatus]);

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
                <StudyDashboard
                    kanjiCount={kanjiData.length}
                    vocabCount={vocabularyData.length}
                    activeTab={activeTab}
                    currentProgress={currentProgress}
                />

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
                                onMarkAllAsLearned={handleMarkAllAsLearned}
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
                                onMarkAllAsLearned={handleMarkAllAsLearned}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Detailed Study Area */}
                <section id="studyArea" className="relative scroll-mt-32 min-h-[600px] mb-32">
                    <AnimatePresence mode="wait">
                        {(activeTab === "kanji" && currentIndex === null) ||
                        (activeTab === "vocab" && vocabIndex === null) ? (
                            <StudyAreaPlaceholder activeTab={activeTab} />
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

                                {activeTab === "kanji" && currentIndex !== null
                                    ? (() => {
                                          const kanjiItem = kanjiData.find((k) => k.id === currentIndex);
                                          const kanjiIdx = kanjiData.findIndex((k) => k.id === currentIndex);
                                          if (!kanjiItem) return null;
                                          return (
                                              <KanjiDetail
                                                  data={kanjiItem}
                                                  currentIndex={kanjiIdx}
                                                  total={kanjiData.length}
                                                  isLearned={learned.has(currentIndex)}
                                                  masks={masks}
                                                  onToggleLearned={toggleLearned}
                                                  onNext={() =>
                                                      kanjiIdx < kanjiData.length - 1 &&
                                                      selectKanji(kanjiData[kanjiIdx + 1].id)
                                                  }
                                                  onPrev={() => kanjiIdx > 0 && selectKanji(kanjiData[kanjiIdx - 1].id)}
                                              />
                                          );
                                      })()
                                    : activeTab === "vocab" && vocabIndex !== null
                                      ? (() => {
                                            const vocabItem = vocabularyData.find((v) => v.id === vocabIndex);
                                            const vocabIdx = vocabularyData.findIndex((v) => v.id === vocabIndex);
                                            if (!vocabItem) return null;
                                            return (
                                                <VocabDetail
                                                    data={vocabItem}
                                                    currentIndex={vocabIdx}
                                                    total={vocabularyData.length}
                                                    isLearned={learnedVocab.has(vocabIndex)}
                                                    masks={masks}
                                                    onToggleLearned={toggleLearned}
                                                    onNext={() =>
                                                        vocabIdx < vocabularyData.length - 1 &&
                                                        selectVocab(vocabularyData[vocabIdx + 1].id)
                                                    }
                                                    onPrev={() =>
                                                        vocabIdx > 0 && selectVocab(vocabularyData[vocabIdx - 1].id)
                                                    }
                                                />
                                            );
                                        })()
                                      : null}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <Footer />

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmMarkAllAsLearned}
                title="Xác nhận học tất cả"
                description={`Bạn có chắc chắn muốn đánh dấu tất cả ${
                    activeTab === "kanji" ? "chữ Kanji" : "từ vựng"
                } hiện tại là đã học không? Hành động này không thể hoàn tác nhanh.`}
                confirmText="Xác nhận học hết"
                cancelText="Để tôi xem lại"
                variant="primary"
            />
        </div>
    );
}

