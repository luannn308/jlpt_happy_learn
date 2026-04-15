"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { VocabularyItem } from "@/data/vocabulary";

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
import { QuizQuestionDisplay } from "./shared/QuizQuestionDisplay";
import { QuizOptionsGrid } from "./shared/QuizOptionsGrid";
import PracticeHeader from "./shared/PracticeHeader";
import { playJapaneseAudio } from "@/lib/audio";

const VOCAB_MODES = [
    { id: "all", label: "Tất cả" },
    { id: "meaning", label: "Nghĩa" },
    { id: "reading", label: "Cách đọc" },
];

const VOCAB_QUESTION_LABELS: Record<string, string> = {
    "word-to-meaning": "Ý nghĩa của từ này là gì?",
    "meaning-to-word": "Từ vựng nào có nghĩa là:",
    "word-to-reading": "Cách đọc của từ này là gì?",
};

type VocabQuestionType = "word-to-meaning" | "meaning-to-word" | "word-to-reading";
type VocabQuizMode = "all" | "meaning" | "reading";

interface VocabQuestion {
    vocabId: number;
    type: VocabQuestionType;
    questionText: string;
    correctAnswer: string;
    options: string[];
    word: string; // Lưu từ vựng gốc để phát âm
    reading?: string; 
    han?: string; 
}

export default function VocabQuiz() {
    const { vocabularyData, isLoading } = useData();
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
    const [showAll, setShowAll] = useState(false);

    const poolLength = useMemo(() => {
        return showAll ? vocabularyData.length : vocabularyData.filter((v) => !v.isLearned).length;
    }, [vocabularyData, showAll]);

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

    const generateQuestion = useCallback(
        (vocab: VocabularyItem, type: VocabQuestionType): VocabQuestion => {
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
                word: vocab.word,
                reading: vocab.reading,
                han: vocab.han,
            };
        },
        [vocabularyData],
    );

    const startQuiz = useCallback(
        (mode: VocabQuizMode = quizMode) => {
            // Filter words based on showAll
            const pool = showAll ? vocabularyData : vocabularyData.filter((v) => !v.isLearned);

            console.log("[DEBUG] VocabQuiz Pool:", pool.length, "showAll:", showAll);

            // Reset states at the beginning
            setCompletedCount(0);
            setScore(0);
            setOriginalQuestions([]);
            setQueue([]);

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
            setQuizFinished(false);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setHasFailedCurrent(false);
            setCurrentQuestion(shuffledQuestions[0] || null);
        },
        [quizMode, showAll, vocabularyData, generateQuestion],
    );

    useEffect(() => {
        startQuiz();
    }, [startQuiz, showAll]);

    const handleAnswer = (answer: string) => {
        if (isAnswered || !currentQuestion) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === currentQuestion.correctAnswer) {
            playSFX("correct");
            // Đọc từ vựng khi trả lời đúng
            playJapaneseAudio(currentQuestion.word);
            
            if (!hasFailedCurrent) {
                setScore((prev) => prev + 1);
            }

            // Auto-next disabled by user request to allow reading furigana/han-viet
            // setTimeout(() => {
            //     nextQuestion();
            // }, 600);
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
                            Bạn đã học hết tất cả các từ vựng hiện có. <br />
                            Hãy quay lại sau hoặc ôn tập các từ đã học nhé!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => setShowAll(true)}
                                size="lg"
                                className="bg-primary text-white hover:bg-primary/90 rounded-2xl h-16 px-10 font-bold flex gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                            >
                                <RotateCcw size={20} /> Ôn tập lại ngay
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

        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-4 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full space-y-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                        <CheckCircle2 className="relative h-24 w-24 text-primary mx-auto" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-stone-900 Vietnamese-Content">
                            Hoàn thành Quiz Từ vựng!
                        </h2>
                        <p className="text-stone-500 font-medium Vietnamese-Content">
                            Bạn đã trả lời đúng {score}/{totalQuestions} câu hỏi.
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-4 space-y-8">
                <div className="w-full h-8 bg-stone-100 rounded-full animate-pulse" />
                <div className="w-full h-[400px] bg-white rounded-[3rem] animate-pulse shadow-xl" />
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 p-4 py-10">
            {/* Shared Header & Progress */}
            <PracticeHeader
                title="Trắc nghiệm Từ vựng N3"
                icon={<BrainCircuit size={14} />}
                modes={VOCAB_MODES}
                activeMode={quizMode}
                onModeChange={(mode) => {
                    const newMode = mode as VocabQuizMode;
                    setQuizMode(newMode);
                    startQuiz(newMode);
                }}
                currentIndex={completedCount}
                total={totalQuestions}
                showAll={showAll}
                onShowAllChange={setShowAll}
                isMuted={isMuted}
                onMuteToggle={toggleMute}
            />

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
                            <QuizQuestionDisplay
                                type={currentQuestion.type}
                                questionText={currentQuestion.questionText}
                                correctAnswer={currentQuestion.correctAnswer}
                                isAnswered={isAnswered}
                                selectedAnswer={selectedAnswer}
                                reading={currentQuestion.reading}
                                han={currentQuestion.han}
                                questionTypeLabels={VOCAB_QUESTION_LABELS}
                            />

                            <QuizOptionsGrid
                                options={currentQuestion.options}
                                correctAnswer={currentQuestion.correctAnswer}
                                isAnswered={isAnswered}
                                selectedAnswer={selectedAnswer}
                                onAnswer={handleAnswer}
                                onNext={nextQuestion}
                                isKanjiOption={(opt) => currentQuestion.type !== "word-to-meaning" && opt.length <= 6}
                            />
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
// Logic moved inside component or uses dynamic data

