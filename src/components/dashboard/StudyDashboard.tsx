"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, BookOpenCheck, PenTool } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressChart from "@/components/kanji/ProgressChart";

interface StudyDashboardProps {
    kanjiCount: number;
    vocabCount: number;
    activeTab: string;
    currentProgress: {
        learned: number;
        total: number;
    };
}

export default function StudyDashboard({ 
    kanjiCount, 
    vocabCount, 
    activeTab, 
    currentProgress 
}: StudyDashboardProps) {
    return (
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
                            <h2 className="text-2xl font-black tracking-tight md:text-3xl Vietnamese-Content">
                                Mục tiêu học tập N3
                            </h2>
                        </div>

                        <p className="text-stone-500 text-lg leading-relaxed mb-10 max-w-2xl Vietnamese-Content">
                            Hôm nay bạn cần chinh phục hệ thống từ vựng và Kanji N3. Mỗi mục tiêu đều được tối
                            ưu hóa để giúp bạn ghi nhớ nhanh và lâu hơn qua ví dụ thực tế.
                        </p>

                        <div className="flex flex-wrap gap-8">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 Vietnamese-Content">
                                    Tổng chữ Kanji
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-stone-900">
                                        {kanjiCount}
                                    </span>
                                    <span className="text-sm font-bold text-stone-400 uppercase Vietnamese-Content">Chữ</span>
                                </div>
                            </div>
                            <div className="hidden sm:block w-[1px] bg-stone-100" />
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 Vietnamese-Content">
                                    Tổng từ vựng
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-stone-900">
                                        {vocabCount}
                                    </span>
                                    <span className="text-sm font-bold text-stone-400 uppercase Vietnamese-Content">Từ</span>
                                </div>
                            </div>
                            <div className="hidden lg:block w-[1px] bg-stone-100 mx-4" />
                            <nav className="flex flex-wrap items-center gap-3 mt-6 sm:mt-0">
                                <Link href="/flashcards" className="group flex-1 min-w-[140px] sm:flex-none">
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 hover:bg-primary/90">
                                        <Sparkles className="h-5 w-5 fill-white/20 transition-transform group-hover:rotate-12" />
                                        <span className="text-xs font-bold uppercase tracking-wider Vietnamese-Content">Ôn tập</span>
                                    </div>
                                </Link>
                                <Link href="/quiz" className="group flex-1 min-w-[140px] sm:flex-none">
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-primary/10 text-primary transition-all hover:scale-105 active:scale-95 hover:bg-primary/5 hover:border-primary/20">
                                        <BookOpenCheck className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                                        <span className="text-xs font-bold uppercase tracking-wider Vietnamese-Content">Trắc nghiệm</span>
                                    </div>
                                </Link>
                                <Link href="/writing" className="group flex-1 min-w-[140px] sm:flex-none">
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-primary/10 text-primary transition-all hover:scale-105 active:scale-95 hover:bg-primary/5 hover:border-primary/20">
                                        <PenTool className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                                        <span className="text-xs font-bold uppercase tracking-wider Vietnamese-Content">Tự luận</span>
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
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-stone-400 Vietnamese-Content">
                            Tiến độ {activeTab === "kanji" ? "Kanji" : "Từ Vựng"}
                        </CardTitle>
                    </CardHeader>
                    <ProgressChart learned={currentProgress.learned} total={currentProgress.total} />
                </Card>
            </motion.div>
        </div>
    );
}
