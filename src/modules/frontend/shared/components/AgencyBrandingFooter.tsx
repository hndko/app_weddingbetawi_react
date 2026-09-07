import React from 'react';
import { Instagram, Globe, Phone, Award } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';

export const AgencyBrandingFooter: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { weddingConfig } = useWeddingConfig();
  const branding = weddingConfig.agencyBranding || {
    mode: 'co_branded',
    agencyName: 'Mari Partner Wedding Organizer',
    agencyTagline: 'Professional Wedding Planner & Digital Concierge',
    agencyInstagram: '@maripartner.wedding',
    agencyWebsite: 'https://maripartner.com',
  };

  if (branding.mode === 'disabled') {
    return (
      <footer className={`py-6 text-center text-xs text-stone-500 ${className}`}>
        <p>© {new Date().getFullYear()} {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}. All Rights Reserved.</p>
      </footer>
    );
  }

  // 100% Pure White-Label Mode
  if (branding.mode === 'white_label') {
    return (
      <footer className={`py-8 px-4 text-center border-t border-stone-200/40 dark:border-stone-800/40 ${className}`}>
        <div className="max-w-md mx-auto flex flex-col items-center gap-2.5">
          {branding.agencyLogoUrl ? (
            <img
              src={branding.agencyLogoUrl}
              alt={branding.agencyName}
              className="h-10 w-auto object-contain rounded-md"
            />
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-800 dark:text-stone-200">
              <Award size={16} className="text-amber-500" />
              <span>{branding.agencyName}</span>
            </div>
          )}

          {branding.agencyTagline ? (
            <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
              {branding.agencyTagline}
            </p>
          ) : null}

          {/* Contact Links */}
          <div className="flex items-center justify-center gap-4 text-xs text-stone-600 dark:text-stone-400 mt-1">
            {branding.agencyInstagram && (
              <a
                href={`https://instagram.com/${branding.agencyInstagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-pink-600 transition-colors"
              >
                <Instagram size={13} />
                <span>{branding.agencyInstagram}</span>
              </a>
            )}

            {branding.agencyWebsite && (
              <a
                href={branding.agencyWebsite}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-amber-600 transition-colors"
              >
                <Globe size={13} />
                <span>Website</span>
              </a>
            )}

            {branding.agencyPhone && (
              <a
                href={`https://wa.me/${branding.agencyPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
              >
                <Phone size={13} />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-2">
            Organized exclusively for {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
          </p>
        </div>
      </footer>
    );
  }

  // Co-Branded Mode (Default)
  return (
    <footer className={`py-8 px-4 text-center border-t border-stone-200/40 dark:border-stone-800/40 ${className}`}>
      <div className="max-w-md mx-auto flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-600 dark:text-stone-300">
          {branding.agencyLogoUrl ? (
            <img
              src={branding.agencyLogoUrl}
              alt={branding.agencyName}
              className="h-6 w-auto object-contain inline-block"
            />
          ) : (
            <span className="font-semibold">{branding.agencyName}</span>
          )}
          <span className="text-stone-400">•</span>
          <span className="text-stone-500 dark:text-stone-400 text-[11px]">Official Wedding Organizer</span>
        </div>

        {branding.agencyInstagram && (
          <a
            href={`https://instagram.com/${branding.agencyInstagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-pink-600 dark:text-pink-400 hover:underline"
          >
            <Instagram size={12} />
            <span>{branding.agencyInstagram}</span>
          </a>
        )}

        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
          Powered by Mari Partner Digital Wedding Invitation Platform
        </p>
      </div>
    </footer>
  );
};
