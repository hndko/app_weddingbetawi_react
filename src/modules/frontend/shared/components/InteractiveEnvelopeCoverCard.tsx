import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { playEnvelopeOpenSound } from '../../../../utils/envelopeAudio';

export interface InteractiveEnvelopeThemeStyle {
  envelopePocketBg?: string;
  envelopeFlapBg?: string;
  envelopeBorder?: string;
  waxColor?: string;
  waxRingColor?: string;
  waxTextColor?: string;
  letterBg?: string;
  letterBorder?: string;
  letterTextColor?: string;
  letterMutedColor?: string;
  badgeBg?: string;
  badgeBorder?: string;
  buttonBg?: string;
  buttonText?: string;
}

export interface InteractiveEnvelopeCoverCardProps {
  onOpen: () => void;
  guestName: string;
  recipientLabel?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  monogram?: string;
  className?: string;
  themeStyle?: InteractiveEnvelopeThemeStyle;
  children?: React.ReactNode;
}

export const InteractiveEnvelopeCoverCard: React.FC<InteractiveEnvelopeCoverCardProps> = ({
  onOpen,
  guestName,
  recipientLabel = 'Kepada Yth. Bapak/Ibu/Saudara/i:',
  buttonText = 'Buka Undangan',
  buttonIcon = <MailOpen size={17} />,
  monogram,
  className = '',
  themeStyle,
  children,
}) => {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();
  const [isOpening, setIsOpening] = useState(false);

  // Derive elegant monogram if not explicitly specified (e.g. "C & I")
  const defaultMonogram = React.useMemo(() => {
    const groomInitial = (weddingConfig.groom?.nickname || 'G').trim().charAt(0).toUpperCase();
    const brideInitial = (weddingConfig.bride?.nickname || 'B').trim().charAt(0).toUpperCase();
    return `${groomInitial} & ${brideInitial}`;
  }, [weddingConfig.groom?.nickname, weddingConfig.bride?.nickname]);

  const activeMonogram = monogram || defaultMonogram;

  // Harmonized styling with fallback to active theme visual tokens
  const styles = {
    envelopePocketBg: themeStyle?.envelopePocketBg || (isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.94)'),
    envelopeFlapBg: themeStyle?.envelopeFlapBg || (isDark ? 'rgba(38, 38, 38, 0.98)' : 'rgba(248, 246, 240, 0.98)'),
    envelopeBorder: themeStyle?.envelopeBorder || (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(212, 175, 55, 0.4)'),
    waxColor: themeStyle?.waxColor || (isDark ? '#991B1B' : '#8B0000'),
    waxRingColor: themeStyle?.waxRingColor || '#D4AF37',
    waxTextColor: themeStyle?.waxTextColor || '#FDFBF7',
    badgeBg: themeStyle?.badgeBg || themeStyle?.letterBg || (isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.98)'),
    badgeBorder: themeStyle?.badgeBorder || themeStyle?.letterBorder || themeStyle?.envelopeBorder || (isDark ? 'rgba(212, 175, 55, 0.35)' : 'rgba(212, 175, 55, 0.5)'),
    letterBg: themeStyle?.letterBg || (isDark ? 'rgba(24, 24, 27, 0.98)' : 'rgba(255, 255, 255, 0.99)'),
    letterBorder: themeStyle?.letterBorder || (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(212, 175, 55, 0.45)'),
    letterTextColor: themeStyle?.letterTextColor || tokens.textPrimary,
    letterMutedColor: themeStyle?.letterMutedColor || tokens.textMuted,
    buttonBg: themeStyle?.buttonBg || tokens.btnPrimaryBg,
    buttonText: themeStyle?.buttonText || tokens.btnPrimaryText,
  };

  const handleOpenSequence = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play native synthesized acoustic experience (wax pop + paper rustle + harp chime)
    playEnvelopeOpenSound();

    // 2. Allow 3D flap flip & letter slide-out animations to unfold gracefully before closing cover
    setTimeout(() => {
      onOpen();
    }, 850);
  };

  return (
    <div className={`w-full max-w-[340px] mx-auto flex flex-col items-center relative select-none ${className}`}>
      {/* 3D Envelope Perspective Container */}
      <div 
        className="w-full relative cursor-pointer group"
        style={{ perspective: '1200px' }}
        onClick={handleOpenSequence}
      >
        {/* Envelope Outer Frame */}
        <div className="relative w-full h-[240px] rounded-2xl shadow-xl overflow-visible transition-transform duration-300 group-hover:scale-[1.01]">
          
          {/* ========================================================================= */}
          {/* 1. TOP 3D FLAP (Unfolds 180° upwards when opened) */}
          {/* ========================================================================= */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[90px] z-30 origin-top overflow-visible pointer-events-none"
            style={{ 
              transformStyle: 'preserve-3d',
            }}
            initial={false}
            animate={isOpening ? { 
              rotateX: -180, 
              zIndex: 1, 
              filter: 'brightness(0.95)' 
            } : { 
              rotateX: 0, 
              zIndex: 35, 
              filter: 'brightness(1)' 
            }}
            transition={{ duration: 0.65, ease: [0.45, 0, 0.55, 1] }}
          >
            {/* Flap SVG Polygon with Luxury Bevel & Border */}
            <svg 
              className="w-full h-full drop-shadow-md overflow-visible" 
              viewBox="0 0 340 90" 
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="envelopeFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={styles.envelopeFlapBg} />
                  <stop offset="100%" stopColor={styles.envelopePocketBg} />
                </linearGradient>
                <filter id="flapShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.22" />
                </filter>
              </defs>
              <path 
                d="M 0 0 L 170 82 Q 170 84 170 82 L 340 0 Z" 
                fill="url(#envelopeFlapGrad)"
                stroke={styles.envelopeBorder}
                strokeWidth="1.5"
                filter="url(#flapShadow)"
              />
            </svg>

            {/* 3D Wax Seal Monogram (Positioned at apex of flap) */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-[54px] z-40 pointer-events-auto cursor-pointer"
              animate={isOpening ? {
                scale: [1, 1.25, 0],
                opacity: [1, 0.9, 0],
                rotate: [0, 8, -12],
              } : {
                scale: [1, 1.04, 1],
              }}
              transition={isOpening ? {
                duration: 0.45,
                ease: 'easeOut',
              } : {
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div 
                className="w-13 h-13 rounded-full flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${styles.waxColor}, #450A0A)`,
                  boxShadow: `0 6px 16px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -3px 6px rgba(0, 0, 0, 0.5)`,
                }}
              >
                {/* Organic Scalloped Wax Border */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="23" fill="none" stroke={styles.waxRingColor} strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx="26" cy="26" r="20.5" fill="none" stroke={styles.waxRingColor} strokeWidth="1.5" />
                </svg>

                {/* Monogram Text */}
                <span 
                  className="font-heading text-xs sm:text-[12px] tracking-wider font-bold relative z-10 select-none text-center px-1"
                  style={{ 
                    color: styles.waxTextColor,
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  {activeMonogram}
                </span>

                {/* Wax Seal Click Hint Sparkle */}
                <motion.div 
                  className="absolute -top-1 -right-1 text-amber-300"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={12} />
                </motion.div>
              </div>
            </motion.div>

            {/* Golden Sparkle Burst Particles (Fires on Opening) */}
            <AnimatePresence>
              {isOpening && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[60px] pointer-events-none">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-sm"
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      animate={{
                        x: Math.cos((angle * Math.PI) / 180) * 50,
                        y: Math.sin((angle * Math.PI) / 180) * 50,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ========================================================================= */}
          {/* 2. INNER LETTER CARD (Slides smoothly UPWARD on opening) */}
          {/* ========================================================================= */}
          <motion.div
            className="absolute inset-x-3.5 top-2.5 h-[225px] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-2xl border"
            style={{
              backgroundColor: styles.letterBg,
              borderColor: styles.letterBorder,
            }}
            initial={false}
            animate={isOpening ? {
              y: -105,
              scale: 1.02,
              opacity: 1,
              zIndex: 40,
            } : {
              y: 0,
              scale: 0.96,
              opacity: 0,
              zIndex: 5,
            }}
            transition={{
              delay: 0.15,
              duration: 0.65,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            {/* Subtle Inner Card Filigree Accent */}
            <div 
              className="absolute inset-1.5 rounded-lg border border-dashed pointer-events-none opacity-40"
              style={{ borderColor: styles.letterBorder }}
            />

            <span 
              className="text-[9px] uppercase tracking-[0.25em] font-semibold mb-1"
              style={{ color: tokens.accent }}
            >
              The Wedding Invitation
            </span>

            <h4 
              className="font-heading text-lg sm:text-xl font-bold tracking-tight mb-1"
              style={{ color: styles.letterTextColor }}
            >
              {weddingConfig.groom?.nickname || 'Mempelai Pria'} & {weddingConfig.bride?.nickname || 'Mempelai Wanita'}
            </h4>

            <div className="w-10 h-[1px] bg-amber-400/50 my-1.5" />

            <p 
              className="text-[10px] sm:text-[11px] leading-relaxed max-w-[240px] font-light"
              style={{ color: styles.letterMutedColor }}
            >
              Turut mengundang Bapak/Ibu/Saudara/i dalam perayaan hari bahagia kami.
            </p>

            <span 
              className="text-[11px] sm:text-xs font-semibold mt-2 font-heading"
              style={{ color: tokens.accent }}
            >
              {weddingConfig.dateStr}
            </span>
          </motion.div>

          {/* ========================================================================= */}
          {/* 3. ENVELOPE POCKET BODY (With Luxury Name Tag Badge on front) */}
          {/* ========================================================================= */}
          <div 
            className="absolute inset-x-0 bottom-0 h-[168px] rounded-b-2xl z-20 overflow-hidden border-b border-x flex flex-col justify-end p-3.5"
            style={{
              backgroundColor: styles.envelopePocketBg,
              borderColor: styles.envelopeBorder,
              boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.12)',
            }}
          >
            {/* Realistic Pocket Diagonal Folds */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-60" 
              viewBox="0 0 340 168" 
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Left fold */}
              <path 
                d="M 0 0 L 170 168 L 0 168 Z" 
                fill={isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'} 
                stroke={styles.envelopeBorder} 
                strokeWidth="1" 
              />
              {/* Right fold */}
              <path 
                d="M 340 0 L 170 168 L 340 168 Z" 
                fill={isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)'} 
                stroke={styles.envelopeBorder} 
                strokeWidth="1" 
              />
            </svg>

            {/* ===================================================================== */}
            {/* LUXURY NAME TAG BADGE (100% Unobstructed, Crisp, and Elegant) */}
            {/* ===================================================================== */}
            <div 
              className="relative z-25 w-full rounded-xl p-3 sm:p-3.5 flex flex-col items-center justify-center text-center shadow-md border transition-all duration-300 group-hover:shadow-lg"
              style={{
                backgroundColor: styles.badgeBg,
                borderColor: styles.badgeBorder,
              }}
            >
              {/* Inner Double Thin Gold Foil Border */}
              <div 
                className="absolute inset-1 rounded-lg border border-amber-400/40 pointer-events-none"
              />

              {/* Recipient Greeting Label */}
              <p 
                className="text-[10px] sm:text-[11px] tracking-wider uppercase font-medium relative z-10"
                style={{ color: styles.letterMutedColor }}
              >
                {recipientLabel}
              </p>

              {/* Guest Name (Prominent, High-Contrast & Legible) */}
              <h3 
                className="font-heading text-lg sm:text-xl font-bold tracking-tight my-1 relative z-10 line-clamp-2 px-2"
                style={{ color: styles.letterTextColor }}
              >
                {guestName}
              </h3>

              {/* Thematic Children Ornaments (e.g. Floral Divider) */}
              {children && (
                <div className="relative z-10 w-full flex justify-center scale-90 -my-0.5">
                  {children}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PRIMARY ACTION BUTTON */}
      {/* ========================================================================= */}
      <motion.button
        type="button"
        onClick={handleOpenSequence}
        disabled={isOpening}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-5 py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-xs sm:text-sm uppercase relative z-30 active:scale-98"
        style={{
          backgroundColor: styles.buttonBg,
          color: styles.buttonText,
        }}
      >
        {buttonIcon}
        <span>{isOpening ? 'Membuka Undangan...' : buttonText}</span>
      </motion.button>
    </div>
  );
};
