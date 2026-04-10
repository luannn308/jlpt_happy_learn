import { useState, useEffect } from "react";
import { getFurigana } from "@/lib/japanese";

/**
 * Custom hook to convert Japanese text to Hiragana (Furigana)
 * Handles loading state and provides the converted text.
 */
export function useFurigana(text: string) {
    const [furigana, setFurigana] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        async function convert() {
            if (!text) {
                setFurigana("");
                return;
            }

            setIsLoading(true);
            try {
                const result = await getFurigana(text);
                if (isMounted) {
                    setFurigana(result);
                }
            } catch (error) {
                console.error("useFurigana conversion error:", error);
                if (isMounted) {
                    setFurigana(text); // Fallback to original text
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        convert();

        return () => {
            isMounted = false;
        };
    }, [text]);

    return { furigana, isLoading };
}
