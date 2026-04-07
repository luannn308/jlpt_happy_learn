"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressChartProps {
  learned: number;
  total: number;
}

export default function ProgressChart({ learned, total }: ProgressChartProps) {
  const percentage = (learned / total) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '150px', height: '150px' }}>
      <svg width="150" height="150" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="var(--stone-100)"
          strokeWidth="8"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="var(--success)"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      {/* Center Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>
          {learned}
        </div>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Đã thuộc
        </div>
      </div>
    </div>
  );
}
