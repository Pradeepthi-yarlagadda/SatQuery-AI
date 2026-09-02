'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as maplibreglNS from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ChevronDown,
  Image as ImageIcon,
  Clock,
  ScanEye,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const maplibregl: any = (maplibreglNS as any).default || maplibreglNS;

const HOME_CENTER: [number, number] = [78.9629, 20.5937];

// Scroll-progress camera keyframes for the cinematic dive. Bearing is not
// interpolated here — it's left to the separate idle auto-rotation loop so
// the globe keeps a living, spinning feel even while the camera pushes in
// and pulls back. progress 0 = the resting landing framing (matches the
// provided design), 0.45 = closest approach ("diving toward" the surface),
// 1 = pulled all the way back to see the whole planet, Google-Earth style.
const CAMERA_KEYFRAMES = [
  { p: 0, zoom: 1.7, pitch: 0 },
  { p: 0.45, zoom: 5.5, pitch: 55 },
  { p: 1, zoom: 0.35, pitch: 0 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cameraForProgress(rawProgress: number) {
  const progress = easeInOutCubic(Math.min(1, Math.max(0, rawProgress)));
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    const a = CAMERA_KEYFRAMES[i];
    const b = CAMERA_KEYFRAMES[i + 1];
    if (progress >= a.p && progress <= b.p) {
      const t = (progress - a.p) / (b.p - a.p);
      return { zoom: lerp(a.zoom, b.zoom, t), pitch: lerp(a.pitch, b.pitch, t) };
    }
  }
  const last = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  return { zoom: last.zoom, pitch: last.pitch };
}

const FEATURE_CARDS = [
  { icon: ImageIcon, title: 'Single Image', desc: 'Understand any scene', scenario: 'grounding-water' },
  { icon: Clock, title: 'Temporal Analysis', desc: 'Detect changes over time', scenario: 'temporal-expansion' },
  { icon: ScanEye, title: 'Optical + SAR', desc: 'Multi-sensor intelligence', scenario: 'optical-sar-fusion' },
  { icon: Sparkles, title: 'AI-Powered', desc: 'Agentic analysis & insights', scenario: 'vqa-landcover' },
];

export default function LandingPage() {
  const cinematicRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const rotationFrameRef = useRef<number | null>(null);
  const userInteractingRef = useRef(false);
  const resumeRotationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileChecked, setMobileChecked] = useState(false);

  // Detect narrow / low-power devices once on mount and skip the live WebGL
  // globe there — a static background with a lighter CSS-only scroll fade
  // is a much cheaper, still-reasonable fallback for the same interaction.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    setMobileChecked(true);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Initialize the MapLibre 3D globe — it sits behind the landing page from
  // the very first frame, at the resting camera framing.
  useEffect(() => {
    if (!mobileChecked || isMobile) return;
    if (!mapContainerRef.current) return;
    let isMounted = true;
    let mapInstance: any = null;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-imagery': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
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
            paint: { 'raster-fade-duration': 300 },
          },
        ],
      },
      projection: 'globe',
      center: HOME_CENTER,
      zoom: CAMERA_KEYFRAMES[0].zoom,
      pitch: CAMERA_KEYFRAMES[0].pitch,
      bearing: 0,
      attributionControl: false,
      dragRotate: true,
      touchZoomRotate: true,
      scrollZoom: false, // native page scroll drives the camera instead
      dragPan: false, // panning would fight the scroll-driven center; rotate/zoom stay interactive
    });

    map.on('style.load', () => {
      if (!isMounted) return;
      if (typeof map.setSky === 'function') {
        map.setSky({
          'sky-color': '#000005',
          'sky-horizon-blend': 0.5,
          'horizon-color': '#3b82f6',
          'horizon-fog-blend': 0.6,
          'fog-color': '#0a1a3d',
          'fog-ground-blend': 0.5,
        });
      }
      setMapReady(true);
      map.resize();
    });

    const pauseRotation = () => {
      userInteractingRef.current = true;
      if (resumeRotationTimeoutRef.current) clearTimeout(resumeRotationTimeoutRef.current);
    };
    const scheduleResumeRotation = () => {
      if (resumeRotationTimeoutRef.current) clearTimeout(resumeRotationTimeoutRef.current);
      resumeRotationTimeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
      }, 2500);
    };
    map.on('rotatestart', pauseRotation);
    map.on('pitchstart', pauseRotation);
    map.on('rotateend', scheduleResumeRotation);
    map.on('pitchend', scheduleResumeRotation);

    mapRef.current = map;
    mapInstance = map;
    setTimeout(() => mapRef.current?.resize(), 150);

    const handleResize = () => mapRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (resumeRotationTimeoutRef.current) clearTimeout(resumeRotationTimeoutRef.current);
      mapInstance?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [mobileChecked, isMobile]);

  // Idle auto-rotation — bearing spins continuously regardless of scroll
  // progress, independent of the scroll-driven zoom/pitch, so the planet
  // always feels alive rather than static during the cinematic sequence.
  useEffect(() => {
    if (!mapReady) return;
    const spin = () => {
      const map = mapRef.current;
      if (map && !userInteractingRef.current) {
        map.setBearing((map.getBearing() + 0.02) % 360);
      }
      rotationFrameRef.current = requestAnimationFrame(spin);
    };
    rotationFrameRef.current = requestAnimationFrame(spin);
    return () => {
      if (rotationFrameRef.current) cancelAnimationFrame(rotationFrameRef.current);
    };
  }, [mapReady]);

  // The core interaction: scroll position (not discrete click events) drives
  // the camera continuously and reversibly. rAF-throttled so it stays smooth
  // even on fast scroll-wheel bursts.
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = cinematicRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollableHeight = rect.height - window.innerHeight;
        const raw = scrollableHeight > 0 ? -rect.top / scrollableHeight : 0;
        const progress = Math.min(1, Math.max(0, raw));
        setScrollProgress(progress);

        const map = mapRef.current;
        if (map) {
          const { zoom, pitch } = cameraForProgress(progress);
          map.jumpTo({ zoom, pitch, center: HOME_CENTER });
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToProgress = (target: number) => {
    const el = cinematicRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const currentScrollY = window.scrollY;
    const sectionTop = currentScrollY + rect.top;
    window.scrollTo({ top: sectionTop + scrollableHeight * target, behavior: 'smooth' });
  };

  // Hero content fades and drifts away early in the scroll — it should feel
  // like the camera is moving past it toward Earth, not like a section swap.
  const heroOpacity = Math.max(0, 1 - scrollProgress / 0.22);
  const heroTranslate = Math.min(1, scrollProgress / 0.22) * -36;
  const heroScale = 1 - Math.min(1, scrollProgress / 0.22) * 0.05;

  return (
    <div className="relative bg-[#020617] text-slate-100">
      {/* Persistent top nav — stays fixed across the whole page, cinematic
          section and normal content alike. */}
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto flex items-center justify-between rounded-full border border-glass-border bg-glass px-4 py-2.5 backdrop-blur-xl">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full orbit-ring bg-glass">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nebula/20 to-orbit/20" />
                <div className="relative h-5 w-5">
                  <div className="absolute inset-0 rounded-full border-2 border-nebula" />
                  <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orbit" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Orbit <span className="text-gradient">IQ</span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white hover:text-cyan-accent transition-colors">Home</button>
              <button onClick={() => scrollToProgress(1)} className="hover:text-cyan-accent transition-colors">Explore</button>
              <Link href="/workspace" className="hover:text-cyan-accent transition-colors">Features</Link>
              <Link href="/technology" className="hover:text-cyan-accent transition-colors">About</Link>
            </nav>

            <Link
              href="/workspace"
              className="inline-flex items-center justify-center rounded-full gradient-cta px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── CINEMATIC SECTION ─────────────────────────────────────────────
          A tall scroll track with a pinned (sticky) viewport inside. Scroll
          position within this track maps directly to camera progress — the
          landing page IS the resting frame (progress 0) of the same scene
          the globe belongs to, not a separate section stacked on top of it. */}
      <div ref={cinematicRef} className="relative" style={{ height: isMobile ? '160vh' : '400vh' }}>
        <div className="sticky top-0 h-screen w-screen overflow-hidden">
          {/* Live globe / static fallback background */}
          <div className="absolute inset-0 z-0">
            {!isMobile && (
              <div
                id="map-container"
                ref={mapContainerRef}
                className="absolute inset-0 h-full w-full"
              />
            )}
            <img
              src="/images/assets/hero-satellite.jpg"
              alt="Photorealistic Earth view from space with orbiting satellite"
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.92] saturate-[1.15] transition-opacity duration-700"
              style={{
                opacity: isMobile ? 1 - scrollProgress * 0.3 : mapReady ? 0 : 1,
                transform: isMobile ? `scale(${1 + scrollProgress * 0.15})` : undefined,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/55 via-transparent to-[#020617]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
          </div>

          {/* Hero content — fades/drifts away as scroll progress advances */}
          <div
            className="relative z-10 flex h-full w-full flex-col justify-between p-6 pt-28 sm:p-8 sm:pt-32 lg:p-10 lg:pt-36"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${heroTranslate}px) scale(${heroScale})`,
              pointerEvents: heroOpacity < 0.05 ? 'none' : 'auto',
            }}
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse" />
                <span className="text-xs font-semibold tracking-widest text-white/90 uppercase font-mono">
                  AI FOR EARTH INTELLIGENCE
                </span>
              </div>

              <h1 className="mt-6 text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl font-sans">
                Orbit <span className="text-gradient">IQ</span>
              </h1>

              <h2 className="mt-2 text-xl font-semibold tracking-[0.2em] text-cyan-accent sm:text-2xl font-mono">
                TALK TO EARTH.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg font-sans">
                An interactive vision-language assistant for multimodal remote sensing image analysis through natural language queries.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToProgress(1)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer font-sans"
                >
                  <span>Explore Orbit IQ</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="w-full">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                {FEATURE_CARDS.map((card) => (
                  <Link
                    key={card.title}
                    href={`/workspace?scenario=${card.scenario}`}
                    className="group glass-card hero-glow rounded-2xl p-4 transition-all hover:border-slate-line/40 hover:bg-white/[0.06] block cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-white/[0.04] text-cyan-accent group-hover:bg-cyan-accent/10 transition-colors">
                        <card.icon size={18} strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{card.title}</h3>
                        <p className="mt-0.5 text-xs text-gray-400">{card.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 mx-auto flex flex-col items-center justify-center gap-1 text-xs font-medium tracking-widest text-gray-400 uppercase">
                <span>SCROLL TO EXPLORE</span>
                <ChevronDown size={16} className="animate-bounce text-cyan-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NORMAL CONTENT ────────────────────────────────────────────────
          Once the cinematic dive has fully played out (scroll progress
          reaches 1 and the sticky viewport unpins), ordinary page content
          continues below in normal document flow. */}
      <section className="relative z-10 bg-[#020617] px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl font-sans">
            You've seen the whole planet. <span className="text-gradient">Now zoom into a region.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400 font-sans">
            Mission Control lets you upload GeoTIFF observations and ask natural-language questions about bi-temporal change, optical+SAR fusion, and spatial grounding.
          </p>
          <Link
            href="/workspace"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 font-sans"
          >
            <span>Launch Mission Control</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
