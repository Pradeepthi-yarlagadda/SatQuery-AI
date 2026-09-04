'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Image as ImageIcon,
  Clock,
  ScanEye,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MousePointer2,
  Layers,
  ChevronDown,
  Plus,
  Minus,
  Rotate3d,
  Crosshair,
  Bot,
  Loader2,
  ExternalLink,
  Compass,
  Search,
  Globe2,
  Play,
  Pause,
  MapPin,
  X,
} from 'lucide-react';
import { geocodeLocation, GeocodedLocation } from '@/utils/geoCoder';

const GOOGLE_EARTH_URL =
  'https://earth.google.com/web/@22.88899785,75.2951107,3744.95251812a,16284957.7173543d,35y,344.45125297h,0t,0r/data=CgRCAggBOgMKATBCAggASg0I____________ARAA?authuser=0';

// Global Landmark Presets for 3D Earth Exploration
const WORLD_PRESETS = [
  { name: 'New Delhi', coords: [77.2090, 28.6139], zoom: 13.2, pitch: 45 },
  { name: 'Mumbai', coords: [72.8347, 18.9220], zoom: 13.2, pitch: 45 },
  { name: 'Bengaluru', coords: [77.5946, 12.9716], zoom: 13.5, pitch: 45 },
  { name: 'Hyderabad', coords: [78.4867, 17.3850], zoom: 14.2, pitch: 45 },
  { name: 'Sriharikota (ISRO)', coords: [80.2300, 13.7200], zoom: 14.5, pitch: 50 },
  { name: 'Himalayas / Everest', coords: [86.9250, 27.9881], zoom: 12.5, pitch: 60 },
  { name: 'Dubai Palm', coords: [55.1384, 25.1124], zoom: 13.5, pitch: 50 },
  { name: 'Tokyo, Japan', coords: [139.6917, 35.6895], zoom: 13.8, pitch: 45 },
  { name: 'Paris, France', coords: [2.3522, 48.8566], zoom: 14.0, pitch: 40 },
  { name: 'New York City', coords: [-74.0060, 40.7128], zoom: 14.5, pitch: 50 },
];

const featureCards = [
  {
    icon: ImageIcon,
    title: 'Single Image',
    description: 'Understand any scene',
    scenarioId: 'grounding-water',
  },
  {
    icon: Clock,
    title: 'Temporal Analysis',
    description: 'Detect changes over time',
    scenarioId: 'temporal-expansion',
  },
  {
    icon: ScanEye,
    title: 'Optical + SAR',
    description: 'Multi-sensor intelligence',
    scenarioId: 'optical-sar-fusion',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Agentic analysis & insights',
    scenarioId: 'vqa-landcover',
  },
];

