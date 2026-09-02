'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnalysisScenario, LayerState } from '@/types/satellite';
import { ZoomIn, ZoomOut, RotateCcw, Split, MapPin, Crosshair } from 'lucide-react';

interface SatelliteCanvasProps {
  scenario: AnalysisScenario;
  activeTab: 'map' | 'split' | 'change' | 'sar_fusion' | 'grounding';
  layers: LayerState;
  splitPosition?: number;
  onSplitPositionChange?: (pos: number) => void;
  highlightCoordinates?: boolean;
}

export default function ProceduralSatelliteCanvas({
  scenario,
  activeTab,
  layers,
  splitPosition = 50,
  onSplitPositionChange,
}: SatelliteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorGeo, setCursorGeo] = useState({ lat: 12.934, lon: 77.742 });
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [internalSplit, setInternalSplit] = useState(splitPosition);

  // Loaded Real Satellite Image References
  const imgMapRef = useRef<HTMLImageElement | null>(null);
  const img2022Ref = useRef<HTMLImageElement | null>(null);
  const img2026Ref = useRef<HTMLImageElement | null>(null);
  const imgChangeRef = useRef<HTMLImageElement | null>(null);
  const imgOpticalRef = useRef<HTMLImageElement | null>(null);
  const imgSarRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let count = 0;
    const total = 6;
    const checkLoaded = () => {
      count++;
      if (count >= 3) setImagesLoaded(true);
    };

    const imgMap = new Image();
    imgMap.src = '/images/scenarios/satellite_main_map.jpg';
    imgMap.onload = checkLoaded;
    imgMapRef.current = imgMap;

    const img2022 = new Image();
    img2022.src = '/images/scenarios/bangalore_2022.jpg';
    img2022.onload = checkLoaded;
    img2022Ref.current = img2022;

    const img2026 = new Image();
    img2026.src = '/images/scenarios/bangalore_2026.jpg';
    img2026.onload = checkLoaded;
    img2026Ref.current = img2026;

    const imgChange = new Image();
    imgChange.src = '/images/scenarios/change_map_real.jpg';
    imgChange.onload = checkLoaded;
    imgChangeRef.current = imgChange;

    const imgOptical = new Image();
    imgOptical.src = '/images/scenarios/optical_real.jpg';
    imgOptical.onload = checkLoaded;
    imgOpticalRef.current = imgOptical;

    const imgSar = new Image();
    imgSar.src = '/images/scenarios/sar_real.jpg';
    imgSar.onload = checkLoaded;
    imgSarRef.current = imgSar;
  }, []);

  const currentSplit = onSplitPositionChange ? splitPosition : internalSplit;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.7));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSliderDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(10, Math.min(rect.width - 10, e.clientX - rect.left));
      const percentage = Math.round((x / rect.width) * 100);
      if (onSplitPositionChange) {
        onSplitPositionChange(percentage);
      } else {
        setInternalSplit(percentage);
      }
      return;
    }

    if (isDragging) {
      setPan({
        x: pan.x + (e.clientX - dragStart.x),
        y: pan.y + (e.clientY - dragStart.y),
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      const baseLat = 12.93 + (1 - relY) * 0.05;
      const baseLon = 77.72 + relX * 0.06;
      setCursorGeo({
        lat: parseFloat(baseLat.toFixed(4)),
        lon: parseFloat(baseLon.toFixed(4)),
      });
    }
  };

  // Main Canvas Render
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Pan & Zoom
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const isTemporal = scenario.mode === 'temporal';
    const isGrounding = scenario.mode === 'grounding' || activeTab === 'grounding';
    const isOpticalSar = scenario.mode === 'optical_sar' || activeTab === 'sar_fusion';

    // Helper: Draw Satellite Image
    const drawRealSatelliteImage = (img: HTMLImageElement | null, opacity = 1) => {
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.globalAlpha = 1;
      } else {
        // Fallback dark satellite tone
        ctx.fillStyle = '#10211a';
        ctx.fillRect(0, 0, width, height);
      }
    };

    if (activeTab === 'split' && isTemporal) {
      // 1. Draw Left (2022 Before)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, (width * currentSplit) / 100, height);
      ctx.clip();
      drawRealSatelliteImage(img2022Ref.current || imgMapRef.current);
      ctx.restore();

      // 2. Draw Right (2026 After)
      ctx.save();
      ctx.beginPath();
      ctx.rect((width * currentSplit) / 100, 0, width - (width * currentSplit) / 100, height);
      ctx.clip();
      drawRealSatelliteImage(img2026Ref.current || imgMapRef.current);
      ctx.restore();
    } else if (activeTab === 'change' || (activeTab === 'map' && layers.changeRegions && isTemporal)) {
      // Base Image
      drawRealSatelliteImage(img2026Ref.current || imgMapRef.current);

      // Real Change Map Overlay
      if (imgChangeRef.current && imgChangeRef.current.complete) {
        ctx.globalAlpha = 0.75;
        ctx.drawImage(imgChangeRef.current, width * 0.45, height * 0.2, width * 0.45, height * 0.6);
        ctx.globalAlpha = 1;
      } else {
        // Vector Highlight overlay
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(width * 0.48, height * 0.2, width * 0.38, height * 0.55, [8]);
        ctx.fill();
        ctx.stroke();
      }
    } else if (activeTab === 'sar_fusion' || (isOpticalSar && layers.sarBackscatter)) {
      // Real SAR Radar Backscatter Tile
      drawRealSatelliteImage(imgSarRef.current || imgMapRef.current);
    } else if (isOpticalSar) {
      // Real Optical Tile
      drawRealSatelliteImage(imgOpticalRef.current || imgMapRef.current);
    } else {
      // Real Satellite Scene Map
      drawRealSatelliteImage(imgMapRef.current);
    }

    // Draw Grounding Polygon / Bounding Box (Option 2 style)
    if ((isGrounding || layers.builtUpAreas || layers.waterBodies) && scenario.groundingBox) {
      const gb = scenario.groundingBox;
      const gx = (width * gb.x) / 100;
      const gy = (height * gb.y) / 100;
      const gw = (width * gb.width) / 100;
      const gh = (height * gb.height) / 100;

      // Realistic dashed glowing cyan polygon boundary
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      // Draw polygon vertices resembling real region
      ctx.moveTo(gx + 20, gy);
      ctx.lineTo(gx + gw - 30, gy + 10);
      ctx.lineTo(gx + gw, gy + 40);
      ctx.lineTo(gx + gw - 15, gy + gh);
      ctx.lineTo(gx + 30, gy + gh - 10);
      ctx.lineTo(gx, gy + gh - 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Tooltip Label Pill
      ctx.fillStyle = 'rgba(6, 14, 34, 0.9)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      const pillW = 160;
      const pillH = 26;
      ctx.beginPath();
      ctx.roundRect(gx + gw / 2 - pillW / 2, gy - 32, pillW, pillH, [6]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(gb.label, gx + gw / 2 - pillW / 2 + 10, gy - 15);
      ctx.fillStyle = '#00f0ff';
      ctx.font = '10px monospace';
      ctx.fillText(`Confidence: ${(gb.confidence * 100).toFixed(0)}%`, gx + gw / 2 - pillW / 2 + 10, gy - 4);
    }

    // Center Crosshair
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 10, height / 2);
    ctx.lineTo(width / 2 + 10, height / 2);
    ctx.moveTo(width / 2, height / 2 - 10);
    ctx.lineTo(width / 2, height / 2 + 10);
    ctx.stroke();

    ctx.restore();
  }, [scenario, activeTab, layers, currentSplit, zoom, pan, imagesLoaded]);

  useEffect(() => {
    renderCanvas();
    const handleResize = () => renderCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] bg-[#030712] rounded-2xl overflow-hidden border border-space-border select-none shadow-2xl"
      onMouseDown={(e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={() => {
        setIsDragging(false);
        setIsSliderDragging(false);
      }}
      onMouseLeave={() => {
        setIsDragging(false);
        setIsSliderDragging(false);
      }}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* Split Divider */}
      {activeTab === 'split' && (
        <>
          <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-30 shadow-neon-cyan flex items-center justify-center"
            style={{ left: `${currentSplit}%` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsSliderDragging(true);
            }}
          >
            <div className="w-7 h-7 rounded-full bg-space-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
              <Split className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded bg-black/80 border border-white/20 text-[10px] font-mono text-white backdrop-blur-md">
            2022 · BEFORE
          </div>
          <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded bg-black/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-400 backdrop-blur-md">
            2026 · AFTER
          </div>
        </>
      )}

      {/* Top Floating Telemetry */}
      {activeTab !== 'split' && (
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/80 border border-space-border backdrop-blur-md text-[11px] font-mono text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white">{scenario.locationName}</span>
          <span className="text-gray-400">|</span>
          <span className="text-cyan-400">{scenario.coordinates}</span>
        </div>
      )}

      {/* Bottom Floating Telemetry */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-3 pointer-events-none">
        <div className="flex items-center space-x-2 px-3 py-1 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-gray-400 backdrop-blur-md">
          <Crosshair className="w-3 h-3 text-cyan-400" />
          <span>LAT: {cursorGeo.lat}°N</span>
          <span>LON: {cursorGeo.lon}°E</span>
          <span className="text-cyan-400 font-semibold">GSD: 10.0m</span>
          <span className="text-gray-400">CRS: EPSG:4326</span>
        </div>
      </div>

      {/* Zoom / Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 p-1 rounded-xl bg-black/80 border border-space-border backdrop-blur-md shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-space-850 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-space-850 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset View"
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-space-850 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
