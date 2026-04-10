"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { KanjiData } from "@/data/kanji";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PenTool, ArrowRight, RotateCcw, Sparkles, CheckCircle2, Timer, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { toHiragana } from "@/lib/japanese";
import { Input } from "@/components/ui/input";

import PracticeFinished from "@/components/quiz/shared/PracticeFinished";
import PracticeHeader from "@/components/quiz/shared/PracticeHeader";
import PracticeFeedback from "@/components/quiz/shared/PracticeFeedback";

type WritingMode = "kanji-to-han" | "kanji-to-on" | "kanji-to-kun";

const WRITING_MODES = [
    { id: "kanji-to-han", label: "Âm Hán" },
    { id: "kanji-to-on", label: "Onyomi" },
    { id: "kanji-to-kun", label: "Kunyomi" },
];

export default function KanjiWriting() {
    const { kanjiData, isLoading } = useData();
    const [mode, setMode] = useState<WritingMode>("kanji-to-han");

    const [queue, setQueue] = useState<KanjiData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [penaltyTimer, setPenaltyTimer] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [totalAttempted, setTotalAttempted] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize practice session
    const startPractice = useCallback(() => {
        const shuffled = [...kanjiData.filter((k) => !k.isLearned)].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
        setCurrentIndex(0);
        setUserInput("");
        setIsCorrect(null);
        setPenaltyTimer(0);
        setShowAnswer(false);
        setFinished(false);
        setScore(0);
        setTotalAttempted(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [kanjiData]);

    useEffect(() => {
        startPractice();
    }, [startPractice]);

    // Handle penalty timer
    useEffect(() => {
        if (penaltyTimer > 0) {
            const timer = setInterval(() => {
                setPenaltyTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [penaltyTimer]);

    const currentKanji = queue[currentIndex];

    const getCorrectAnswer = () => {
        if (!currentKanji) return "";
        if (mode === "kanji-to-han") return currentKanji.han;
        if (mode === "kanji-to-on") return currentKanji.on;
        return currentKanji.kun;
    };

    const katakanaToHiragana = (src: string) => {
        return src.replace(/[\u30a1-\u30f6]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0x60);
        });
    };

    const normalize = (str: string) => {
        let normalized = str.trim().toLowerCase().normalize("NFC");
        normalized = normalized.replace(/・/g, "");
        return katakanaToHiragana(normalized);
    };

    const handleInputChange = (val: string) => {
        if (mode === "kanji-to-on" || mode === "kanji-to-kun") {
            setUserInput(toHiragana(val));
        } else {
            setUserInput(val);
        }
    };

    const handleCheck = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (penaltyTimer > 0 || !currentKanji) return;

        const correctAnswer = getCorrectAnswer();
        const userInputNormalized = normalize(userInput);

        const correctAnswers = correctAnswer.split(",").map((a) => normalize(a));
        const isMatch = correctAnswers.some((a) => a === userInputNormalized);

        if (isMatch) {
            setIsCorrect(true);
            setScore((prev) => prev + 1);
            setTotalAttempted((prev) => prev + 1);

            setTimeout(() => {
                handleNext();
            }, 1000);
        } else {
            setIsCorrect(false);
            setPenaltyTimer(2);
            setShowAnswer(true);
            setTotalAttempted((prev) => prev + 1);

            setQueue((prev) => {
                const newQueue = [...prev];
                const item = newQueue[currentIndex];
                newQueue.push(item);
                return newQueue;
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!finished && inputRef.current && penaltyTimer === 0) {
                inputRef.current.focus();
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [currentIndex, finished, mode, penaltyTimer]);

    const handleNext = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setUserInput("");
            setIsCorrect(null);
            setShowAnswer(false);
            setPenaltyTimer(0);
        } else {
            setFinished(true);
        }
    };

    const handleRetryAfterPenalty = () => {
        setUserInput("");
        setShowAnswer(false);
        setIsCorrect(null);
        setPenaltyTimer(0);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    if (finished) {
        return (
            <PracticeFinished 
                score={score} 
                totalAttempted={totalAttempted} 
                onRetry={startPractice} 
                title="Hoàn thành tự luận Kanji!"
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-3xl mx-auto p-4 space-y-8">
                <div className="w-full h-12 bg-stone-100 rounded-2xl animate-pulse" />
                <div className="w-full h-[300px] bg-white rounded-[3rem] animate-pulse shadow-xl" />
            </div>
        );
    }

    if (!currentKanji) return null;

    return (
        <div className="w-full max-w-3xl mx-auto p-4 space-y-8 py-10">
            <PracticeHeader 
                icon={PenTool}
                title="Tự luận Kanji"
                description={
                    mode === "kanji-to-han"
                        ? "Kanji → Âm Hán"
                        : mode === "kanji-to-on"
                            ? "Kanji → Onyomi" 
                            : "Kanji → Kunyomi"
                }
                modes={WRITING_MODES}
                activeMode={mode}
                onModeChange={(newMode) => {
                    setMode(newMode);
                    startPractice();
                }}
                currentIndex={currentIndex}
                total={queue.length}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex + mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                >
                    <Card className="border-none shadow-2xl shadow-stone-200/50 bg-white rounded-[3rem] p-8 md:p-16 overflow-hidden">
                        <CardContent className="p-0 flex flex-col items-center space-y-12">
                            <div className="text-center space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 Vietnamese-Content">
                                    {mode === "kanji-to-han"
                                        ? "Âm Hán Việt của chữ này là gì?"
                                        : mode === "kanji-to-on"
                                          ? "Âm ON của chữ này là gì?"
                                          : "Âm KUN của chữ này là gì?"}
                                </span>
                                <h2 className="font-black text-stone-900 leading-tight text-8xl md:text-9xl font-kanji">
                                    {currentKanji.kanji}
                                </h2>
                            </div>

                            <div className="w-full max-w-sm space-y-4">
                                <form onSubmit={(e) => handleCheck(e as any)} className="relative">
                                    <Input
                                        ref={inputRef}
                                        value={userInput}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        disabled={penaltyTimer > 0 || isCorrect === true}
                                        placeholder={
                                            mode === "kanji-to-han"
                                                ? "Nhập âm Hán..."
                                                : "Nhập cách đọc..."
                                        }
                                        className={cn(
                                            "h-16 rounded-2xl text-center text-2xl font-bold border-2 transition-all duration-300",
                                            isCorrect === true
                                                ? "border-green-500 bg-green-50 text-green-700 Vietnamese-Content"
                                                : isCorrect === false
                                                  ? "border-red-500 bg-red-50 text-red-700 Vietnamese-Content"
                                                  : "border-stone-100 focus:border-primary focus:ring-4 focus:ring-primary/10",
                                        )}
                                    />
                                    <AnimatePresence>
                                        {userInput.length > 0 && !isCorrect && penaltyTimer === 0 && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute right-2 top-2 h-12 w-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                                type="submit"
                                            >
                                                <ArrowRight size={20} />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </form>

                                <PracticeFeedback 
                                    penaltyTimer={penaltyTimer}
                                    showAnswer={showAnswer}
                                    isCorrect={isCorrect}
                                    correctAnswer={getCorrectAnswer()}
                                    onRetry={handleRetryAfterPenalty}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4"
                    >
                        <Sparkles className="text-primary shrink-0 mt-1" size={20} />
                        <div className="space-y-1">
                            <h4 className="font-bold text-stone-800 Vietnamese-Content text-sm">Gợi ý luyện tập</h4>
                            <p className="text-stone-500 text-xs leading-relaxed Vietnamese-Content">
                                {mode === "kanji-to-han"
                                    ? "Nhập âm Hán Việt không dấu hoặc có dấu (hệ thống sẽ chuẩn hóa). Chú ý các chữ có nhiều âm đọc."
                                    : "Sử dụng bàn phím Tiếng Nhật để gõ Hiragana chính xác."}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


