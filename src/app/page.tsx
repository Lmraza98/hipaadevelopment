'use client'
import { useRef, useState, useEffect } from 'react';
import doctorAnimation from '../../public/Comp.json';
import Lottie from 'lottie-react';

export default function Home() {
  const lottieRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  // Control Lottie playback imperatively
  useEffect(() => {
    if (lottieRef.current && isAnimationReady) {
      try {
        // @ts-expect-error LottieRef type does not include play(), but it exists at runtime
        if (isHovered) lottieRef.current.play();
        // @ts-expect-error LottieRef type does not include stop(), but it exists at runtime
        else lottieRef.current.stop();
      } catch (error) {
        console.error('Error controlling animation:', error);
      }
    }
  }, [isHovered, isAnimationReady]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#8ecae6] to-[#bde0fe] p-4 sm:p-0">
      <section className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-8 md:gap-0 py-12">
        {/* Text Content (right) */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md mb-6 leading-tight">
            HIPAA-<br />
            Compliant<br />
            Software<br />
            Development
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-md">
            We build secure, HIPAA-compliant apps and software for healthcare, insurance, wellness, and any business handling sensitive health data.
          </p>
          <div className="flex gap-4">
            <button
              className="bg-[#183153] text-white text-lg font-semibold rounded-full px-8 py-4 shadow-lg hover:bg-[#274472] transition mb-4"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Get Started
            </button>
            <button
              className="bg-white/20 text-white text-lg font-semibold rounded-full px-8 py-4 shadow-lg hover:bg-[#274472]/80 transition mb-4 border border-white/30"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Learn More
            </button>
          </div>
        </div>
        {/* Phone illustration (left) */}
        <div className="flex-1 flex items-start justify-start relative w-full h-[500px]">
          {/* Phone illustration (background) */}
          <div className="relative w-[260px] h-[500px] bg-white rounded-[40px] border-4 border-[#274472] z-10 flex flex-col items-center shadow-xl">
            {/* Phone notch */}
            <div className="w-24 h-6 bg-[#274472] rounded-b-2xl mt-2 mb-4"></div>
            {/* Medical cross icon */}
            <div className="w-16 h-16 bg-[#8ecae6] rounded-full flex items-center justify-center mt-2 mb-4">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#8ecae6" />
                <rect x="16" y="9" width="4" height="18" rx="2" fill="white" />
                <rect x="9" y="16" width="18" height="4" rx="2" fill="white" />
              </svg>
            </div>
            {/* Phone screen */}
            <div className="flex-1 w-full bg-white rounded-b-[32px] border-t-2 border-[#e0e0e0] flex items-center justify-center relative overflow-hidden">
              {/* Empty for now, doctor is outside */}
            </div>
          </div>
        </div>
        
      </section>
      {/* Doctor Lottie Animation - fixed to bottom right of the screen */}
      <div className="fixed right-4 bottom-0 h-[600px] w-[250px] flex items-end justify-end z-20 pointer-events-none">
        <Lottie
          lottieRef={lottieRef}
          animationData={doctorAnimation}
          loop
          autoplay={false}
          onComplete={() => setIsAnimationReady(true)}
          style={{
            transform: 'scale(4)',
            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
