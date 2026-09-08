import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ScrollableTabsContainerProps {
  children: React.ReactNode;
  /** Custom outer wrapper styling */
  className?: string;
  /** Custom inner scrollable flex container styling */
  innerClassName?: string;
  /** Key to trigger auto-scrolling to the active tab ([data-active="true"]) */
  activeKey?: string | number;
  /** Background styling for edge gradient fade masks */
  gradientBg?: 'page' | 'white' | 'transparent';
}

export const ScrollableTabsContainer: React.FC<ScrollableTabsContainerProps> = ({
  children,
  className = '',
  innerClassName = '',
  activeKey,
  gradientBg = 'page',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse drag-to-scroll refs
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();

    const handleScroll = () => checkScrollability();
    el.addEventListener('scroll', handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkScrollability();
      });
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [checkScrollability]);

  // Auto-scroll active item into view when activeKey changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;

      const activeEl = el.querySelector('[data-active="true"]') as HTMLElement | null;
      if (activeEl) {
        const containerRect = el.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        // If outside or close to edges, center it smoothly
        if (
          activeRect.left < containerRect.left + 50 ||
          activeRect.right > containerRect.right - 50
        ) {
          activeEl.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          });
        }
      }
      checkScrollability();
    }, 60);

    return () => clearTimeout(timer);
  }, [activeKey, checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(180, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left mouse button only
    const el = containerRef.current;
    if (!el) return;

    isDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    const el = containerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    dragDistance.current = Math.abs(walk);

    if (dragDistance.current > 5 && !isDragging) {
      setIsDragging(true);
    }

    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDown.current = false;
    setTimeout(() => {
      setIsDragging(false);
      dragDistance.current = 0;
    }, 40);
  };

  // Prevent accidental button clicks when user was dragging
  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Resolve background gradient classes
  const leftGradientClass =
    gradientBg === 'white'
      ? 'from-white via-white/80 to-transparent'
      : gradientBg === 'transparent'
      ? 'from-transparent to-transparent'
      : 'from-[#F4F6F0] via-[#F4F6F0]/85 to-transparent';

  const rightGradientClass =
    gradientBg === 'white'
      ? 'from-white via-white/80 to-transparent'
      : gradientBg === 'transparent'
      ? 'from-transparent to-transparent'
      : 'from-[#F4F6F0] via-[#F4F6F0]/85 to-transparent';

  return (
    <div className={`relative group/tabs w-full ${className}`}>
      {/* Left Floating Arrow & Fade Mask */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pr-8 pl-0 pointer-events-none bg-gradient-to-r ${leftGradientClass} transition-opacity duration-200 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => handleScroll('left')}
          tabIndex={canScrollLeft ? 0 : -1}
          disabled={!canScrollLeft}
          className={`pointer-events-auto p-1.5 rounded-full bg-white text-gray-700 hover:text-sage-dark hover:bg-gray-50 border border-gray-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 ${
            canScrollLeft ? 'flex items-center justify-center' : 'hidden'
          }`}
          title="Geser tab ke kiri"
          aria-label="Geser tab ke kiri"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Scrollable Container with Mouse Drag & Wheel */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
        className={`flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 select-none ${
          isDragging ? 'cursor-grabbing scroll-auto' : 'cursor-grab md:cursor-default scroll-smooth'
        } ${innerClassName}`}
      >
        {children}
      </div>

      {/* Right Floating Arrow & Fade Mask */}
      <div
        className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pl-8 pr-0 pointer-events-none bg-gradient-to-l ${rightGradientClass} transition-opacity duration-200 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => handleScroll('right')}
          tabIndex={canScrollRight ? 0 : -1}
          disabled={!canScrollRight}
          className={`pointer-events-auto p-1.5 rounded-full bg-white text-gray-700 hover:text-sage-dark hover:bg-gray-50 border border-gray-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 ${
            canScrollRight ? 'flex items-center justify-center' : 'hidden'
          }`}
          title="Geser tab ke kanan"
          aria-label="Geser tab ke kanan"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
