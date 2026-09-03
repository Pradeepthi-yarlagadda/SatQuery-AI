'use client';

import React, { useState } from 'react';
import { VisualEvidence } from '@/types/evidence';
import { Layers, Sliders, Eye, EyeOff, Maximize2 } from 'lucide-react';

interface VisualEvidenceViewerProps {
  evidence: VisualEvidence;
}

export default function VisualEvidenceViewer({ evidence }: VisualEvidenceViewerProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // For before/after slider
  const [showMasks, setShowMasks] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);

  const hasCompare = !!evidence.compareImageUrl;
  const isTemporalOrFusion = evidence.type === 'change_map' || evidence.type === 'optical_sar_fusion';

  return (
    <div className="rounded-2xl border border-glass-border bg-[#050814]/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      
      {/* Evidence Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-glass-border pb-3">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">
            Visual Evidence
          </div>
          <h4 className="text-sm font-bold text-white">
            {evidence.title}
          </h4>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center gap-2">
          {evidence.masks && evidence.masks.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMasks(!showMasks)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
                showMasks
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                  : 'border-glass-border bg-white/[0.02] text-gray-400'
              }`}
            >
              {showMasks ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>Masks ({evidence.masks.length})</span>
            </button>
          )}

          {evidence.boundingBoxes && evidence.boundingBoxes.length > 0 && (
            <button
              type="button"
              onClick={() => setShowBoxes(!showBoxes)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
                showBoxes
                  ? 'border-purple-400/40 bg-purple-400/10 text-purple-300'
                  : 'border-glass-border bg-white/[0.02] text-gray-400'
              }`}
            >
              {showBoxes ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>Boxes ({evidence.boundingBoxes.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Canvas Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-glass-border bg-space select-none">
        
        {/* Base Image */}
        {evidence.baseImageUrl && (
          <img
            src={evidence.baseImageUrl}
            alt="Base Remote Sensing Observation"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        {/* Bi-Temporal / Optical-SAR Comparison Slider Layer */}
        {hasCompare && evidence.compareImageUrl && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <img
              src={evidence.compareImageUrl}
              alt="Comparison Observation (T2 / SAR)"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute top-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-purple-300 backdrop-blur-sm border border-purple-500/30">
              {evidence.type === 'optical_sar_fusion' ? 'SAR Sentinel-1 (C-Band)' : 'Observation T2 (2026)'}
            </div>
          </div>
        )}

        {/* Base Image Label */}
        {hasCompare && (
          <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-cyan-300 backdrop-blur-sm border border-cyan-500/30 pointer-events-none">
            {evidence.type === 'optical_sar_fusion' ? 'Optical Multi-Spectral (Sentinel-2)' : 'Observation T1 (2022)'}
          </div>
        )}

        {/* SVG Overlays for Masks & Bounding Boxes */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Polygons / Masks */}
          {showMasks &&
            evidence.masks?.map((mask) => (
              <polygon
                key={mask.id}
                points={mask.coordinates.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                fill={mask.fillColor}
                fillOpacity={mask.opacity}
                stroke={mask.strokeColor}
                strokeWidth="0.8"
                className="transition-all duration-300"
              />
            ))}

          {/* Bounding Boxes */}
          {showBoxes &&
            evidence.boundingBoxes?.map((box) => (
              <rect
                key={box.id}
                x={`${box.xmin * 100}%`}
                y={`${box.ymin * 100}%`}
                width={`${(box.xmax - box.xmin) * 100}%`}
                height={`${(box.ymax - box.ymin) * 100}%`}
                fill="none"
                stroke={box.color || '#8b5cf6'}
                strokeWidth="0.8"
                strokeDasharray="2, 1"
              />
            ))}
        </svg>

        {/* Comparison Split Divider Line */}
        {hasCompare && (
          <>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#050814] border border-white text-white shadow-xl">
                <Sliders size={12} />
              </div>
            </div>

            {/* Range Input for Split Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Comparison split slider"
              className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize z-20"
            />
          </>
        )}

      </div>

      {/* Description & Categorical Metrics */}
      <div className="space-y-2 text-xs font-mono text-gray-300">
        <p className="leading-relaxed text-gray-300">
          {evidence.description}
        </p>

        {/* Change Categories Legend (if present) */}
        {evidence.changeCategories && evidence.changeCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {evidence.changeCategories.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center gap-2 rounded-lg border border-glass-border bg-white/[0.02] p-2"
              >
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate text-[11px]">
                    {cat.label} ({cat.deltaPercentage > 0 ? `+${cat.deltaPercentage}%` : `${cat.deltaPercentage}%`})
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {cat.areaKm2} km² footprint
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Metrics Grid */}
        {evidence.metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {Object.entries(evidence.metrics).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-glass-border bg-white/[0.02] p-2">
                <div className="text-[10px] text-gray-400 uppercase truncate">{key}</div>
                <div className="text-xs font-bold text-cyan-300 truncate">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
