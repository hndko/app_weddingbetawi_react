import { useState, useEffect } from 'react';
import { GuestTier } from '../types';

export interface GuestUrlDetails {
  name: string;
  tier: GuestTier;
  tableNumber?: string;
  pax: number;
  guestId?: string;
}

export function useGuestDetails(): GuestUrlDetails {
  const [details, setDetails] = useState<GuestUrlDetails>({
    name: 'Tamu Undangan',
    tier: 'regular',
    pax: 1,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const tierParam = (params.get('tier') || '').toLowerCase();
    const tableParam = params.get('table') || params.get('meja');
    const paxParam = parseInt(params.get('pax') || '1', 10);
    const idParam = params.get('id');

    let tier: GuestTier = 'regular';
    if (tierParam === 'vvip') tier = 'vvip';
    else if (tierParam === 'vip') tier = 'vip';
    else if (tierParam === 'family' || tierParam === 'keluarga') tier = 'family';

    setDetails({
      name: to ? to.trim() : 'Tamu Undangan',
      tier,
      tableNumber: tableParam ? tableParam.trim() : undefined,
      pax: isNaN(paxParam) || paxParam < 1 ? 1 : paxParam,
      guestId: idParam ? idParam.trim() : undefined,
    });
  }, []);

  return details;
}

export function useGuestName(): string {
  const { name } = useGuestDetails();
  return name;
}
