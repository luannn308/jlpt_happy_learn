"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import KanjiWriting from "@/components/kanji/KanjiWriting";
import VocabWriting from "@/components/quiz/VocabWriting";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, BookOpen } from "lucide-react";

export default function WritingPage() {
    const [activeTab, setActiveTab] = useState("kanji");

    return (
        <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900">
            <Header
                learnedCount={0}
                totalCount={0}
                level="JLPT N3 Writing Practice"
            />

            <main className="container mx-auto px-4 max-w-7xl mt-24 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-10"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-stone-900 Vietnamese-Content">
                            {activeTab === "kanji" ? "Tự luận Kanji" : "Tự luận Từ vựng"}
                        </h1>
                        <p className="text-stone-500 font-medium Vietnamese-Content">
                            {activeTab === "kanji" 
                                ? "Luyện tập ghi nhớ sâu qua việc nhập liệu chính xác"
                                : "Nâng cao phản xạ từ vựng và cách đọc Hiragana"}
                        </p>
                    </div>

                    <Tabs defaultValue="kanji" className="w-full" onValueChange={setActiveTab}>
                        <div className="flex justify-center mb-8">
                            <TabsList className="bg-stone-100 p-1 h-14 rounded-2xl shadow-inner border border-stone-200">
                                <TabsTrigger 
                                    value="kanji" 
                                    className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm flex gap-2"
                                >
                                    <PenTool size={18} /> Kanji
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="vocab" 
                                    className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm flex gap-2"
                                >
                                    <BookOpen size={18} /> Từ vựng
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <TabsContent value="kanji" className="mt-0">
                            <KanjiWriting />
                        </TabsContent>
                        <TabsContent value="vocab" className="mt-0">
                            <VocabWriting />
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
