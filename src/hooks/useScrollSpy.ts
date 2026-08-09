import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[], offset: number = 0) {
  const [activeId, setActiveId] = useState<string>('');
  
  // Use a stringified version of ids to prevent infinite loops
  const joinedIds = ids.join(',');
  
  useEffect(() => {
    const idArray = joinedIds.split(',');
    
    // We get the scroll container for the intersection observer root
    const scrollContainer = document.getElementById('scroll-container');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        root: scrollContainer,
        rootMargin: `-${offset}px 0px -40% 0px`, 
        threshold: [0, 0.2, 0.5] 
      }
    );
    
    // Function to find and observe elements
    const observeElements = () => {
      idArray.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };
    
    // Initial observation
    observeElements();
    
    // Observe DOM mutations to catch lazy-loaded elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [joinedIds, offset]);
  
  return activeId;
}
