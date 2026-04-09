"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { kanjiData, KanjiData } from "@/data/kanji";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    ArrowRight,
    RotateCcw,
    Home,
    CheckCircle2,
    XCircle,
    BrainCircuit,
    Volume2,
    VolumeX,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type QuestionType = "han-viet" | "reading" | "face" | "on-yomi" | "kun-yomi" | "vocab-reading" | "vocab-meaning";
type QuizMode = "all" | "han-viet" | "on-kun" | "vocab";

interface Question {
    kanjiId: number;
    type: QuestionType;
    questionText: string;
    correctAnswer: string;
    options: string[];
    reading?: string; // Thêm cách đọc
    han?: string;     // Thêm âm Hán
}

export default function KanjiQuiz() {
    const [quizMode, setQuizMode] = useState<QuizMode>("all");
    const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
    const [queue, setQueue] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [hasFailedCurrent, setHasFailedCurrent] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Audio Context Utility
    const playSFX = useCallback(
        (type: "correct" | "wrong") => {
            if (isMuted) return;

            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const audioCtx = new AudioContextClass();

                if (type === "correct") {
                    // Harmonic "Ping"
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();

                    osc.type = "sine";
                    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
                    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5

                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

                    osc.connect(gain);
                    gain.connect(audioCtx.destination);

                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.4);
                } else {
                    // Soft "Thud"
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();

                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);

                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

                    osc.connect(gain);
                    gain.connect(audioCtx.destination);

                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                }

                // Close context after a while
                setTimeout(() => {
                    audioCtx.close();
                }, 1000);
            } catch (e) {
                console.error("Audio error:", e);
            }
        },
        [isMuted],
    );

    // Load mute preference
    useEffect(() => {
        const savedMute = localStorage.getItem("jlpt_quiz_muted");
        if (savedMute === "true") setIsMuted(true);
    }, []);

    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        localStorage.setItem("jlpt_quiz_muted", String(newState));
    };

    // Parse radicals for distractors
    const getRadicals = (components: string) => {
        const matches = components.match(/<strong>(.*?)<\/strong>/g);
        if (!matches) return [];
        return matches.map((m) => m.replace(/<\/?strong>/g, ""));
    };

    const startQuiz = useCallback(
        (mode: QuizMode = quizMode) => {
            // 1. Get 10 random kanji that are NOT learned (isLearned: false/undefined AND not in localStorage)
            const savedKanji = localStorage.getItem("jlpt_learned_kanji");
            const learnedIds = savedKanji ? JSON.parse(savedKanji) : [];

            const pool = kanjiData.filter((k) => !k.isLearned && !learnedIds.includes(k.id));

            if (pool.length === 0) {
                setQuizFinished(true);
                return;
            }

            const selectedKanji = [...pool].sort(() => Math.random() - 0.5);

            const newQuestions: Question[] = [];

            selectedKanji.forEach((k) => {
                if (mode === "all" || mode === "han-viet") {
                    newQuestions.push(generateQuestion(k, "han-viet"));
                    newQuestions.push(generateQuestion(k, "face"));
                }

                if (mode === "all" || mode === "on-kun") {
                    if (k.on !== "Không có") newQuestions.push(generateQuestion(k, "on-yomi"));
                    if (k.kun !== "Không có") newQuestions.push(generateQuestion(k, "kun-yomi"));
                }

                if (mode === "all" || mode === "vocab") {
                    if (k.vocab && k.vocab.length > 0) {
                        newQuestions.push(generateQuestion(k, "vocab-reading"));
                        newQuestions.push(generateQuestion(k, "vocab-meaning"));
                    }
                }

                // Mặc định cũ (giữ cho "all")
                if (mode === "all" && !newQuestions.find((q) => q.kanjiId === k.id && q.type === "reading")) {
                    newQuestions.push(generateQuestion(k, "reading"));
                }
            });

            const shuffledQuestions = [...newQuestions].sort(() => Math.random() - 0.5);
            setOriginalQuestions(shuffledQuestions);
            setQueue(shuffledQuestions);
            setCompletedCount(0);
            setScore(0);
            setQuizFinished(false);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setHasFailedCurrent(false);
            setCurrentQuestion(null); // Reset current question to trigger useEffect
        },
        [quizMode],
    );

    const generateQuestion = (kanji: KanjiData, type: QuestionType): Question => {
        let questionText = "";
        let correctAnswer = "";
        let options: string[] = [];

        const radicals = getRadicals(kanji.components);

        // Find similar distractors based on radicals
        const findDistractors = (field: keyof KanjiData, count: number) => {
            let similar = kanjiData.filter(
                (k) => k.id !== kanji.id && getRadicals(k.components).some((r) => radicals.includes(r)),
            );

            if (similar.length < count) {
                // Add random distractors if not enough similar ones
                const others = kanjiData.filter((k) => k.id !== kanji.id && !similar.includes(k));
                similar = [...similar, ...others.sort(() => Math.random() - 0.5)];
            }

            return similar.slice(0, count).map((k) => k[field] as string);
        };

        if (type === "han-viet") {
            questionText = `${kanji.kanji}`;
            correctAnswer = kanji.han;
            options = [correctAnswer, ...findDistractors("han", 3)];
        } else if (type === "reading") {
            questionText = `${kanji.kanji}`;
            correctAnswer = kanji.on !== "Không có" ? kanji.on : kanji.kun;
            const dists = kanjiData
                .filter((k) => k.id !== kanji.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((k) => (k.on !== "Không có" ? k.on : k.kun));
            options = [correctAnswer, ...dists];
        } else if (type === "face") {
            questionText = `${kanji.han}`;
            correctAnswer = kanji.kanji;
            options = [correctAnswer, ...findDistractors("kanji", 3)];
        } else if (type === "on-yomi") {
            questionText = `${kanji.kanji}`;
            correctAnswer = kanji.on;
            const dists = kanjiData
                .filter((k) => k.id !== kanji.id && k.on !== "Không có")
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((k) => k.on);
            options = [correctAnswer, ...dists];
        } else if (type === "kun-yomi") {
            questionText = `${kanji.kanji}`;
            correctAnswer = kanji.kun;
            const dists = kanjiData
                .filter((k) => k.id !== kanji.id && k.kun !== "Không có")
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((k) => k.kun);
            options = [correctAnswer, ...dists];
        } else if (type === "vocab-reading") {
            const v = kanji.vocab[Math.floor(Math.random() * kanji.vocab.length)];
            questionText = `${v.word}`;
            correctAnswer = v.reading;
            const dists = kanjiData
                .flatMap((k) => k.vocab)
                .filter((vocab) => vocab.word !== v.word)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((vocab) => vocab.reading);
            options = [correctAnswer, ...dists];
        } else if (type === "vocab-meaning") {
            const v = kanji.vocab[Math.floor(Math.random() * kanji.vocab.length)];
            questionText = `${v.word}`;
            correctAnswer = v.meaning;
            const dists = kanjiData
                .flatMap((k) => k.vocab)
                .filter((vocab) => vocab.word !== v.word)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((vocab) => vocab.meaning);
            options = [correctAnswer, ...dists];
        }

        return {
            kanjiId: kanji.id,
            type,
            questionText,
            correctAnswer,
            options: options.sort(() => Math.random() - 0.5),
            reading:
                type === "vocab-reading" || type === "vocab-meaning"
                    ? kanji.vocab.find((v) => v.word === questionText)?.reading || ""
                    : kanji.on !== "Không có"
                      ? kanji.on
                      : kanji.kun,
            han: kanji.han,
        };
    };

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    useEffect(() => {
        if (queue.length > 0 && !currentQuestion) {
            setCurrentQuestion(queue[0]);
        }
    }, [queue, currentQuestion]);

    const handleAnswer = (answer: string) => {
        if (isAnswered || !currentQuestion) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === currentQuestion.correctAnswer) {
            playSFX("correct");
            // Only add score if the user didn't fail this question in the current attempt
            if (!hasFailedCurrent) {
                setScore((prev) => prev + 1);
            }

            // Auto-next after 600ms disabled by user request
            // setTimeout(() => {
            //     nextQuestion();
            // }, 600);
        } else {
            playSFX("wrong");
            // Wrong answer logic
            setHasFailedCurrent(true);

            // Move this question to the end of the queue
            setQueue((prevQueue) => {
                const newQueue = [...prevQueue];
                const removed = newQueue.shift();
                if (removed) newQueue.push(removed);
                return newQueue;
            });

            // Wait a moment and then allow retry
            setTimeout(() => {
                setIsAnswered(false);
                setSelectedAnswer(null);
            }, 800);
        }
    };

    const nextQuestion = () => {
        if (!currentQuestion) return;

        setCompletedCount((prev) => prev + 1);
        setHasFailedCurrent(false);

        const newQueue = [...queue];
        // If the question was already moved to the end (because it was failed first),
        // it's no longer at the front, so we don't shift.
        // If it was corrected on the first try, we remove it from the front.
        if (!hasFailedCurrent) {
            newQueue.shift();
        }

        if (newQueue.length === 0) {
            setQuizFinished(true);
        } else {
            setQueue(newQueue);
            setCurrentQuestion(newQueue[0]);
            setIsAnswered(false);
            setSelectedAnswer(null);
        }
    };

    const totalQuestions = originalQuestions.length;
    const progress = (completedCount / totalQuestions) * 100;

    if (quizFinished) {
        if (originalQuestions.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-4 text-center space-y-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="relative inline-block">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                            <Sparkles className="relative h-24 w-24 text-primary mx-auto" />
                        </div>
                        <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">Tuyệt vời!</h2>
                        <p className="text-xl text-stone-600 font-medium Vietnamese-Content">
                            Bạn đã học hết tất cả các chữ Kanji hiện có. <br />
                            Hãy quay lại sau hoặc ôn tập các từ đã học nhé!
                        </p>
                        <Link href="/">
                            <Button
                                size="lg"
                                className="bg-primary text-white hover:bg-primary/90 rounded-2xl h-16 px-10 font-bold flex gap-2 mx-auto shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                            >
                                <Home size={20} /> Quay về trang chủ
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full text-center space-y-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                        <CheckCircle2 className="relative h-24 w-24 text-primary mx-auto" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">
                            Hoàn thành bảng trắc nghiệm!
                        </h2>
                        <p className="text-stone-500 font-medium Vietnamese-Content">
                            Bạn đã chinh phục được {originalQuestions.length / 3} chữ Kanji trong lượt này.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-none bg-white shadow-xl shadow-stone-200/50 p-6 rounded-3xl text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                Độ chính xác
                            </span>
                            <p className="text-3xl font-black text-primary">
                                {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                            </p>
                        </Card>
                        <Card className="border-none bg-white shadow-xl shadow-stone-200/50 p-6 rounded-3xl text-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                Số câu đúng
                            </span>
                            <p className="text-3xl font-black text-stone-900">
                                {score}/{totalQuestions}
                            </p>
                        </Card>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            size="lg"
                            className="bg-primary text-white hover:bg-primary/90 rounded-2xl h-16 px-10 font-bold flex gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                            onClick={() => startQuiz()}
                        >
                            <RotateCcw size={20} /> Làm lại lượt mới
                        </Button>
                        <Link href="/">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-stone-200 hover:bg-stone-50 rounded-2xl h-16 px-10 font-bold flex gap-2 text-stone-600 transition-all"
                            >
                                <Home size={20} /> Quay về trang chủ
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 p-4 py-10">
            {/* Header & Progress */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <Badge
                        variant="outline"
                        className="border-primary/20 text-primary bg-primary/5 font-bold px-4 py-1.5 rounded-full flex gap-2"
                    >
                        <BrainCircuit size={14} /> Trắc nghiệm Kanji N3
                    </Badge>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="rounded-full hover:bg-stone-100 text-stone-400"
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </Button>
                        <span className="text-sm font-black text-stone-400 uppercase tracking-widest">
                            Tiến độ: {completedCount}/{totalQuestions}
                        </span>
                    </div>
                </div>
                <div className="relative h-3 w-full bg-stone-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>

                {/* Tabs for Quiz Mode */}
                {!isAnswered && completedCount === 0 && (
                    <Tabs
                        value={quizMode}
                        onValueChange={(v) => {
                            const newMode = v as QuizMode;
                            setQuizMode(newMode);
                            startQuiz(newMode);
                        }}
                        className="w-full flex justify-center"
                    >
                        <TabsList className="bg-stone-100/80 p-1 h-12 rounded-2xl border border-stone-200 shadow-sm Vietnamese-Content">
                            <TabsTrigger
                                value="all"
                                className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger
                                value="han-viet"
                                className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Âm Hán
                            </TabsTrigger>
                            <TabsTrigger
                                value="on-kun"
                                className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                On/Kun
                            </TabsTrigger>
                            <TabsTrigger
                                value="vocab"
                                className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Từ vựng
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.kanjiId + currentQuestion.type + queue.length}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-none shadow-2xl shadow-stone-200/60 bg-white rounded-[3rem] p-8 md:p-12 overflow-hidden">
                        <CardContent className="p-0 space-y-10">
                            {/* Question Section */}
                            <div className="text-center space-y-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 Vietnamese-Content">
                                    {currentQuestion.type === "han-viet" && "Tìm âm Hán Việt"}
                                    {currentQuestion.type === "face" && "Tìm chữ Kanji tương ứng"}
                                    {currentQuestion.type === "on-yomi" && "Tìm cách đọc On-yomi"}
                                    {currentQuestion.type === "kun-yomi" && "Tìm cách đọc Kun-yomi"}
                                    {currentQuestion.type === "vocab-reading" && "Cách đọc của từ này là gì?"}
                                    {currentQuestion.type === "vocab-meaning" && "Nghĩa của từ này là gì?"}
                                    {currentQuestion.type === "reading" && "Cách đọc nào là đúng?"}
                                </span>
                                <h2
                                    className={cn(
                                        "font-black text-stone-900 leading-tight flex flex-col items-center justify-center gap-4",
                                        currentQuestion.type === "face"
                                            ? "text-4xl md:text-6xl Vietnamese-Content"
                                            : "text-5xl md:text-8xl font-kanji",
                                    )}
                                >
                                    {isAnswered &&
                                    selectedAnswer === currentQuestion.correctAnswer &&
                                    (currentQuestion.type === "vocab-meaning" || currentQuestion.type === "han-viet") ? (
                                        <ruby className="ruby-position-over">
                                            {currentQuestion.questionText}
                                            <rt className="text-primary text-xl md:text-2xl font-bold mb-2 lowercase tracking-normal">
                                                {currentQuestion.reading}
                                            </rt>
                                        </ruby>
                                    ) : (
                                        currentQuestion.questionText
                                    )}

                                    {/* Hiển thị Âm Hán Việt khi chọn đúng */}
                                    {isAnswered &&
                                        selectedAnswer === currentQuestion.correctAnswer &&
                                        currentQuestion.han &&
                                        (currentQuestion.type === "vocab-meaning" ||
                                            currentQuestion.type === "vocab-reading" ||
                                            currentQuestion.type === "on-yomi" ||
                                            currentQuestion.type === "kun-yomi") && (
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-primary/60 text-lg md:text-xl font-bold uppercase tracking-widest block"
                                            >
                                                {currentQuestion.han}
                                            </motion.span>
                                        )}
                                </h2>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        disabled={isAnswered && selectedAnswer === currentQuestion.correctAnswer}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "relative p-6 rounded-[2rem] text-lg font-bold border-2 transition-all duration-200 text-left flex items-center justify-between group",
                                            !isAnswered
                                                ? "border-stone-100 hover:border-primary hover:bg-primary/5 text-stone-700"
                                                : option === selectedAnswer
                                                  ? option === currentQuestion.correctAnswer
                                                      ? "border-green-500 bg-green-50 text-green-700"
                                                      : "border-red-500 bg-red-50 text-red-700"
                                                  : "border-stone-100 text-stone-400",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "font-bold",
                                                currentQuestion.type === "han-viet" ||
                                                    currentQuestion.type === "vocab-meaning"
                                                    ? "text-xl Vietnamese-Content"
                                                    : "text-3xl font-kanji",
                                            )}
                                        >
                                            {option}
                                        </span>
                                        {isAnswered &&
                                            option === selectedAnswer &&
                                            option === currentQuestion.correctAnswer && (
                                                <CheckCircle2 className="h-6 w-6 text-green-500 fill-white" />
                                            )}
                                        {isAnswered &&
                                            option === selectedAnswer &&
                                            option !== currentQuestion.correctAnswer && (
                                                <XCircle className="h-6 w-6 text-red-500 fill-white" />
                                            )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Feedback message & Next Button */}
                            <div className="min-h-[60px] flex flex-col items-center justify-center gap-4">
                                {isAnswered && selectedAnswer === currentQuestion.correctAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full flex flex-col items-center gap-4"
                                    >
                                        <Button
                                            onClick={nextQuestion}
                                            size="lg"
                                            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl h-14 px-10 font-bold flex gap-2 shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95 Vietnamese-Content"
                                        >
                                            Tiếp tục <ArrowRight size={20} />
                                        </Button>
                                    </motion.div>
                                )}
                                {isAnswered && selectedAnswer !== currentQuestion.correctAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full flex flex-col items-center gap-4"
                                    >
                                        <p className="text-red-500 font-bold Vietnamese-Content flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" /> Sai rồi! Hãy suy nghĩ lại nhé.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Hint */}
            <p className="text-center text-stone-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-primary" />
                Mẹo: Nếu sai, câu hỏi sẽ xuất hiện lại ở cuối lượt để bạn nhớ lâu hơn!
            </p>
        </div>
    );
}

