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

type WritingMode = "kanji-to-han" | "kanji-to-on" | "kanji-to-kun";

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
    }, []);

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
        } else if (penaltyTimer === 0 && showAnswer) {
            // Timer finished, hide answer and let user re-type
            // We keep the input cleared so they have to type again
        }
    }, [penaltyTimer, showAnswer]);

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
        // Loại bỏ khoảng trắng, dấu chấm phụ (・), chuyển về Hiragana để so khớp
        let normalized = str.trim().toLowerCase().normalize("NFC");
        normalized = normalized.replace(/・/g, "");
        return katakanaToHiragana(normalized);
    };

    const handleInputChange = (val: string) => {
        // Tự động chuyển đổi sang Hiragana nếu ở chế độ nhập âm đọc tiếng Nhật
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

        // Hỗ trợ nhiều đáp án (phân cách bằng dấu phẩy)
        const correctAnswers = correctAnswer.split(",").map((a) => normalize(a));
        const isMatch = correctAnswers.some((a) => a === userInputNormalized);

        if (isMatch) {
            setIsCorrect(true);
            setScore((prev) => prev + 1);
            setTotalAttempted((prev) => prev + 1);

            // Success animation then next
            setTimeout(() => {
                handleNext();
            }, 1000);
        } else {
            setIsCorrect(false);
            setPenaltyTimer(2);
            setShowAnswer(true);
            setTotalAttempted((prev) => prev + 1);

            // Move this to end of queue to practice again later
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
        // Đợi animation của AnimatePresence hoàn tất (thường ~300-500ms)
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
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="relative inline-block mb-6">
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                        <CheckCircle2 className="relative h-24 w-24 text-primary mx-auto" />
                    </div>
                    <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">Hoàn thành luyện tập!</h2>
                    <p className="text-stone-500 mt-2 Vietnamese-Content">Bạn đã thực hành xong bộ chữ Kanji này.</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <Card className="p-6 rounded-3xl border-none shadow-lg">
                        <span className="text-[10px] font-black uppercase text-stone-400">Độ chính xác</span>
                        <p className="text-3xl font-black text-primary">
                            {Math.round((score / totalAttempted) * 100)}%
                        </p>
                    </Card>
                    <Card className="p-6 rounded-3xl border-none shadow-lg">
                        <span className="text-[10px] font-black uppercase text-stone-400">Số câu đúng</span>
                        <p className="text-3xl font-black text-stone-900">
                            {score}/{totalAttempted}
                        </p>
                    </Card>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={startPractice}
                        className="bg-primary text-white h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <RotateCcw className="mr-2 h-5 w-5" /> Luyện tập lại
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 px-8 rounded-2xl font-bold border-stone-200"
                        onClick={() => (window.location.href = "/")}
                    >
                        Quay về trang chủ
                    </Button>
                </div>
            </div>
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


    const progress = (currentIndex / queue.length) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto p-4 space-y-8 py-10">
            {/* Header & Progress */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <Badge
                            variant="outline"
                            className="w-fit bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1 rounded-full flex gap-2"
                        >
                            <PenTool size={14} /> Tự luận Kanji
                        </Badge>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest px-1">
                            {mode === "kanji-to-han"
                                ? "Kanji → Âm Hán"
                                : mode === "kanji-to-on"
                                  ? "Kanji → Onyomi"
                                  : "Kanji → Kunyomi"}
                        </p>
                    </div>

                    <div className="flex bg-stone-100 p-1 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-xl font-bold whitespace-nowrap px-4 tracking-tight",
                                mode === "kanji-to-han" ? "bg-white shadow-sm text-primary" : "text-stone-500",
                            )}
                            onClick={() => {
                                setMode("kanji-to-han");
                                startPractice();
                            }}
                        >
                            Âm Hán
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-xl font-bold whitespace-nowrap px-4 tracking-tight",
                                mode === "kanji-to-on" ? "bg-white shadow-sm text-primary" : "text-stone-500",
                            )}
                            onClick={() => {
                                setMode("kanji-to-on");
                                startPractice();
                            }}
                        >
                            Onyomi
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-xl font-bold whitespace-nowrap px-4 tracking-tight",
                                mode === "kanji-to-kun" ? "bg-white shadow-sm text-primary" : "text-stone-500",
                            )}
                            onClick={() => {
                                setMode("kanji-to-kun");
                                startPractice();
                            }}
                        >
                            Kunyomi
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black tracking-widest text-stone-400 uppercase">
                        <span>Tiến trình</span>
                        <span>
                            {currentIndex + 1} / {queue.length}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2 bg-stone-100" />
                </div>
            </div>

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
                            {/* Question Section */}
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

                            {/* Input Area */}
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
                                                : mode === "kanji-to-on"
                                                  ? "Nhập âm On..."
                                                  : "Nhập âm Kun..."
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

                                {/* Penalty / Feedback */}
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
                                                {getCorrectAnswer()}
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-1 w-full max-w-[100px] bg-red-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-red-500"
                                                        initial={{ width: "100%" }}
                                                        animate={{ width: "0%" }}
                                                        transition={{ duration: 5, ease: "linear" }}
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
                                                onClick={handleRetryAfterPenalty}
                                                className="text-primary font-bold flex gap-2"
                                            >
                                                <History size={14} /> Thử lại ngay
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Helper/Hint */}
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
                                    : "Sử dụng bàn phím Tiếng Nhật (Microsoft IME, Google Japanese Input...) để gõ Kanji chính xác."}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

