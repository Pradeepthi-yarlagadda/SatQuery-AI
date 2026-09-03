'use client';

import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Crosshair,
  Compass,
  Layers,
  ChevronDown,
  ChevronsRight,
  Sparkles,
  Locate,
} from 'lucide-react';

export type LayerKey =
  | 'Base Map'
  | 'Change Detection'
  | 'Built-up Area'
  | 'Vegetation'
  | 'Water Bodies'
  | 'Roads';

const layerColors: Record<LayerKey, string> = {
  'Base Map': '#64748b',
  'Change Detection': '#3b82f6',
  'Built-up Area': '#ef4444',
  Vegetation: '#f59e0b',
  'Water Bodies': '#22c55e',
  Roads: '#94a3b8',
};

const layerOrder: LayerKey[] = [
  'Base Map',
  'Change Detection',
  'Built-up Area',
  'Vegetation',
  'Water Bodies',
  'Roads',
];

export function MapCanvas() {
  const [zoom, setZoom] = useState(1);
  const [layersOpen, setLayersOpen] = useState(true);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    'Base Map': true,
    'Change Detection': true,
    'Built-up Area': false,
    Vegetation: false,
    'Water Bodies': false,
    Roads: false,
  });

  const toggle = (key: LayerKey) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-glass-border bg-[#0a1229]">
      {/* Real Satellite Map Background */}
      <img
        src="/images/assets/map-satellite.jpg"
        alt="Dark satellite view of farmland with a river and road network"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.6] saturate-[0.9] transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,8,20,0.75)_100%)]" />

      {/* Change detection polygon overlay */}
      {layers['Change Detection'] && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points="38,42 52,38 58,52 50,66 38,62 33,52"
            fill="rgba(59,130,246,0.35)"
            stroke="#60a5fa"
            strokeWidth="0.4"
          />
        </svg>
      )}

      {/* Polygon label */}
      {layers['Change Detection'] && (
        <div className="absolute left-[36%] top-[33%] rounded-lg border border-glass-border bg-[#050814]/85 px-3 py-2 text-xs shadow-lg backdrop-blur-md">
          <p className="font-semibold text-white">Built-up Area</p>
          <p className="mt-0.5 flex items-center gap-1 text-gray-400">
            <Locate size={11} className="text-nebula" />
            Confidence: 0.87
          </p>
        </div>
      )}

      {/* Zoom + tool controls */}
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <div className="overflow-hidden rounded-lg border border-glass-border bg-[#050814]/80 backdrop-blur-md">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(2.5, +(z * 1.2).toFixed(3)))}
            className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus size={15} />
          </button>
          <div className="h-px bg-glass-border" />
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(1, +(z / 1.2).toFixed(3)))}
            className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Minus size={15} />
          </button>
        </div>
        {[Compass, Crosshair, Sparkles].map((Icon, i) => (
          <button
            key={i}
            type="button"
            aria-label="Map tool"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-glass-border bg-[#050814]/80 text-gray-400 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon size={15} />
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Recenter map"
        className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg border border-glass-border bg-[#050814]/80 text-gray-400 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
      >
        <Crosshair size={15} />
      </button>

      {/* Layers card */}
      <div className="absolute right-3 top-3 w-52 rounded-xl border border-glass-border bg-[#050814]/85 p-3 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => setLayersOpen((o) => !o)}
          className="flex w-full items-center justify-between text-sm font-semibold text-white"
        >
          <span className="flex items-center gap-2">
            <Layers size={14} className="text-nebula" />
            Layers
          </span>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${layersOpen ? '' : '-rotate-90'}`}
          />
        </button>
        {layersOpen && (
          <div className="mt-3 space-y-2.5">
            {layerOrder.map((key) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2.5 text-xs text-gray-400 transition-colors hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => toggle(key)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded-[3px] border border-slate-line accent-indigo-500"
                />
                <span
                  className="h-3 w-3 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: layerColors[key] }}
                />
                <span>{key}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Evidence pill */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-glass-border bg-[#050814]/80 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-md">
        <Sparkles size={12} className="text-nebula" />
        Evidence
        <ChevronsRight size={12} />
      </div>
    </div>
  );
}
