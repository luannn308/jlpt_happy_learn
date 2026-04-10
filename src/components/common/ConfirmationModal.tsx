"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary";
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "primary",
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-stone-900/5"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Icon Wrapper */}
                            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
                                variant === "danger" ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"
                            }`}>
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="mb-2 text-xl font-black uppercase tracking-tighter text-stone-800">
                                {title}
                            </h3>
                            <p className="mb-8 text-sm font-medium leading-relaxed text-stone-500">
                                {description}
                            </p>

                            <div className="flex w-full gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    className="h-12 flex-1 rounded-2xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 border-none transition-all"
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`h-12 flex-1 rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${
                                        variant === "danger" 
                                            ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
                                            : "bg-primary hover:bg-primary/90 shadow-primary/20"
                                    }`}
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
