"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import KanjiQuiz from "@/components/quiz/KanjiQuiz";
import VocabQuiz from "@/components/quiz/VocabQuiz";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import BackButton from "@/components/common/BackButton";

export default function QuizPage() {
    const [activeQuiz, setActiveQuiz] = React.useState<"kanji" | "vocab">("kanji");

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-stone-900 selection:bg-primary/10 selection:text-primary">
            <Header
                learnedCount={0}
                totalCount={0}
                level={activeQuiz === "kanji" ? "JLPT N3 Kanji Quiz" : "JLPT N3 Vocab Quiz"}
            />

            <main className="container mx-auto px-4 max-w-7xl mt-20 relative">
                <BackButton />

                {/* Hero Section - Tăng độ cao cấp (Premium) */}
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
                    >
                        <Sparkles size={14} /> Knowledge Assessment
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight Vietnamese-Content">
                        Trắc nghiệm Kiến thức
                    </h1>
                    <p className="text-stone-500 max-w-2xl text-lg font-medium leading-relaxed Vietnamese-Content">
                        Kiểm tra mức độ ghi nhớ Kanji và Từ vựng N3 của bạn. Hãy chọn chế độ phù hợp và bắt đầu thử
                        thách bản thân ngay nhé!
                    </p>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <Tabs
                        value={activeQuiz}
                        onValueChange={(v) => setActiveQuiz(v as "kanji" | "vocab")}
                        className="w-full max-w-md"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-stone-100 p-1 rounded-2xl h-14 shadow-inner border border-stone-200/50 Vietnamese-Content">
                            <TabsTrigger
                                value="kanji"
                                className="rounded-[0.9rem] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400"
                            >
                                Kanji Quiz
                            </TabsTrigger>
                            <TabsTrigger
                                value="vocab"
                                className="rounded-[0.9rem] font-black uppercase tracking-tighter data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full text-stone-400"
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

