import { Home, Heart, Calendar, Image as ImageIcon, MessageCircle, BookOpen } from 'lucide-react';
import { useScrollSpy } from '../../../hooks/useScrollSpy';
import { cn } from '../../../utils/cn';

export function BottomNavigation() {
  const activeId = useScrollSpy(['home', 'mempelai', 'cerita', 'acara', 'galeri', 'ucapan'], 100);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'mempelai', icon: Heart, label: 'Mempelai' },
    { id: 'cerita', icon: BookOpen, label: 'Cerita' },
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
    <div className="fixed md:absolute bottom-0 left-0 right-0 w-full flex justify-center z-[100] pb-[calc(16px+env(safe-area-inset-bottom))] px-4 pointer-events-none">
      <div className="flex items-center justify-between bg-warm-white/92 backdrop-blur-xl border border-light-gray rounded-[24px] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] px-4 py-3 w-full max-w-[420px] pointer-events-auto overflow-x-auto no-scrollbar gap-4 sm:justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id || (!activeId && item.id === 'home');
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center gap-1 group relative outline-none min-w-[44px]"
            >
              <div className={cn(
                "transition-colors duration-300",
                isActive ? "text-sage pb-3" : "text-text-dark/40 group-hover:text-text-dark/60"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-medium transition-all duration-300 absolute bottom-0 opacity-0 translate-y-2 whitespace-nowrap",
                isActive && "opacity-100 translate-y-0 text-sage"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
