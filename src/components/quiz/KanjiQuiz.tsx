"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useKanjiQuiz } from "./hooks/useKanjiQuiz";
import { QuizQuestionDisplay } from "./shared/QuizQuestionDisplay";
import { QuizOptionsGrid } from "./shared/QuizOptionsGrid";
import PracticeHeader from "./shared/PracticeHeader";
import PracticeFinished from "./shared/PracticeFinished";

const KANJI_QUESTION_LABELS: Record<string, string> = {
    "han-viet": "Tìm âm Hán Việt",
    face: "Tìm chữ Kanji tương ứng",
    "on-yomi": "Tìm cách đọc On-yomi",
    "kun-yomi": "Tìm cách đọc Kun-yomi",
    "vocab-reading": "Cách đọc của từ này là gì?",
    "vocab-meaning": "Nghĩa của từ này là gì?",
    reading: "Cách đọc nào là đúng?",
};

const QUIZ_MODES = [
    { id: "all", label: "Tất cả" },
    { id: "han-viet", label: "Âm Hán" },
    { id: "on-kun", label: "On/Kun" },
    { id: "vocab", label: "Từ vựng" },
];

export default function KanjiQuiz() {
    const {
        quizMode,
        setQuizMode,
        currentQuestion,
        score,
        isAnswered,
        selectedAnswer,
        quizFinished,
        completedCount,
        totalQuestions,
        showAll,
        setShowAll,
        isMuted,
        toggleMute,
        isLoading,
        handleAnswer,
        nextQuestion,
        startQuiz,
        queue,
    } = useKanjiQuiz();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-4 space-y-8">
                <div className="w-full h-8 bg-stone-100 rounded-full animate-pulse" />
                <div className="w-full h-[400px] bg-white rounded-[3rem] animate-pulse shadow-xl" />
            </div>
        );
    }

    if (quizFinished) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <PracticeFinished
                    score={score}
                    totalAttempted={totalQuestions}
                    onRetry={() => startQuiz()}
                    onReviewAll={() => setShowAll(true)}
                    title={totalQuestions === 0 ? "Tuyệt vời!" : "Hoàn thành bài trắc nghiệm!"}
                />
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 p-4 py-10">
            {/* Shared Header & Progress */}
            <PracticeHeader
                title="Trắc nghiệm Kanji N3"
                icon={<BrainCircuit size={14} />}
                modes={QUIZ_MODES}
                activeMode={quizMode}
                onModeChange={(mode) => {
                    setQuizMode(mode);
                    startQuiz(mode);
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
                    key={currentQuestion.kanjiId + currentQuestion.type + queue.length}
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
                                questionTypeLabels={KANJI_QUESTION_LABELS}
                            />

                            <QuizOptionsGrid
                                options={currentQuestion.options}
                                correctAnswer={currentQuestion.correctAnswer}
                                isAnswered={isAnswered}
                                selectedAnswer={selectedAnswer}
                                onAnswer={handleAnswer}
                                onNext={nextQuestion}
                                isKanjiOption={(opt) =>
                                    currentQuestion.type === "face" ||
                                    (currentQuestion.type !== "han-viet" &&
                                        currentQuestion.type !== "vocab-meaning" &&
                                        opt.length <= 4)
                                }
                            />
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

