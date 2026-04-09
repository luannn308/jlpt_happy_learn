"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import KanjiQuiz from "@/components/quiz/KanjiQuiz";
import VocabQuiz from "@/components/quiz/VocabQuiz";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QuizPage() {
    const [activeQuiz, setActiveQuiz] = React.useState<"kanji" | "vocab">("kanji");

    return (
        <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900">
            <Header
                learnedCount={0}
                totalCount={0}
                level={activeQuiz === "kanji" ? "JLPT N3 Kanji Quiz" : "JLPT N3 Vocab Quiz"}
            />

            <main className="container mx-auto px-4 max-w-7xl mt-24 mb-20 text-center">
                <div className="mb-8 inline-block">
                    <Tabs
                        value={activeQuiz}
                        onValueChange={(v) => setActiveQuiz(v as "kanji" | "vocab")}
                        className="w-full"
                    >
                        <TabsList className="bg-stone-100/80 p-1 h-12 rounded-2xl border border-stone-200 shadow-sm Vietnamese-Content">
                            <TabsTrigger
                                value="kanji"
                                className="rounded-xl px-8 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Kanji Quiz
                            </TabsTrigger>
                            <TabsTrigger
                                value="vocab"
                                className="rounded-xl px-8 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Từ vựng Quiz
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeQuiz}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeQuiz === "kanji" ? <KanjiQuiz /> : <VocabQuiz />}
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
