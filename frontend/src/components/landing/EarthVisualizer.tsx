'use client';

import React, { useEffect, useRef } from 'react';

export default function EarthVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    const numStars = 160;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.85 ? '#67e8f9' : Math.random() > 0.92 ? '#fde047' : '#ffffff',
    }));

    // City Light Clusters (Night Earth)
    const numLights = 320;
    const cityLights = Array.from({ length: numLights }, () => {
      const u = Math.random();
      const v = Math.random();
      return {
        u, // relative u across continental landmass
        v,
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.7 ? '#ffd166' : Math.random() > 0.3 ? '#ffb703' : '#fb8500',
        pulse: Math.random() * 0.04 + 0.01,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Space Black Background
      ctx.fillStyle = '#030611';
      ctx.fillRect(0, 0, width, height);

      // 2. Distant Blue Nebula Dust
      const nebGrad = ctx.createRadialGradient(
        width * 0.8,
        height * 0.2,
        20,
        width * 0.8,
        height * 0.2,
        width * 0.6
      );
      nebGrad.addColorStop(0, 'rgba(14, 116, 144, 0.18)');
      nebGrad.addColorStop(0.4, 'rgba(59, 130, 246, 0.08)');
      nebGrad.addColorStop(1, 'rgba(3, 6, 17, 0)');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Stars
      stars.forEach((s) => {
        const flicker = Math.sin(time * 2 + s.x) * 0.2;
        const currentAlpha = Math.max(0.1, Math.min(1, s.alpha + flicker));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        if (s.size > 1.2) {
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // 4. Earth Curved Horizon
      // Center of Earth curvature is well below the bottom-left/center
      const earthCenterX = width * 0.35;
      const earthCenterY = height * 1.65;
      const earthRadius = height * 1.15;

      ctx.save();

      // Atmospheric Rim Glow Outer Shell
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius + 18, 0, Math.PI * 2);
      const atmosGrad = ctx.createRadialGradient(
        earthCenterX,
        earthCenterY,
        earthRadius - 15,
        earthCenterX,
        earthCenterY,
        earthRadius + 30
      );
      atmosGrad.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
      atmosGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
      atmosGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)');
      atmosGrad.addColorStop(0.8, 'rgba(3, 105, 161, 0.1)');
      atmosGrad.addColorStop(1, 'rgba(3, 6, 17, 0)');
      ctx.fillStyle = atmosGrad;
      ctx.fill();

      // Earth Dark Globe Base (Night side)
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.clip(); // Clip everything inside Earth disk

      // Deep dark blue / black oceanic surface
      const earthBodyGrad = ctx.createRadialGradient(
        earthCenterX,
        earthCenterY,
        earthRadius * 0.6,
        earthCenterX,
        earthCenterY,
        earthRadius
      );
      earthBodyGrad.addColorStop(0, '#02040a');
      earthBodyGrad.addColorStop(0.7, '#040918');
      earthBodyGrad.addColorStop(0.96, '#06132b');
      earthBodyGrad.addColorStop(1, '#0a2540');
      ctx.fillStyle = earthBodyGrad;
      ctx.fillRect(0, 0, width, height);

      // Night City Lights on Earth
      cityLights.forEach((city) => {
        // Map u, v into Earth curved surface region
        const angle = -0.6 + city.u * 1.3 + Math.sin(time * 0.05) * 0.01;
        const rad = earthRadius - 20 - city.v * (height * 0.55);

        const lx = earthCenterX + Math.cos(angle - Math.PI / 2) * rad;
        const ly = earthCenterY + Math.sin(angle - Math.PI / 2) * rad;

        if (ly > height * 0.38) {
          const p = Math.sin(time * 3 + city.u * 10) * 0.25;
          const a = Math.max(0.15, Math.min(1, city.alpha + p));

          ctx.beginPath();
          ctx.arc(lx, ly, city.size, 0, Math.PI * 2);
          ctx.fillStyle = city.color;
          ctx.globalAlpha = a;
          ctx.shadowColor = city.color;
          ctx.shadowBlur = city.size > 1.4 ? 8 : 4;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          // Connect nearby cities with faint golden web lines
          if (city.u > 0.4 && city.u < 0.7 && Math.random() > 0.985) {
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + (Math.random() - 0.5) * 35, ly + (Math.random() - 0.5) * 30);
            ctx.strokeStyle = 'rgba(255, 183, 3, 0.25)';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      // Subtle atmospheric edge sheen
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();

      // 5. High-Tech Satellite in Top-Right
      const satBaseX = width * 0.82 + (mouseX - width / 2) * 0.015;
      const satBaseY = height * 0.22 + Math.sin(time * 1.2) * 8 + (mouseY - height / 2) * 0.015;
      const satAngle = -0.35; // Tilted towards Earth

      ctx.save();
      ctx.translate(satBaseX, satBaseY);
      ctx.rotate(satAngle);

      // Satellite Lens Flare / Beacon Glow
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Central Satellite Bus/Body
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-18, -14, 36, 28, [4]);
      ctx.fill();
      ctx.stroke();

      // Golden MLI Thermal Foil on Body
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-12, -8, 24, 16);

      // Left Solar Panel Array
      ctx.fillStyle = '#0c4a6e';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-95, -20, 70, 40);
      ctx.fill();
      ctx.stroke();

      // Left Solar Grid Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      for (let gx = -95; gx <= -25; gx += 17.5) {
        ctx.beginPath();
        ctx.moveTo(gx, -20);
        ctx.lineTo(gx, 20);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-95, 0);
      ctx.lineTo(-25, 0);
      ctx.stroke();

      // Right Solar Panel Array
      ctx.fillStyle = '#0c4a6e';
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.rect(25, -20, 70, 40);
      ctx.fill();
      ctx.stroke();

      // Right Solar Grid Lines
      for (let gx = 25; gx <= 95; gx += 17.5) {
        ctx.beginPath();
        ctx.moveTo(gx, -20);
        ctx.lineTo(gx, 20);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(95, 0);
      ctx.stroke();

      // High-gain Antenna Dish
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 22, 14, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(0, 28);
      ctx.stroke();

      // Cyan Telemetry Pulse Ping
      const pingR = (time * 25) % 35;
      ctx.beginPath();
      ctx.arc(0, 0, pingR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - pingR / 35)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
