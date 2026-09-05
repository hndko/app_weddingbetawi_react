import { Home, Heart, Calendar, Image as ImageIcon, MessageCircle, BookOpen } from 'lucide-react';
import { useScrollSpy } from '../../../../hooks/useScrollSpy';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

export function BottomNavigation() {
  const activeId = useScrollSpy(['home', 'mempelai', 'cerita', 'acara', 'galeri', 'ucapan'], 100);
  const { tokens, isDark } = useThemeTokens();

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
      <div 
        className={cn(
          "flex items-center justify-between backdrop-blur-xl rounded-[24px] px-4 py-3 w-full max-w-[420px] pointer-events-auto overflow-x-auto no-scrollbar gap-4 sm:justify-between transition-colors duration-300",
          isDark ? "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.8)]" : "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)]"
        )}
        style={{
          backgroundColor: tokens.navBg,
          border: `1px solid ${tokens.navBorder}`
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id || (!activeId && item.id === 'home');
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center gap-1 group relative outline-none min-w-[44px]"
            >
              <div 
                className="transition-colors duration-300"
                style={{
                  color: isActive ? tokens.navActive : tokens.navInactive,
                  paddingBottom: isActive ? '12px' : '0px'
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span 
                className={cn(
                  "text-[9px] font-medium transition-all duration-300 absolute bottom-0 opacity-0 translate-y-2 whitespace-nowrap",
                  isActive && "opacity-100 translate-y-0"
                )}
                style={{ color: tokens.navActive }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
