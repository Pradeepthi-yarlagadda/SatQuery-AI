'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ImageInput, ImageModality } from '@/types/image';
import { AnalysisResult, ExecutionStep, AnalysisMode } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';
import { UploadService } from '@/services/uploadService';
import { DEMO_ANALYSIS_SCENARIOS } from '@/data/demoResults';
import OrbitIqCoreStatus from './OrbitIqCoreStatus';
import AnalysisResultCard from './AnalysisResultCard';
import {
  Image as ImageIcon,
  Clock,
  ScanEye,
  Sparkles,
  ArrowRight,
  Upload,
  Bot,
  Loader2,
  RefreshCw,
  Cpu,
  Layers,
  FileQuestion,
} from 'lucide-react';

interface AnalysisWorkspaceViewProps {
  initialMode?: AnalysisMode;
  initialScenario?: string;
}

export default function AnalysisWorkspaceView({
  initialMode = 'single',
  initialScenario,
}: AnalysisWorkspaceViewProps) {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams?.get('scenario') || initialScenario;

  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [query, setQuery] = useState('Where did urban expansion occur between 2022 and 2026?');
  const [inputs, setInputs] = useState<ImageInput[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<ExecutionStep[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load preset scenarios on mount
  useEffect(() => {
    if (scenarioParam && DEMO_ANALYSIS_SCENARIOS[scenarioParam]) {
      const scenario = DEMO_ANALYSIS_SCENARIOS[scenarioParam];
      setResult(scenario);
      setQuery(scenario.query);
      setInputs(scenario.inputs);
      if (scenario.task === 'OPTICAL_SAR_FUSION') {
        setMode('multimodal');
      } else if (scenario.task === 'CHANGE_DETECTION' || scenario.task === 'CHANGE_VQA') {
        setMode('temporal');
      } else {
        setMode('single');
      }
    } else {
      // Default initial Single image setup
      loadDefaultInputsForMode(mode);
    }
  }, [scenarioParam]);

  // Update default inputs when mode changes manually
  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    loadDefaultInputsForMode(newMode);
    setResult(null);
    setError(null);
  };

  const loadDefaultInputsForMode = (targetMode: AnalysisMode) => {
    if (targetMode === 'temporal') {
      const tempScenario = DEMO_ANALYSIS_SCENARIOS['temporal-expansion'];
      setInputs(tempScenario.inputs);
      setQuery('What changes in built-up area and water occurred between 2022 and 2026?');
    } else if (targetMode === 'multimodal') {
      const fusionScenario = DEMO_ANALYSIS_SCENARIOS['optical-sar-fusion'];
      setInputs(fusionScenario.inputs);
      setQuery('Use optical and SAR backscatter to identify dense structures and water extent.');
    } else {
      const singleScenario = DEMO_ANALYSIS_SCENARIOS['grounding-water'];
      setInputs(singleScenario.inputs);
      setQuery('Highlight the central lake reservoir and surrounding wetland zones.');
    }
  };

  // Handle File Ingestion
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newImages: ImageInput[] = [];
      for (let i = 0; i < files.length; i++) {
        const img = await UploadService.processUploadedFile(files[i]);
        newImages.push(img);
      }

      if (index !== undefined && inputs[index]) {
        const updated = [...inputs];
        updated[index] = newImages[0];
        setInputs(updated);
      } else {
        setInputs((prev) => [...prev, ...newImages]);
      }
    } catch (err: any) {
      setError(`Failed to load uploaded imagery: ${err.message}`);
    }
  };

  // Main Submit Analysis via Orbit IQ Core
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentSteps([]);

    try {
      const res = await OrbitIqCore.executeAnalysis(
        {
          query,
          inputs,
          mode,
        },
        (step) => {
          setCurrentSteps((prev) => {
            const existingIdx = prev.findIndex((s) => s.message === step.message);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = step;
              return updated;
            }
            return [...prev, step];
          });
        }
      );

      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Orbit IQ Core encountered an error during inference.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-foreground font-sans">
      
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <Cpu size={14} />
            <span>Orbit IQ Mission Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Analysis Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Single intelligence controller: Orbit IQ Core automatically identifies query intent, validates observation parameters, and dispatches the optimal remote sensing specialist capability.
          </p>
        </div>

        {/* Workflow Mode Selector */}
        <div className="flex items-center p-1 rounded-2xl border border-glass-border bg-[#050814]/90 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
              mode === 'single'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            <span>Single Image</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('temporal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
              mode === 'temporal'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock size={14} />
            <span>Temporal (T1/T2)</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('multimodal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
              mode === 'multimodal'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ScanEye size={14} />
            <span>Optical + SAR</span>
          </button>
        </div>
      </div>

      {/* Grid: Imagery Observations Input Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {inputs.map((img, idx) => (
          <div
            key={img.id || idx}
            className="rounded-2xl border border-glass-border bg-[#050814]/90 p-4 shadow-xl backdrop-blur-md space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase">
                {mode === 'temporal'
                  ? `Observation T${idx + 1}`
                  : mode === 'multimodal'
                  ? idx === 0 ? 'Optical Multispectral' : 'Synthetic Aperture Radar'
                  : 'Target Observation'}
              </span>
              <span className="rounded bg-white/[0.05] px-2 py-0.5 text-[10px] text-gray-300 uppercase">
                {img.modality}
              </span>
            </div>

            {/* Preview Canvas */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-glass-border bg-black">
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.fileName}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-mono text-gray-500">
                  No preview available
                </div>
              )}

              <label className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-mono text-gray-200 backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">
                <Upload size={11} />
                <span>Replace</span>
                <input
                  type="file"
                  accept=".tif,.tiff,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileUpload(e, idx)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Metadata Footer */}
            <div className="text-[11px] font-mono text-gray-400 space-y-1">
              <div className="text-white font-semibold truncate">{img.fileName}</div>
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>Date: {img.acquisitionDate || '2026-03-15'}</span>
                <span>{img.width}x{img.height} px</span>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Slot if needed */}
        {inputs.length < (mode === 'single' ? 1 : 2) && (
          <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-glass-border bg-white/[0.01] p-6 text-center transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/[0.02]">
            <Upload size={24} className="text-cyan-400" />
            <span className="mt-2 text-xs font-mono font-medium text-white">
              Upload GeoTIFF / Observation Image
            </span>
            <span className="mt-1 text-[10px] text-gray-400">
              Supports Optical, Multispectral, or SAR format
            </span>
            <input
              type="file"
              accept=".tif,.tiff,.png,.jpg,.jpeg"
              onChange={(e) => handleFileUpload(e)}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Unified Orbit IQ Core Natural Language Query Bar */}
      <div className="rounded-2xl border border-cyan-400/30 bg-[#050814]/90 p-5 shadow-2xl backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
            <Bot size={16} />
            <span>Ask Orbit IQ Core</span>
          </div>
          <span className="text-[11px] text-gray-400">
            Autonomous Specialist Routing
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about this scene (e.g. 'What changed?', 'Highlight water', 'Describe land cover')..."
              className="w-full rounded-xl border border-glass-border bg-black/40 px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl gradient-cta px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Running</span>
              </>
            ) : (
              <>
                <span>Run Analysis</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Query Suggestions for Current Mode */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-[10px] text-gray-400 uppercase">Suggested Queries:</span>
          {(mode === 'temporal'
            ? [
                'What major urban changes occurred between 2022 and 2026?',
                'Show me where built-up expansion occurred',
                'Has the water reservoir surface area decreased?',
              ]
            : mode === 'multimodal'
            ? [
                'Fuse optical and SAR to identify structures through haze',
                'Use SAR double-bounce to verify building footprint',
                'Identify open water boundaries using SAR specular return',
              ]
            : [
                'Highlight the central lake reservoir and wetlands',
                'What is the dominant land cover class and urban density?',
                'Describe this remote sensing scene in detail',
              ]
          ).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQuery(chip);
              }}
              className="px-2.5 py-1 rounded-lg border border-glass-border bg-white/[0.02] hover:bg-cyan-400/10 hover:border-cyan-400/40 text-gray-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs font-mono text-rose-300">
          {error}
        </div>
      )}

      {/* Real-time Observable Execution Status when Running */}
      {isAnalyzing && (
        <OrbitIqCoreStatus
          steps={currentSteps}
          isRunning={true}
        />
      )}

      {/* Final Analysis Result & Visual Evidence */}
      {result && !isAnalyzing && (
        <AnalysisResultCard result={result} />
      )}

    </div>
  );
}
