"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizQuestionDisplayProps {
    type: string;
    questionText: string;
    correctAnswer: string;
    isAnswered: boolean;
    selectedAnswer: string | null;
    reading?: string;
    han?: string;
    // Map mô tả loại câu hỏi
    questionTypeLabels: Record<string, string>;
}

/**
 * Shared Component để hiển thị câu hỏi cho cả KanjiQuiz và VocabQuiz.
 * Hỗ trợ hiển thị Ruby (Furigana) và Âm Hán Việt khi trả lời đúng.
 */
export function QuizQuestionDisplay({
    type,
    questionText,
    correctAnswer,
    isAnswered,
    selectedAnswer,
    reading,
    han,
    questionTypeLabels,
}: QuizQuestionDisplayProps) {
    const isCorrect = isAnswered && selectedAnswer === correctAnswer;

    // Kiểm tra xem có nên hiển thị ruby không (dành cho các câu hỏi về chữ Nhật)
    const shouldShowRuby = isCorrect && reading && type !== "meaning-to-word" && type !== "face";

    return (
        <div className="text-center space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 Vietnamese-Content">
                {questionTypeLabels[type] || "Câu hỏi dành cho bạn"}
            </span>
            
            <h2 className={cn(
                "font-black text-stone-900 leading-tight flex flex-col items-center justify-center gap-4 transition-all duration-500",
                (type === "meaning-to-word" || type === "face") 
                    ? "text-4xl md:text-6xl Vietnamese-Content" 
                    : "text-5xl md:text-8xl font-kanji"
            )}>
                {shouldShowRuby ? (
                    <ruby className="ruby-position-over">
                        {questionText}
                        <motion.rt 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary text-xl md:text-2xl font-bold mb-2 lowercase tracking-normal font-sans"
                        >
                            {reading}
                        </motion.rt>
                    </ruby>
                ) : (
                    questionText
                )}

                {/* Hiển thị Âm Hán Việt hoặc Nghĩa khi chọn đúng */}
                {isCorrect && han && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "text-primary/60 font-bold block font-sans transition-all",
                            type.startsWith("vocab-") 
                                ? "text-base md:text-lg tracking-normal max-w-[80%] mx-auto" 
                                : "text-lg md:text-xl uppercase tracking-widest"
                        )}
                    >
                        {han}
                    </motion.span>
                )}
            </h2>
        </div>
    );
}
