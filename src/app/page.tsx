"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, BookOpenCheck, Settings } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProgressChart from "@/components/kanji/ProgressChart";
import KanjiGrid from "@/components/kanji/KanjiGrid";
import KanjiDetail from "@/components/kanji/KanjiDetail";
import { kanjiData } from "@/data/kanji";

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [learned, setLearned] = useState<Set<number>>(new Set());
    const [masks, setMasks] = useState({ reading: false, meaning: false });

    // Load learned data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("jlpt_learned_kanji");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLearned(new Set(parsed));
            } catch (e) {
                console.error("Failed to parse learned kanji", e);
            }
        }
    }, []);

    // Save to localStorage whenever learned set changes
    useEffect(() => {
        localStorage.setItem("jlpt_learned_kanji", JSON.stringify(Array.from(learned)));
    }, [learned]);

    const selectKanji = useCallback((id: number) => {
        if (id < 0) id = 0;
        if (id >= kanjiData.length) id = kanjiData.length - 1;
        setCurrentIndex(id);

        // Auto scroll to detail area
        const detailElement = document.getElementById("studyArea");
        if (detailElement) {
            detailElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    const toggleLearned = useCallback(() => {
        if (currentIndex === null) return;
        setLearned((prev) => {
            const next = new Set(prev);
            if (next.has(currentIndex)) next.delete(currentIndex);
            else next.add(currentIndex);
            return next;
        });
    }, [currentIndex]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (currentIndex === null) return;
            if (e.key === "ArrowLeft") selectKanji(currentIndex - 1);
            if (e.key === "ArrowRight") selectKanji(currentIndex + 1);
        },
        [currentIndex, selectKanji],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />

            <main className="container section-padding" style={{ flexGrow: 1 }}>
                {/* Dashboard Section */}
                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1.5rem",
                        marginBottom: "3rem",
                    }}
                >
                    {/* Welcome Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{
                            gridColumn: "span 2",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            backgroundColor: "var(--white)",
                            padding: "2rem",
                            borderRadius: "24px",
                            border: "1px solid var(--stone-100)",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <Target size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Mục tiêu học tập N3</h2>
                        </div>
                        <p
                            style={{
                                color: "var(--text-dark)",
                                marginBottom: "1.5rem",
                                maxWidth: "600px",
                                fontSize: "1rem",
                            }}
                        >
                            Hôm nay bạn có <strong>10 chữ Kanji mới</strong> cần chinh phục. Mỗi chữ đều đi kèm phân
                            tích bộ thủ, câu chuyện gợi nhớ và từ vựng thực tế.
                        </p>
                        <div style={{ display: "flex", gap: "1.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span
                                    style={{
                                        fontSize: "0.625rem",
                                        fontWeight: 700,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Tổng số chữ
                                </span>
                                <span style={{ fontSize: "1.5rem", fontWeight: 900 }}>10</span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    borderLeft: "1px solid var(--stone-100)",
                                    paddingLeft: "1.5rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "0.625rem",
                                        fontWeight: 700,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Từ vựng đi kèm
                                </span>
                                <span style={{ fontSize: "1.5rem", fontWeight: 900 }}>31</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                        style={{
                            padding: "2rem",
                            borderRadius: "24px",
                            backgroundColor: "var(--white)",
                            border: "1px solid var(--stone-100)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <ProgressChart learned={learned.size} total={kanjiData.length} />
                    </motion.div>
                </section>

                {/* Kanji Selector Grid */}
                <section style={{ marginBottom: "4rem" }}>
                    <KanjiGrid data={kanjiData} currentIndex={currentIndex} learned={learned} onSelect={selectKanji} />
                </section>

                {/* Detailed Study Area */}
                <section
                    id="studyArea"
                    style={{ minHeight: "600px", scrollMarginTop: "calc(var(--header-height) + 2rem)" }}
                >
                    {currentIndex === null ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                backgroundColor: "var(--white)",
                                borderRadius: "32px",
                                padding: "5rem 2rem",
                                textAlign: "center",
                                border: "2px dashed var(--stone-200)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--text-muted)",
                            }}
                        >
                            <div style={{ fontSize: "4rem", opacity: 0.2, marginBottom: "1.5rem" }}>📖</div>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                Chọn một chữ Kanji bên trên để bắt đầu học
                            </h3>
                            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                                Sử dụng phím mũi tên để điều hướng nhanh hơn
                            </p>
                        </motion.div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        fontSize: "1.125rem",
                                    }}
                                >
                                    <Sparkles size={20} color="var(--primary)" />
                                    Học chi tiết chữ {kanjiData[currentIndex].kanji}
                                </h3>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button
                                        onClick={() => setMasks((prev) => ({ ...prev, reading: !prev.reading }))}
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            backgroundColor: "var(--stone-100)",
                                            padding: "0.5rem 0.75rem",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        {masks.reading ? "Hiện Cách Đọc" : "Ẩn Cách Đọc"}
                                    </button>
                                    <button
                                        onClick={() => setMasks((prev) => ({ ...prev, meaning: !prev.meaning }))}
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            backgroundColor: "var(--stone-100)",
                                            padding: "0.5rem 0.75rem",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        {masks.meaning ? "Hiện Nghĩa" : "Ẩn Nghĩa"}
                                    </button>
                                </div>
                            </div>

                            <KanjiDetail
                                data={kanjiData[currentIndex]}
                                currentIndex={currentIndex}
                                total={kanjiData.length}
                                isLearned={learned.has(currentIndex)}
                                masks={masks}
                                onToggleLearned={toggleLearned}
                                onNext={() => selectKanji(currentIndex + 1)}
                                onPrev={() => selectKanji(currentIndex - 1)}
                            />
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}

