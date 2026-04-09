"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FlashcardGame from "@/components/flashcards/FlashcardGame";
import { useData } from "@/context/DataContext";

import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FlashcardsPage() {
    const { kanjiData, vocabularyData, isLoading } = useData();

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-stone-900 selection:bg-primary/10 selection:text-primary">
            <Header 
              learnedCount={0} 
              totalCount={isLoading ? 0 : vocabularyData.length + kanjiData.length} 
              level="JLPT N3 - Ôn Tập" 
            />


            <main className="container mx-auto px-4 max-w-7xl mt-20 relative">
                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="rounded-xl font-bold text-stone-500 hover:text-primary hover:bg-white flex items-center gap-2">
                            <ArrowLeft size={18} /> Quay lại trang chủ
                        </Button>
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest"
                    >
                        <Sparkles size={14} /> Flashcard Learning
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
                        Ôn tập với Flashcard
                    </h1>
                    <p className="text-stone-500 max-w-2xl text-lg font-medium leading-relaxed">
                        Sử dụng thẻ flashcard để ghi nhớ từ vựng N3 một cách hiệu quả. Mỗi lần lật thẻ là một bước tiến gần hơn tới mục tiêu đỗ N3!
                    </p>
                </div>

                {/* Flashcard Component */}
                <FlashcardGame />
            </main>

            <Footer />
        </div>
    );
}
