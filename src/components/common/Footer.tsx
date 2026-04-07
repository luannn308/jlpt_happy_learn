import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '5rem',
      padding: '2.5rem 0',
      borderTop: '1px solid var(--stone-200)',
      textAlign: 'center'
    }}>
      <div className="container">
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          Học Kanji qua trải nghiệm tương tác - Dự án JLPT Happy Learn
        </p>
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#cbd5e0'
        }}>
          <span>N5</span>
          <span>N4</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>N3</span>
          <span>N2</span>
          <span>N1</span>
        </div>
      </div>
    </footer>
  );
}
