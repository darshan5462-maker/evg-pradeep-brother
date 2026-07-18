import { Home, BookOpen, Scroll, Newspaper } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin';
  onNavigate: (tab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin') => void;
}

export default function BottomNavbar({ activeTab, onNavigate }: BottomNavbarProps) {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sermons', label: 'Sermons', icon: BookOpen },
    { id: 'bible', label: 'Bible', icon: Scroll },
    { id: 'blog', label: 'Blog', icon: Newspaper }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-4 py-2.5 md:hidden bg-white/90 backdrop-blur-lg border-t border-outline-variant/10 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
              isActive 
                ? 'text-secondary bg-secondary-container/20 font-bold scale-105' 
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
            <span className="font-body text-[9px] font-bold tracking-wider uppercase mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
