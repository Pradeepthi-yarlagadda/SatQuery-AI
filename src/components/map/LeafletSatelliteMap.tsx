'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  Plus,
  Minus,
  Crosshair,
  Compass,
  Layers,
  ChevronDown,
  Sparkles,
  Locate,
  Bot,
  ArrowRight,
  Loader2,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface LeafletSatelliteMapProps {
  interactive: boolean;
  onOpenReport?: () => void;
}

export default function LeafletSatelliteMap({
  interactive,
  onOpenReport,
}: LeafletSatelliteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ [key: string]: any }>({});

  const [zoomLevel, setZoomLevel] = useState(13);
  const [layersOpen, setLayersOpen] = useState(true);
  const [activeLayers, setActiveLayers] = useState({
    base: true,
    urban: true,
    water: true,
    change: true,
  });

  const [query, setQuery] = useState('Where did urban expansion occur between 2022 and 2026?');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState(87.4);
  const [explanation, setExplanation] = useState(
    'Built-up residential and commercial area increased by +28.4% (+14.6 km²) concentrated in the eastern sector.'
  );

  // Initialize Leaflet Map (ESRI World Imagery)
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Target Coordinates: Hyderabad / Telangana Region (17.3850, 78.4867)
      const initialCenter: [number, number] = [17.3850, 78.4867];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: interactive,
        dragging: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
      });

      // 1. ESRI High-Resolution World Imagery Layer
      const esriLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        }
      ).addTo(map);
      layersRef.current['base'] = esriLayer;

      // 2. Change Detection Heat Polygon (Eastern Urban Corridor)
      const urbanPolygon = L.polygon(
        [
          [17.4100, 78.5050],
          [17.4350, 78.5450],
          [17.3950, 78.5600],
          [17.3800, 78.5150],
        ],
        {
          color: '#f43f5e',
          weight: 2,
          fillColor: '#f43f5e',
          fillOpacity: 0.35,
          dashArray: '5, 5',
        }
      ).addTo(map);

      urbanPolygon.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #030712; padding: 4px;">
          <strong style="color: #f43f5e;">BUILT-UP EXPANSION</strong><br/>
          Area: +14.62 km² (+28.4%)<br/>
          Confidence: 87.4% (CDVQA)
        </div>
      `);
      layersRef.current['urban'] = urbanPolygon;

      // 3. Water Body Mask (Reservoir / Hussain Sagar Lake)
      const waterPolygon = L.polygon(
        [
          [17.4200, 78.4650],
          [17.4320, 78.4720],
          [17.4350, 78.4850],
          [17.4240, 78.4890],
          [17.4150, 78.4780],
        ],
        {
          color: '#06b6d4',
          weight: 2,
          fillColor: '#06b6d4',
          fillOpacity: 0.4,
        }
      ).addTo(map);

      waterPolygon.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #030712; padding: 4px;">
          <strong style="color: #06b6d4;">WATER RESERVOIR</strong><br/>
          NDWI Index: 0.48 (High Moisture)<br/>
          Extent: 5.7 km²
        </div>
      `);
      layersRef.current['water'] = waterPolygon;

      // 4. Change Difference Overlay Box
      const changeBounds: L.LatLngBoundsExpression = [
        [17.3900, 78.5100],
        [17.4300, 78.5550],
      ];
      const changeRect = L.rectangle(changeBounds, {
        color: '#eab308',
        weight: 1.5,
        fillColor: '#eab308',
        fillOpacity: 0.15,
      }).addTo(map);
      layersRef.current['change'] = changeRect;

      map.on('zoomend', () => {
        if (isMounted) setZoomLevel(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map interactive mode on scroll lock
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (interactive) {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
    }
  }, [interactive]);

  // Toggle Map Layers
  const handleLayerToggle = (layerKey: 'base' | 'urban' | 'water' | 'change') => {
    const updated = !activeLayers[layerKey];
    setActiveLayers((prev) => ({ ...prev, [layerKey]: updated }));

    const layer = layersRef.current[layerKey];
    const map = mapInstanceRef.current;
    if (!layer || !map) return;

    if (updated) {
      layer.addTo(map);
    } else {
      map.removeLayer(layer);
    }
  };

  // Zoom Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([17.3850, 78.4867], 13, { animate: true });
    }
  };

  // Run Query
  const handleRunQuery = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryText = customQuery || query;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setConfidence(92.4);
      setExplanation(
        `Analysis complete for "${queryText}": Multi-sensor classification confirmed +18.4% (+14.6 km²) built-up expansion with sub-pixel alignment accuracy.`
      );
    }, 1400);
  };

  return (
    <div className="relative w-full h-full bg-[#050814] overflow-hidden select-none">
      
      {/* 1. Full-Screen Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Laser Scanline Effect during analysis */}
      {isAnalyzing && (
        <div className="absolute inset-x-0 h-1 scanline z-20 animate-scan pointer-events-none" />
      )}

      {/* 2. Top-Left Map Navigation Controls */}
      <div className="absolute left-4 top-20 z-30 flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border border-glass-border bg-[#050814]/85 backdrop-blur-md shadow-2xl">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={handleZoomIn}
            className="flex h-9 w-9 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus size={16} />
          </button>
          <div className="h-px bg-glass-border" />
          <button
            type="button"
            aria-label="Zoom out"
            onClick={handleZoomOut}
            className="flex h-9 w-9 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Minus size={16} />
          </button>
        </div>

        <button
          type="button"
          aria-label="Recenter coordinates"
          onClick={handleRecenter}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-cyan-accent shadow-2xl"
          title="Recenter Map"
        >
          <Crosshair size={16} />
        </button>

        <button
          type="button"
          aria-label="Compass Orientation"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-cyan-accent shadow-2xl"
          title="North Aligned"
        >
          <Compass size={16} />
        </button>
      </div>

      {/* 3. Top-Right Floating Layers Control Card */}
      <div className="absolute right-4 top-20 z-30 w-56 rounded-2xl border border-glass-border bg-[#050814]/90 p-3.5 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setLayersOpen(!layersOpen)}
          className="flex w-full items-center justify-between text-xs font-mono font-bold text-white uppercase"
        >
          <span className="flex items-center gap-2">
            <Layers size={14} className="text-cyan-accent" />
            Satellite Layers
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
                <span>Base Imagery</span>
              </span>
              <input
                type="checkbox"
                checked={activeLayers.base}
                onChange={() => handleLayerToggle('base')}
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
                onChange={() => handleLayerToggle('urban')}
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
                onChange={() => handleLayerToggle('water')}
                className="rounded border-gray-600 text-cyan-accent focus:ring-0"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between text-yellow-300 hover:text-white transition-colors">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span>Change Mask</span>
              </span>
              <input
                type="checkbox"
                checked={activeLayers.change}
                onChange={() => handleLayerToggle('change')}
                className="rounded border-gray-600 text-yellow-400 focus:ring-0"
              />
            </label>
          </div>
        )}
      </div>

      {/* 4. Bottom-Left Coordinate & Telemetry HUD */}
      <div className="absolute left-4 bottom-24 z-30 flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-[#050814]/90 border border-glass-border text-[10px] font-mono text-gray-300 backdrop-blur-md shadow-2xl">
        <div>COORDS: <span className="text-cyan-accent font-bold">17.3850° N, 78.4867° E</span></div>
        <div className="h-3 w-px bg-white/20" />
        <div>ZOOM: <span className="text-white font-bold">{zoomLevel}x</span></div>
        <div className="h-3 w-px bg-white/20" />
        <div>SENSOR: <span className="text-purple-300">ESRI World Imagery (10m GSD)</span></div>
      </div>

      {/* 5. Floating Bottom "Ask Orbit IQ..." Query Bar */}
      <div className="absolute inset-x-4 sm:inset-x-12 lg:inset-x-24 bottom-4 z-30 max-w-5xl mx-auto">
        <div className="glass-panel p-3 sm:p-4 rounded-2xl border-cyan-accent/40 shadow-2xl space-y-2.5">
          
          <form onSubmit={(e) => handleRunQuery(e)} className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/15 text-cyan-accent shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Bot size={18} />
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Orbit IQ about this region..."
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
            <span className="text-gray-400 text-[10px]">SUGGESTIONS:</span>
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
                  handleRunQuery(undefined, chip);
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
  );
}
