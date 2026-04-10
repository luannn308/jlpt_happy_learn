"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { VocabularyItem } from "@/data/vocabulary";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, RotateCcw, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { toHiragana } from "@/lib/japanese";
import { Input } from "@/components/ui/input";

import PracticeFinished from "@/components/quiz/shared/PracticeFinished";
import PracticeHeader from "@/components/quiz/shared/PracticeHeader";
import PracticeFeedback from "@/components/quiz/shared/PracticeFeedback";

type VocabMode = "word-to-reading" | "meaning-to-word" | "word-to-meaning";

const VOCAB_MODES = [
    { id: "word-to-reading", label: "Từ → Đọc" },
    { id: "meaning-to-word", label: "Nghĩa → Từ" },
    { id: "word-to-meaning", label: "Từ → Nghĩa" },
];

export default function VocabWriting() {
    const { vocabularyData, isLoading } = useData();
    const [mode, setMode] = useState<VocabMode>("word-to-reading");

    const [queue, setQueue] = useState<VocabularyItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [penaltyTimer, setPenaltyTimer] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [totalAttempted, setTotalAttempted] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const startPractice = useCallback(() => {
        const shuffled = [...vocabularyData.filter(v => !v.isLearned)]
            .sort(() => Math.random() - 0.5);
        
        setQueue(shuffled);
        setCurrentIndex(0);
        setUserInput("");
        setIsCorrect(null);
        setPenaltyTimer(0);
        setShowAnswer(false);
        setFinished(false);
        setScore(0);
        setTotalAttempted(0);
    }, [vocabularyData]);

    useEffect(() => {
        startPractice();
    }, [startPractice]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (penaltyTimer > 0) {
            interval = setInterval(() => {
                setPenaltyTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [penaltyTimer]);

    const currentVocab = queue[currentIndex];

    const getCorrectAnswer = () => {
        if (!currentVocab) return "";
        if (mode === "word-to-meaning") return currentVocab.meaning;
        return currentVocab.reading;
    };

    const normalize = (str: string) => {
        return str.trim().toLowerCase().normalize("NFC");
    };

    const handleInputChange = (val: string) => {
        if (mode === "word-to-reading" || mode === "meaning-to-word") {
            setUserInput(toHiragana(val));
        } else {
            setUserInput(val);
        }
    };

    const handleCheck = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (penaltyTimer > 0 || !currentVocab) return;

        const inputNormalized = normalize(userInput);
        
        // Logic kiểm tra linh hoạt
        let isMatch = false;
        
        if (mode === "word-to-meaning") {
            isMatch = normalize(currentVocab.meaning) === inputNormalized;
        } else {
            const possibleAnswers = [
                normalize(currentVocab.reading),
                normalize(currentVocab.word)
            ];
            isMatch = possibleAnswers.includes(inputNormalized);
        }

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
                title="Hoàn thành tự luận Từ vựng!"
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto p-4 space-y-8">
                <div className="w-full h-12 bg-stone-100 rounded-2xl animate-pulse" />
                <div className="w-full h-[300px] bg-white rounded-[3rem] animate-pulse shadow-xl" />
            </div>
        );
    }

    if (!currentVocab) return null;

    return (
        <div className="w-full space-y-8">
            <PracticeHeader 
                icon={BookOpen}
                title="Tự luận Từ vựng"
                description={
                    mode === "word-to-reading" 
                        ? "Từ → Đọc" 
                        : mode === "meaning-to-word"
                            ? "Nghĩa → Từ"
                            : "Từ → Nghĩa"
                }
                modes={VOCAB_MODES}
                activeMode={mode}
                onModeChange={(newMode) => setMode(newMode as any)}
                currentIndex={currentIndex}
                total={queue.length}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex + mode}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                >
                    <Card className="border-none shadow-2xl shadow-stone-200/50 bg-white rounded-[3rem] p-8 md:p-12">
                        <CardContent className="p-0 flex flex-col items-center space-y-10">
                            <div className="text-center space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 Vietnamese-Content">
                                    {mode === "word-to-reading" 
                                        ? "Cách đọc của từ này là gì?" 
                                        : mode === "meaning-to-word"
                                          ? "Từ vựng có nghĩa này là gì?"
                                          : "Nghĩa tiếng Việt của từ này là gì?"}
                                </span>
                                <h2 className="font-black text-stone-900 leading-tight text-6xl md:text-7xl font-kanji">
                                    {mode === "word-to-meaning" || mode === "word-to-reading" ? currentVocab.word : currentVocab.meaning}
                                </h2>
                                {(mode === "word-to-reading" || mode === "word-to-meaning") && (
                                    <p className="text-stone-400 lowercase font-medium Vietnamese-Content">
                                        {mode === "word-to-reading" ? `(${currentVocab.meaning})` : `(${currentVocab.reading})`}
                                    </p>
                                )}
                            </div>

                            <div className="w-full max-w-sm space-y-6">
                                <form onSubmit={(e) => handleCheck(e as any)} className="relative">
                                    <Input
                                        ref={inputRef}
                                        value={userInput}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        disabled={penaltyTimer > 0 || isCorrect === true}
                                        placeholder={
                                            mode === "word-to-meaning" 
                                                ? "Nhập nghĩa tiếng Việt..." 
                                                : "Nhập đáp án..."
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
                                </form>

                                <PracticeFeedback 
                                    penaltyTimer={penaltyTimer}
                                    showAnswer={showAnswer}
                                    isCorrect={isCorrect}
                                    correctAnswer={getCorrectAnswer()}
                                    onRetry={handleRetryAfterPenalty}
                                    extraContent={showAnswer && (
                                        <div className="space-y-2 text-left">
                                            <p className="text-2xl font-black text-stone-900 font-kanji text-center">{currentVocab.word}</p>
                                            <div className="pt-2 border-t border-stone-200">
                                                <p className="text-sm text-stone-500 italic Vietnamese-Content">{currentVocab.example}</p>
                                                <p className="text-xs text-stone-400 Vietnamese-Content">{currentVocab.exampleMeaning}</p>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


