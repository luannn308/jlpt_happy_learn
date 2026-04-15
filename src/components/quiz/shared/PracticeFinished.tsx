"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Sparkles, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PracticeFinishedProps {
    score: number;
    totalAttempted: number;
    onRetry: () => void;
    onReviewAll?: () => void;
    title?: string;
}
export default function PracticeFinished({
    score,
    totalAttempted,
    onRetry,
    onReviewAll,
    title = "Hoàn thành luyện tập!",
}: PracticeFinishedProps) {
    const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;

    return (
        <div className="relative flex flex-col items-center justify-center py-20 px-4 text-center space-y-8 overflow-hidden min-h-[500px]">
            {/* Celebration Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            bottom: "-10%",
                            left: `${Math.random() * 100}%`,
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: 0,
                        }}
                        animate={{
                            bottom: "110%",
                            opacity: [0, 1, 1, 0],
                            rotate: Math.random() * 360,
                            x: (Math.random() - 0.5) * 200,
                        }}
                        transition={{
                            duration: Math.random() * 3 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut",
                        }}
                        className="absolute text-primary/20"
                    >
                        <Sparkles size={24} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10"
            >
                <div className="relative inline-block mb-6">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                    <CheckCircle2 className="relative h-24 w-24 text-primary mx-auto" />
                </div>
                <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">{title}</h2>
                <p className="text-stone-500 mt-2 Vietnamese-Content">Bạn đã thực hành xong bài học này.</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <Card className="p-6 rounded-3xl border-none shadow-lg bg-white">
                    <span className="text-[10px] font-black uppercase text-stone-400 Vietnamese-Content">
                        Độ chính xác
                    </span>
                    <p className="text-3xl font-black text-primary">{accuracy}%</p>
                </Card>
                <Card className="p-6 rounded-3xl border-none shadow-lg bg-white">
                    <span className="text-[10px] font-black uppercase text-stone-400 Vietnamese-Content tracking-widest">
                        Số câu đúng
                    </span>
                    <p className="text-3xl font-black text-stone-900">
                        {score}/{totalAttempted}
                    </p>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                {totalAttempted === 0 && onReviewAll ? (
                    <Button
                        onClick={onReviewAll}
                        className="bg-primary text-white h-16 px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all Vietnamese-Content"
                    >
                        <RotateCcw className="mr-2 h-5 w-5" /> Ôn tập tất cả ngay
                    </Button>
                ) : (
                    <Button
                        onClick={onRetry}
                        className="bg-primary text-white h-16 px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <RotateCcw className="mr-2 h-5 w-5" /> <span className="Vietnamese-Content">Luyện tập lại</span>
                    </Button>
                )}
                <Link href="/">
                    <Button
                        variant="outline"
                        className="h-16 px-10 rounded-2xl font-bold border-stone-200 text-stone-600 hover:bg-stone-50 transition-all bg-white shadow-sm"
                    >
                        <Home className="mr-2 h-5 w-5" /> <span className="Vietnamese-Content">Về trang chủ</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

