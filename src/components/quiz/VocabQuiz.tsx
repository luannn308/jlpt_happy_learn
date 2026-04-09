"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vocabularyData, VocabularyItem } from "@/data/vocabulary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RotateCcw, Home, CheckCircle2, XCircle, BrainCircuit, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VocabQuestionType = "word-to-meaning" | "meaning-to-word" | "word-to-reading";
type VocabQuizMode = "all" | "meaning" | "reading";

interface VocabQuestion {
    vocabId: number;
    type: VocabQuestionType;
    questionText: string;
    correctAnswer: string;
    options: string[];
}

export default function VocabQuiz() {
    const [quizMode, setQuizMode] = useState<VocabQuizMode>("all");
    const [originalQuestions, setOriginalQuestions] = useState<VocabQuestion[]>([]);
    const [queue, setQueue] = useState<VocabQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<VocabQuestion | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [hasFailedCurrent, setHasFailedCurrent] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Audio Context Utility (Reused from KanjiQuiz)
    const playSFX = useCallback(
        (type: "correct" | "wrong") => {
            if (isMuted) return;

            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const audioCtx = new AudioContextClass();

                if (type === "correct") {
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

    const generateQuestion = useCallback((vocab: VocabularyItem, type: VocabQuestionType): VocabQuestion => {
        let questionText = "";
        let correctAnswer = "";
        let options: string[] = [];

        // Helper to find random distractors
        const getDistractors = (field: keyof VocabularyItem, count: number) => {
            return vocabularyData
                .filter((v) => v.id !== vocab.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, count)
                .map((v) => v[field] as string);
        };

        switch (type) {
            case "word-to-meaning":
                questionText = vocab.word;
                correctAnswer = vocab.meaning;
                options = [correctAnswer, ...getDistractors("meaning", 3)];
                break;
            case "meaning-to-word":
                questionText = vocab.meaning;
                correctAnswer = vocab.word;
                options = [correctAnswer, ...getDistractors("word", 3)];
                break;
            case "word-to-reading":
                questionText = vocab.word;
                correctAnswer = vocab.reading;
                options = [correctAnswer, ...getDistractors("reading", 3)];
                break;
        }

        return {
            vocabId: vocab.id,
            type,
            questionText,
            correctAnswer,
            options: options.sort(() => Math.random() - 0.5),
        };
    }, []);

    const startQuiz = useCallback(
        (mode: VocabQuizMode = quizMode) => {
            // Filter only non-learned words
            const pool = vocabularyData.filter((v) => !v.isLearned);

            if (pool.length === 0) {
                setQuizFinished(true);
                return;
            }

            // Pick 10 random words
            const selectedVocab = [...pool].sort(() => Math.random() - 0.5);
            const newQuestions: VocabQuestion[] = [];

            selectedVocab.forEach((v) => {
                if (mode === "all" || mode === "meaning") {
                    newQuestions.push(generateQuestion(v, "word-to-meaning"));
                }
                if (mode === "all") {
                    newQuestions.push(generateQuestion(v, "meaning-to-word"));
                }
                if (mode === "all" || mode === "reading") {
                    newQuestions.push(generateQuestion(v, "word-to-reading"));
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
            setCurrentQuestion(shuffledQuestions[0] || null);
        },
        [quizMode, generateQuestion],
    );

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    const handleAnswer = (answer: string) => {
        if (isAnswered || !currentQuestion) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === currentQuestion.correctAnswer) {
            playSFX("correct");
            if (!hasFailedCurrent) {
                setScore((prev) => prev + 1);
            }

            // Auto-next
            setTimeout(() => {
                nextQuestion();
            }, 600);
        } else {
            playSFX("wrong");
            setHasFailedCurrent(true);

            // Move this question to the end of the queue
            setQueue((prevQueue) => {
                const newQueue = [...prevQueue];
                const removed = newQueue.shift();
                if (removed) newQueue.push(removed);
                return newQueue;
            });

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
                            {poolLength === 0 && originalQuestions.length === 0
                                ? "Bạn đã học hết từ vựng!"
                                : "Hoàn thành Quiz Từ vựng!"}
                        </h2>
                        <p className="text-stone-500 font-medium Vietnamese-Content">
                            {originalQuestions.length > 0 && `Bạn đã trả lời đúng ${score}/${totalQuestions} câu hỏi.`}
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
                            <RotateCcw size={20} /> Làm lượt mới
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
                        <BrainCircuit size={14} /> Trắc nghiệm Từ vựng N3
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
                            {completedCount}/{totalQuestions}
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
                            const newMode = v as VocabQuizMode;
                            setQuizMode(newMode);
                            startQuiz(newMode);
                        }}
                        className="w-full flex justify-center"
                    >
                        <TabsList className="bg-stone-100/80 p-1 h-12 rounded-2xl border border-stone-200 shadow-sm Vietnamese-Content">
                            <TabsTrigger
                                value="all"
                                className="rounded-xl px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger
                                value="meaning"
                                className="rounded-xl px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Nghĩa
                            </TabsTrigger>
                            <TabsTrigger
                                value="reading"
                                className="rounded-xl px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                            >
                                Cách đọc
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.vocabId + currentQuestion.type + queue.length}
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
                                    {currentQuestion.type === "word-to-meaning" && "Ý nghĩa của từ này là gì?"}
                                    {currentQuestion.type === "meaning-to-word" && "Từ vựng nào có nghĩa là:"}
                                    {currentQuestion.type === "word-to-reading" && "Cách đọc của từ này là gì?"}
                                </span>
                                <h2 className={cn(
                                    "font-black text-stone-900 leading-tight",
                                    currentQuestion.type === "meaning-to-word" ? "text-4xl md:text-6xl Vietnamese-Content" : "text-5xl md:text-8xl font-kanji"
                                )}>
                                    {currentQuestion.questionText}
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
                                            "relative p-6 rounded-[2rem] text-xl font-bold border-2 transition-all duration-200 text-left flex items-center justify-between group",
                                            !isAnswered
                                                ? "border-stone-100 hover:border-primary hover:bg-primary/5 text-stone-700"
                                                : option === selectedAnswer
                                                  ? option === currentQuestion.correctAnswer
                                                      ? "border-green-500 bg-green-50 text-green-700"
                                                      : "border-red-500 bg-red-50 text-red-700"
                                                  : "border-stone-100 text-stone-400",
                                        )}
                                    >
                                        <span className={cn(
                                            "font-bold",
                                            currentQuestion.type === "word-to-meaning" ? "text-xl Vietnamese-Content" : "text-3xl font-kanji"
                                        )}>
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

                            {/* Feedback message */}
                            <div className="min-h-[40px] flex items-center justify-center">
                                {isAnswered && selectedAnswer !== currentQuestion.correctAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full flex flex-col items-center gap-4"
                                    >
                                        <p className="text-red-500 font-bold Vietnamese-Content flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" /> Hãy chọn lại nhé!
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
                Mẹo: Chỉ các từ vựng chưa học (`isLearned = false`) mới xuất hiện trong Quiz.
            </p>
        </div>
    );
}

// Add this to handle pool length check in result screen
const poolLength = vocabularyData.filter((v) => !v.isLearned).length;