export default function LandingPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const spinIntervalRef = useRef<any>(null);

  const [isDiving, setIsDiving] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1.8);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentBearing, setCurrentBearing] = useState(344.45);
  const [coords, setCoords] = useState({ lng: 75.2951, lat: 22.8890 });
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

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

  // Initialize MapLibre 3D Spherical Globe Canvas (Google Earth Physics)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;
    let mapInstance: any = null;

    async function initMap() {
      const maplibreModule: any = await import('maplibre-gl');
      const maplibregl = maplibreModule.default || maplibreModule;

      if (!mapContainerRef.current) return;

      const map = new maplibregl.Map({
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
              maxzoom: 20,
              paint: {
                'raster-fade-duration': 300,
              },
            },
          ],
        },
        projection: 'globe', // CRITICAL: True 3D Spherical Earth Curvature
        center: [75.2951, 22.8890], // Exact Google Earth user coordinates
        zoom: 1.8,
        minZoom: 1.2,
        maxZoom: 18,
        pitch: 0,
        bearing: 344.45,
        dragRotate: true,
        pitchWithRotate: true,
        touchZoomRotate: true,
        touchPitch: true,
        attributionControl: false,
      });

      map.on('style.load', () => {
        if (!isMounted) return;

        // Atmospheric Sky & Deep Space Horizon
        if (typeof map.setSky === 'function') {
          map.setSky({
            'sky-color': '#020617',
            'horizon-color': '#0284c7',
            'fog-color': '#000000',
          });
        }

        map.resize();

        // Vector Layer: Built-up Urban Area
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

        // Vector Layer: Water Reservoir Mask
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

      // Free 360° Drag & Navigation Telemetry
      map.on('move', () => {
        if (!isMounted) return;
        const center = map.getCenter();
        const z = map.getZoom();
        setCoords({ lng: +center.lng.toFixed(4), lat: +center.lat.toFixed(4) });
        setCurrentZoom(+z.toFixed(1));
        setCurrentPitch(+map.getPitch().toFixed(0));
        setCurrentBearing(+map.getBearing().toFixed(0));

        // Bidirectional Return to Space: if zoomed all the way out, restore hero
        if (z <= 2.2) {
          setIsDiving(false);
          setControlsVisible(false);
        } else if (z >= 5.5) {
          setControlsVisible(true);
        }
      });

      // Stop auto spin on user interaction
      map.on('mousedown', () => stopSpin());
      map.on('touchstart', () => stopSpin());

      mapRef.current = map;
      mapInstance = map;

      setTimeout(() => {
        if (isMounted && mapRef.current) {
          mapRef.current.resize();
        }
      }, 150);
    }

    initMap();

    const handleResize = () => {
      if (mapRef.current) mapRef.current.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      stopSpin();
      window.removeEventListener('resize', handleResize);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // Ambient Earth Auto-Spin (Like Google Earth Space view)
  const toggleSpin = () => {
    if (isAutoSpinning) {
      stopSpin();
    } else {
      startSpin();
    }
  };

  const startSpin = () => {
    if (spinIntervalRef.current) return;
    setIsAutoSpinning(true);
    spinIntervalRef.current = setInterval(() => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter();
        mapRef.current.easeTo({
          center: [(center.lng + 1.2) % 360, center.lat],
          duration: 120,
          easing: (t: number) => t,
        });
      }
    }, 120);
  };

  const stopSpin = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
    setIsAutoSpinning(false);
  };

  // Fly to Target Region on Dive
  const handleDive = () => {
    stopSpin();
    setIsDiving(true);
    if (mapRef.current) {
      mapRef.current.resize();
      mapRef.current.flyTo({
        center: [78.4867, 17.3850], // Hyderabad / Target Region
        zoom: 14.2,
        pitch: 45, // 3D Google Earth Perspective Tilt
        bearing: -15,
        duration: 3800,
        essential: true,
      });

      setTimeout(() => {
        setControlsVisible(true);
      }, 3400);
    }
  };

  // Add or update glowing target radar pin marker on MapLibre globe
  const updateTargetPin = (lng: number, lat: number, title: string) => {
    const map = mapRef.current;
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

        // Pulsing radar glow circle
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

        // Center pin marker point
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
      console.warn('Could not update map target pin:', err);
    }
  };

  // Fly to Geocoded Location
  const flyToLocation = (loc: GeocodedLocation) => {
    stopSpin();
    setIsDiving(true);
    setActiveLocationTitle(loc.name);
    setCoords({ lng: +loc.lng.toFixed(4), lat: +loc.lat.toFixed(4) });

    if (mapRef.current) {
      mapRef.current.resize();
      mapRef.current.flyTo({
        center: [loc.lng, loc.lat],
        zoom: loc.zoom || 13,
        pitch: loc.pitch ?? 45,
        bearing: loc.bearing ?? 0,
        duration: 3200,
        essential: true,
      });

      updateTargetPin(loc.lng, loc.lat, loc.name);

      setTimeout(() => {
        setControlsVisible(true);
      }, 2900);
    }
  };

  // Fly to Any Selected Preset Landmark across the World
  const flyToPreset = (preset: typeof WORLD_PRESETS[0]) => {
    stopSpin();
    setIsDiving(true);
    setActiveLocationTitle(preset.name);
    setCoords({ lng: +preset.coords[0].toFixed(4), lat: +preset.coords[1].toFixed(4) });

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: preset.coords,
        zoom: preset.zoom,
        pitch: preset.pitch,
        bearing: 0,
        duration: 3200,
        essential: true,
      });

      updateTargetPin(preset.coords[0], preset.coords[1], preset.name);

      setTimeout(() => {
        setControlsVisible(true);
      }, 2900);
    }
  };

  // Search Any Place, City, Landmark, or Coordinates Globally
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
          text: `Location "${queryStr}" not found. Try entering a city name or coordinates (e.g. 28.61, 77.20)`,
        });
      }
    } catch (err) {
      setSearchFeedback({
        type: 'error',
        text: `Error locating "${queryStr}". Please try again.`,
      });
    } finally {
      setIsSearchingLocation(false);
      setTimeout(() => {
        setSearchFeedback(null);
      }, 6000);
    }
  };

  // Return to Space Orbit / Restore Landing Page
  const handleBackToLanding = () => {
    stopSpin();
    setControlsVisible(false);
    setIsDiving(false);
    setActiveLocationTitle(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [75.2951, 22.8890], // Exact Google Earth user coordinates
        zoom: 1.8,
        pitch: 0,
        bearing: 344.45,
        duration: 2800,
        essential: true,
      });
    }
  };

  // Intercept Wheel on Hero Overlay to initiate dive
  const handleHeroWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0 && !isDiving) {
      handleDive();
    }
  };

  // Reset North Bearing
  const resetNorth = () => {
    mapRef.current?.easeTo({ bearing: 0, duration: 600 });
  };

  // Toggle 3D Perspective Pitch
  const toggle3DTilt = () => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getPitch();
    map.easeTo({
      pitch: current > 20 ? 0 : 55,
      duration: 800,
    });
  };

  // Toggle Layers
  const toggleLayer = (layerKey: 'urban' | 'water') => {
    const map = mapRef.current;
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

  // Run Query with Location-Aware Flight & AI Scanline Trigger
  const handleQuery = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryText = (customQuery || query).trim();
    if (!queryText) return;

    setIsAnalyzing(true);

    // Extract any location mentioned in the question and fly there
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
      // Non-spatial query: continue analysis
    }

    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-space select-none text-foreground font-sans">
      
      {/* ========================================================= */}
      {/* 1. LAYER 0 (Behind): 3D Spherical Earth Globe (Google Earth)*/}
      {/* ========================================================= */}
      <div
        id="map-container"
        ref={mapContainerRef}
        className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-space cursor-grab active:cursor-grabbing"
      />

      {/* Laser Scanline during inference */}
      {isAnalyzing && (
        <div className="absolute inset-x-0 h-1 scanline z-20 animate-scan pointer-events-none" />
      )}

      {/* ========================================================= */}
      {/* 2. LAYER 1: Fullscreen Hero Scene (Exact Reference Image) */}
      {/* ========================================================= */}
      <div
        onWheel={handleHeroWheel}
        className={`fixed inset-0 z-10 w-screen h-screen flex flex-col justify-between transition-opacity duration-700 ease-in-out ${
          isDiving ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        {/* Deep Space Background Wallpaper with Glowing Earth Horizon and Satellite */}
        <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none">
          <img
            src="/images/assets/hero-satellite.jpg"
            alt="Satellite orbiting Earth at night"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-space/80 via-space/40 to-space/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.22),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.15),_transparent_50%)]" />
        </div>

        {/* TOP NAVBAR (Exact Reference Header) */}
        <header className="fixed left-0 right-0 top-0 z-50 pointer-events-auto">
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between rounded-full border border-glass-border bg-glass px-4 py-2.5 backdrop-blur-xl">
              
              {/* Logo */}
              <button onClick={handleBackToLanding} className="flex items-center gap-2.5 group cursor-pointer">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full orbit-ring bg-glass">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nebula/20 to-orbit/20" />
                  <div className="relative h-5 w-5">
                    <div className="absolute inset-0 rounded-full border-2 border-nebula" />
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orbit" />
                  </div>
                </div>
                <span className="text-lg font-semibold tracking-tight text-white">
                  Orbit IQ
                </span>
              </button>

              {/* Navigation Links */}
              <ul className="hidden items-center gap-1 md:flex">
                <li>
                  <button
                    onClick={handleBackToLanding}
                    className="relative px-4 py-2 text-sm font-medium text-white transition-colors hover:text-white cursor-pointer"
                  >
                    Home
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full gradient-cta" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDive}
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white cursor-pointer"
                  >
                    Explore
                  </button>
                </li>
                <li>
                  <Link
                    href="/workspace"
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technology"
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
                  >
                    About
                  </Link>
                </li>
              </ul>

              {/* Get Started Button */}
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center rounded-full gradient-cta px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        {/* HERO CENTER CONTENT */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 w-full">
          <div className="max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-nebula animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-foreground/90 uppercase font-mono">
                • AI FOR EARTH INTELLIGENCE
              </span>
            </div>

            {/* Main Heading: Orbit IQ */}
            <h1 className="mt-6 text-6xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Orbit <span className="text-gradient">IQ</span>
            </h1>

            {/* Subheading: TALK TO EARTH. */}
            <h2 className="mt-2 text-xl font-semibold tracking-[0.2em] text-nebula sm:text-2xl font-mono">
              TALK TO EARTH.
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              An interactive vision-language assistant for multimodal remote sensing image analysis through natural language queries.
            </p>

            {/* CTA Button: Explore Orbit IQ → */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleDive}
                className="group inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Orbit IQ</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM 4 FEATURE CARDS & SCROLL TO EXPLORE CUE */}
        <div className="relative z-10 w-full px-4 pb-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={`/workspace?scenario=${card.scenarioId}`}
                className="group glass-card hero-glow rounded-2xl p-5 transition-all hover:border-slate-line/40 hover:bg-white/[0.06] block cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-white/[0.04] text-nebula group-hover:bg-nebula/10 transition-colors">
                    <card.icon size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* SCROLL TO EXPLORE Indicator */}
          <button
            type="button"
            onClick={handleDive}
            className="mt-6 mx-auto flex flex-col items-center justify-center gap-1.5 text-xs font-medium tracking-widest text-muted-foreground/80 hover:text-white uppercase transition-colors cursor-pointer"
          >
            <span>SCROLL TO EXPLORE</span>
            <MousePointer2 size={16} className="animate-bounce text-nebula" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LAYER 2: 3D Google Earth Interactive Suite (When Dived) */}
      {/* ========================================================= */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          isDiving && controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top-Left: Back to Landing Page & Google Earth Link */}
        <div className="absolute left-6 top-6 z-30 flex flex-col gap-2.5">
          {/* Back to Landing Page Button */}
          <button
            type="button"
            onClick={handleBackToLanding}
            className="flex items-center gap-2 rounded-xl border border-glass-border bg-[#050814]/90 px-4 py-2.5 text-xs font-mono font-bold text-cyan-400 shadow-2xl backdrop-blur-xl hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>← Back to Landing Page</span>
          </button>

          {/* Direct Google Earth Web Link */}
          <a
            href={GOOGLE_EARTH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#050814]/90 px-4 py-2 text-xs font-mono text-purple-300 shadow-2xl backdrop-blur-xl hover:bg-purple-500/20 hover:border-purple-400/50 transition-all"
          >
            <ExternalLink size={13} />
            <span>Open in Google Earth 3D ↗</span>
          </a>

          {/* Navigation Zoom / Pitch Tools */}
          <div className="overflow-hidden rounded-xl border border-glass-border bg-[#050814]/85 backdrop-blur-md shadow-2xl w-fit">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => mapRef.current?.zoomIn()}
              className="flex h-9 w-9 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Plus size={16} />
            </button>
            <div className="h-px bg-glass-border" />
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => mapRef.current?.zoomOut()}
              className="flex h-9 w-9 items-center justify-center text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Minus size={16} />
            </button>
          </div>

          {/* 3D Perspective Pitch Tilt Button */}
          <button
            type="button"
            aria-label="Toggle 3D Perspective Pitch"
            onClick={toggle3DTilt}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-cyan-400 shadow-2xl"
            title="Toggle 3D Perspective Tilt"
          >
            <Rotate3d size={16} />
          </button>

          {/* Compass / Reset North */}
          <button
            type="button"
            aria-label="Reset North"
            onClick={resetNorth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 text-gray-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-cyan-400 shadow-2xl"
            title="Reset North Compass"
          >
            <Compass size={16} style={{ transform: `rotate(${-currentBearing}deg)` }} className="transition-transform" />
          </button>

          {/* Auto Earth Rotation Toggle */}
          <button
            type="button"
            onClick={toggleSpin}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-[#050814]/85 backdrop-blur-md transition-colors shadow-2xl ${
              isAutoSpinning ? 'text-cyan-400 border-cyan-400/50 bg-cyan-400/20' : 'text-gray-300 hover:text-white'
            }`}
            title={isAutoSpinning ? 'Pause Auto-Spin' : 'Auto-Rotate Globe 360°'}
          >
            {isAutoSpinning ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>

        {/* Top-Center Global Place Search & Landmarks Bar */}
        <div className="absolute left-1/2 top-6 -translate-x-1/2 z-30 w-full max-w-xl px-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any city, landmark, or coordinates (e.g. Delhi, Mumbai, Sriharikota, Tokyo, Paris)..."
              className="w-full rounded-2xl border border-glass-border bg-[#050814]/90 pl-10 pr-28 py-2.5 text-xs text-white placeholder-gray-400 backdrop-blur-xl shadow-2xl focus:border-cyan-400/50 focus:outline-none font-sans"
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

          {/* Quick Preset Location Chips */}
          <div className="flex items-center justify-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
            {WORLD_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => flyToPreset(p)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-[#050814]/85 border border-glass-border hover:border-cyan-400/40 text-[10px] font-mono text-gray-300 hover:text-cyan-400 transition-colors shadow-lg cursor-pointer"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Top-Right Floating 3D Globe Layers Panel */}
        <div className="absolute right-6 top-6 z-30 w-56 rounded-2xl border border-glass-border bg-[#050814]/90 p-3.5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setLayersOpen(!layersOpen)}
            className="flex w-full items-center justify-between text-xs font-mono font-bold text-white uppercase"
          >
            <span className="flex items-center gap-2">
              <Layers size={14} className="text-cyan-400" />
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
                  className="rounded border-gray-600 text-cyan-400 focus:ring-0"
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
                  className="rounded border-gray-600 text-cyan-400 focus:ring-0"
                />
              </label>
            </div>
          )}
        </div>

        {/* Bottom-Left Coordinate & Telemetry HUD */}
        <div className="absolute left-6 bottom-24 z-30 flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-[#050814]/90 border border-glass-border text-[10px] font-mono text-gray-300 backdrop-blur-md shadow-2xl">
          {activeLocationTitle && (
            <>
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-cyan-400" />
                <span className="text-cyan-400 font-bold max-w-[160px] truncate">{activeLocationTitle}</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
            </>
          )}
          <div>COORDS: <span className="text-cyan-400 font-bold">{coords.lat}° N, {coords.lng}° E</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>ZOOM: <span className="text-white font-bold">{currentZoom}x</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>PITCH: <span className="text-purple-300 font-bold">{currentPitch}°</span></div>
          <div className="h-3 w-px bg-white/20" />
          <div>ROTATION: <span className="text-emerald-400 font-bold">360° FREE ROTATE</span></div>
        </div>

        {/* Floating Bottom "Ask Orbit IQ..." Query Bar */}
        <div className="absolute inset-x-6 sm:inset-x-12 lg:inset-x-24 bottom-6 z-30 max-w-5xl mx-auto">
          <div className="glass-panel p-3 sm:p-4 rounded-2xl border-cyan-400/40 shadow-2xl space-y-2.5">
            
            <form onSubmit={(e) => handleQuery(e)} className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Bot size={18} />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Orbit IQ about this 3D Earth region..."
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
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-400/15 border border-glass-border hover:border-cyan-400/50 text-gray-300 hover:text-cyan-400 text-[11px] transition-colors cursor-pointer"
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
}
