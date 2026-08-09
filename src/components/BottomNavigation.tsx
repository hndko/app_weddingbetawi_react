import { Home, Heart, Calendar, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { cn } from '../utils/cn';

export function BottomNavigation() {
  const activeId = useScrollSpy(['home', 'mempelai', 'acara', 'galeri', 'ucapan'], 100);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'mempelai', icon: Heart, label: 'Mempelai' },
    { id: 'acara', icon: Calendar, label: 'Acara' },
    { id: 'galeri', icon: ImageIcon, label: 'Galeri' },
    { id: 'ucapan', icon: MessageCircle, label: 'Ucapan' },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center z-[100] pb-[calc(16px+env(safe-area-inset-bottom))] px-4 pointer-events-none">
      <div className="flex items-center justify-between bg-warm-white/92 backdrop-blur-xl border border-light-gray rounded-[24px] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] px-6 py-4 w-full max-w-[380px] pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id || (!activeId && item.id === 'home');
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center gap-1 group relative outline-none"
            >
              <div className={cn(
                "transition-colors duration-300 pb-2",
                isActive ? "text-sage" : "text-text-dark/40 group-hover:text-text-dark/60"
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300 absolute bottom-0 opacity-0 translate-y-2",
                isActive && "opacity-100 translate-y-0 text-sage"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 rounded-full bg-sage" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
