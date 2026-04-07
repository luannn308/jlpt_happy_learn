import React from 'react';

const jlptLevels = ["N5", "N4", "N3", "N2", "N1"];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 py-10 bg-white/40">
      <div className="container px-4 text-center">
        <p className="text-sm font-medium text-stone-500">
          Học Kanji qua trải nghiệm tương tác - Dự án <span className="text-primary font-bold">JLPT Happy Learn</span>
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-xs font-semibold tracking-wider text-stone-300">
          {jlptLevels.map((level) => (
            <span 
              key={level} 
              className={level === "N3" ? "text-primary font-bold bg-primary/10 px-2 py-1 rounded" : ""}
            >
              {level}
            </span>
          ))}
        </div>
        <p className="mt-8 text-[10px] uppercase tracking-widest text-stone-300">
          © 2024 JLPT Happy Learn Mara. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
