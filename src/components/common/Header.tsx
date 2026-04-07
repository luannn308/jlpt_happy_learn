"use client";

import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header style={{
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--stone-200)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--white)',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            JLPT <span style={{ color: 'var(--primary)' }}>Happy Learn</span> Mara
          </h1>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right', display: 'none' /* Show on md+ */ }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Trình độ hiện tại
            </span>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>JLPT N3</div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid var(--primary)'
            }}
          >
            <Award size={18} />
            <span>0 / 1000 Kanji</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
