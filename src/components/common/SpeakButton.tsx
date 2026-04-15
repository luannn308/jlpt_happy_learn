"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playJapaneseAudio } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SpeakButtonProps {
    text: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "icon";
    variant?: "ghost" | "outline" | "default" | "secondary";
}

/**
 * A reusable button for Japanese Text-to-Speech.
 * Uses the centralized Audio Manager for playback.
 */
export default function SpeakButton({
    text,
    className,
    size = "icon",
    variant = "ghost",
}: SpeakButtonProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = (e: React.MouseEvent) => {
        // Prevent event bubbling so we don't flip flashcards etc.
        e.stopPropagation(); 
        
        setIsSpeaking(true);
        playJapaneseAudio(text);
        
        // Use a timeout to simulate the pulse effect on the button
        // SpeechSynthesis 'end' event is inconsistent, so a timeout is better for UI consistency
        setTimeout(() => setIsSpeaking(false), 1500); 
    };

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="inline-block"
        >
            <Button
                variant={variant}
                size={size}
                onClick={handleSpeak}
                className={cn(
                    "rounded-full transition-all duration-300",
                    isSpeaking 
                        ? "text-primary bg-primary/10 ring-2 ring-primary/20" 
                        : "text-stone-400 hover:text-primary hover:bg-stone-50",
                    className
                )}
                title="Nghe phát âm"
                disabled={!text}
            >
                <Volume2 className={cn(
                    "transition-all",
                    size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
                    isSpeaking && "animate-pulse"
                )} />
            </Button>
        </motion.div>
    );
}
