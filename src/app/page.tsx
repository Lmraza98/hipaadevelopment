'use client'
import { useRef, useState, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import doctorAnimation from '../../public/Comp.json';
import dnaAnimation from '../../public/DNA.json';


/* ─── Timing + feel ─────────────────────────────────────── */
const ZOOM_DURATION       = 1200;
const SCALE_BACK_DURATION = 450;
const CONTENT_REVEAL      = 3 * ZOOM_DURATION;
const BEZEL_HIDE_TIME     = 0.85 * ZOOM_DURATION;
// const ZOOM_FACTOR         = 9;
const slowEase = 'cubic-bezier(0.85,0,0.2,1)';
const fastEase = 'cubic-bezier(0.7,0,0.3,1)';

const SCRUB_RADIUS_MULTIPLIER = 4;   // bigger number → larger zone
const SCRUB_EASING            = 5;  

/* ───────────────────────────────────────────────────────── */

export default function Home() {
  const lottieRef        = useRef<LottieRefCurrentProps>(null);
  const totalFramesRef   = useRef(0);           // total frames of the Lottie
  const rafIdRef         = useRef<number | undefined>(undefined);
  const containerRef     = useRef<HTMLDivElement>(null);
  const phoneScreenRef   = useRef<HTMLDivElement>(null);

  const [isZoomed, setIsZoomed]       = useState(false);
  const [cameraTf, setCameraTf]       = useState('');
  const [hideBezel, setHideBezel]     = useState(false);
  const [zoomDone, setZoomDone]       = useState(false);

  /* ─── Mouse‑distance scrubbing ───────────────────────── */
  useEffect(() => {
    const clamp = (v:number,min=0,max=1)=>Math.max(min,Math.min(max,v));
  
    function handleMove(e: MouseEvent) {
      if (!phoneScreenRef.current || !lottieRef.current) return;
  
      const rect = phoneScreenRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
  
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
  
      const halfDiag = Math.hypot(rect.width, rect.height) / 2;
      const maxDist  = halfDiag * SCRUB_RADIUS_MULTIPLIER;
  
      /* progress: 1 at centre  →  0 at (or beyond) max radius */
      let progress = clamp(1 - dist / maxDist);
  
      /* ease the progress so it changes more gradually */
      progress = Math.pow(progress, SCRUB_EASING);
  
      /* seek the Lottie on the next animation frame */
      cancelAnimationFrame(rafIdRef.current!);
      rafIdRef.current = requestAnimationFrame(() => {
        lottieRef.current!.goToAndStop(progress * totalFramesRef.current, true);
      });
    }
  
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafIdRef.current!);
    };
  }, []);

  /* ─── Zoom trigger (unchanged) ───────────────────────── */
  const handleClick = () => {
    if (!phoneScreenRef.current || !containerRef.current) return;
  
    /* 1.  dimensions of JUST the glass */
    const rect = phoneScreenRef.current.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;
  
    /* 2.  base scale that fills the smaller viewport dimension */
    const base = Math.max(vw / rect.width, vh / rect.height);  // ★ note max()
  
    /* 3.  overshoot so glass > viewport (1.75‑2 feels "infinite") */
    const OVERSHOOT = 1;          // tweak to taste
    const scale     = base * OVERSHOOT;
  
    /* 4.  translate so the DNA's centre stays centred while we scale */
    const tx = vw / 2 - (rect.left + rect.width  / 2);
    const ty = vh / 2 - (rect.top  + rect.height / 2);
  
    setCameraTf(`translate(${tx}px,${ty}px) scale(${scale})`);
    setIsZoomed(true);
  
    /* timers unchanged */
    setTimeout(() => setZoomDone(true),  CONTENT_REVEAL);
    setTimeout(() => setHideBezel(true), BEZEL_HIDE_TIME);
  };
  

  return (
    <div
      ref={containerRef}
      className={`h-screen w-screen overflow-hidden ${
        zoomDone ? 'bg-white' : 'min-h-screen bg-gradient-to-bl from-[#93D8C9] to-[#59A1CF]'
      }`}
      style={{
        transition: `transform ${
          zoomDone ? SCALE_BACK_DURATION : ZOOM_DURATION
        }ms ${zoomDone ? fastEase : slowEase}`,
        transform: zoomDone ? 'none' : isZoomed ? cameraTf : 'none',
        transformOrigin: 'center center'
      }}
    >
      {/* HERO / CTA */}
      {!zoomDone && (
        <section className={`absolute inset-0 flex flex-row items-center justify-center transition-opacity duration-700 ${
            isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{zIndex:10}}>
          <div className="w-full flex flex-col items-center md:items-center text-center md:text-left px-4 md:px-0">
            <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md mb-6 leading-tight">
              HIPAA-<br/>Compliant<br/>Software<br/>Development
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-sm leading-loose">
              We build secure, HIPAA‑compliant apps and software for healthcare, insurance,
              wellness, and any business handling sensitive health data.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#183153] text-white text-lg font-semibold rounded-md px-8 py-4 shadow-lg hover:bg-[#274472] transition mb-4"
                onClick={handleClick} disabled={isZoomed}>Get Started</button>
              <button className="bg-white/20 text-white text-lg font-semibold rounded-md px-8 py-4 shadow-lg hover:bg-[#274472]/80 transition mb-4 border border-white/30"
                onClick={handleClick} disabled={isZoomed}>Learn More</button>
            </div>
            </div>
          </div>
          <div className="w-full h-full">
            
          </div>
        </section>
      )}

      {/* PHONE (refreshed styling) */}
      {!zoomDone && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 270, height: 540, zIndex: 20 }}
        >
          {/* OUTER FRAME – dark glass + soft bevel */}
          <div className="relative w-full h-full rounded-[44px] bg-gradient-to-br from-[#274472] to-[#1b3357] p-[5px]     shadow-[0_12px_24px_-6px_rgba(0,0,0,0.35)]">
              {/* GLASS */}
              <div
                ref={phoneScreenRef}          // <- still the element we measure
                className="relative w-full h-full rounded-[38px] bg-[#51A5E1] overflow-hidden"
              >
                {/* DNA animation */}
                <Lottie
                  animationData={dnaAnimation}
                  loop
                  autoplay

                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                {/* ----- TOP AREA (hideBezel controlled) ----- */}
                {!hideBezel && (
                  <>
                    {/* tiny speaker grille */}
                    <div className="absolute inset-x-1/2 -translate-x-1/2 top-[7px] w-[50px] h-[4px] rounded bg-slate-300/40" />
                  </>
                )}
                {/* home‑indicator bar (always on) */}
                <div className="absolute bottom-3 inset-x-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-slate-300/50" />
              </div>
            {/* OPTIONAL HAND‑WITH‑PHONE OVERLAY (keep your existing Lottie / SVG) */}
            {/* <div className="absolute -bottom-6 -right-12 w-[160px] pointer-events-none">
                ...doctor hand holding phone SVG / Lottie...
              </div> */}
          </div>
        </div>
      )}


      {/* FULL‑SCREEN CONTENT – slides up */}
      {zoomDone && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto p-8 animate-slide-up flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-[#183153] mb-4">Coming Soon</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-sm leading-loose">
            We are currently working on this page. Please check back soon.
          </p>
        </div>
      )}

      {/* Lottie doctor */}
      {!isZoomed && (
        <div className="fixed right-1/5 bottom-[-50px] h-[600px] w-[250px] flex items-end justify-end z-20 pointer-events-none">
          <Lottie
            lottieRef={lottieRef}
            animationData={doctorAnimation}
            loop
            autoplay={false}
            onDOMLoaded={()=>{
              totalFramesRef.current = lottieRef.current?.getDuration(true) || 0;
            }}
            style={{ transform:'scale(4.5)', transformOrigin:'bottom center' }}
          />
        </div>
      )}

      {/* keyframes */}
      <style jsx global>{`
        .animate-slide-up{animation:slideUp .7s cubic-bezier(.7,0,.2,1) forwards;}
        @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
      `}</style>
    </div>
  );
}
