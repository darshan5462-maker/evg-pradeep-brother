import { Facebook, Youtube, Radio, ExternalLink, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full py-12 px-6 md:px-12 bg-surface-container border-t border-outline-variant/10 flex flex-col items-center justify-center gap-6 mt-16">
      <div className="flex flex-col items-center text-center">
        <h2 
          onClick={() => onNavigate('home')}
          className="font-headline text-xl md:text-2xl text-secondary font-bold cursor-pointer hover:opacity-85 transition-opacity"
        >
          Bro Pradeep Shinde
        </h2>
        
        {/* Social Links */}
        <div className="flex gap-6 mt-6">
          <a 
            href="https://www.facebook.com/subziro.7" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white text-on-surface-variant hover:text-blue-600 hover:shadow-md border border-outline-variant/10 flex items-center justify-center transition-all duration-300"
            title="Facebook Page"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://www.youtube.com/@Biblestudy1988" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white text-on-surface-variant hover:text-red-600 hover:shadow-md border border-outline-variant/10 flex items-center justify-center transition-all duration-300"
            title="YouTube Channel"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a 
            href="https://wa.me/918722346210?text=Hello%20Evangelist%20Pradeep%20Shinde%20Ministry,%20I%20would%20like%20to%20connect%20with%20your%20ministry." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white text-on-surface-variant hover:text-emerald-600 hover:shadow-md border border-outline-variant/10 flex items-center justify-center transition-all duration-300"
            title="WhatsApp Helpline"
          >
            {/* Custom WhatsApp SVG Icon */}
            <svg 
              className="w-5 h-5 fill-current" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.883-6.963C16.588 1.958 14.118.934 11.99.934c-5.439 0-9.865 4.422-9.87 9.853-.001 1.642.428 3.242 1.246 4.654l-.989 3.613 3.7.971c1.398-.762 2.766-1.177 4.57-1.177zm11.236-7.391c-.29-.145-1.716-.848-1.983-.945-.266-.096-.46-.145-.653.145-.193.29-.748.945-.918 1.139-.17.194-.34.218-.63.073-.29-.145-1.226-.452-2.335-1.442-.864-.771-1.447-1.724-1.617-2.014-.17-.29-.018-.447.127-.591.13-.13.29-.339.435-.508.145-.17.193-.29.29-.484.097-.193.048-.363-.024-.508-.073-.145-.653-1.573-.895-2.153-.235-.569-.476-.491-.653-.5-.17-.008-.363-.01-.556-.01-.193 0-.508.073-.774.363-.266.29-1.016.992-1.016 2.42 0 1.427 1.039 2.809 1.184 3.003.145.193 2.043 3.12 4.949 4.373.692.298 1.232.476 1.652.61.696.22 1.329.19 1.83.115.558-.085 1.716-.701 1.958-1.38.242-.678.242-1.258.17-1.38-.072-.122-.266-.194-.556-.34z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-4 text-xs font-bold font-body uppercase tracking-wider text-on-surface-variant/90">
        <button onClick={() => onNavigate('home')} className="hover:text-secondary transition-colors cursor-pointer">
          Privacy Policy
        </button>
        <button onClick={() => onNavigate('home')} className="hover:text-secondary transition-colors cursor-pointer">
          Terms of Service
        </button>
        <button onClick={() => onNavigate('home')} className="hover:text-secondary transition-colors cursor-pointer">
          Contact Support
        </button>
        <button onClick={() => onNavigate('admin')} className="hover:text-secondary hover:underline transition-colors cursor-pointer flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> Staff Portal
        </button>
        <button onClick={() => onNavigate('bible')} className="text-secondary underline hover:text-primary transition-all cursor-pointer font-extrabold flex items-center gap-1">
          Donate Partnership <ExternalLink className="w-3 h-3" />
        </button>
      </nav>

      {/* Copyright line */}
      <p className="font-body text-xs text-on-surface-variant/70 text-center mt-4">
        © 2024 Evangelist Pradeep Shinde Ministry. All Rights Reserved.
      </p>
    </footer>
  );
}
