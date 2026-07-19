import { useState, useRef, FormEvent } from 'react';
import { PlayCircle, ArrowRight, Calendar, Heart, Share2, Sparkles, BookOpen, VolumeX, Volume2, Landmark, Facebook, Youtube, MessageSquare, Phone } from 'lucide-react';
import { Sermon, MinistryEvent, PrayerRequest } from '../types';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin') => void;
  sermons: Sermon[];
  events: MinistryEvent[];
  onPlaySermon: (sermon: Sermon) => void;
  onSubmitPrayer: (req: Omit<PrayerRequest, 'id' | 'date' | 'status'>) => void;
}

export default function HomeView({ onNavigate, sermons, events, onPlaySermon, onSubmitPrayer }: HomeViewProps) {
  const [prayerName, setPrayerName] = useState('');
  const [prayerNeed, setPrayerNeed] = useState('');
  const [prayerSuccess, setPrayerSuccess] = useState(false);
  const prayerFormRef = useRef<HTMLDivElement>(null);

  // Counseling Interactive Helper States
  const [counselType, setCounselType] = useState<'counsel' | 'testimony' | 'study'>('counsel');
  const [customMessage, setCustomMessage] = useState('Hello Evangelist Pradeep Shinde Ministry, I would like to request spiritual counseling and guidance on a matter in my life.');

  const handleCounselTypeChange = (type: 'counsel' | 'testimony' | 'study') => {
    setCounselType(type);
    if (type === 'counsel') {
      setCustomMessage('Hello Evangelist Pradeep Shinde Ministry, I would like to request spiritual counseling and guidance on a matter in my life.');
    } else if (type === 'testimony') {
      setCustomMessage('Hello Evangelist Pradeep Shinde Ministry, I want to share an amazing testimony of what God has done in my life!');
    } else if (type === 'study') {
      setCustomMessage('Hello Evangelist Pradeep Shinde Ministry, I am interested in joining your weekly Bible study sessions. Please share details!');
    }
  };

  // Filter latest sermon for play button
  const latestSermon = sermons.find(s => s.id === 'sermon-1') || sermons[0];

  const handlePrayerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prayerName.trim() || !prayerNeed.trim()) return;

    onSubmitPrayer({
      name: prayerName,
      need: prayerNeed,
      isUrgent: prayerNeed.toLowerCase().includes('urgent') || prayerNeed.toLowerCase().includes('emergency')
    });

    setPrayerName('');
    setPrayerNeed('');
    setPrayerSuccess(true);
    setTimeout(() => setPrayerSuccess(false), 5000);
  };

  const scrollToPrayerForm = () => {
    prayerFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[650px] md:h-[750px] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[10000ms] hover:scale-105"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4-ZZrOzu7UttwfjT30RwGT9xE7YKTpklSJZh5G_8z5qoz4FvXOLmnwweNSN0-j1pMl5oR7g3wCbylK2EHgZZz3kAi9wIzh3JWMr37zdxuNHMMW8elRZdh3UgFtagzhZlgIJkCdrnYah2KNjWkr-c5sn7Ar01TJ73NmB4P3vI4Rud8afGns-KZiOYJEjE3X8qBm9vNMYvWTvpzB9Vv05GGjMb3nYGYwvP3ZSyBf4-3oEjTFq5JJnCLLA')" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl text-left">
            <span className="font-body text-xs md:text-sm font-bold text-secondary mb-4 block tracking-[0.2em] uppercase">
              WELCOME TO THE MINISTRY
            </span>
            <h2 className="font-headline text-4xl md:text-6xl text-on-surface mb-6 leading-[1.15] font-bold">
              Finding Divine Peace in a Modern World
            </h2>
            <p className="font-body text-base md:text-lg text-on-surface-variant mb-8 leading-relaxed max-w-lg">
              Join us as we explore the transformative power of faith and the timeless wisdom of the Scriptures. Pradeep Shinde brings the Word of God to life for today's generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onPlaySermon(latestSermon)}
                className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-body text-xs font-bold tracking-widest flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                <span className="material-symbols-outlined text-lg fill-1">play_circle</span>
                WATCH LATEST SERMON
              </button>
              <button 
                onClick={() => onNavigate('bible')}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-body text-xs font-bold tracking-widest transition-all duration-300"
              >
                JOIN BIBLE STUDY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture & Prayer Bento Grid */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Scripture of the Day Card */}
          <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
              <span className="material-symbols-outlined text-[240px]">auto_stories</span>
            </div>
            <span className="font-body text-xs font-bold text-secondary mb-6 block tracking-widest uppercase">
              SCRIPTURE OF THE DAY
            </span>
            <blockquote className="mb-8">
              <p className="font-headline text-2xl md:text-3xl italic text-on-surface leading-normal">
                "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid."
              </p>
              <footer className="mt-6 font-body text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                — JOHN 14:27 (KJV)
              </footer>
            </blockquote>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('bible')}
                className="text-secondary flex items-center gap-2 font-body text-xs font-bold tracking-widest hover:gap-4 transition-all uppercase"
              >
                READ FULL CHAPTER <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Prayer Request Form */}
          <div ref={prayerFormRef} className="lg:col-span-5 bg-primary-container text-on-primary-container rounded-2xl p-8 md:p-10 flex flex-col shadow-lg">
            <h3 className="font-headline text-2xl text-secondary-container mb-2 font-semibold">Prayer Request</h3>
            <p className="font-body text-sm text-on-primary-container/80 mb-8">
              How can we pray for you today? Our ministry team is here to support you in faith.
            </p>
            <form onSubmit={handlePrayerSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={prayerName}
                    onChange={(e) => setPrayerName(e.target.value)}
                    className="w-full bg-white/5 border-b border-on-primary-container/30 text-white focus:border-secondary-container transition-colors py-3 px-1 outline-none font-body text-sm rounded-t placeholder:text-on-primary-container/50"
                    placeholder="Your Name" 
                    required
                  />
                </div>
                <div>
                  <textarea 
                    value={prayerNeed}
                    onChange={(e) => setPrayerNeed(e.target.value)}
                    className="w-full bg-white/5 border-b border-on-primary-container/30 text-white focus:border-secondary-container transition-colors py-3 px-1 outline-none font-body text-sm rounded-t placeholder:text-on-primary-container/50 resize-none"
                    placeholder="Your Prayer Need" 
                    rows={3}
                    required
                  ></textarea>
                </div>
              </div>

              <div>
                {prayerSuccess && (
                  <div className="p-3 bg-green-900/40 text-green-200 border border-green-500/30 rounded text-xs font-body mb-4 animate-fade-in flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-400 shrink-0" />
                    Prayer request submitted securely! Our team is praying for you.
                  </div>
                )}
                <button 
                  type="submit" 
                  className="w-full bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white py-4 rounded-lg font-body text-xs font-bold tracking-widest mt-4 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  SUBMIT PRAYER REQUEST
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Upcoming Events Carousel */}
      <section className="bg-surface-bright py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-body text-xs font-bold text-secondary mb-2 block tracking-widest uppercase">
                GET INVOLVED
              </span>
              <h2 className="font-headline text-3xl md:text-4xl text-on-surface font-semibold">
                Upcoming Events
              </h2>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="w-12 h-12 rounded-full border border-outline-variant hover:bg-surface-container flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-outline-variant hover:bg-surface-container flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar">
            {events.map((event) => (
              <div 
                key={event.id}
                className="min-w-[300px] md:min-w-[380px] flex-1 bg-white rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-xl transition-all duration-300 snap-start flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="h-48 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${event.imageUrl}')` }}
                  ></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span className="font-body text-[10px] font-bold uppercase tracking-wider">{event.date}</span>
                    </div>
                    <h4 className="font-headline text-lg text-on-surface mb-3 font-bold line-clamp-1">
                      {event.title}
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button 
                    onClick={scrollToPrayerForm}
                    className="font-body text-xs font-bold text-secondary border-b border-secondary/30 pb-1 hover:border-secondary transition-all inline-block uppercase"
                  >
                    EVENT DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spiritual Counseling & Helpline Section */}
      <section className="py-16 bg-surface-container-low border-y border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center md:text-left mb-12">
            <span className="font-body text-xs font-bold text-secondary mb-2 block tracking-widest uppercase">
              24/7 CONNECT & HELPLINE
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface font-semibold">
              Spiritual Counsel & Media Streams
            </h2>
            <p className="font-body text-sm text-on-surface-variant mt-2 max-w-2xl">
              We are dedicated to supporting your spiritual walk. Reach out directly to Bro Pradeep Shinde for guidance, or follow our global community across channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Hand: Social Channels Bento Grid */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* YouTube Channel Spotlight */}
              <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Youtube className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-headline text-base font-bold text-on-surface">Official Bible Study Channel</h4>
                    <p className="font-body text-xs text-on-surface-variant mt-1">
                      Subscribe to `@Biblestudy1988` on YouTube for weekly deep-dives, expository series, and live spiritual messages.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/5 flex justify-end">
                  <a 
                    href="https://www.youtube.com/@Biblestudy1988"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-body text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 transition-colors shadow-sm"
                  >
                    Watch on YouTube <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Facebook Profile Spotlight */}
              <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Facebook className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-headline text-base font-bold text-on-surface">Ministry updates & Live Streams</h4>
                    <p className="font-body text-xs text-on-surface-variant mt-1">
                      Follow our official Facebook account `subziro.7` to access direct devotions, schedule notices, and family news.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/5 flex justify-end">
                  <a 
                    href="https://www.facebook.com/subziro.7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-body text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 transition-colors shadow-sm"
                  >
                    Follow on Facebook <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Hand: Interactive WhatsApp Help Desk Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-outline-variant/10 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.883-6.963C16.588 1.958 14.118.934 11.99.934c-5.439 0-9.865 4.422-9.87 9.853-.001 1.642.428 3.242 1.246 4.654l-.989 3.613 3.7.971c1.398-.762 2.766-1.177 4.57-1.177zm11.236-7.391c-.29-.145-1.716-.848-1.983-.945-.266-.096-.46-.145-.653.145-.193.29-.748.945-.918 1.139-.17.194-.34.218-.63.073-.29-.145-1.226-.452-2.335-1.442-.864-.771-1.447-1.724-1.617-2.014-.17-.29-.018-.447.127-.591.13-.13.29-.339.435-.508.145-.17.193-.29.29-.484.097-.193.048-.363-.024-.508-.073-.145-.653-1.573-.895-2.153-.235-.569-.476-.491-.653-.5-.17-.008-.363-.01-.556-.01-.193 0-.508.073-.774.363-.266.29-1.016.992-1.016 2.42 0 1.427 1.039 2.809 1.184 3.003.145.193 2.043 3.12 4.949 4.373.692.298 1.232.476 1.652.61.696.22 1.329.19 1.83.115.558-.085 1.716-.701 1.958-1.38.242-.678.242-1.258.17-1.38-.072-.122-.266-.194-.556-.34z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">Interactive WhatsApp Help Desk</h3>
                    <p className="font-body text-xs text-on-surface-variant font-medium">Counseling Hotline: <span className="text-emerald-600 font-bold font-mono">+91 87223 46210</span></p>
                  </div>
                </div>

                <p className="font-body text-xs text-on-surface-variant mb-6">
                  Select a category helper chip to draft an automatic personalized message template, edit the text if desired, then click to open the chat window instantly.
                </p>

                {/* Predefined Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button 
                    type="button"
                    onClick={() => handleCounselTypeChange('counsel')}
                    className={`px-3 py-1.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      counselType === 'counsel' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    Spiritual Counsel
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleCounselTypeChange('testimony')}
                    className={`px-3 py-1.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      counselType === 'testimony' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    Share Testimony
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleCounselTypeChange('study')}
                    className={`px-3 py-1.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      counselType === 'study' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    Bible Study Info
                  </button>
                </div>

                {/* Message Editor */}
                <div className="relative mb-6">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body text-xs text-on-surface outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all resize-none"
                    placeholder="Enter your message..."
                  />
                  <div className="absolute right-3 bottom-3 text-[9px] text-on-surface-variant/50 uppercase font-bold tracking-wider">
                    Direct Broadcast Draft
                  </div>
                </div>
              </div>

              <div>
                <a 
                  href={`https://wa.me/918722346210?text=${encodeURIComponent(customMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-body text-xs font-bold tracking-widest text-center flex items-center justify-center gap-3.5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-emerald-600/10"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  CONNECT DIRECTLY VIA WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bilingual Support */}
      <section className="py-12 px-6 md:px-12 bg-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-headline text-2xl text-on-surface font-semibold">Available in Kannada</h3>
            <p className="font-body text-sm text-on-surface-variant mt-2">
              Access all our sermons, books, and teachings in Kannada language.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={() => onNavigate('sermons')}
              className="bg-white hover:bg-primary-container hover:text-white px-6 py-3 rounded-full border border-outline text-on-surface font-body text-xs font-bold tracking-widest transition-all duration-300 text-center uppercase"
            >
              VIEW ENGLISH CONTENT
            </button>
            <button 
              onClick={() => onNavigate('sermons')}
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-body text-xs font-bold tracking-widest transition-all duration-300 text-center uppercase"
            >
              ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ (KANNADA)
            </button>
          </div>
        </div>
      </section>

      {/* FAB for Prayer (Contextual) */}
      <button 
        onClick={scrollToPrayerForm}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-secondary hover:bg-secondary/90 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
        title="Send Prayer Request"
      >
        <span className="material-symbols-outlined text-[28px] md:text-[32px] font-light">volunteer_activism</span>
        <span className="absolute right-full mr-4 bg-on-surface text-surface text-xs font-bold py-2 px-4 rounded-lg tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          PRAYER REQUEST
        </span>
      </button>
    </div>
  );
}
