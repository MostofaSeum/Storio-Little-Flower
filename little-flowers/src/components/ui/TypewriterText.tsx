'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorColor?: string;
}

export default function TypewriterText({
  text,
  speed = 75,
  delay = 200,
  className = '',
  cursorColor = 'var(--accent-pink)',
}: TypewriterTextProps) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayedCount(index);
        if (index >= text.length) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, text, speed, delay]);

  const visibleText = text.slice(0, displayedCount);
  const isTypingComplete = displayedCount >= text.length;

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {visibleText}
      <span
        className={`inline-block w-[3px] h-[0.85em] align-middle ml-1 rounded-sm ${
          isTypingComplete ? 'animate-pulse' : 'opacity-100'
        }`}
        style={{ backgroundColor: cursorColor }}
      />
    </span>
  );
}
