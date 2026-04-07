"use client";

import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  learnedCount?: number;
  totalCount?: number;
  level?: string;
}

export default function Header({ 
  learnedCount = 0, 
  totalCount = 1000, 
  level = "JLPT N3" 
}: HeaderProps) {
  const progress = (learnedCount / totalCount) * 100;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 line-clamp-1">
              JLPT <span className="text-primary italic">Happy</span> Learn
            </h1>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Trình độ hiện tại
            </span>
            <Badge variant="outline" className="border-primary/30 text-primary font-bold px-2 py-0">
              {level}
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[120px] md:min-w-[180px]">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600">
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-primary" />
                <span>Hoàn thành</span>
              </div>
              <span className="text-primary font-mono">{learnedCount}/{totalCount}</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-stone-100" />
          </div>
        </div>
      </div>
    </header>
  );
}
