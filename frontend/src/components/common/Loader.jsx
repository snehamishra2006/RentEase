import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = 'Loading records...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2]/90 dark:bg-stone-950/90 backdrop-blur-xs">
        <Loader2 className="w-10 h-10 text-[#1B3B2B] dark:text-emerald-400 animate-spin mb-3" />
        <p className="text-[#1C1917] dark:text-stone-100 font-serif text-sm font-semibold tracking-wide animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-7 h-7 text-[#1B3B2B] dark:text-emerald-400 animate-spin mb-2" />
      <p className="text-[#605A52] dark:text-stone-400 text-xs font-medium">{text}</p>
    </div>
  );
};

export default Loader;
