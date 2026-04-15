export type KanjiQuestionType = "han-viet" | "reading" | "face" | "on-yomi" | "kun-yomi" | "vocab-reading" | "vocab-meaning";
export type KanjiQuizMode = "all" | "han-viet" | "on-kun" | "vocab";

export interface KanjiQuestion {
    kanjiId: number;
    type: KanjiQuestionType;
    questionText: string;
    correctAnswer: string;
    options: string[];
    reading?: string;
    han?: string;
}

export type VocabQuestionType = "word-to-meaning" | "meaning-to-word" | "word-to-reading";
export type VocabQuizMode = "all" | "meaning" | "reading";

export interface VocabQuestion {
    vocabId: number;
    type: VocabQuestionType;
    questionText: string;
    correctAnswer: string;
    options: string[];
    reading?: string;
    han?: string;
}
