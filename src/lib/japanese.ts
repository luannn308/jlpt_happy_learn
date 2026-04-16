// @ts-ignore
import Kuroshiro from "kuroshiro";
// @ts-ignore
import Analyzer from "kuroshiro-analyzer-kuromoji";

const romajiToHiraganaMap: { [key: string]: string } = {
    a: "あ",
    i: "い",
    u: "う",
    e: "え",
    o: "お",
    ka: "か",
    ki: "き",
    ku: "く",
    ke: "け",
    ko: "こ",
    sa: "さ",
    shi: "し",
    su: "す",
    se: "せ",
    so: "そ",
    ta: "た",
    chi: "ち",
    tsu: "つ",
    te: "て",
    to: "と",
    na: "な",
    ni: "に",
    nu: "ぬ",
    ne: "ね",
    no: "の",
    ha: "は",
    hi: "ひ",
    fu: "ふ",
    he: "へ",
    ho: "ほ",
    ma: "ま",
    mi: "み",
    mu: "む",
    me: "め",
    mo: "も",
    ya: "や",
    yu: "ゆ",
    yo: "よ",
    ra: "ら",
    ri: "り",
    ru: "る",
    re: "れ",
    ro: "ろ",
    wa: "わ",
    wo: "を",
    nn: "ん",
    ga: "が",
    gi: "ぎ",
    gu: "ぐ",
    ge: "げ",
    go: "ご",
    za: "ざ",
    ji: "じ",
    zu: "ず",
    ze: "ぜ",
    zo: "ぞ",
    da: "だ",
    di: "ぢ",
    du: "づ",
    de: "で",
    do: "ど",
    ba: "ば",
    bi: "び",
    bu: "ぶ",
    be: "べ",
    bo: "ぼ",
    pa: "ぱ",
    pi: "ぴ",
    pu: "ぷ",
    pe: "ぺ",
    po: "ぽ",
    kya: "きゃ",
    kyu: "きゅ",
    kyo: "きょ",
    sha: "しゃ",
    shu: "しゅ",
    sho: "しょ",
    cha: "ちゃ",
    chu: "ちゅ",
    cho: "ちょ",
    nya: "にゃ",
    nyu: "にゅ",
    nyo: "にょ",
    hya: "ひゃ",
    hyu: "ひゅ",
    hyo: "ひょ",
    mya: "みゃ",
    myu: "みゅ",
    myo: "みょ",
    rya: "りゃ",
    ryu: "りゅ",
    ryo: "りょ",
    gya: "ぎゃ",
    gyu: "ぎゅ",
    gyo: "ぎょ",
    ja: "じゃ",
    ju: "じゅ",
    jo: "じょ",
    bya: "びゃ",
    byu: "びゅ",
    byo: "びょ",
    pya: "ぴゃ",
    pyu: "ぴゅ",
    pyo: "ぴょ",
    tsa: "つぁ",
    tsi: "つぃ",
    tse: "つぇ",
    tso: "つぉ",
};

// Singleton instance for Kuroshiro
let kuroshiroInstance: any = null;
let isInitializing = false;

/**
 * Khởi tạo Kuroshiro với Kuromoji analyzer
 */
async function initKuroshiro() {
    if (kuroshiroInstance) return kuroshiroInstance;
    if (isInitializing) {
        // Đợi khởi tạo hoàn thành
        while (isInitializing) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return kuroshiroInstance;
    }

    isInitializing = true;
    try {
        const kuroshiro = new Kuroshiro();
        await kuroshiro.init(
            new Analyzer({
                dictPath: "/dict", // Path to the public/dict folder
            }),
        );
        kuroshiroInstance = kuroshiro;
        return kuroshiroInstance;
    } catch (error) {
        console.error("Failed to initialize Kuroshiro:", error);
        return null;
    } finally {
        isInitializing = false;
    }
}

/**
 * Chuyển đổi Kanji sang Hiragana (Furigana)
 * Sử dụng localStorage để cache kết quả
 */
export async function getFurigana(text: string): Promise<string> {
    if (!text) return "";

    // 1. Kiểm tra cache
    const cacheKey = `furigana_html_${text}`;
    if (typeof window !== "undefined") {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;
    }

    // 2. Chuyển đổi nếu chưa có trong cache
    try {
        const kuroshiro = await initKuroshiro();
        if (!kuroshiro) return text;

        const result = await kuroshiro.convert(text, {
            to: "hiragana",
            mode: "furigana",
        });

        // 3. Lưu vào cache
        if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, result);
        }

        return result;
    } catch (error) {
        console.error("Furigana conversion error:", error);
        return text;
    }
}

/**
 * Chuyển đổi Kanji sang Hiragana dạng trơn (phục vụ phát âm Audio)
 * Sử dụng localStorage để cache kết quả
 */
export async function getAudioText(text: string): Promise<string> {
    if (!text) return "";

    const cacheKey = `audio_hiragana_${text}`;
    if (typeof window !== "undefined") {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;
    }

    try {
        const kuroshiro = await initKuroshiro();
        if (!kuroshiro) return text;

        const result = await kuroshiro.convert(text, {
            to: "hiragana",
            mode: "normal",
        });

        if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, result);
        }

        return result;
    } catch (error) {
        console.error("Audio text conversion error:", error);
        return text;
    }
}

/**
 * A more robust Romaji to Hiragana converter for real-time typing.
 */
export function toHiragana(text: string): string {
    let result = "";
    let i = 0;
    const lowerText = text.toLowerCase();

    while (i < lowerText.length) {
        let found = false;

        // Try 3 characters
        if (i + 2 < lowerText.length) {
            const three = lowerText.substring(i, i + 3);
            if (romajiToHiraganaMap[three]) {
                result += romajiToHiraganaMap[three];
                i += 3;
                found = true;
            }
        }

        // Try 2 characters
        if (!found && i + 1 < lowerText.length) {
            const two = lowerText.substring(i, i + 2);
            if (romajiToHiraganaMap[two]) {
                result += romajiToHiraganaMap[two];
                i += 2;
                found = true;
            } else if (
                two[0] === two[1] && 
                two[0] >= "a" && two[0] <= "z" && 
                !["a", "i", "u", "e", "o", "n"].includes(two[0])
            ) {
                // Double consonant (っ)
                result += "っ";
                i += 1;
                found = true;
            } else if (two[0] === "n" && !["a", "i", "u", "e", "o", "y"].includes(two[1])) {
                // 'n' followed by a consonant (ex: 'nk') -> 'んk'
                result += "ん";
                i += 1;
                found = true;
            }
        }

        // Try 1 character
        if (!found) {
            const one = lowerText[i];
            const nextOne = lowerText[i + 1];

            if (one === "n") {
                if (nextOne === " ") {
                    result += "ん ";
                    i += 2;
                } else if (!nextOne) {
                    // Last character 'n' stays as 'n' until next char or space
                    result += "n";
                    i += 1;
                } else {
                    // Should be handled by 2-char logic if it was n+consonant
                    result += "n";
                    i += 1;
                }
                found = true;
            } else if (romajiToHiraganaMap[one]) {
                result += romajiToHiraganaMap[one];
                i += 1;
                found = true;
            } else {
                result += text[i];
                i += 1;
            }
        }
    }
    return result;
}

