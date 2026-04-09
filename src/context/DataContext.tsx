"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { KanjiData } from "@/data/kanji";
import { VocabularyItem } from "@/data/vocabulary";
import { fetchJLPTData } from "@/lib/google-sheets";

interface DataContextType {
  kanjiData: KanjiData[];
  vocabularyData: VocabularyItem[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateLearnedStatus: (type: "kanji" | "vocab", id: number, status: boolean) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [kanjiData, setKanjiData] = useState<KanjiData[]>([]);
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJLPTData();
      setKanjiData(data.kanji);
      setVocabularyData(data.vocabulary);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLearnedStatus = useCallback(async (type: "kanji" | "vocab", id: number, status: boolean) => {
    // 1. Cập nhật state local ngay lập tức (Optimistic Update)
    if (type === "kanji") {
      setKanjiData(prev => prev.map(item => item.id === id ? { ...item, isLearned: status } : item));
    } else {
      setVocabularyData(prev => prev.map(item => item.id === id ? { ...item, isLearned: status } : item));
    }

    // 2. Gọi API để cập nhật lên Sheets
    try {
      const response = await fetch('/api/data/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type, isLearned: status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update Google Sheets');
      }

      console.log(`Đã cập nhật ${type} ID ${id} lên Google Sheets: ${status}`);
      return true;
    } catch (err) {
      console.error("Lỗi đồng bộ Google Sheets:", err);
      // Có thể hiển thị một thông báo toast lỗi ở đây nếu có thư viện
      return false;
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DataContext.Provider
      value={{
        kanjiData,
        vocabularyData,
        isLoading,
        error,
        refreshData,
        updateLearnedStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
