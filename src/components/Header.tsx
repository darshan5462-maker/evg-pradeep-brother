import { Menu, Globe, X, Home, BookOpen, Heart, ShieldCheck, Landmark, Newspaper } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  activeTab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin';
  onNavigate: (tab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin') => void;
}

export default function Header({ activeTab, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sermons', label: 'Sermons', icon: BookOpen },
    { id: 'bible', label: 'Bible Study', icon: Heart },
    { id: 'blog', label: 'Blog', icon: Newspaper }
  ] as const;

  const handleMobileNav = (tab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin') => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-outline-variant/10 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          {/* Logo & Hamburg Menu */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-secondary hover:text-primary p-1 rounded-lg transition-colors focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 
              onClick={() => onNavigate('home')}
              className="font-headline text-lg md:text-xl font-bold text-on-surface tracking-tight cursor-pointer select-none hover:text-secondary transition-colors"
            >
              Bro Pradeep Shinde
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative font-body text-xs font-bold tracking-widest uppercase transition-all py-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-secondary font-semibold border-b-2 border-secondary' 
                      : 'text-on-surface-variant hover:text-secondary'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-1.5 border border-outline-variant rounded-full font-body text-xs font-bold tracking-wider hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-secondary shrink-0" />
              English
            </button>
            <button 
              onClick={() => {
                // Open secure partnership donation inside BibleStudyView
                onNavigate('bible');
              }}
              className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-full font-body text-[10px] font-bold tracking-widest uppercase shadow-sm transition-all duration-300"
            >
              Donate
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sliding panel */}
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between p-6 animate-slide-in border-r border-outline-variant/10">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-secondary/20 bg-secondary-container/10 flex items-center justify-center">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPt5_9Po7wK5OkfIlYJBDTqcV71p5QmxlqvijN8nRUPd8ZYtzn-pLEd31rHUUUVutG3NCzimleO0869F8LkGMaU_CTL1RC-DSQnkAp9oOnEIKdjYECUFtkY1OLAziBtjpJ8ky9JcG70OY9bj0VtIh948sdETFq6nGAQW6vY2RKCpPqFLd3cqCDzjdKZvmz_q9KYlD-dp4BiRdsa3ZIXN1h_Vsh2bI7XHV9_NzGqT96Ys7UfaQcqswzhg" 
                      alt="Pradeep Shinde Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface leading-none">Pradeep Shinde</h4>
                    <span className="text-[10px] text-on-surface-variant font-body">Christian Ministry</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-primary p-1 hover:bg-surface-container rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items list */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNav(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-body text-xs font-bold tracking-widest uppercase transition-all ${
                        isActive 
                          ? 'bg-secondary-container text-on-secondary-container font-bold' 
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer inside drawer */}
            <div className="border-t border-outline-variant/10 pt-4">
              <button 
                onClick={() => handleMobileNav('home')}
                className="w-full bg-primary hover:bg-secondary text-white py-3.5 rounded-xl font-body text-xs font-bold tracking-widest transition-all"
              >
                CLOSE MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
