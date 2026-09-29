'use client';

import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  extraScale?: number;
}

export default function ClickSpark({
  sparkSize = 10,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 450,
  extraScale = 1.2,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Palette strictly from globals.css design system tokens
    const schoolColors = [
      '#6c4298', // --primary
      '#f39c12', // --secondary
      '#ff4081', // --accent-pink
      '#4fc3f7', // --accent-blue
      '#8bc34a', // --accent-green
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleClick = (e: MouseEvent) => {
      const now = performance.now();
      const count = sparkCount;
      const angleStep = (Math.PI * 2) / count;

      for (let i = 0; i < count; i++) {
        const color = schoolColors[i % schoolColors.length];
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: i * angleStep + (Math.random() * 0.2 - 0.1),
          startTime: now,
          color,
        });
      }
    };

    window.addEventListener('click', handleClick);

    const draw = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = currentTime - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const distance = ease * sparkRadius * extraScale;
        const currentLength = sparkSize * (1 - progress);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + currentLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + currentLength) * Math.sin(spark.angle);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = spark.color;
        ctx.lineWidth = Math.max(1.5, 3 * (1 - progress));
        ctx.lineCap = 'round';
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleClick);
    };
  }, [duration, extraScale, sparkCount, sparkRadius, sparkSize]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ userSelect: 'none' }}
    />
  );
}
