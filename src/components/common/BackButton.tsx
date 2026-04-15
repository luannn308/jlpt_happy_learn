"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href?: string;
    label?: string;
    className?: string;
}

/**
 * BackButton Component
 * Một component điều hướng dùng chung được thiết kế theo phong cách Premium.
 * Mặc định điều hướng về trang chủ ("/").
 */
export default function BackButton({ 
    href = "/", 
    label = "Quay lại trang chủ", 
    className 
}: BackButtonProps) {
    return (
        <div className={cn("mb-8", className)}>
            <Link href={href}>
                <motion.div
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block"
                >
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="rounded-xl font-bold text-stone-500 hover:text-primary hover:bg-white flex items-center gap-2 transition-all px-4"
                    >
                        <ArrowLeft size={18} /> 
                        <span className="Vietnamese-Content">{label}</span>
                    </Button>
                </motion.div>
            </Link>
        </div>
    );
}
