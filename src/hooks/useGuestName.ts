import { useState, useEffect } from 'react';

export function useGuestName() {
  const [guestName, setGuestName] = useState<string>('Tamu Undangan');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }
  }, []);

  return guestName;
}
