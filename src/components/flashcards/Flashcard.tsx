"use client";

import React from "react";
import { motion } from "framer-motion";
import { VocabularyItem } from "@/data/vocabulary";
import { KanjiData } from "@/data/kanji";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FuriganaText from "@/components/common/FuriganaText";

interface FlashcardProps {
    data: VocabularyItem | KanjiData;
    isFlipped: boolean;
    onFlip: () => void;
    mode: "vocab" | "kanji";
}

export default function Flashcard({ data, isFlipped, onFlip, mode }: FlashcardProps) {
    const isKanji = (item: any): item is KanjiData => "kanji" in item;
    const isVocab = (item: any): item is VocabularyItem => "word" in item;

    const displayWord = isKanji(data) ? data.kanji : data.word;
    const displayHan = data.han;
    const category = isKanji(data) ? "Hán tự" : data.category || "Từ vựng";

    const handleSpeak = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
        const audio = new Audio(url);
        audio.play();
    };

    return (
        <div className="group relative h-[450px] w-full max-w-[400px] cursor-pointer perspective-1000" onClick={onFlip}>
            <motion.div
                className="relative h-full w-full preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    type: "tween",
                    duration: 0.3,
                    ease: "easeInOut",
                }}
            >
                {/* Front Side */}
                <Card className="absolute inset-0 backface-hidden border-2 border-stone-100 bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 flex flex-col items-center justify-center p-8 text-center overscroll-none">
                    <div className="absolute top-6 right-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-primary/10 text-stone-300 hover:text-primary transition-colors h-12 w-12"
                            onClick={(e) => handleSpeak(displayWord, e)}
                        >
                            <Volume2 className="h-6 w-6" />
                        </Button>
                    </div>

                    <Badge
                        variant="outline"
                        className="mb-6 border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    >
                        {category}
                    </Badge>

                    <h1
                        className={cn(
                            "font-kanji font-black text-stone-900 leading-tight",
                            isKanji(data) ? "text-9xl" : "text-8xl",
                        )}
                    >
                        {displayWord}
                    </h1>

                    <div className="mt-8 text-stone-400 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Chạm để lật thẻ
                    </div>
                </Card>

                {/* Back Side */}
                <Card className="absolute inset-0 backface-hidden border-2 border-primary/20 bg-stone-50 rounded-[2.5rem] shadow-xl shadow-primary/10 flex flex-col p-8 text-left rotate-y-180 overflow-y-auto">
                    <div className="flex-1 space-y-5">
                        {isVocab(data) ? (
                            /* Vocabulary Back Side */
                            <div className="space-y-5">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                        Ý nghĩa
                                    </span>
                                    <h2 className="text-3xl font-black text-primary leading-tight Vietnamese-Content">
                                        {data.meaning}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            Cách đọc
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-bold text-stone-700 font-kanji">
                                                {data.reading}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-primary/10 text-stone-300 hover:text-primary"
                                                onClick={(e) => handleSpeak(data.reading, e)}
                                            ></Button>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            Hán tự
                                        </span>
                                        <p className="text-xl font-bold text-stone-700 uppercase">{data.han}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Kanji Back Side */
                            <div className="space-y-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                            Hán tự
                                        </span>
                                        <h2 className="text-3xl font-black text-primary uppercase">{displayHan}</h2>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            ID
                                        </span>
                                        <p className="text-sm font-bold text-stone-400">#{data.id}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            Âm ON
                                        </span>
                                        <p className="text-lg font-bold text-stone-700 font-kanji">{data.on}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                            Âm KUN
                                        </span>
                                        <p className="text-lg font-bold text-stone-700 font-kanji">{data.kun}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 mt-auto border-t border-stone-200/50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                Ví dụ minh họa
                            </span>
                            {isVocab(data) ? (
                                <>
                                    <div className="flex items-start gap-2 mt-1">
                                        <div className="flex-1">
                                            <FuriganaText 
                                                text={data.example} 
                                                className="text-lg font-bold text-stone-700 leading-relaxed"
                                                furiganaClassName="text-xs"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-primary/10 text-stone-300 hover:text-primary shrink-0"
                                            onClick={(e) => handleSpeak(data.example, e)}
                                        ></Button>
                                    </div>
                                    <p className="text-sm font-medium italic text-stone-500 Vietnamese-Content mt-1">
                                        "{data.exampleMeaning}"
                                    </p>
                                </>
                            ) : (
                                <div className="mt-1 space-y-2">
                                    {data.vocab.slice(0, 2).map((v, i) => (
                                        <div key={i} className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-stone-700 font-kanji">
                                                    {v.word} ({v.reading})
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-full hover:bg-primary/10 text-stone-300 hover:text-primary"
                                                    onClick={(e) => handleSpeak(v.word, e)}
                                                >
                                                    <Volume2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <span className="text-sm text-stone-500 Vietnamese-Content">
                                                {v.meaning}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

