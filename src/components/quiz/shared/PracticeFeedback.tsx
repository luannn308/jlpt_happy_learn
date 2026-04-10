"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, History, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PracticeFeedbackProps {
    penaltyTimer: number;
    showAnswer: boolean;
    isCorrect: boolean | null;
    correctAnswer: string;
    onRetry: () => void;
    extraContent?: React.ReactNode;
}

export default function PracticeFeedback({
    penaltyTimer,
    showAnswer,
    isCorrect,
    correctAnswer,
    onRetry,
    extraContent
}: PracticeFeedbackProps) {
    return (
        <AnimatePresence>
            {penaltyTimer > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-50 border border-red-100 p-6 rounded-3xl space-y-4 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                        <Timer size={18} />
                        <span className="Vietnamese-Content">Sai rồi! Hãy ghi nhớ đáp án:</span>
                    </div>
                    <div className="text-4xl font-black text-red-700 font-kanji">
                        {correctAnswer}
                    </div>
                    
                    {extraContent && (
                        <div className="pt-2 border-t border-red-100 mt-2">
                            {extraContent}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                        <div className="h-1 w-full max-w-[100px] bg-red-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-red-500"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 2, ease: "linear" }}
                            />
                        </div>
                        <span className="text-xs font-bold text-red-300 w-4">
                            {penaltyTimer}s
                        </span>
                    </div>
                </motion.div>
            )}

            {penaltyTimer === 0 && showAnswer && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3 pt-2"
                >
                    <p className="text-stone-400 text-sm font-bold Vietnamese-Content">
                        Vui lòng nhập lại đáp án đúng để tiếp tục
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRetry}
                        className="text-primary font-bold flex gap-2"
                    >
                        <History size={14} /> <span className="Vietnamese-Content">Thử lại ngay</span>
                    </Button>
                </motion.div>
            )}

            {isCorrect === true && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-green-500 font-bold"
                >
                    <CheckCircle2 size={18} />
                    <span className="Vietnamese-Content">Chính xác! Đang chuyển...</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
