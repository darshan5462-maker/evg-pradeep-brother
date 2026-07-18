import { useState, FormEvent, useMemo, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Video, Calendar, ShieldCheck, LogOut, ArrowRight, PlusCircle, 
  Trash2, Mail, Check, Settings, Heart, Users, Newspaper, Edit3, 
  Bookmark, ShieldAlert, FileText, Lock, Globe 
} from 'lucide-react';
import { Sermon, MinistryEvent, PrayerRequest, ActivityLog, BlogPost, BibleStudyLesson } from '../types';

interface AdminDashboardViewProps {
  sermons: Sermon[];
  onAddSermon: (sermon: Sermon) => void;
  onUpdateSermon: (sermon: Sermon) => void;
  onDeleteSermon: (id: string) => void;
  
  events: MinistryEvent[];
  onAddEvent: (event: MinistryEvent) => void;
  onUpdateEvent: (event: MinistryEvent) => void;
  onDeleteEvent: (id: string) => void;
  
  prayers: PrayerRequest[];
  onUpdatePrayerStatus: (id: string, status: PrayerRequest['status']) => void;
  onDeletePrayer: (id: string) => void;
  
  blogs: BlogPost[];
  onAddBlog: (blog: BlogPost) => void;
  onUpdateBlog: (blog: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
  
  lessons: BibleStudyLesson[];
  onAddLesson: (lesson: BibleStudyLesson) => void;
  onUpdateLesson: (lesson: BibleStudyLesson) => void;
  onDeleteLesson: (id: string) => void;
  
  logs: ActivityLog[];
}

type AdminSection = 'overview' | 'blogs' | 'sermons' | 'events' | 'lessons' | 'prayers' | 'settings';

export default function AdminDashboardView({
  sermons,
  onAddSermon,
  onUpdateSermon,
  onDeleteSermon,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  prayers,
  onUpdatePrayerStatus,
  onDeletePrayer,
  blogs,
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog,
  lessons,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  logs
}: AdminDashboardViewProps) {
  
  // Login Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('shinde_admin_logged_in') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Inner Routing State
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');

  // Modals & Sub-states
  const [activeModal, setActiveModal] = useState<'none' | 'add-sermon' | 'edit-sermon' | 'add-event' | 'edit-event' | 'add-blog' | 'edit-blog' | 'add-lesson' | 'edit-lesson'>('none');
  
  // Selection references for editing
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MinistryEvent | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<BibleStudyLesson | null>(null);

  // Add Sermon state
  const [sermonForm, setSermonForm] = useState({
    title: '',
    description: '',
    topic: 'The Power of Faith',
    book: 'John',
    language: 'English' as Sermon['language'],
    type: 'video' as Sermon['type'],
    duration: '45:00',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  });

  // Add Event state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: 'June 28, 2026',
    location: 'Main Sanctuary',
    type: 'prayer' as MinistryEvent['type']
  });

  // Add Blog state
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    content: '',
    author: 'Evangelist Pradeep Shinde',
    category: 'Devotional' as BlogPost['category'],
    readTime: '5 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB58HYK5MeZb_Ps2NVHScusVawOwPfvNQImbtvf5uN26n-8RvRft67jn--21cVucJg28waHcqkAVN980ltdsvygTZoIfzUPPJRUaCu4vo1BNf2800PGAFBzRuBqJCGXj-wUk1hWIPSChGfFYA6XkAlXoYg7veZ8z-r0EqzYdgeSclybX7-Z7C7fFLUCDYCdVMTck3sE4_tUqWw-B-8csZsAJfYBM0gBrQcUT64TjHWWMc_7gMemBdVJ6w'
  });

  // Add Lesson state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    reference: '',
    category: 'Weekly Exegesis',
    context: '',
    interpretation: '',
    reflectionInput: '', // comma-separated or newlines
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgremkm9IOtZvhgysZjV5FJn663RPGDPAztOJdVxhhvSZuMGOVOPzTYJWwNZUR_YTTJfgElOBp_IB22dvVIwGi8d7pX9-5mYKc1Qe0IVMixNeV9gLpPnzIrN9OiIiBaCqiGqnWeJggxw9XGMUdOmV3huOfGzgdzSU9qmwR-P0Td0aLD60ckJvpjzhVzR-ycYrAn6iF2zGrdygquKpRrUwD5xAqfxw7HrOESfe4ZbOWET-28dKBduPkzA'
  });

  // Site general settings state
  const [siteSettings, setSiteSettings] = useState({
    ministryName: 'Evangelist Pradeep Shinde Ministry',
    leadEmail: 'contact@pradeepshindeministry.org',
    primaryLanguage: 'English',
    enableOnlineDonations: true,
    requirePrayerApproval: true
  });

  // Admin Credentials fetched from Firestore (will sync across devices)
  const [dbUsername, setDbUsername] = useState<string>('admin');
  const [dbPassword, setDbPassword] = useState<string>('admin');
  const [credentialsForm, setCredentialsForm] = useState({
    username: 'admin',
    password: 'admin'
  });
  const [credSuccess, setCredSuccess] = useState('');
  const [credError, setCredError] = useState('');

  // Fetch / Sync Admin Credentials from Firestore in real-time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'admin'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const u = data.username || 'admin';
        const p = data.password || 'admin';
        setDbUsername(u);
        setDbPassword(p);
        setCredentialsForm({ username: u, password: p });
      }
    });
    return () => unsub();
  }, []);

  // Fetch / Sync General Site Settings from Firestore in real-time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteSettings({
          ministryName: data.ministryName || 'Evangelist Pradeep Shinde Ministry',
          leadEmail: data.leadEmail || 'contact@pradeepshindeministry.org',
          primaryLanguage: data.primaryLanguage || 'English',
          enableOnlineDonations: data.enableOnlineDonations !== false,
          requirePrayerApproval: data.requirePrayerApproval !== false
        });
      }
    });
    return () => unsub();
  }, []);

  // Mock Traffic Stats
  const trafficData = [
    { name: 'MON', traffic: 420 },
    { name: 'TUE', traffic: 680 },
    { name: 'WED', traffic: 890 },
    { name: 'THU', traffic: 570 },
    { name: 'FRI', traffic: 710 },
    { name: 'SAT', traffic: 1010 },
    { name: 'SUN', traffic: 490 }
  ];

  // Global authentication handler
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === dbUsername.toLowerCase() && password === dbPassword) {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('shinde_admin_logged_in', 'true');
    } else {
      setLoginError('Invalid Administrator credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('shinde_admin_logged_in');
  };

  const handleUpdateCredentials = async (e: FormEvent) => {
    e.preventDefault();
    setCredSuccess('');
    setCredError('');
    if (!credentialsForm.username.trim() || !credentialsForm.password.trim()) {
      setCredError('Username and Password cannot be blank.');
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'admin'), {
        username: credentialsForm.username.trim(),
        password: credentialsForm.password.trim()
      });
      setCredSuccess('Administrator credentials updated successfully across all devices!');
    } catch (err: any) {
      setCredError(`Failed to update credentials: ${err?.message || err}`);
    }
  };

  // Analytics helper derivations
  const totalSermonsCount = sermons.length + 1242;
  const pendingPrayersCount = prayers.filter(p => p.status === 'Pending').length;
  const totalPrayersCount = prayers.length + 339;
  const totalBlogsCount = blogs.length + 45;

  // ====== Sermons Operations ======
  const triggerAddSermonModal = () => {
    setSermonForm({
      title: '',
      description: '',
      topic: 'The Power of Faith',
      book: 'John',
      language: 'English',
      type: 'video',
      duration: '45:00',
      mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });
    setSelectedSermon(null);
    setActiveModal('add-sermon');
  };

  const triggerEditSermonModal = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setSermonForm({
      title: sermon.title,
      description: sermon.description,
      topic: sermon.topic,
      book: sermon.book,
      language: sermon.language,
      type: sermon.type,
      duration: sermon.duration,
      mediaUrl: sermon.mediaUrl
    });
    setActiveModal('edit-sermon');
  };

  const handleSaveSermon = (e: FormEvent) => {
    e.preventDefault();
    if (!sFormValid()) return;

    if (activeModal === 'add-sermon') {
      onAddSermon({
        id: `sermon-${Date.now()}`,
        ...sermonForm,
        speaker: 'Pradeep Shinde',
        imageUrl: sermonForm.type === 'video' 
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuB58HYK5MeZb_Ps2NVHScusVawOwPfvNQImbtvf5uN26n-8RvRft67jn--21cVucJg28waHcqkAVN980ltdsvygTZoIfzUPPJRUaCu4vo1BNf2800PGAFBzRuBqJCGXj-wUk1hWIPSChGfFYA6XkAlXoYg7veZ8z-r0EqzYdgeSclybX7-Z7C7fFLUCDYCdVMTck3sE4_tUqWw-B-8csZsAJfYBM0gBrQcUT64TjHWWMc_7gMemBdVJ6w"
          : "https://lh3.googleusercontent.com/aida-public/AB6AXuD6tFLBp60U01F68nImhALb65PujBhaxwLPmFLrFtYLeMguqx2B3kF7WY8KXzwDfaC6qL6x4nNkdv8MPn9DNL-Q6EwmvByBOtrE1C5LBjybmI5-FkdYu2uEWI9hL8vFtSLhC0sZoXYUEdWqPlaK6hPyrH4XyivXDeQfhNPsyg_2MP44yttBiRHPc-2SUb60yEtmx0p9t2fL8CQi9BRsoGuKA-VCwQaNBvevIksB2DFCsV3bOBnr4xl6TA",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    } else if (activeModal === 'edit-sermon' && selectedSermon) {
      onUpdateSermon({
        ...selectedSermon,
        ...sermonForm
      });
    }
    setActiveModal('none');
  };

  const sFormValid = () => sermonForm.title.trim() !== '' && sermonForm.description.trim() !== '';

  // ====== Events Operations ======
  const triggerAddEventModal = () => {
    setEventForm({
      title: '',
      description: '',
      date: 'July 28, 2026',
      location: 'Main Sanctuary',
      type: 'prayer'
    });
    setSelectedEvent(null);
    setActiveModal('add-event');
  };

  const triggerEditEventModal = (event: MinistryEvent) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      type: event.type
    });
    setActiveModal('edit-event');
  };

  const handleSaveEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.description.trim()) return;

    if (activeModal === 'add-event') {
      onAddEvent({
        id: `event-${Date.now()}`,
        ...eventForm,
        imageUrl: eventForm.type === 'prayer' 
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAz6TZAqAjSBPdkNMNG_sMI9wDknX66YXFy73FDf547mkU6fG4rMjHyp5A5NY7ytKUuUVa5kMmzDAl9F2IIjgYdG6tDN_xskY-v_lnqvf3duQ-62bjgtobGIBiwmqetL90JVPRGKe9DaIOWrcch92qX94pXNeoaqJuQEUZpG7WTg8CgwSkOvditQeImzETI1famK0he0LDnZ4mcjY7kt-fjHRBZUToOULmiRFb5eB3Re0zzMIQmx-Z5tA"
          : "https://lh3.googleusercontent.com/aida-public/AB6AXuAMnglCMOun7Z2-PGIQJF0Lqf518Ob9YMMtq0Fd5guCAqydc3kL6W_-H-mQbtYM5MvwtGCDFUQ0j6T_4FIPrBcor20et2jU9H1GzhKXWSBL48cuIcd_Swcq5aJPZ5Vsm_dpNPwJ8sHY2WNoPczT4byoH6PELVTfleAXGvrZV_ZUiRHxhwl5xXPRYaIMBAowfbTBrxUAyvA4vp-x7hIccG03pHLdCbI1bUAIl_xKhU0nfqSH5A18gJLqSQ"
      });
    } else if (activeModal === 'edit-event' && selectedEvent) {
      onUpdateEvent({
        ...selectedEvent,
        ...eventForm
      });
    }
    setActiveModal('none');
  };

  // ====== Blogs Operations ======
  const triggerAddBlogModal = () => {
    setBlogForm({
      title: '',
      summary: '',
      content: '',
      author: 'Evangelist Pradeep Shinde',
      category: 'Devotional',
      readTime: '5 min read',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB58HYK5MeZb_Ps2NVHScusVawOwPfvNQImbtvf5uN26n-8RvRft67jn--21cVucJg28waHcqkAVN980ltdsvygTZoIfzUPPJRUaCu4vo1BNf2800PGAFBzRuBqJCGXj-wUk1hWIPSChGfFYA6XkAlXoYg7veZ8z-r0EqzYdgeSclybX7-Z7C7fFLUCDYCdVMTck3sE4_tUqWw-B-8csZsAJfYBM0gBrQcUT64TjHWWMc_7gMemBdVJ6w'
    });
    setSelectedBlog(null);
    setActiveModal('add-blog');
  };

  const triggerEditBlogModal = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      readTime: blog.readTime,
      imageUrl: blog.imageUrl
    });
    setActiveModal('edit-blog');
  };

  const handleSaveBlog = (e: FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.content.trim()) return;

    if (activeModal === 'add-blog') {
      onAddBlog({
        id: `blog-${Date.now()}`,
        ...blogForm,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    } else if (activeModal === 'edit-blog' && selectedBlog) {
      onUpdateBlog({
        ...selectedBlog,
        ...blogForm
      });
    }
    setActiveModal('none');
  };

  // ====== Bible Study Lessons Operations ======
  const triggerAddLessonModal = () => {
    setLessonForm({
      title: '',
      reference: '',
      category: 'Weekly Exegesis',
      context: '',
      interpretation: '',
      reflectionInput: '',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgremkm9IOtZvhgysZjV5FJn663RPGDPAztOJdVxhhvSZuMGOVOPzTYJWwNZUR_YTTJfgElOBp_IB22dvVIwGi8d7pX9-5mYKc1Qe0IVMixNeV9gLpPnzIrN9OiIiBaCqiGqnWeJggxw9XGMUdOmV3huOfGzgdzSU9qmwR-P0Td0aLD60ckJvpjzhVzR-ycYrAn6iF2zGrdygquKpRrUwD5xAqfxw7HrOESfe4ZbOWET-28dKBduPkzA'
    });
    setSelectedLesson(null);
    setActiveModal('add-lesson');
  };

  const triggerEditLessonModal = (lesson: BibleStudyLesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      reference: lesson.reference,
      category: lesson.category,
      context: lesson.context,
      interpretation: lesson.interpretation,
      reflectionInput: lesson.reflection ? lesson.reflection.join('\n') : '',
      imageUrl: lesson.imageUrl
    });
    setActiveModal('edit-lesson');
  };

  const handleSaveLesson = (e: FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !lessonForm.reference.trim()) return;

    const reflections = lessonForm.reflectionInput
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const lessonData: BibleStudyLesson = {
      id: selectedLesson ? selectedLesson.id : `lesson-${Date.now()}`,
      title: lessonForm.title,
      reference: lessonForm.reference,
      category: lessonForm.category,
      context: lessonForm.context,
      interpretation: lessonForm.interpretation,
      reflection: reflections,
      crossReferences: selectedLesson ? selectedLesson.crossReferences : [
        { reference: "Hebrews 11:1", text: "Now faith is the assurance of things hoped for, the conviction of things not seen." }
      ],
      imageUrl: lessonForm.imageUrl
    };

    if (activeModal === 'add-lesson') {
      onAddLesson(lessonData);
    } else if (activeModal === 'edit-lesson' && selectedLesson) {
      onUpdateLesson(lessonData);
    }
    setActiveModal('none');
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'site'), siteSettings);
      alert('Ministry configurations updated and saved to Firestore!');
    } catch (err: any) {
      alert(`Error saving configurations: ${err?.message || err}`);
    }
  };

  // RENDER ADMIN LOGIN GATE IF NOT LOGGED IN
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface-container-lowest px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-outline-variant/15 p-8 text-center relative animate-scale-in">
          
          {/* Locks Brand Accent */}
          <div className="w-16 h-16 rounded-full bg-secondary-container/10 text-secondary flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-headline text-2xl font-bold text-on-surface">Staff Access Only</h2>
          <p className="font-body text-xs text-on-surface-variant mt-2 max-w-sm mx-auto">
            This workspace contains global administration controls. Please authorize your session credentials.
          </p>

          {/* Demonstration Badging for quick verification */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 my-6 text-left">
            <p className="font-body text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Authentication Help Badge
            </p>
            <p className="font-body text-xs text-amber-700/90 mt-1 leading-snug">
              If not customized yet, the defaults are: Username <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200/50 font-bold">admin</code> and Password <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200/50 font-bold">admin</code>. These can be customized dynamically in the "Site Settings" tab of the dashboard and will synchronize across all devices.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left font-body text-xs">
            <div>
              <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-on-surface"
                placeholder="Staff username"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-on-surface"
                placeholder="Session key"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-600 font-bold text-xs mt-2 text-center">{loginError}</p>
            )}

            <button 
              type="submit" 
              className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-xl font-bold tracking-widest mt-6 uppercase transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> AUTHORIZE SECURE ENTRY
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN PORTAL RENDER
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      
      {/* Dynamic Header Toolbar */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/10 pb-6 mb-8">
        <div>
          <span className="font-body text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ADMIN WORKSPACE SECURED
          </span>
          <h2 className="font-headline text-2xl md:text-3xl text-on-surface font-bold mt-1">
            Ministry Control Panel
          </h2>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Log Out Session
        </button>
      </section>

      {/* Main Grid: Sidebar + Controlled Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar Navigation Menu */}
        <div className="lg:col-span-3 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 shadow-xs space-y-1">
          <p className="font-body text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest px-3 mb-2">
            MAIN PORTAL CHANNELS
          </p>

          <button 
            onClick={() => setCurrentSection('overview')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'overview' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Overview Analytics
          </button>

          <button 
            onClick={() => setCurrentSection('blogs')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'blogs' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Newspaper className="w-4 h-4" /> Manage Blog Spot
          </button>

          <button 
            onClick={() => setCurrentSection('sermons')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'sermons' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Video className="w-4 h-4" /> Manage Sermons
          </button>

          <button 
            onClick={() => setCurrentSection('events')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'events' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Calendar className="w-4 h-4" /> Manage Events
          </button>

          <button 
            onClick={() => setCurrentSection('lessons')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'lessons' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Manage Bible Studies
          </button>

          <button 
            onClick={() => setCurrentSection('prayers')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'prayers' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Mail className="w-4 h-4" /> Review Prayers ({pendingPrayersCount})
          </button>

          <button 
            onClick={() => setCurrentSection('settings')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider uppercase flex items-center gap-3 transition-colors cursor-pointer ${
              currentSection === 'settings' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Settings className="w-4 h-4" /> Site Settings
          </button>
        </div>

        {/* Right Side: Tab Canvas Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* SECTION 1: OVERVIEW */}
          {currentSection === 'overview' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Statistical counters bento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="font-body text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Sermons Count</span>
                    <h3 className="font-headline text-3xl font-bold mt-1 text-on-surface">{totalSermonsCount}</h3>
                  </div>
                  <button 
                    onClick={() => setCurrentSection('sermons')}
                    className="text-secondary font-body text-[10px] font-bold mt-4 tracking-wider uppercase hover:underline text-left"
                  >
                    Manage sermons list →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="font-body text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Active Blog Posts</span>
                    <h3 className="font-headline text-3xl font-bold mt-1 text-on-surface">{totalBlogsCount}</h3>
                  </div>
                  <button 
                    onClick={() => setCurrentSection('blogs')}
                    className="text-secondary font-body text-[10px] font-bold mt-4 tracking-wider uppercase hover:underline text-left"
                  >
                    Manage blog spot →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="font-body text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Pending Prayers</span>
                    <h3 className="font-headline text-3xl font-bold mt-1 text-on-surface">{pendingPrayersCount}</h3>
                  </div>
                  <button 
                    onClick={() => setCurrentSection('prayers')}
                    className="text-secondary font-body text-[10px] font-bold mt-4 tracking-wider uppercase hover:underline text-left"
                  >
                    Review prayer petition list →
                  </button>
                </div>
              </div>

              {/* Traffic Chart and logs column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-outline-variant/10 p-6 shadow-xs">
                  <h3 className="font-headline text-sm font-bold text-on-surface mb-4">Weekly Engagement Analytics</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#44474d" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#44474d" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="traffic" fill="#775a19" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-outline-variant/10 p-6 shadow-xs space-y-4 max-h-[250px] overflow-y-auto">
                  <h3 className="font-headline text-sm font-bold text-on-surface">Recent Workspace Events</h3>
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="text-xs font-body leading-relaxed flex items-start gap-2 border-b border-outline-variant/5 pb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                        <div>
                          <p className="font-bold text-on-surface">{log.title}</p>
                          <p className="text-[10px] text-on-surface-variant/80">{log.timestamp} • {log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
                <h4 className="font-headline text-sm font-bold text-on-surface mb-4">Quick Administrator Shortcuts</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={triggerAddBlogModal} className="bg-white hover:bg-secondary hover:text-white p-4 rounded-xl border border-outline-variant/5 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-xs">
                    <Newspaper className="w-5 h-5" />
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider">Publish Blog</span>
                  </button>
                  <button onClick={triggerAddSermonModal} className="bg-white hover:bg-secondary hover:text-white p-4 rounded-xl border border-outline-variant/5 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-xs">
                    <Video className="w-5 h-5" />
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider">Add Sermon</span>
                  </button>
                  <button onClick={triggerAddEventModal} className="bg-white hover:bg-secondary hover:text-white p-4 rounded-xl border border-outline-variant/5 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-xs">
                    <Calendar className="w-5 h-5" />
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider">New Event</span>
                  </button>
                  <button onClick={triggerAddLessonModal} className="bg-white hover:bg-secondary hover:text-white p-4 rounded-xl border border-outline-variant/5 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-xs">
                    <Bookmark className="w-5 h-5" />
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider">New Lesson</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: BLOGS CRUD LISTING */}
          {currentSection === 'blogs' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-bold text-on-surface">Manage Blog Spot Articles</h3>
                <button 
                  onClick={triggerAddBlogModal}
                  className="bg-secondary hover:bg-primary text-white text-xs font-bold font-body px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Publish Blog Post
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-xs overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  {blogs.length > 0 ? (
                    <table className="w-full text-xs font-body text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant/10 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Title & Author</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Publish Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {blogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-on-surface text-sm line-clamp-1">{blog.title}</p>
                              <p className="text-[10px] text-on-surface-variant">Author: {blog.author}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-secondary-container/30 text-secondary font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                                {blog.category}
                              </span>
                            </td>
                            <td className="p-4 text-on-surface-variant font-medium">{blog.date}</td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => triggerEditBlogModal(blog)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Edit Article"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this blog post?')) {
                                    onDeleteBlog(blog.id);
                                  }
                                }}
                                className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-20 italic text-on-surface-variant">
                      No blog posts published yet. Get started by publishing your first post!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: SERMONS CRUD LISTING */}
          {currentSection === 'sermons' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-bold text-on-surface">Manage Sermons</h3>
                <button 
                  onClick={triggerAddSermonModal}
                  className="bg-secondary hover:bg-primary text-white text-xs font-bold font-body px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Publish Sermon
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-xs overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  {sermons.length > 0 ? (
                    <table className="w-full text-xs font-body text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant/10 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Sermon Title & Book</th>
                          <th className="p-4">Language</th>
                          <th className="p-4">Format</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {sermons.map((sermon) => (
                          <tr key={sermon.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-on-surface text-sm line-clamp-1">{sermon.title}</p>
                              <p className="text-[10px] text-on-surface-variant">Book: {sermon.book} • {sermon.topic}</p>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-[10px]">{sermon.language}</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-surface-container-high font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                                {sermon.type}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => triggerEditSermonModal(sermon)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Edit Sermon"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this sermon?')) {
                                    onDeleteSermon(sermon.id);
                                  }
                                }}
                                className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Delete Sermon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-20 italic text-on-surface-variant">
                      No sermons loaded. Add some sermons to display in visitor lists!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: EVENTS CRUD LISTING */}
          {currentSection === 'events' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-bold text-on-surface">Manage Ministry Events</h3>
                <button 
                  onClick={triggerAddEventModal}
                  className="bg-secondary hover:bg-primary text-white text-xs font-bold font-body px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Schedule Event
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-xs overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  {events.length > 0 ? (
                    <table className="w-full text-xs font-body text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant/10 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Event Details</th>
                          <th className="p-4">Venue Location</th>
                          <th className="p-4">Schedule Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {events.map((event) => (
                          <tr key={event.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-on-surface text-sm">{event.title}</p>
                              <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block">
                                {event.type}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-on-surface-variant">{event.location}</td>
                            <td className="p-4 font-bold text-secondary">{event.date}</td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => triggerEditEventModal(event)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Edit Event"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this event?')) {
                                    onDeleteEvent(event.id);
                                  }
                                }}
                                className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-20 italic text-on-surface-variant">
                      No events scheduled.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: BIBLE STUDY LESSONS CRUD LISTING */}
          {currentSection === 'lessons' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-bold text-on-surface">Manage Bible Study Lessons</h3>
                <button 
                  onClick={triggerAddLessonModal}
                  className="bg-secondary hover:bg-primary text-white text-xs font-bold font-body px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Create Bible Study Lesson
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-xs overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  {lessons.length > 0 ? (
                    <table className="w-full text-xs font-body text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant/10 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Lesson Title & Reference</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Reflections</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {lessons.map((lesson) => (
                          <tr key={lesson.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-on-surface text-sm">{lesson.title}</p>
                              <p className="text-[10px] text-on-surface-variant font-mono">{lesson.reference}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-secondary-container/30 text-secondary font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                                {lesson.category}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-on-surface-variant">
                              {lesson.reflection ? lesson.reflection.length : 0} questions
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => triggerEditLessonModal(lesson)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Edit Lesson"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this Bible Study Lesson?')) {
                                    onDeleteLesson(lesson.id);
                                  }
                                }}
                                className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-20 italic text-on-surface-variant">
                      No Bible lessons loaded. Create some to populate the study view!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: REVIEW PRAYERS */}
          {currentSection === 'prayers' && (
            <div className="space-y-4 animate-fade-in text-left">
              <h3 className="font-headline text-xl font-bold text-on-surface">Review Prayer Intercessions</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">Manage, approve, or pray for incoming spiritual petitions sent by site visitors.</p>

              <div className="space-y-3">
                {prayers.length > 0 ? (
                  prayers.map((prayer) => (
                    <div key={prayer.id} className="p-4 bg-white rounded-2xl border border-outline-variant/10 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface text-sm font-body">{prayer.name}</span>
                          <span className="text-[10px] text-on-surface-variant">{prayer.date}</span>
                          {prayer.isUrgent && (
                            <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              Urgent
                            </span>
                          )}
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            prayer.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            prayer.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {prayer.status}
                          </span>
                        </div>
                        <p className="font-body text-xs text-on-surface-variant italic">
                          "{prayer.need}"
                        </p>
                      </div>

                      <div className="flex gap-1.5 shrink-0 self-end sm:self-auto">
                        {prayer.status !== 'Prayed For' && (
                          <button 
                            onClick={() => onUpdatePrayerStatus(prayer.id, 'Prayed For')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold font-body flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Prayed
                          </button>
                        )}
                        <button 
                          onClick={() => onDeletePrayer(prayer.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white text-center py-20 italic text-on-surface-variant border border-outline-variant/10 rounded-2xl shadow-xs">
                    No active prayer petitions in the queue.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 7: SETTINGS */}
          {currentSection === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-outline-variant/10 shadow-xs text-left animate-fade-in">
                <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Ministry Site Config</h3>
                
                <form onSubmit={handleSaveSettings} className="space-y-4 font-body text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-secondary uppercase">Ministry Platform Title</label>
                    <input 
                      type="text" 
                      value={siteSettings.ministryName}
                      onChange={(e) => setSiteSettings({...siteSettings, ministryName: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 text-secondary uppercase">Lead Administrative Contact</label>
                    <input 
                      type="email" 
                      value={siteSettings.leadEmail}
                      onChange={(e) => setSiteSettings({...siteSettings, leadEmail: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-on-surface">Enable Secure Partner Donations</p>
                        <p className="text-[10px] text-on-surface-variant">Allow global online giving modules inside Bible lessons</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={siteSettings.enableOnlineDonations}
                        onChange={(e) => setSiteSettings({...siteSettings, enableOnlineDonations: e.target.checked})}
                        className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-on-surface">Require Prayer Request Review</p>
                        <p className="text-[10px] text-on-surface-variant">Hold submissions in Pending status before public release</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={siteSettings.requirePrayerApproval}
                        onChange={(e) => setSiteSettings({...siteSettings, requirePrayerApproval: e.target.checked})}
                        className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-secondary hover:bg-primary text-white py-3 px-6 rounded-xl font-bold tracking-widest mt-6 uppercase transition-all duration-300 cursor-pointer"
                  >
                    APPLY SITE CONFIGS
                  </button>
                </form>
              </div>

              {/* Admin Credentials config card */}
              <div className="bg-white p-8 rounded-2xl border border-outline-variant/10 shadow-xs text-left animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-headline text-xl font-bold text-on-surface">Admin Credentials Config</h3>
                </div>
                <p className="font-body text-xs text-on-surface-variant mb-6">
                  Update the administrator ID and password below. These credentials are saved securely in Firestore and synchronized across all active devices in real-time.
                </p>

                <form onSubmit={handleUpdateCredentials} className="space-y-4 font-body text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-secondary uppercase">New Admin ID / Username</label>
                    <input 
                      type="text" 
                      value={credentialsForm.username}
                      onChange={(e) => setCredentialsForm({...credentialsForm, username: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface font-mono"
                      placeholder="e.g. evangelist_pradeep"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 text-secondary uppercase">New Password</label>
                    <input 
                      type="password" 
                      value={credentialsForm.password}
                      onChange={(e) => setCredentialsForm({...credentialsForm, password: e.target.value})}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                      placeholder="Enter new administrator password"
                      required 
                    />
                  </div>

                  {credSuccess && (
                    <p className="text-green-600 font-bold text-xs mt-2">{credSuccess}</p>
                  )}
                  {credError && (
                    <p className="text-red-600 font-bold text-xs mt-2">{credError}</p>
                  )}

                  <button 
                    type="submit" 
                    className="bg-secondary hover:bg-primary text-white py-3 px-6 rounded-xl font-bold tracking-widest mt-6 uppercase transition-all duration-300 cursor-pointer"
                  >
                    UPDATE ADMIN CREDENTIALS
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= ADMIN MANAGEMENT MODALS ================= */}

      {/* 1. Sermons Publish / Edit Modal */}
      {(activeModal === 'add-sermon' || activeModal === 'edit-sermon') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 border border-outline-variant/10 animate-scale-in relative text-left">
            <button 
              onClick={() => setActiveModal('none')}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
              {activeModal === 'add-sermon' ? 'Publish Sermon' : 'Modify Sermon Settings'}
            </h3>
            
            <form onSubmit={handleSaveSermon} className="space-y-4 font-body text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Sermon Title</label>
                <input 
                  type="text" 
                  value={sermonForm.title}
                  onChange={(e) => setSermonForm({...sermonForm, title: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                  placeholder="e.g. Integrity in Leadership" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Sermon Description</label>
                <textarea 
                  value={sermonForm.description}
                  onChange={(e) => setSermonForm({...sermonForm, description: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface resize-none"
                  rows={3}
                  placeholder="Summarize theological context..." 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Topic / Focus</label>
                  <input 
                    type="text" 
                    value={sermonForm.topic}
                    onChange={(e) => setSermonForm({...sermonForm, topic: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. Holiness" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Scriptural Book</label>
                  <input 
                    type="text" 
                    value={sermonForm.book}
                    onChange={(e) => setSermonForm({...sermonForm, book: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. Psalms" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Format Type</label>
                  <select 
                    value={sermonForm.type}
                    onChange={(e) => setSermonForm({...sermonForm, type: e.target.value as Sermon['type']})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs font-bold focus:outline-secondary text-on-surface"
                  >
                    <option value="video">Video Embed</option>
                    <option value="audio">Audio Stream</option>
                    <option value="series">Series Study</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Language</label>
                  <select 
                    value={sermonForm.language}
                    onChange={(e) => setSermonForm({...sermonForm, language: e.target.value as Sermon['language']})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs font-bold focus:outline-secondary text-on-surface"
                  >
                    <option value="English">English</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Duration</label>
                  <input 
                    type="text" 
                    value={sermonForm.duration}
                    onChange={(e) => setSermonForm({...sermonForm, duration: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. 45:00" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Media Link (YouTube URL or MP3 Link)</label>
                <input 
                  type="text" 
                  value={sermonForm.mediaUrl}
                  onChange={(e) => setSermonForm({...sermonForm, mediaUrl: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface font-mono"
                  placeholder="https://..." 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-xl font-bold tracking-widest mt-4 uppercase transition-all duration-300 cursor-pointer shadow-md"
              >
                {activeModal === 'add-sermon' ? 'Publish Sermon Live' : 'Update Sermon Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Events Schedule / Edit Modal */}
      {(activeModal === 'add-event' || activeModal === 'edit-event') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 border border-outline-variant/10 animate-scale-in relative text-left">
            <button 
              onClick={() => setActiveModal('none')}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
              {activeModal === 'add-event' ? 'Schedule Ministry Event' : 'Modify Scheduled Event'}
            </h3>
            
            <form onSubmit={handleSaveEvent} className="space-y-4 font-body text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Event Title</label>
                <input 
                  type="text" 
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                  placeholder="e.g. Family Prayer Assembly" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Event Description</label>
                <textarea 
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface resize-none"
                  rows={3}
                  placeholder="Describe venue highlights, speakers..." 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Date / Time</label>
                  <input 
                    type="text" 
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. July 28, 2026" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Venue Location</label>
                  <input 
                    type="text" 
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. Community Center B" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Event Category</label>
                <select 
                  value={eventForm.type}
                  onChange={(e) => setEventForm({...eventForm, type: e.target.value as MinistryEvent['type']})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs font-bold focus:outline-secondary text-on-surface"
                >
                  <option value="prayer">Prayer assembly</option>
                  <option value="bible_study">Bible Study Exegesis</option>
                  <option value="live">Global Live stream</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-xl font-bold tracking-widest mt-4 uppercase transition-all duration-300 cursor-pointer shadow-md"
              >
                {activeModal === 'add-event' ? 'Schedule Event Live' : 'Update Event Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Blog Publish / Edit Modal */}
      {(activeModal === 'add-blog' || activeModal === 'edit-blog') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-6 border border-outline-variant/10 animate-scale-in relative text-left">
            <button 
              onClick={() => setActiveModal('none')}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
              {activeModal === 'add-blog' ? 'Publish Theological Blog Article' : 'Modify Blog Post Details'}
            </h3>
            
            <form onSubmit={handleSaveBlog} className="space-y-4 font-body text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Article Title</label>
                <input 
                  type="text" 
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                  placeholder="e.g. Walking in Divine Alignment" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Short Summary (Visible in cards)</label>
                <input 
                  type="text" 
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({...blogForm, summary: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                  placeholder="Provide a highly scannable teaser summary..." 
                  required 
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Category</label>
                  <select 
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({...blogForm, category: e.target.value as BlogPost['category']})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs font-bold focus:outline-secondary text-on-surface"
                  >
                    <option value="Devotional">Devotional</option>
                    <option value="Theology">Theology Study</option>
                    <option value="Ministry Update">Ministry Update</option>
                    <option value="Spiritual Growth">Spiritual Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Read Time (Estimate)</label>
                  <input 
                    type="text" 
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. 5 min read" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Author Name</label>
                  <input 
                    type="text" 
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="Author name" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Header Banner Image URL</label>
                <input 
                  type="text" 
                  value={blogForm.imageUrl}
                  onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface font-mono"
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Complete Article Body Content (Supports blank line splits for layout)</label>
                <textarea 
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs focus:outline-secondary outline-none text-on-surface resize-none font-sans leading-relaxed"
                  rows={8}
                  placeholder="Draft the complete article blocks. Use '### Heading' on its own line to insert theological subheaders." 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-xl font-bold tracking-widest mt-4 uppercase transition-all duration-300 cursor-pointer shadow-md"
              >
                {activeModal === 'add-blog' ? 'Publish Article to Blog Spot' : 'Update Blog Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Bible Study Lesson Create / Edit Modal */}
      {(activeModal === 'add-lesson' || activeModal === 'edit-lesson') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-6 border border-outline-variant/10 animate-scale-in relative text-left">
            <button 
              onClick={() => setActiveModal('none')}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6">
              {activeModal === 'add-lesson' ? 'Create Bible Study Lesson' : 'Modify Bible Lesson Details'}
            </h3>
            
            <form onSubmit={handleSaveLesson} className="space-y-4 font-body text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Lesson Title</label>
                  <input 
                    type="text" 
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. Adoption as Sons" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Scriptural Range Reference</label>
                  <input 
                    type="text" 
                    value={lessonForm.reference}
                    onChange={(e) => setLessonForm({...lessonForm, reference: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface font-mono"
                    placeholder="e.g. Romans 8:14-17" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Exegesis Category</label>
                  <input 
                    type="text" 
                    value={lessonForm.category}
                    onChange={(e) => setLessonForm({...lessonForm, category: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface"
                    placeholder="e.g. Covenant Studies" 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-secondary uppercase">Cover Image URL</label>
                  <input 
                    type="text" 
                    value={lessonForm.imageUrl}
                    onChange={(e) => setLessonForm({...lessonForm, imageUrl: e.target.value})}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-sm focus:outline-secondary outline-none text-on-surface font-mono"
                    placeholder="Cover URL" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Historical & Literary Context</label>
                <textarea 
                  value={lessonForm.context}
                  onChange={(e) => setLessonForm({...lessonForm, context: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs focus:outline-secondary outline-none text-on-surface resize-none leading-relaxed"
                  rows={3}
                  placeholder="Describe the historical circumstances, author intent, and literary structure..." 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Interpretation & Scriptural Breakdown</label>
                <textarea 
                  value={lessonForm.interpretation}
                  onChange={(e) => setLessonForm({...lessonForm, interpretation: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs focus:outline-secondary outline-none text-on-surface resize-none leading-relaxed"
                  rows={3}
                  placeholder="Provide verse-by-verse structural exegesis, translation highlights..." 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-secondary uppercase">Reflection Questions (One per line)</label>
                <textarea 
                  value={lessonForm.reflectionInput}
                  onChange={(e) => setLessonForm({...lessonForm, reflectionInput: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-xs focus:outline-secondary outline-none text-on-surface resize-none leading-relaxed"
                  rows={3}
                  placeholder="Question 1&#10;Question 2&#10;Question 3" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-xl font-bold tracking-widest mt-4 uppercase transition-all duration-300 cursor-pointer shadow-md"
              >
                {activeModal === 'add-lesson' ? 'Create Lesson' : 'Update Lesson Details'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
