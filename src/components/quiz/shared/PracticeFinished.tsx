"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PracticeFinishedProps {
    score: number;
    totalAttempted: number;
    onRetry: () => void;
    title?: string;
}

export default function PracticeFinished({ 
    score, 
    totalAttempted, 
    onRetry,
    title = "Hoàn thành luyện tập!"
}: PracticeFinishedProps) {
    const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-8">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="relative inline-block mb-6">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                    <CheckCircle2 className="relative h-24 w-24 text-primary mx-auto" />
                </div>
                <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">{title}</h2>
                <p className="text-stone-500 mt-2 Vietnamese-Content">Bạn đã thực hành xong bài học này.</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <Card className="p-6 rounded-3xl border-none shadow-lg bg-white">
                    <span className="text-[10px] font-black uppercase text-stone-400 Vietnamese-Content">Độ chính xác</span>
                    <p className="text-3xl font-black text-primary">
                        {accuracy}%
                    </p>
                </Card>
                <Card className="p-6 rounded-3xl border-none shadow-lg bg-white">
                    <span className="text-[10px] font-black uppercase text-stone-400 Vietnamese-Content">Số câu đúng</span>
                    <p className="text-3xl font-black text-stone-900">
                        {score}/{totalAttempted}
                    </p>
                </Card>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={onRetry}
                    className="bg-primary text-white h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <RotateCcw className="mr-2 h-5 w-5" /> <span className="Vietnamese-Content">Luyện tập lại</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-14 px-8 rounded-2xl font-bold border-stone-200"
                    onClick={() => (window.location.href = "/")}
                >
                    <span className="Vietnamese-Content">Quay về trang chủ</span>
                </Button>
            </div>
        </div>
    );
}
