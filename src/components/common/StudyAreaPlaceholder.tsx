"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Keyboard, Info } from "lucide-react";

interface StudyAreaPlaceholderProps {
    activeTab: string;
}

export default function StudyAreaPlaceholder({ activeTab }: StudyAreaPlaceholderProps) {
    return (
        <motion.div
            key="empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex flex-col items-center justify-center py-24 px-6 rounded-[3rem] border-2 border-dashed border-stone-200 bg-stone-50/30"
        >
            <div className="mb-8 p-6 bg-white rounded-full shadow-lg shadow-stone-200/50">
                <LayoutGrid className="h-16 w-16 text-stone-200" />
            </div>
            <h3 className="text-2xl font-bold text-stone-600 mb-2 Vietnamese-Content">
                Bạn muốn học {activeTab === "kanji" ? "chữ Kanji" : "từ vựng"} nào?
            </h3>
            <p className="text-stone-400 font-medium mb-8 Vietnamese-Content">
                Chọn một mục bên trên để bắt đầu khám phá chi tiết
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-stone-400 text-center">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest Vietnamese-Content">
                    <Keyboard size={16} /> Dùng phím mũi tên để chuyển nhanh
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest Vietnamese-Content">
                    <Info size={16} /> Click và giữ để xem nhanh nghĩa
                </div>
            </div>
        </motion.div>
    );
}
