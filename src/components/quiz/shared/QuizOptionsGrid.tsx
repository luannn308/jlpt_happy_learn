"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizOptionsGridProps {
    options: string[];
    correctAnswer: string;
    isAnswered: boolean;
    selectedAnswer: string | null;
    onAnswer: (answer: string) => void;
    onNext: () => void;
    // Để xác định loại font cho option (Kanji vs Vietnamese)
    isKanjiOption?: (option: string) => boolean;
}

/**
 * Shared Component hiển thị các phương án trả lời dưới dạng lưới.
 * Đồng bộ hóa styling từ VocabQuiz sang các Quiz khác.
 */
export function QuizOptionsGrid({
    options,
    correctAnswer,
    isAnswered,
    selectedAnswer,
    onAnswer,
    onNext,
    isKanjiOption,
}: QuizOptionsGridProps) {
    return (
        <div className="space-y-10">
            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, idx) => {
                    const isCorrect = option === correctAnswer;
                    const isSelected = option === selectedAnswer;
                    const useKanjiFont = isKanjiOption ? isKanjiOption(option) : false;

                    return (
                        <motion.button
                            key={idx}
                            onClick={() => onAnswer(option)}
                            disabled={isAnswered && selectedAnswer === correctAnswer}
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: !isAnswered ? "0 10px 25px -5px rgba(184, 92, 92, 0.15)" : "none"
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "relative p-6 rounded-[2rem] text-xl font-bold border-2 transition-all duration-300 text-left flex items-center justify-between group overflow-hidden",
                                !isAnswered
                                    ? "border-stone-100 hover:border-primary/50 hover:bg-primary/5 text-stone-700 shadow-sm"
                                    : isSelected
                                      ? isCorrect
                                          ? "border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100"
                                          : "border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-100"
                                      : "border-stone-100 text-stone-400 opacity-60",
                            )}
                        >
                            <span className={cn(
                                "relative z-10 font-bold",
                                useKanjiFont ? "text-3xl font-kanji" : "text-xl Vietnamese-Content"
                            )}>
                                {option}
                            </span>

                            {isAnswered && isSelected && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="relative z-10"
                                >
                                    {isCorrect ? (
                                        <CheckCircle2 className="h-7 w-7 text-green-500 fill-white" />
                                    ) : (
                                        <XCircle className="h-7 w-7 text-red-500 fill-white" />
                                    )}
                                </motion.div>
                            )}
                            
                            {/* Subtle background glow on hover */}
                            {!isAnswered && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Feedback message & Next Button */}
            <div className="min-h-[70px] flex flex-col items-center justify-center gap-4">
                {isAnswered && selectedAnswer === correctAnswer && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex flex-col items-center gap-4"
                    >
                        <Button
                            onClick={onNext}
                            size="lg"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl h-16 px-12 font-bold flex gap-3 shadow-xl shadow-green-200 transition-all hover:scale-105 active:scale-95 Vietnamese-Content text-lg"
                        >
                            Tiếp tục <ArrowRight size={22} />
                        </Button>
                    </motion.div>
                )}
                {isAnswered && selectedAnswer !== correctAnswer && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex flex-col items-center gap-4"
                    >
                        <p className="text-red-500 font-bold Vietnamese-Content flex items-center gap-2 text-lg">
                            <Sparkles className="h-5 w-5 animate-pulse" /> Hãy chọn lại nhé!
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
