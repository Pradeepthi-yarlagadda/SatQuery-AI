'use client';

import React, { useEffect, useRef } from 'react';

interface SpaceCanvasProps {
  scrollProgress: number; // 0 (top) to 1 (bottom)
}

export default function SpaceCanvas({ scrollProgress }: SpaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars collection
    const numStars = 200;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.85 ? '#67e8f9' : Math.random() > 0.9 ? '#c084fc' : '#ffffff',
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      const progress = scrollRef.current;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Space Black-Navy Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#02050e');
      bgGrad.addColorStop(0.6, '#030712');
      bgGrad.addColorStop(1, '#02040b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Distant Cyan & Indigo Ambient Aura
      const auraGrad = ctx.createRadialGradient(
        width * 0.75 - progress * (width * 0.3),
        height * 0.35 + progress * (height * 0.2),
        20,
        width * 0.75 - progress * (width * 0.3),
        height * 0.35 + progress * (height * 0.2),
        width * 0.65
      );
      auraGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
      auraGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.06)');
      auraGrad.addColorStop(1, 'rgba(2, 5, 14, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Stars with parallax
      stars.forEach((s) => {
        const py = (s.y - progress * 150 + height) % height;
        const currentAlpha = Math.max(0.1, Math.min(1, s.alpha + Math.sin(time * 2 + s.x) * 0.2));

        ctx.beginPath();
        ctx.arc(s.x, py, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        if (s.size > 1.2) {
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // 4. Earth Curved Horizon (Moves seamlessly with scroll)
      // As scroll progress goes from 0 -> 1, Earth scales and descends smoothly into satellite data
      const earthCenterX = width * 0.45 - progress * (width * 0.15);
      const earthCenterY = height * 1.55 + progress * (height * 0.4);
      const earthRadius = height * 1.1 + progress * (height * 0.3);

      ctx.save();

      // Atmospheric Glowing Shell
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius + 22, 0, Math.PI * 2);
      const atmosGrad = ctx.createRadialGradient(
        earthCenterX,
        earthCenterY,
        earthRadius - 20,
        earthCenterX,
        earthCenterY,
        earthRadius + 35
      );
      atmosGrad.addColorStop(0, 'rgba(0, 240, 255, 0.75)');
      atmosGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.4)');
      atmosGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.15)');
      atmosGrad.addColorStop(1, 'rgba(2, 5, 14, 0)');
      ctx.fillStyle = atmosGrad;
      ctx.fill();

      // Earth Dark Body
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.clip();

      const earthGrad = ctx.createRadialGradient(
        earthCenterX,
        earthCenterY,
        earthRadius * 0.5,
        earthCenterX,
        earthCenterY,
        earthRadius
      );
      earthGrad.addColorStop(0, '#02040a');
      earthGrad.addColorStop(0.75, '#050c1e');
      earthGrad.addColorStop(0.97, '#071630');
      earthGrad.addColorStop(1, '#0e2b4f');
      ctx.fillStyle = earthGrad;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Rim Highlight
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();

      // 5. Orbiting Satellite Beacon in Top-Right
      const satX = width * 0.82 - progress * (width * 0.1) + Math.cos(time * 0.5) * 6;
      const satY = height * 0.22 + progress * (height * 0.15) + Math.sin(time * 0.6) * 6;

      ctx.save();
      ctx.translate(satX, satY);
      ctx.rotate(-0.35);

      // Satellite Lens Flare
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Central Body
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -12, 32, 24, [3]);
      ctx.fill();
      ctx.stroke();

      // Solar Panels
      ctx.fillStyle = '#0c4a6e';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-80, -18, 60, 36);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(20, -18, 60, 36);
      ctx.fill();
      ctx.stroke();

      // Telemetry Ping
      const pingR = (time * 20) % 30;
      ctx.beginPath();
      ctx.arc(0, 0, pingR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - pingR / 30)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
