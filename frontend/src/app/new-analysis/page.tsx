'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileCheck, CheckCircle2, ShieldCheck, ArrowRight, Layers, Clock, Radio, Sparkles, Satellite } from 'lucide-react';
import StarfieldCanvas from '@/components/landing/StarfieldCanvas';

type ConfigMode = 'single' | 'temporal' | 'optical_sar';

export default function NewAnalysisPage() {
  const router = useRouter();
  const [configMode, setConfigMode] = useState<ConfigMode>('temporal');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['area_2022.tif', 'area_2026.tif']);

  const handleModeSelect = (mode: ConfigMode) => {
    setConfigMode(mode);
    if (mode === 'single') {
      setUploadedFiles(['nagarjuna_sagar_scene.tif']);
    } else if (mode === 'temporal') {
      setUploadedFiles(['area_2022.tif', 'area_2026.tif']);
    } else if (mode === 'optical_sar') {
      setUploadedFiles(['ganga_optical.tif', 'ganga_sar_vv_vh.tif']);
    }
  };

  const handleSimulateDrop = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 600);
  };

  const handleLaunchAnalysis = () => {
    const scenarioMap: Record<ConfigMode, string> = {
      single: 'grounding-water',
      temporal: 'temporal-expansion',
      optical_sar: 'optical-sar-fusion',
    };
    router.push(`/workspace?scenario=${scenarioMap[configMode]}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-space-950">
      <StarfieldCanvas />

      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-orbit-cyan">
            <Satellite className="w-3.5 h-3.5 animate-spin-slow" />
            <span>DATA INGESTION PIPELINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
            START AN ANALYSIS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-lg mx-auto">
            Upload your satellite imagery and ask OrbitIQ what you want to know. Automated metadata validation guarantees spatial alignment.
          </p>
        </div>

        {/* Input Configuration Selector */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider text-center">
            SELECT INPUT CONFIGURATION
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            {/* Single Image */}
            <button
              onClick={() => handleModeSelect('single')}
              className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
                configMode === 'single'
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-neon-cyan'
                  : 'bg-space-900/60 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Single Image</span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                One optical, multispectral, or SAR GeoTIFF scene.
              </p>
            </button>

            {/* Before & After (Temporal) */}
            <button
              onClick={() => handleModeSelect('temporal')}
              className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
                configMode === 'temporal'
                  ? 'bg-purple-500/15 border-purple-500/50 shadow-neon-cyan'
                  : 'bg-space-900/60 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Before & After</span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                Two observations of the same geographic area across dates.
              </p>
            </button>

            {/* Optical + SAR */}
            <button
              onClick={() => handleModeSelect('optical_sar')}
              className={`p-4 rounded-xl border text-left transition-all space-y-1.5 ${
                configMode === 'optical_sar'
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-neon-cyan'
                  : 'bg-space-900/60 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Optical + SAR</span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                Co-registered optical reflectance and SAR radar backscatter.
              </p>
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={handleSimulateDrop}
          className="relative p-8 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-space-900/50 hover:bg-space-900/80 transition-all cursor-pointer text-center space-y-3 group backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-orbit-cyan flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold font-mono text-white">
              DROP SATELLITE DATA (.GeoTIFF / .TIFF)
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Drag and drop satellite raster datasets or click to browse filesystem
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-space-950 border border-white/10 text-[10px] font-mono text-gray-400">
            <span>Supported: Optical · SAR · Multispectral · Sentinel · Landsat · Cartosat</span>
          </div>
        </div>

        {/* Ingested Imagery Inspection Manifest */}
        <div className="p-4 rounded-xl bg-space-900/80 border border-white/10 space-y-3 font-mono text-xs backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white uppercase">GeoTIFF Validation Status</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              ✓ Ready for Mission Control
            </span>
          </div>

          {/* Dynamic Cards depending on mode */}
          {configMode === 'single' && (
            <div className="p-3 rounded-lg bg-space-950/70 border border-white/5 space-y-1">
              <div className="flex justify-between text-cyan-300 font-bold">
                <span>IMAGE 01: area_scene.tif</span>
                <span className="text-emerald-400">✓ Validated</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-400 pt-1">
                <div>MODALITY: <span className="text-white">Multispectral (12-Band)</span></div>
                <div>RESOLUTION: <span className="text-white">10.0 m</span></div>
                <div>CRS: <span className="text-white">EPSG:4326</span></div>
                <div>GSD: <span className="text-white">10.0 m</span></div>
              </div>
            </div>
          )}

          {configMode === 'temporal' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-space-950/70 border border-white/5 space-y-1">
                <div className="flex justify-between text-cyan-300 font-bold">
                  <span>BEFORE: area_2022.tif</span>
                  <span className="text-gray-400 text-[10px]">Sentinel-2A · Optical 10m</span>
                </div>
                <div className="flex justify-between text-purple-300 font-bold pt-1">
                  <span>AFTER: area_2026.tif</span>
                  <span className="text-gray-400 text-[10px]">Sentinel-2A · Optical 10m</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>TEMPORAL PAIR: Geographic correspondence and co-registration verified (RMSE &lt; 0.12 px).</span>
              </div>
            </div>
          )}

          {configMode === 'optical_sar' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-space-950/70 border border-white/5 space-y-1">
                <div className="flex justify-between text-cyan-300 font-bold">
                  <span>OPTICAL: optical_scene.tif</span>
                  <span className="text-gray-400 text-[10px]">Sentinel-2A (RGB/NIR)</span>
                </div>
                <div className="flex justify-between text-emerald-300 font-bold pt-1">
                  <span>SAR: sar_scene.tif</span>
                  <span className="text-gray-400 text-[10px]">Sentinel-1B (C-Band VV/VH)</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>CROSS-MODAL PAIR: Spatial bounding overlap 100%, radar speckle calibrated.</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLaunchAnalysis}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-slate-950 font-bold text-xs font-mono hover:brightness-110 transition-all shadow-neon-cyan flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>LAUNCH IN MISSION CONTROL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
