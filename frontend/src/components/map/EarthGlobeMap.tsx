'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  Plus,
  Minus,
  Crosshair,
  Layers,
  ChevronDown,
  Globe2,
  Bot,
  ArrowRight,
  Loader2,
  Rotate3d,
} from 'lucide-react';

export interface EarthGlobeMapHandle {
  diveToTarget: () => void;
  resetToSpace: () => void;
}

interface EarthGlobeMapProps {
  isDived?: boolean;
  onDivedChange?: (dived: boolean) => void;
}

const EarthGlobeMap = forwardRef<EarthGlobeMapHandle, EarthGlobeMapProps>(function EarthGlobeMap(
  { isDived = false, onDivedChange },
  ref
) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [currentZoom, setCurrentZoom] = useState(1.8);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [coords, setCoords] = useState({ lng: 78.9629, lat: 20.5937 });
  const [controlsVisible, setControlsVisible] = useState(false);

  const [layersOpen, setLayersOpen] = useState(true);
  const [activeLayers, setActiveLayers] = useState({
    base: true,
    urban: true,
    water: true,
  });

  const [query, setQuery] = useState('Where did urban expansion occur between 2022 and 2026?');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize Native MapLibre 3D Globe
  useEffect(() => {
    let isMounted = true;

    async function initMapLibre() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const maplibreModule: any = await import('maplibre-gl');
      const MapLibreMap = maplibreModule.Map || maplibreModule.default?.Map;

      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'esri-imagery': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
              maxzoom: 18,
              attribution: 'Tiles &copy; Esri',
            },
          },
          layers: [
            {
              id: 'satellite',
              type: 'raster',
              source: 'esri-imagery',
              minzoom: 0,
              maxzoom: 18,
            },
          ],
        },
        center: [78.9629, 20.5937], // Centered over India
        zoom: 1.8,
        minZoom: 1.5,
        maxZoom: 18, // Clamped to 18 to prevent grey missing tiles
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      });

      map.on('style.load', () => {
        if (!isMounted) return;

        // 1. CRITICAL: 3D Spherical Globe Projection
        if (typeof map.setProjection === 'function') {
          map.setProjection({ type: 'globe' });
        }

        // 2. Atmospheric Sky & Deep Space Colors
        if (typeof map.setSky === 'function') {
          map.setSky({
            'sky-color': '#020617',
            'horizon-color': '#0284c7',
            'fog-color': '#000000',
          });
        }

        // 3. Vector Analysis Layers
        map.addSource('urban-sprawl-src', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [78.505, 17.41],
                  [78.545, 17.435],
                  [78.56, 17.395],
                  [78.515, 17.38],
                  [78.505, 17.41],
                ],
              ],
            },
            properties: {
              title: 'BUILT-UP AREA (+28.4%)',
              confidence: '87.4%',
            },
          },
        });

        map.addLayer({
          id: 'urban-sprawl-fill',
          type: 'fill',
          source: 'urban-sprawl-src',
          paint: {
            'fill-color': '#f43f5e',
            'fill-opacity': 0.35,
          },
        });

        map.addLayer({
          id: 'urban-sprawl-line',
          type: 'line',
          source: 'urban-sprawl-src',
          paint: {
            'line-color': '#f43f5e',
            'line-width': 2.5,
            'line-dasharray': [3, 2],
          },
        });

        map.addSource('water-reservoir-src', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [78.465, 17.42],
                  [78.472, 17.432],
                  [78.485, 17.435],
                  [78.489, 17.424],
                  [78.478, 17.415],
                  [78.465, 17.42],
                ],
              ],
            },
            properties: {
              title: 'LAKE RESERVOIR (NDWI: 0.48)',
            },
          },
        });

        map.addLayer({
          id: 'water-reservoir-fill',
          type: 'fill',
          source: 'water-reservoir-src',
          paint: {
            'fill-color': '#06b6d4',
            'fill-opacity': 0.45,
          },
        });

        map.addLayer({
          id: 'water-reservoir-line',
          type: 'line',
          source: 'water-reservoir-src',
          paint: {
            'line-color': '#06b6d4',
            'line-width': 2,
          },
        });
      });

      // Update telemetry on move
      map.on('move', () => {
        if (!isMounted) return;
        const center = map.getCenter();
        setCoords({ lng: +center.lng.toFixed(4), lat: +center.lat.toFixed(4) });
        setCurrentZoom(+map.getZoom().toFixed(1));
        setCurrentPitch(+map.getPitch().toFixed(0));
      });

      mapInstanceRef.current = map;
    }

    initMapLibre();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Cinematic 3.8s 3D Swoop & Dive
  const diveToTarget = () => {
    if (!mapInstanceRef.current) return;
    if (onDivedChange) onDivedChange(true);

    mapInstanceRef.current.flyTo({
      center: [78.4867, 17.3850], // Hyderabad / Target Region
      zoom: 14, // Deep street/field zoom
      pitch: 45, // 3D perspective pitch tilt like Google Earth
      bearing: -15,
      duration: 3800,
      essential: true,
    });

    // Fade in UI controls during the final 10% of the fly-in
    setTimeout(() => {
      setControlsVisible(true);
    }, 3200);
  };

  const resetToSpace = () => {
    if (!mapInstanceRef.current) return;
    setControlsVisible(false);
    if (onDivedChange) onDivedChange(false);

    mapInstanceRef.current.flyTo({
      center: [78.9629, 20.5937],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      duration: 2600,
      essential: true,
    });
  };

  useImperativeHandle(ref, () => ({
    diveToTarget,
    resetToSpace,
  }));

  // Toggle Layer Visibility
  const toggleLayer = (layerKey: 'urban' | 'water') => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const newState = !activeLayers[layerKey];
    setActiveLayers((prev) => ({ ...prev, [layerKey]: newState }));

    const fillId = layerKey === 'urban' ? 'urban-sprawl-fill' : 'water-reservoir-fill';
    const lineId = layerKey === 'urban' ? 'urban-sprawl-line' : 'water-reservoir-line';

    if (map.getLayer(fillId)) {
      map.setLayoutProperty(fillId, 'visibility', newState ? 'visible' : 'none');
    }
    if (map.getLayer(lineId)) {
      map.setLayoutProperty(lineId, 'visibility', newState ? 'visible' : 'none');
    }
  };

  // Toggle 3D Pitch Tilt
  const toggle3DTilt = () => {
    if (!mapInstanceRef.current) return;
    const current = mapInstanceRef.current.getPitch();
    mapInstanceRef.current.easeTo({
      pitch: current > 20 ? 0 : 55,
      duration: 800,
    });
  };

  // Run Query with Scanline Trigger
  const handleQuery = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1400);
  };

  return (
    <div className="relative w-full h-full bg-[#02050e] overflow-hidden select-none">
      
      {/* 1. MapLibre 3D WebGL Globe Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Laser Scanline during inference */}
      {isAnalyzing && (
        <div className="absolute inset-x-0 h-1 scanline z-20 animate-scan pointer-events-none" />
      )}

      {/* 2. Workspace Controls (Fades in during the final 10% of the fly-in) */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          isDived && controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top-Left Controls */}
        <div className="absolute left-4 top-20 z-30 flex flex-col gap-2">
          <div className="overflow-hidden rounded-xl border border-glass-border bg-[#050814]/85 backdrop-blur-md shadow-2xl">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="flex h-9 w-9 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Plus size={16} />
            </button>
            <div className="h-px bg-glass-border" />
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="flex h-9 w-9 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Minus size={16} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle 3D Perspective Pitch"
            onClick={toggle3DTilt}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-cyan-accent shadow-2xl"
            title="Toggle 3D Perspective Tilt"
          >
            <Rotate3d size={16} />
          </button>

          <button
            type="button"
            aria-label="Cinematic Dive into Target"
            onClick={diveToTarget}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-accent/50 bg-cyan-accent/15 text-cyan-accent backdrop-blur-md transition-colors hover:bg-cyan-accent/30 shadow-2xl"
            title="Cinematic Dive to Target Region"
          >
            <Crosshair size={16} />
          </button>

          <button
            type="button"
            aria-label="Reset to Space Globe"
            onClick={resetToSpace}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 text-purple-300 backdrop-blur-md transition-colors hover:bg-purple-500/20 shadow-2xl"
            title="Reset to Outer Space View"
          >
            <Globe2 size={16} />
          </button>
        </div>

        {/* Top-Right Floating Layers Control Card */}
        <div className="absolute right-4 top-20 z-30 w-56 rounded-2xl border border-glass-border bg-[#050814]/90 p-3.5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setLayersOpen(!layersOpen)}
            className="flex w-full items-center justify-between text-xs font-mono font-bold text-white uppercase"
          >
            <span className="flex items-center gap-2">
              <Layers size={14} className="text-cyan-accent" />
              3D Globe Layers
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-300 ${
                layersOpen ? '' : '-rotate-90'
              }`}
            />
          </button>

          {layersOpen && (
            <div className="mt-3 space-y-2 font-mono text-xs">
              <label className="flex cursor-pointer items-center justify-between text-gray-300 hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                  <span>ESRI Satellite 3D</span>
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.base}
                  readOnly
                  className="rounded border-gray-600 text-cyan-accent focus:ring-0"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between text-rose-300 hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Built-up (+28.4%)</span>
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.urban}
                  onChange={() => toggleLayer('urban')}
                  className="rounded border-gray-600 text-rose-500 focus:ring-0"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between text-cyan-300 hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span>Water Bodies</span>
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.water}
                  onChange={() => toggleLayer('water')}
                  className="rounded border-gray-600 text-cyan-accent focus:ring-0"
                />
              </label>
            </div>
          )}
        </div>

        {/* Bottom-Left Coordinate & Telemetry HUD */}
        <div className="absolute left-4 bottom-24 z-30 flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-[#050814]/90 border border-glass-border text-[10px] font-mono text-gray-300 backdrop-blur-md shadow-2xl">
          <div>COORDS: <span className="text-cyan-accent font-bold">{coords.lat}° N, {coords.lng}° E</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>ZOOM: <span className="text-white font-bold">{currentZoom}x</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>PITCH: <span className="text-purple-300 font-bold">{currentPitch}°</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>PROJECTION: <span className="text-emerald-400 font-bold">3D SPHERICAL GLOBE</span></div>
        </div>

        {/* Floating Bottom "Ask Orbit IQ..." Query Bar */}
        <div className="absolute inset-x-4 sm:inset-x-12 lg:inset-x-24 bottom-4 z-30 max-w-5xl mx-auto">
          <div className="glass-panel p-3 sm:p-4 rounded-2xl border-cyan-accent/40 shadow-2xl space-y-2.5">
            
            <form onSubmit={(e) => handleQuery(e)} className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/15 text-cyan-accent shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Bot size={18} />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Orbit IQ about this 3D region..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl gradient-cta px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:opacity-70 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span className="hidden sm:inline">Analyzing</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Query Preset Chips */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 pt-0.5 text-xs font-mono">
              <span className="text-gray-400 text-[10px]">PRESETS:</span>
              {[
                'Where did urban expansion occur?',
                'Highlight the water reservoir',
                'Detect flood inundation',
                'Compare 2022 vs 2026',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setQuery(chip);
                    handleQuery(undefined, chip);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-accent/15 border border-glass-border hover:border-cyan-accent/50 text-gray-300 hover:text-cyan-accent text-[11px] transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
});

export default EarthGlobeMap;
