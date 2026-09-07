import React from 'react';
import { Crown, Star, HeartHandshake, ShieldCheck } from 'lucide-react';
import { GuestTier } from '../../../../types';

interface VipAccessBadgeProps {
  tier?: GuestTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const VipAccessBadge: React.FC<VipAccessBadgeProps> = ({
  tier = 'regular',
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  if (tier === 'regular') return null;

  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 10,
    md: 13,
    lg: 15,
  };

  if (tier === 'vvip') {
    return (
      <span
        className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full shadow-sm bg-gradient-to-r from-[#78350F] via-[#B45309] to-[#78350F] text-[#FEF3C7] border border-[#FDE68A]/60 shadow-[#D97706]/20 ${sizeStyles[size]} ${className}`}
        title="Tamu Kehormatan VVIP"
      >
        {showIcon && <Crown size={iconSizes[size]} className="text-[#FDE68A] animate-pulse shrink-0" />}
        <span>VVIP Guest</span>
      </span>
    );
  }

  if (tier === 'vip') {
    return (
      <span
        className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full shadow-sm bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] text-[#F8FAFC] border border-[#94A3B8]/60 shadow-slate-900/10 ${sizeStyles[size]} ${className}`}
        title="Tamu Prioritas VIP"
      >
        {showIcon && <Star size={iconSizes[size]} className="text-[#FCD34D] shrink-0" />}
        <span>VIP Guest</span>
      </span>
    );
  }

  if (tier === 'family') {
    return (
      <span
        className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full shadow-sm bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#064E3B] text-[#ECFDF5] border border-[#A7F3D0]/60 shadow-emerald-900/15 ${sizeStyles[size]} ${className}`}
        title="Keluarga Inti Mempelai"
      >
        {showIcon && <HeartHandshake size={iconSizes[size]} className="text-[#6EE7B7] shrink-0" />}
        <span>Keluarga Inti</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-300 ${sizeStyles[size]} ${className}`}
    >
      {showIcon && <ShieldCheck size={iconSizes[size]} className="text-stone-500 shrink-0" />}
      <span>Tamu Undangan</span>
    </span>
  );
};
