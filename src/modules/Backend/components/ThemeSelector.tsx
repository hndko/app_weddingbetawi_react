import React, { useState } from 'react';
import { 
  Palette, Sparkles, CheckCircle2, Clock, ExternalLink, 
  Eye, Check, Layers, Compass
} from 'lucide-react';
import { THEME_CATALOG, ThemeMeta } from '../../Frontend/themes';

export interface ThemeSelectorProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeSelector({ currentThemeId, onSelectTheme }: ThemeSelectorProps) {
  const [filterCategory, setFilterCategory] = useState<'all' | 'adat' | 'modern' | 'islami'>('all');

  const filteredThemes = THEME_CATALOG.filter((theme) => {
    if (filterCategory === 'all') return true;
    return theme.category === filterCategory;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-heading text-base font-bold text-text-dark flex items-center gap-2">
            <Palette size={18} className="text-sage-dark" />
            <span>Katalog Tema & Desain Undangan</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Pilih estetika adat tradisional atau gaya modern yang Anda inginkan. Seluruh data mempelai dan jadwal akan tersinkronisasi otomatis.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'Semua Gaya' },
            { id: 'adat', label: 'Adat Nusantara' },
            { id: 'modern', label: 'Modern' },
            { id: 'islami', label: 'Syar\'i / Islami' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id as 'all' | 'adat' | 'modern' | 'islami')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-sage-dark text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredThemes.map((theme: ThemeMeta) => {
          const isActive = (currentThemeId || 'betawi').toLowerCase() === theme.id.toLowerCase();
          const isReady = theme.status === 'ready';

          return (
            <div
              key={theme.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between bg-white relative ${
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-gray-200 hover:border-sage hover:shadow-sm'
              }`}
            >
              {/* Card Banner Image */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden group">
                <img
                  src={theme.thumbnail}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md bg-black/40 text-white border border-white/20">
                    {theme.category.toUpperCase()}
                  </span>
                </div>

                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Check size={12} strokeWidth={3} />
                    <span>Tema Aktif</span>
                  </div>
                )}

                {/* Bottom title inside banner */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-heading text-lg font-bold drop-shadow-sm leading-snug">
                    {theme.name}
                  </h4>
                  <p className="text-[11px] text-white/80 font-light drop-shadow-sm">
                    {theme.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1">
                {/* Color Palette Preview */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">Palet Warna:</span>
                  <div className="flex items-center gap-1.5">
                    {Object.entries(theme.previewColors).map(([key, hex]) => (
                      <div
                        key={key}
                        className="w-5 h-5 rounded-full border border-gray-200 shadow-2xs cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: hex }}
                        title={`${key}: ${hex}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {theme.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-gray-50 border border-gray-200/80 text-gray-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-100 mt-auto flex items-center gap-2">
                {isActive ? (
                  <div className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>Sedang Digunakan</span>
                  </div>
                ) : isReady ? (
                  <button
                    type="button"
                    onClick={() => onSelectTheme(theme.id)}
                    className="w-full bg-sage text-white hover:bg-sage-dark py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles size={14} />
                    <span>Aktifkan Tema</span>
                  </button>
                ) : (
                  <div className="w-full bg-gray-50 text-gray-400 border border-gray-200 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 select-none">
                    <Clock size={14} />
                    <span>Segera Hadir</span>
                  </div>
                )}

                {/* Live Demo Preview Link */}
                {isReady && (
                  <a
                    href={`/?theme=${theme.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-gray-200 hover:border-sage hover:bg-sage/5 text-gray-600 hover:text-sage-dark rounded-xl transition-colors cursor-pointer shrink-0"
                    title={`Pratinjau Live Tema ${theme.name}`}
                    aria-label={`Pratinjau Live Tema ${theme.name}`}
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
