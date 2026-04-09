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

type VocabMode = "word-to-reading" | "meaning-to-word" | "word-to-meaning";

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
        // Lọc từ chưa thuộc và xáo trộn hoàn toàn (Random) theo yêu cầu USER
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
    }, []);

    useEffect(() => {
        startPractice();
    }, [startPractice, mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (penaltyTimer > 0) {
            interval = setInterval(() => {
                setPenaltyTimer((prev) => prev - 1);
            }, 1000);
        } else if (penaltyTimer === 0 && showAnswer && isCorrect === false) {
            handleRetryAfterPenalty();
        }
        return () => clearInterval(interval);
    }, [penaltyTimer, showAnswer, isCorrect]);

    const currentVocab = queue[currentIndex];

    const normalize = (str: string) => {
        return str.trim().toLowerCase().normalize("NFC");
    };

    const handleInputChange = (val: string) => {
        // Chỉ tự động chuyển sang Hiragana ở các chế độ yêu cầu nhập tiếng Nhật
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
            // Kiểm tra nghĩa tiếng Việt
            isMatch = normalize(currentVocab.meaning) === inputNormalized;
        } else {
            // Chấp nhận cả cách đọc (reading) và mặt chữ (word) cho các chế độ tiếng Nhật
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

    // Auto focus when question changes
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
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-8">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Badge className="bg-green-500 scale-150 p-2">🎉</Badge>
                    </div>
                    <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">Hoàn thành!</h2>
                    <p className="text-stone-500 Vietnamese-Content">Bạn đã luyện tập xong bộ từ vựng này.</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <Card className="p-6 rounded-3xl border-none shadow-lg">
                        <span className="text-[10px] font-black uppercase text-stone-400">Độ chính xác</span>
                        <p className="text-3xl font-black text-primary">
                            {totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0}%
                        </p>
                    </Card>
                    <Card className="p-6 rounded-3xl border-none shadow-lg">
                        <span className="text-[10px] font-black uppercase text-stone-400">Số từ đúng</span>
                        <p className="text-3xl font-black text-stone-900">
                            {score}/{totalAttempted}
                        </p>
                    </Card>
                </div>

                <div className="flex gap-4">
                    <Button onClick={startPractice} className="bg-primary text-white h-14 px-8 rounded-2xl font-bold">
                        <RotateCcw className="mr-2 h-5 w-5" /> Luyện tập lại
                    </Button>
                </div>
            </div>
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


    const progress = (currentIndex / queue.length) * 100;

    return (
        <div className="w-full space-y-8">
            {/* Context & Transition */}
            <div className="flex flex-col items-center space-y-6">
                <div className="flex bg-stone-100 p-1 rounded-2xl max-w-full">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "rounded-xl font-bold whitespace-nowrap px-6",
                            mode === "word-to-reading" ? "bg-white shadow-sm text-primary" : "text-stone-500",
                        )}
                        onClick={() => setMode("word-to-reading")}
                    >
                        Từ → Đọc
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "rounded-xl font-bold whitespace-nowrap px-6",
                            mode === "meaning-to-word" ? "bg-white shadow-sm text-primary" : "text-stone-500",
                        )}
                        onClick={() => setMode("meaning-to-word")}
                    >
                        Nghĩa → Từ
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "rounded-xl font-bold whitespace-nowrap px-6",
                            mode === "word-to-meaning" ? "bg-white shadow-sm text-primary" : "text-stone-500",
                        )}
                        onClick={() => setMode("word-to-meaning")}
                    >
                        Từ → Nghĩa
                    </Button>
                </div>

                <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-[10px] font-black tracking-widest text-stone-400 uppercase">
                        <span>Tiến trình luyện tập từ vựng</span>
                        <span>{currentIndex + 1} / {queue.length}</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-stone-100" />
                </div>
            </div>

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
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : isCorrect === false
                                                  ? "border-red-500 bg-red-50 text-red-700"
                                                  : "border-stone-100 focus:border-primary focus:ring-4 focus:ring-primary/10",
                                        )}
                                    />
                                    {penaltyTimer > 0 && (
                                        <div className="absolute -bottom-10 left-0 right-0 text-center">
                                            <Badge variant="outline" className="text-red-500 border-red-100 bg-red-50 animate-pulse">
                                                Tiếp tục sau {penaltyTimer}s
                                            </Badge>
                                        </div>
                                    )}
                                </form>

                                {showAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-stone-400 Vietnamese-Content">Đáp án đúng</span>
                                            <Badge className="bg-primary">
                                                {mode === "word-to-meaning" ? currentVocab.meaning : currentVocab.reading}
                                            </Badge>
                                        </div>
                                        <p className="text-2xl font-black text-stone-900 font-kanji">{currentVocab.word}</p>
                                        <div className="pt-2 border-t border-stone-200">
                                            <p className="text-sm text-stone-500 italic Vietnamese-Content">{currentVocab.example}</p>
                                            <p className="text-xs text-stone-400 Vietnamese-Content">{currentVocab.exampleMeaning}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
