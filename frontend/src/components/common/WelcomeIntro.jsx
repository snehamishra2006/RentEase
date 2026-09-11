import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';

const WelcomeIntro = ({ children }) => {
  const [showSplash, setShowSplash] = useState(() => {
    // Skip if already shown in session or if user prefers reduced motion
    const alreadyShown = sessionStorage.getItem('rentease_intro_shown');
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return !alreadyShown && !prefersReducedMotion;
  });

  const [stage, setStage] = useState(1); // 1 to 5
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    // Stage 2: Two hands bring seal together & impact (0.3s)
    const t1 = setTimeout(() => setStage(2), 300);

    // Stage 3: Seal impact & logo branding reveal (0.7s)
    const t2 = setTimeout(() => setStage(3), 700);

    // Stage 4: Wordmark & Tagline reveal (1.1s)
    const t3 = setTimeout(() => setStage(4), 1100);

    // Stage 5: Ledger book page-split reveal (1.8s)
    const t4 = setTimeout(() => {
      triggerLedgerBookReveal();
    }, 1800);

    // Keyboard shortcut to skip
    const handleKeyDown = () => triggerLedgerBookReveal();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSplash]);

  const triggerLedgerBookReveal = () => {
    setStage(5);
    setIsOpening(true);
    setTimeout(() => {
      sessionStorage.setItem('rentease_intro_shown', 'true');
      setShowSplash(false);
    }, 500);
  };

  if (!showSplash) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Background Main App Layer (Mounted & Ready underneath) */}
      <div className={isOpening ? 'opacity-100 transition-opacity duration-500' : 'opacity-100'}>
        {children}
      </div>

      {/* Fullscreen Cinematic Splash Overlay */}
      <div
        onClick={triggerLedgerBookReveal}
        className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center cursor-pointer select-none"
      >
        {/* Left Ledger Book Door Panel */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#F4B4AC] via-[#FCE4E0] to-[#FAF7F2] dark:from-[#3D221B] dark:via-[#281814] dark:to-[#121210] border-r border-[#E2DACD] dark:border-stone-800 transition-transform duration-500 ease-in-out ${
            isOpening ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        />

        {/* Right Ledger Book Door Panel */}
        <div
          className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#F4B4AC] via-[#FCE4E0] to-[#FAF7F2] dark:from-[#3D221B] dark:via-[#281814] dark:to-[#121210] border-l border-[#E2DACD] dark:border-stone-800 transition-transform duration-500 ease-in-out ${
            isOpening ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        />

        {/* Background Paper-Grain Texture & Gold Dust Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1B3B2B_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Floating Gold Mote Dust Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#B8860B]/40 blur-xs animate-bounce"
              style={{
                left: `${12 + i * 11}%`,
                top: `${20 + (i % 4) * 20}%`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Center Animation Content Container */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center p-6 space-y-4 text-center transition-all duration-500 ${
            isOpening ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Top Headline Tagline Pill: Find. Feel. Belong. */}
          <div className="mb-1">
            <span className="inline-block px-5 py-2 rounded-full bg-white/95 dark:bg-stone-900/95 border-2 border-[#1B3B2B] dark:border-emerald-500 text-[#1B3B2B] dark:text-emerald-400 font-serif font-extrabold text-base sm:text-lg tracking-widest uppercase shadow-lg">
              Find. Feel. Belong.
            </span>
          </div>

          {/* Stage 2 & 3: Wax-Seal Stamp Impact & Ink Ripple */}
          <div className="relative w-32 h-32 flex items-center justify-center my-1">
            {/* Left Hand Holding Half Seal SVG */}
            <div
              className={`absolute transition-all duration-500 ease-out transform ${
                stage >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
              }`}
            >
              <svg className="w-18 h-18 text-[#8C3A1D]" fill="currentColor" viewBox="0 0 100 100">
                <path d="M 10 90 Q 40 60 50 50 A 25 25 0 0 1 50 0 L 10 90 Z" opacity="0.8" />
              </svg>
            </div>

            {/* Right Hand Holding Half Seal SVG */}
            <div
              className={`absolute transition-all duration-500 ease-out transform ${
                stage >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
              }`}
            >
              <svg className="w-18 h-18 text-[#8C3A1D]" fill="currentColor" viewBox="0 0 100 100">
                <path d="M 90 90 Q 60 60 50 50 A 25 25 0 0 0 50 0 L 90 90 Z" opacity="0.8" />
              </svg>
            </div>

            {/* Ink Ripple Expansion Effect at Impact */}
            {stage >= 3 && (
              <div className="absolute w-28 h-28 rounded-full border-4 border-[#B8860B]/60 animate-ping opacity-40" />
            )}

            {/* Wax Seal Stamp Disc Container */}
            <div
              className={`w-24 h-24 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center shadow-2xl border-4 border-[#B8860B] transition-all duration-500 transform ${
                stage >= 3
                  ? 'scale-100 rotate-0 opacity-100'
                  : stage === 2
                  ? 'scale-125 rotate-12 opacity-90'
                  : 'scale-0 opacity-0'
              }`}
            >
              {/* RentEase House Logo inside Wax Seal */}
              <Building2 className="w-10 h-10 text-[#FAF7F2]" />
            </div>
          </div>

          {/* Stage 4: Wordmark & Tagline Text Reveal */}
          <div
            className={`space-y-2 transition-all duration-500 ease-out transform ${
              stage >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 dark:bg-stone-900/90 border border-[#E2DACD] dark:border-stone-700 text-[#1B3B2B] dark:text-emerald-400 text-[10px] font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Pukkaa Deed Ledger</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1C1917] dark:text-[#FAF7F2] tracking-tight">
              RentEase
            </h1>

            {/* Primary Brand Tagline */}
            <p className="text-xs sm:text-sm font-serif font-extrabold text-[#8C3A1D] dark:text-amber-300 tracking-wider uppercase">
              #Search Se Shift Tak, Sab Ek Jagah
            </p>

            {/* Animated Underline Signature Line */}
            <div className="w-44 mx-auto h-0.5 bg-[#B8860B] rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#1B3B2B] transition-all duration-500 ${
                  stage >= 4 ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>

          {/* Click to Skip Prompt */}
          <div className="pt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#605A52] dark:text-stone-400 bg-white/60 dark:bg-stone-900/60 px-3 py-1 rounded-full border border-[#E2DACD] dark:border-stone-700">
              Click anywhere to skip
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeIntro;
