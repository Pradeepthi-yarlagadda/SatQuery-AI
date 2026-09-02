'use client';

import React, { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const numStars = 140;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.15 + 0.05,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.8 ? '#00f0ff' : Math.random() > 0.9 ? '#f97316' : '#ffffff',
    }));

    // Orbit satellite position
    let orbitAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space ambient glow
      const gradient = ctx.createRadialGradient(
        width * 0.7,
        height * 0.3,
        10,
        width * 0.7,
        height * 0.3,
        width * 0.6
      );
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.06)');
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)');
      gradient.addColorStop(1, 'rgba(4, 7, 18, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle orbital trajectory ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.6, width * 0.45, height * 0.25, -0.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.setLineDash([6, 12]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Render stars
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        star.alpha += Math.sin(Date.now() * star.pulseSpeed) * 0.01;
        const boundedAlpha = Math.max(0.1, Math.min(0.9, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = boundedAlpha;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // Render orbiting satellite beacon
      orbitAngle += 0.004;
      const satX = width * 0.5 + Math.cos(orbitAngle) * (width * 0.45);
      const satY = height * 0.6 + Math.sin(orbitAngle) * (height * 0.25);

      // Satellite glow & beacon
      ctx.beginPath();
      ctx.arc(satX, satY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pulse ring around satellite
      const pulseRadius = (Date.now() % 2000) / 100;
      ctx.beginPath();
      ctx.arc(satX, satY, pulseRadius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - pulseRadius / 20)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
