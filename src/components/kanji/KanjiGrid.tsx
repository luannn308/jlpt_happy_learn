"use client";

import React from "react";
import { motion } from "framer-motion";
import { KanjiData } from "@/data/kanji";

interface KanjiGridProps {
    data: KanjiData[];
    currentIndex: number | null;
    learned: Set<number>;
    onSelect: (id: number) => void;
}

export default function KanjiGrid({ data, currentIndex, learned, onSelect }: KanjiGridProps) {
    return (
        <section style={{ marginBottom: "2rem" }}>
            <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}
            >
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-dark)" }}>Danh sách 10 chữ mới</h3>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "0.75rem",
                }}
            >
                {data.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(item.id)}
                        className={`kanji-card ${currentIndex === item.id ? "active" : ""} ${learned.has(item.id) ? "learned" : ""}`}
                        style={{
                            aspectRatio: "1/1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "12px",
                        }}
                    >
                        <span className="kanji-font" style={{ fontSize: "3rem", fontWeight: 700 }}>
                            {item.kanji}
                        </span>
                        <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--text-muted)" }}>
                            {item.han}
                        </span>
                    </motion.button>
                ))}
            </div>
        </section>
    );
}

