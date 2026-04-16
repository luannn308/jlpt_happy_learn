/**
 * Audio Management Utility
 * Handles Japanese Text-to-Speech using multiple providers.
 */

let currentAudio: HTMLAudioElement | null = null;

import { getAudioText } from "./japanese";

/**
 * Play Japanese audio for a given text.
 * Prioritizes Web Speech API (System Voice) for stability and zero-latency.
 */
export const playJapaneseAudio = async (text: string, reading?: string) => {
    if (!text || typeof window === "undefined") return;

    // Ưu tiên sử dụng reading (phiên âm) nếu có để tránh lỗi biến âm (Rendaku)
    // Nếu không có reading (phần câu ví dụ), mới sử dụng kuroshiro để convert
    const hiraganaText = reading || (await getAudioText(text));

    // 1. Stop any currently playing audio
    stopAudio();

    // 2. Try Web Speech API (First priority for stability)
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(hiraganaText);
        utterance.lang = "ja-JP";
        utterance.rate = 0.9;
        
        // Find best Japanese voice
        const voices = window.speechSynthesis.getVoices();
        // Priority: 1. Enhanced/Premium voices, 2. Google Japanese, 3. Any ja-JP voice
        const jaVoice = 
            voices.find(v => (v.lang === "ja-JP" || v.lang === "ja_JP") && v.name.includes("Premium")) ||
            voices.find(v => (v.lang === "ja-JP" || v.lang === "ja_JP") && v.name.includes("Google")) ||
            voices.find(v => (v.lang === "ja-JP" || v.lang === "ja_JP"));
            
        if (jaVoice) {
            utterance.voice = jaVoice;
        }

        window.speechSynthesis.speak(utterance);
        return;
    }

    // 3. Fallback to Youdao API (Only if Web Speech is not available)
    try {
        const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
        currentAudio = new Audio(url);
        currentAudio.play().catch(e => console.error("Final fallback audio failed:", e));
    } catch (error) {
        console.error("All audio providers failed:", error);
    }
};

/**
 * Stop any ongoing audio playback (both System voice and Audio objects)
 */
export const stopAudio = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
};

