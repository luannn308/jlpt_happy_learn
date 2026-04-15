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

    if (isLoading && !showOriginalIfLoading) {
        return <div className="h-[1em] w-20 bg-stone-100 animate-pulse rounded mt-1" />;
    }

    // Nếu đang tải và muốn hiện text gốc, hoặc nếu không có furigana (lỗi), hiện text gốc
    if (isLoading || !furigana) {
        return (
            <span className={cn("font-kanji", className)}>
                {text}
            </span>
        );
    }

    return (
        <span 
            className={cn(
                "font-kanji inline-ruby", 
                className,
                // Định dạng cho các thẻ rt bên trong
                "[&_rt]:text-[0.5em] [&_rt]:text-stone-400 [&_rt]:font-medium [&_rt]:tracking-normal"
            )}
            dangerouslySetInnerHTML={{ __html: furigana }}
        />
    );
}
