import { KanjiData } from "@/data/kanji";
import { VocabularyItem } from "@/data/vocabulary";

// Gọi tới Proxy nội bộ thay vì gọi trực tiếp tới Google để tránh lỗi CORS
const GOOGLE_SHEETS_API_URL = "/api/data";

export interface JLPTDataResponse {
  kanji: KanjiData[];
  vocabulary: VocabularyItem[];
}

export async function fetchJLPTData(): Promise<JLPTDataResponse> {
  if (!GOOGLE_SHEETS_API_URL) {
    console.warn("Chưa cấu hình NEXT_PUBLIC_GOOGLE_SHEETS_URL. Sử dụng dữ liệu tĩnh làm fallback.");
    // Trả về dữ liệu tĩnh làm fallback nếu chưa có URL
    const { kanjiData } = await import("@/data/kanji");
    const { vocabularyData } = await import("@/data/vocabulary");
    return { kanji: kanjiData, vocabulary: vocabularyData };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu từ Google Sheets:", error);
    // Fallback về dữ liệu tĩnh nếu có lỗi mạng
    const { kanjiData } = await import("@/data/kanji");
    const { vocabularyData } = await import("@/data/vocabulary");
    return { kanji: kanjiData, vocabulary: vocabularyData };
  }
}
