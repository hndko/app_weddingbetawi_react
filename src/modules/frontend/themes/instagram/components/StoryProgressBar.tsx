import React from 'react';

interface StoryProgressBarProps {
  totalSegments: number;
  activeIndex: number;
  progress: number; // 0 to 100
  onSegmentClick?: (index: number) => void;
}

export const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  totalSegments,
  activeIndex,
  progress,
  onSegmentClick,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 px-3 pt-3 pb-1 flex items-center gap-1 select-none pointer-events-auto">
      {Array.from({ length: totalSegments }, (_, i) => {
        let barWidth = '0%';
        if (i < activeIndex) {
          barWidth = '100%';
        } else if (i === activeIndex) {
          barWidth = `${Math.min(100, Math.max(0, progress))}%`;
        }

        return (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onSegmentClick?.(i);
            }}
            className="flex-1 h-[14px] flex items-center cursor-pointer py-1"
          >
            <div className="w-full h-[2.5px] rounded-full bg-white/30 overflow-hidden backdrop-blur-xs">
              <div
                className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                style={{ width: barWidth }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
