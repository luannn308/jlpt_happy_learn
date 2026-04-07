"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KanjiData } from '@/data/kanji';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

interface KanjiDetailProps {
  data: KanjiData;
  currentIndex: number;
  total: number;
  isLearned: boolean;
  masks: { reading: boolean; meaning: boolean };
  onToggleLearned: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function KanjiDetail({
  data,
  currentIndex,
  total,
  isLearned,
  masks,
  onToggleLearned,
  onNext,
  onPrev
}: KanjiDetailProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="card"
        style={{
          border: '1px solid var(--stone-100)',
          overflow: 'hidden',
          padding: 0,
          background: 'var(--white)',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Main Area */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Left Column: The Kanji */}
            <div style={{
              flex: '1 1 300px',
              padding: '3rem',
              backgroundColor: 'var(--bg-warm)',
              borderRight: '1px solid var(--stone-100)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div
                className="kanji-font"
                style={{ fontSize: '9rem', fontWeight: 900, color: 'var(--text-dark)', lineHeight: 1 }}
              >
                {data.kanji}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '1rem', marginBottom: '1.5rem' }}>
                {data.han}
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--stone-200)' }}>
                  <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Âm On (Kun)</label>
                  <div className="kanji-font" style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{data.on}</div>
                </div>
                <div style={{ backgroundColor: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--stone-200)' }}>
                  <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Âm Kun (On)</label>
                  <div className="kanji-font" style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{data.kun}</div>
                </div>
              </div>

              <button
                onClick={onToggleLearned}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: isLearned ? '2px solid var(--success)' : '2px solid var(--stone-200)',
                  backgroundColor: isLearned ? 'rgba(16, 185, 129, 0.1)' : 'var(--white)',
                  color: isLearned ? 'var(--success)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {isLearned ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                <span>{isLearned ? 'Đã thuộc chữ này' : 'Đánh dấu đã thuộc'}</span>
              </button>
            </div>

            {/* Right Column: Details & Vocab */}
            <div style={{ flex: '2 1 400px', padding: '2.5rem' }}>
              {/* Components & Memory Story */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>
                  Cấu tạo & Ghi nhớ
                </h4>
                <div style={{ backgroundColor: 'var(--bg-warm)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--stone-100)', marginBottom: '1rem', color: 'var(--text-dark)' }}>
                  <p dangerouslySetInnerHTML={{ __html: data.components }}></p>
                </div>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '1.5rem', borderRadius: '16px', border: '1px dotted var(--primary)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '-10px', left: '20px', backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>CÂU CHUYỆN</span>
                  <p style={{ fontSize: '1.125rem', fontStyle: 'italic', color: 'var(--text-dark)' }}>{data.story}</p>
                </div>
              </div>

              {/* Vocabulary Grid */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>
                    Từ vựng N3 trọng tâm
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {data.vocab.map((v, i) => (
                    <div key={i} style={{ backgroundColor: 'var(--white)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--stone-100)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ borderBottom: '1px solid var(--stone-100)', pb: '0.5rem', mb: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="kanji-font" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{v.word}</span>
                        <span 
                          className={masks.reading ? 'hide-content' : ''}
                          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}
                          onClick={(e) => (e.currentTarget.classList.toggle('hide-content'))}
                        >
                          {v.reading}
                        </span>
                      </div>
                      <div 
                        className={masks.meaning ? 'hide-content' : ''}
                        style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-dark)' }}
                        onClick={(e) => (e.currentTarget.classList.toggle('hide-content'))}
                      >
                        {v.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div style={{ backgroundColor: 'var(--bg-warm)', padding: '1rem 2rem', borderTop: '1px solid var(--stone-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={onPrev}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.875rem' }}
            >
              <ChevronLeft size={20} /> Quay lại
            </button>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--stone-200)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              KANJI {currentIndex + 1} / {total}
            </div>
            <button 
              onClick={onNext}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.875rem' }}
            >
              Tiếp theo <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
