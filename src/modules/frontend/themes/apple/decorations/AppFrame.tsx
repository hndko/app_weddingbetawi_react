import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { DynamicIsland } from './DynamicIsland';
import { FloatingAppleParticles } from './FloatingAppleParticles';

export const AppFrame: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Ambient Floating Apple Particles */}
      <FloatingAppleParticles count={7} />

      {/* iOS Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-11 px-6 flex items-center justify-between text-neutral-800 dark:text-neutral-200 z-[95] pointer-events-none select-none">
        {/* Left: Clock */}
        <div className="w-16 flex items-center">
          <span className="text-[13px] font-semibold tracking-tight font-sans">
            {currentTime}
          </span>
        </div>

        {/* Dynamic Island sits in the center via its absolute positioning */}
        <DynamicIsland />

        {/* Right: Signal, Wi-Fi, Battery */}
        <div className="w-16 flex items-center justify-end gap-1.5 text-neutral-800 dark:text-neutral-200">
          <Signal size={13} strokeWidth={2.5} />
          <Wifi size={13} strokeWidth={2.5} />
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
              <div className="w-full h-full bg-current rounded-[1.5px]" />
            </div>
            <div className="w-0.5 h-1 bg-current rounded-r-xs" />
          </div>
        </div>
      </div>
    </>
  );
};
