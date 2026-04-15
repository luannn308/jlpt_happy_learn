"use client";

import { useState, useEffect, useCallback } from "react";
import { KanjiData } from "@/data/kanji";
import { useData } from "@/context/DataContext";
import { KanjiQuestion, KanjiQuizMode, KanjiQuestionType } from "../types";

export function useKanjiQuiz() {
    const { kanjiData, isLoading } = useData();
    const [quizMode, setQuizMode] = useState<KanjiQuizMode>("all");

    const [originalQuestions, setOriginalQuestions] = useState<KanjiQuestion[]>([]);
    const [queue, setQueue] = useState<KanjiQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<KanjiQuestion | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [hasFailedCurrent, setHasFailedCurrent] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Audio Context Utility
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

    // Parse radicals for distractors
    const getRadicals = (components: string) => {
        const matches = components.match(/<strong>(.*?)<\/strong>/g);
        if (!matches) return [];
        return matches.map((m) => m.replace(/<\/?strong>/g, ""));
    };

    const generateQuestion = useCallback(
        (kanji: KanjiData, type: KanjiQuestionType): KanjiQuestion => {
            let questionText = "";
            let correctAnswer = "";
            let options: string[] = [];

            const radicals = getRadicals(kanji.component);

            const findDistractors = (field: keyof KanjiData, count: number) => {
                let similar = kanjiData.filter(
                    (k) => k.id !== kanji.id && getRadicals(k.component).some((r) => radicals.includes(r)),
                );

                if (similar.length < count) {
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
                han:
                    type === "vocab-reading" || type === "vocab-meaning"
                        ? kanji.vocab.find((v) => v.word === questionText)?.meaning || ""
                        : kanji.han,
            };
        },
        [kanjiData],
    );

    const startQuiz = useCallback(
        (mode: KanjiQuizMode = quizMode) => {
            const pool = showAll ? kanjiData : kanjiData.filter((k) => !k.isLearned);

            setCompletedCount(0);
            setScore(0);
            setOriginalQuestions([]);
            setQueue([]);

            if (pool.length === 0) {
                setQuizFinished(true);
                return;
            }

            const selectedKanji = [...pool].sort(() => Math.random() - 0.5);

            const newQuestions: KanjiQuestion[] = [];

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

                if (mode === "all" && !newQuestions.find((q) => q.kanjiId === k.id && q.type === "reading")) {
                    newQuestions.push(generateQuestion(k, "reading"));
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
        [quizMode, showAll, kanjiData, generateQuestion],
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
            if (!hasFailedCurrent) {
                setScore((prev) => prev + 1);
            }
        } else {
            playSFX("wrong");
            setHasFailedCurrent(true);

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

    return {
        quizMode,
        setQuizMode,
        currentQuestion,
        score,
        isAnswered,
        selectedAnswer,
        quizFinished,
        completedCount,
        totalQuestions: originalQuestions.length,
        progress: originalQuestions.length > 0 ? (completedCount / originalQuestions.length) * 100 : 0,
        isMuted,
        toggleMute,
        showAll,
        setShowAll,
        isLoading,
        handleAnswer,
        nextQuestion,
        startQuiz,
        queue,
    };
}

