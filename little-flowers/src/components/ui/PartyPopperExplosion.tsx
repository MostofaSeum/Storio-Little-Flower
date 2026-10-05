'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'ribbon';
}

export default function PartyPopperExplosion() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = [
      getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--accent-blue').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--accent-pink-hover').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--blob-yellow').trim(),
    ];

    const particles: Particle[] = [];
    const count = 120;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    // Spawn burst from bottom-center/middle like a popped party popper
    const originX = width / 2;
    const originY = height * 0.45;

    for (let i = 0; i < count; i++) {
      // 360-degree explosive burst with upward bias
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      const shapes: Array<'rect' | 'circle' | 'ribbon'> = ['rect', 'circle', 'ribbon'];

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (2 + Math.random() * 5), // Upward force
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    let startTime = performance.now();

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      for (const p of particles) {
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravity
        p.vx *= 0.985; // Air friction
        p.rotation += p.vRot;

        // Fade out gradually after 1.8 seconds
        if (now - startTime > 1200) {
          p.opacity -= 0.012;
        }

        if (p.opacity > 0) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          } else {
            // Ribbon shape
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size * 1.5, p.size / 2.5);
          }

          ctx.restore();
        }
      }

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 w-full h-full overflow-hidden print:hidden"
    />
  );
}
