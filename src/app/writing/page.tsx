"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import KanjiWriting from "@/components/kanji/KanjiWriting";
import { motion } from "framer-motion";

export default function WritingPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900">
            <Header
                learnedCount={0}
                totalCount={0}
                level="JLPT N3 Kanji Practice"
            />

            <main className="container mx-auto px-4 max-w-7xl mt-24 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-10 space-y-2">
                        <h1 className="text-4xl font-black text-stone-900 Vietnamese-Content">Tự luận Kanji</h1>
                        <p className="text-stone-500 font-medium Vietnamese-Content">Luyện tập ghi nhớ sâu qua việc nhập liệu chính xác</p>
                    </div>

                    <KanjiWriting />
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
