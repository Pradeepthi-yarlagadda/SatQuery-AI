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
  ArrowLeft,
  Search,
  MapPin,
  X,
} from 'lucide-react';
import { geocodeLocation, GeocodedLocation } from '@/utils/geoCoder';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [activeLocationTitle, setActiveLocationTitle] = useState<string | null>(null);

  const [layersOpen, setLayersOpen] = useState(true);
  const [activeLayers, setActiveLayers] = useState({
    base: true,
    urban: true,
    water: true,
  });

  const [query, setQuery] = useState('Where did urban expansion occur between 2022 and 2026?');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize MapLibre 3D Globe with ESRI World Imagery
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
            'esri-satellite': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
              maxzoom: 17,
              attribution: 'Tiles &copy; Esri',
            },
          },
          layers: [
            {
              id: 'esri-layer',
              type: 'raster',
              source: 'esri-satellite',
              minzoom: 0,
              maxzoom: 20,
              paint: {
                'raster-fade-duration': 300,
              },
            },
          ],
        },
        center: [78.9629, 20.5937], // India Orbit
        zoom: 1.8,
        minZoom: 1.5,
        maxZoom: 18,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      });

      map.on('style.load', () => {
        if (!isMounted) return;

        // 1. Set 3D Spherical Globe Projection
        if (typeof map.setProjection === 'function') {
          map.setProjection({ type: 'globe' });
        }

        // 2. Set Atmospheric Sky & Horizon
        if (typeof map.setSky === 'function') {
          map.setSky({
            'sky-color': '#020617',
            'horizon-color': '#0284c7',
            'fog-color': '#020617',
          });
        }

        // 3. Force canvas resize
        map.resize();

        // 4. Urban Sprawl GeoJSON Layer
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

        // Water Reservoir GeoJSON Layer
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

      // Interactive Map Telemetry Update
      map.on('move', () => {
        if (!isMounted) return;
        const center = map.getCenter();
        const z = map.getZoom();
        setCoords({ lng: +center.lng.toFixed(4), lat: +center.lat.toFixed(4) });
        setCurrentZoom(+z.toFixed(1));
        setCurrentPitch(+map.getPitch().toFixed(0));

        // When zoomed all the way out to space, restore Hero UI
        if (z <= 2.2 && onDivedChange) {
          onDivedChange(false);
          setControlsVisible(false);
        } else if (z >= 5) {
          setControlsVisible(true);
        }
      });

      mapInstanceRef.current = map;

      // Delayed resize for pixel-perfect viewport fit
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.resize();
        }
      }, 150);
    }

    initMapLibre();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onDivedChange]);

  // Execute 3.5s camera flight into Hyderabad / Target Region
  const diveToTarget = () => {
    if (!mapInstanceRef.current) return;
    if (onDivedChange) onDivedChange(true);

    mapInstanceRef.current.resize();
    mapInstanceRef.current.flyTo({
      center: [78.4867, 17.3850], // Hyderabad / Target Region
      zoom: 14.5,
      pitch: 45,
      duration: 3500,
      essential: true,
    });

    // Reveal UI controls once flyTo finishes
    setTimeout(() => {
      setControlsVisible(true);
    }, 3300);
  };

  // Fly back to Space & Restore Hero UI
  const resetToSpace = () => {
    if (!mapInstanceRef.current) return;
    setControlsVisible(false);
    if (onDivedChange) onDivedChange(false);

    mapInstanceRef.current.flyTo({
      center: [78.9629, 20.5937],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      duration: 2500,
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

  // Add or update target radar pin
  const updateTargetPin = (lng: number, lat: number, title: string) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    try {
      const geojson: any = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: {
              title: title,
            },
          },
        ],
      };

      if (map.getSource('search-target-src')) {
        map.getSource('search-target-src').setData(geojson);
      } else {
        map.addSource('search-target-src', {
          type: 'geojson',
          data: geojson,
        });

        map.addLayer({
          id: 'search-target-glow',
          type: 'circle',
          source: 'search-target-src',
          paint: {
            'circle-radius': 22,
            'circle-color': '#06b6d4',
            'circle-opacity': 0.35,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#22d3ee',
          },
        });

        map.addLayer({
          id: 'search-target-point',
          type: 'circle',
          source: 'search-target-src',
          paint: {
            'circle-radius': 6,
            'circle-color': '#ffffff',
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#0891b2',
          },
        });
      }
    } catch (err) {
      console.warn('Could not update pin:', err);
    }
  };

  const flyToLocation = (loc: GeocodedLocation) => {
    setActiveLocationTitle(loc.name);
    setCoords({ lng: +loc.lng.toFixed(4), lat: +loc.lat.toFixed(4) });
    if (onDivedChange) onDivedChange(true);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.resize();
      mapInstanceRef.current.flyTo({
        center: [loc.lng, loc.lat],
        zoom: loc.zoom || 13,
        pitch: loc.pitch ?? 45,
        bearing: loc.bearing ?? 0,
        duration: 3200,
        essential: true,
      });

      updateTargetPin(loc.lng, loc.lat, loc.name);
      setControlsVisible(true);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryStr = searchQuery.trim();
    if (!queryStr) return;

    setIsSearchingLocation(true);
    setSearchFeedback({ type: 'info', text: `Locating "${queryStr}"...` });

    try {
      const loc = await geocodeLocation(queryStr);
      if (loc) {
        flyToLocation(loc);
        setSearchFeedback({
          type: 'success',
          text: `📍 Navigated to: ${loc.name} (${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° E)`,
        });
      } else {
        setSearchFeedback({
          type: 'error',
          text: `Location "${queryStr}" not found. Try a city or coordinates.`,
        });
      }
    } catch (err) {
      setSearchFeedback({
        type: 'error',
        text: `Error locating "${queryStr}".`,
      });
    } finally {
      setIsSearchingLocation(false);
      setTimeout(() => setSearchFeedback(null), 6000);
    }
  };

  // Run Query with Location-Aware Flight & AI Scanline Trigger
  const handleQuery = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryText = (customQuery || query).trim();
    if (!queryText) return;

    setIsAnalyzing(true);

    try {
      const loc = await geocodeLocation(queryText);
      if (loc) {
        flyToLocation(loc);
        setSearchFeedback({
          type: 'success',
          text: `🎯 Focused on ${loc.name} for spatial AI inference`,
        });
        setTimeout(() => setSearchFeedback(null), 5000);
      }
    } catch (err) {
      // Non-spatial query
    }

    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1600);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020617] overflow-hidden select-none">
      
      {/* 1. MapLibre 3D WebGL Globe Canvas (Layer 0) */}
      <div
        id="map-container"
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#020617] cursor-grab active:cursor-grabbing"
      />

      {/* Laser Scanline during inference */}
      {isAnalyzing && (
        <div className="absolute inset-x-0 h-1 scanline z-20 animate-scan pointer-events-none" />
      )}

      {/* 2. Workspace HUD Controls (Fades in after dive) */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          isDived && controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top-Left "← Back to Orbit" & Navigation Controls */}
        <div className="absolute left-8 top-20 z-30 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={resetToSpace}
            className="flex items-center gap-2 rounded-xl border border-glass-border bg-[#050814]/90 px-4 py-2.5 text-xs font-mono font-bold text-cyan-accent shadow-2xl backdrop-blur-xl hover:bg-cyan-accent/20 hover:border-cyan-accent/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>← Back to Orbit</span>
          </button>

          <div className="overflow-hidden rounded-xl border border-glass-border bg-[#050814]/85 backdrop-blur-md shadow-2xl w-fit">
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
            aria-label="Recenter Target Coordinates"
            onClick={diveToTarget}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-accent/50 bg-cyan-accent/15 text-cyan-accent backdrop-blur-md transition-colors hover:bg-cyan-accent/30 shadow-2xl"
            title="Recenter Target Region"
          >
            <Crosshair size={16} />
          </button>
        </div>

        {/* Top-Center Global Place Search Bar */}
        <div className="absolute left-1/2 top-20 -translate-x-1/2 z-30 w-full max-w-lg px-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any place or coordinates (e.g. Delhi, Mumbai, Sriharikota)..."
              className="w-full rounded-2xl border border-glass-border bg-[#050814]/90 pl-10 pr-28 py-2.5 text-xs text-white placeholder-gray-400 backdrop-blur-xl shadow-2xl focus:border-cyan-accent/50 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-24 text-gray-400 hover:text-white p-1 transition-colors"
                title="Clear input"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearchingLocation}
              className="absolute right-2 rounded-xl gradient-cta px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer hover:brightness-110 disabled:opacity-70 flex items-center gap-1.5"
            >
              {isSearchingLocation ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Locating</span>
                </>
              ) : (
                <span>Fly There</span>
              )}
            </button>
          </form>

          {/* Search Feedback Notification Banner */}
          {searchFeedback && (
            <div
              className={`mt-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono backdrop-blur-xl border shadow-xl transition-all ${
                searchFeedback.type === 'success'
                  ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-300'
                  : searchFeedback.type === 'error'
                  ? 'bg-rose-950/85 border-rose-500/50 text-rose-300'
                  : 'bg-cyan-950/85 border-cyan-500/50 text-cyan-300'
              }`}
            >
              <span>{searchFeedback.text}</span>
            </div>
          )}
        </div>

        {/* Top-Right Floating Layers Control Card */}
        <div className="absolute right-8 top-20 z-30 w-56 rounded-2xl border border-glass-border bg-[#050814]/90 p-3.5 shadow-2xl backdrop-blur-xl">
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
        <div className="absolute left-8 bottom-24 z-30 flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-[#050814]/90 border border-glass-border text-[10px] font-mono text-gray-300 backdrop-blur-md shadow-2xl">
          {activeLocationTitle && (
            <>
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-cyan-accent" />
                <span className="text-cyan-accent font-bold max-w-[160px] truncate">{activeLocationTitle}</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
            </>
          )}
          <div>COORDS: <span className="text-cyan-accent font-bold">{coords.lat}° N, {coords.lng}° E</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>ZOOM: <span className="text-white font-bold">{currentZoom}x</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>PITCH: <span className="text-purple-300 font-bold">{currentPitch}°</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>PROJECTION: <span className="text-emerald-400 font-bold">3D SPHERICAL GLOBE</span></div>
        </div>

        {/* Floating Bottom "Ask Orbit IQ..." Query Bar */}
        <div className="absolute inset-x-8 sm:inset-x-12 lg:inset-x-24 bottom-6 z-30 max-w-5xl mx-auto">
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
