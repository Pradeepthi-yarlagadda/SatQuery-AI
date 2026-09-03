'use client';

import React from 'react';
import { AnalysisScenario, LayerState, GeoTIFFMetadata } from '@/types/satellite';
import { Layers, Database, CheckCircle2, ShieldCheck, MapPin, Eye, Satellite, Radio, Clock } from 'lucide-react';

interface LayerControlProps {
  scenario: AnalysisScenario;
  onScenarioChange: (scenarioId: string) => void;
  allScenarios: Record<string, AnalysisScenario>;
  layers: LayerState;
  onToggleLayer: (layerKey: keyof LayerState) => void;
}

export default function LayerControl({
  scenario,
  onScenarioChange,
  allScenarios,
  layers,
  onToggleLayer,
}: LayerControlProps) {
  return (
    <div className="w-full h-full flex flex-col bg-space-900/90 border border-space-border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-space-950/60">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-orbit-cyan">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white tracking-wider">INPUTS & LAYERS</h3>
            <span className="text-[10px] font-mono text-cyan-400">MISSION CONFIGURATION</span>
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Scenario Preset Switcher */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            <span>Mission Preset</span>
            <span className="text-cyan-400">5 Scenarios</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {Object.values(allScenarios).map((s) => {
              const isSelected = s.id === scenario.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onScenarioChange(s.id)}
                  className={`w-full p-2 rounded-xl text-left border transition-all flex items-center space-x-2.5 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-neon-cyan text-white'
                      : 'bg-space-950/40 border-white/5 text-gray-400 hover:text-white hover:bg-space-950/80 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {s.mode === 'temporal' ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : s.mode === 'optical_sar' ? (
                      <Radio className="w-3.5 h-3.5" />
                    ) : (
                      <Satellite className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold truncate">{s.title}</div>
                    <div className="text-[9px] text-gray-400 truncate">{s.detectedTask}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingested GeoTIFF Metadata Cards */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            <span>Ingested GeoTIFFs</span>
            <span className="text-emerald-400 font-bold">✓ Co-registered</span>
          </div>

          <div className="space-y-2">
            {scenario.inputs.map((geo, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-space-950/70 border border-white/10 space-y-1.5 font-mono text-[10px]"
              >
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="truncate max-w-[140px] text-cyan-300">{geo.filename}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-space-850 border border-white/10 text-gray-300">
                    {geo.satellite}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-gray-400">
                  <div>Modality: <span className="text-gray-200">{geo.modality}</span></div>
                  <div>GSD: <span className="text-gray-200">{geo.gsd}</span></div>
                  <div>CRS: <span className="text-gray-200">{geo.crs.split(' ')[0]}</span></div>
                  <div>Bands: <span className="text-gray-200">{geo.bands}</span></div>
                </div>

                <div className="text-[9px] text-emerald-400 flex items-center space-x-1 pt-1 border-t border-white/5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{geo.compatibilityNote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Layers Toggles */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            Map Render Layers
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg bg-space-950/40 border border-white/5 hover:border-white/15 cursor-pointer">
              <span className="text-gray-200 text-[11px]">Satellite Base Tile</span>
              <input
                type="checkbox"
                checked={layers.satelliteBase}
                onChange={() => onToggleLayer('satelliteBase')}
                className="rounded bg-space-900 border-cyan-500/40 text-cyan-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-space-950/40 border border-white/5 hover:border-white/15 cursor-pointer">
              <span className="text-gray-200 text-[11px]">Analysis Overlays</span>
              <input
                type="checkbox"
                checked={layers.analysisOverlay}
                onChange={() => onToggleLayer('analysisOverlay')}
                className="rounded bg-space-900 border-cyan-500/40 text-cyan-500 focus:ring-0"
              />
            </label>

            {scenario.mode === 'temporal' && (
              <label className="flex items-center justify-between p-2 rounded-lg bg-space-950/40 border border-white/5 hover:border-white/15 cursor-pointer">
                <span className="text-rose-300 text-[11px] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Change Heatmap</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.changeRegions}
                  onChange={() => onToggleLayer('changeRegions')}
                  className="rounded bg-space-900 border-rose-500/40 text-rose-500 focus:ring-0"
                />
              </label>
            )}

            <label className="flex items-center justify-between p-2 rounded-lg bg-space-950/40 border border-white/5 hover:border-white/15 cursor-pointer">
              <span className="text-cyan-300 text-[11px] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Water Bodies</span>
              </span>
              <input
                type="checkbox"
                checked={layers.waterBodies}
                onChange={() => onToggleLayer('waterBodies')}
                className="rounded bg-space-900 border-cyan-500/40 text-cyan-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-space-950/40 border border-white/5 hover:border-white/15 cursor-pointer">
              <span className="text-emerald-300 text-[11px] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Vegetation Density</span>
              </span>
              <input
                type="checkbox"
                checked={layers.vegetation}
                onChange={() => onToggleLayer('vegetation')}
                className="rounded bg-space-900 border-emerald-500/40 text-emerald-500 focus:ring-0"
              />
            </label>

            {scenario.mode === 'optical_sar' && (
              <label className="flex items-center justify-between p-2 rounded-lg bg-space-950/40 border border-cyan-500/30 hover:border-cyan-500/60 cursor-pointer">
                <span className="text-cyan-300 text-[11px] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>SAR Backscatter (VV/VH)</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.sarBackscatter}
                  onChange={() => onToggleLayer('sarBackscatter')}
                  className="rounded bg-space-900 border-cyan-500/40 text-cyan-500 focus:ring-0"
                />
              </label>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
