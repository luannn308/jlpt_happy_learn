"use client";

import React from "react";
import { useFurigana } from "@/hooks/useFurigana";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FuriganaTextProps {
    text: string;
    className?: string;
    furiganaClassName?: string;
    showOriginalIfLoading?: boolean;
}

/**
 * Component hiển thị Kanji cùng với phiên âm nhỏ ngay bên dưới.
 * Tự động tạo phiên âm từ Kanji.
 */
export default function FuriganaText({ 
    text, 
    className, 
    furiganaClassName,
    showOriginalIfLoading = true 
}: FuriganaTextProps) {
    const { furigana, isLoading } = useFurigana(text);

    return (
        <div className={cn("flex flex-col", className)}>
            <span className="font-kanji">
                {text}
            </span>
            <AnimatePresence>
                {!isLoading && furigana && furigana !== text && (
                    <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "text-[0.6em] font-medium text-stone-400 font-kanji leading-tight mt-0.5",
                            furiganaClassName
                        )}
                    >
                        {furigana}
                    </motion.span>
                )}
            </AnimatePresence>
            {isLoading && !showOriginalIfLoading && (
                <div className="h-[1em] w-20 bg-stone-100 animate-pulse rounded mt-1" />
            )}
        </div>
    );
}
