import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavbar from './components/BottomNavbar';
import MediaPlayer from './components/MediaPlayer';
import HomeView from './components/HomeView';
import SermonsView from './components/SermonsView';
import BibleStudyView from './components/BibleStudyView';
import BlogView from './components/BlogView';
import AdminDashboardView from './components/AdminDashboardView';
import { 
  INITIAL_SERMONS, 
  INITIAL_EVENTS, 
  INITIAL_BIBLE_LESSONS, 
  INITIAL_PRAYER_REQUESTS, 
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BLOGS
} from './data';
import { Sermon, MinistryEvent, PrayerRequest, ActivityLog, BlogPost, BibleStudyLesson } from './types';
import { collection, onSnapshot, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'sermons' | 'bible' | 'blog' | 'admin'>('home');
  const [playingSermon, setPlayingSermon] = useState<Sermon | null>(null);

  // Synchronized States
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<MinistryEvent[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [lessons, setLessons] = useState<BibleStudyLesson[]>([]);

  // Load and listen to Firestore collections in real-time
  useEffect(() => {
    // 1. Listen to sermons
    const unsubSermons = onSnapshot(collection(db, 'sermons'), async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial sermons
        for (const item of INITIAL_SERMONS) {
          await setDoc(doc(db, 'sermons', item.id), item);
        }
      } else {
        const list: Sermon[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Sermon);
        });
        setSermons(list);
      }
    });

    // 2. Listen to events
    const unsubEvents = onSnapshot(collection(db, 'events'), async (snapshot) => {
      if (snapshot.empty) {
        for (const item of INITIAL_EVENTS) {
          await setDoc(doc(db, 'events', item.id), item);
        }
      } else {
        const list: MinistryEvent[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as MinistryEvent);
        });
        setEvents(list);
      }
    });

    // 3. Listen to prayers
    const unsubPrayers = onSnapshot(collection(db, 'prayers'), async (snapshot) => {
      if (snapshot.empty) {
        for (const item of INITIAL_PRAYER_REQUESTS) {
          await setDoc(doc(db, 'prayers', item.id), item);
        }
      } else {
        const list: PrayerRequest[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as PrayerRequest);
        });
        setPrayers(list);
      }
    });

    // 4. Listen to logs
    const unsubLogs = onSnapshot(collection(db, 'logs'), async (snapshot) => {
      if (snapshot.empty) {
        for (const item of INITIAL_ACTIVITY_LOGS) {
          await setDoc(doc(db, 'logs', item.id), item);
        }
      } else {
        const list: ActivityLog[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ActivityLog);
        });
        // Sort logs to show latest first
        list.sort((a, b) => b.id.localeCompare(a.id));
        setLogs(list);
      }
    });

    // 5. Listen to blogs
    const unsubBlogs = onSnapshot(collection(db, 'blogs'), async (snapshot) => {
      if (snapshot.empty) {
        for (const item of INITIAL_BLOGS) {
          await setDoc(doc(db, 'blogs', item.id), item);
        }
      } else {
        const list: BlogPost[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        });
        setBlogs(list);
      }
    });

    // 6. Listen to lessons
    const unsubLessons = onSnapshot(collection(db, 'lessons'), async (snapshot) => {
      if (snapshot.empty) {
        for (const item of INITIAL_BIBLE_LESSONS) {
          await setDoc(doc(db, 'lessons', item.id), item);
        }
      } else {
        const list: BibleStudyLesson[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as BibleStudyLesson);
        });
        setLessons(list);
      }
    });

    return () => {
      unsubSermons();
      unsubEvents();
      unsubPrayers();
      unsubLogs();
      unsubBlogs();
      unsubLessons();
    };
  }, []);

  // ====== Sermons CRUD ======
  const handleAddSermon = async (sermon: Sermon) => {
    await setDoc(doc(db, 'sermons', sermon.id), sermon);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      title: `New Sermon Published: "${sermon.title}"`,
      timestamp: 'Just now',
      type: 'sermon',
      details: `By Admin • Book: ${sermon.book} • Format: ${sermon.type}`
    };
    await setDoc(doc(db, 'logs', newLog.id), newLog);
  };

  const handleUpdateSermon = async (updatedSermon: Sermon) => {
    await setDoc(doc(db, 'sermons', updatedSermon.id), updatedSermon);
  };

  const handleDeleteSermon = async (id: string) => {
    await deleteDoc(doc(db, 'sermons', id));
  };

  // ====== Events CRUD ======
  const handleAddEvent = async (event: MinistryEvent) => {
    await setDoc(doc(db, 'events', event.id), event);
  };

  const handleUpdateEvent = async (updatedEvent: MinistryEvent) => {
    await setDoc(doc(db, 'events', updatedEvent.id), updatedEvent);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteDoc(doc(db, 'events', id));
  };

  // ====== Prayers CRUD ======
  const handleAddPrayerRequest = async (req: Omit<PrayerRequest, 'id' | 'date' | 'status'>) => {
    const fullRequest: PrayerRequest = {
      ...req,
      id: `prayer-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Pending'
    };
    await setDoc(doc(db, 'prayers', fullRequest.id), fullRequest);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      title: `New Prayer Request from ${req.name}`,
      timestamp: 'Just now',
      type: 'prayer',
      details: req.isUrgent ? 'Urgent intercession request' : 'General prayer support'
    };
    await setDoc(doc(db, 'logs', newLog.id), newLog);
  };

  const handleUpdatePrayerStatus = async (id: string, status: PrayerRequest['status']) => {
    await updateDoc(doc(db, 'prayers', id), { status });
  };

  const handleDeletePrayer = async (id: string) => {
    await deleteDoc(doc(db, 'prayers', id));
  };

  // ====== Blogs CRUD ======
  const handleAddBlog = async (blog: BlogPost) => {
    await setDoc(doc(db, 'blogs', blog.id), blog);
  };

  const handleUpdateBlog = async (updatedBlog: BlogPost) => {
    await setDoc(doc(db, 'blogs', updatedBlog.id), updatedBlog);
  };

  const handleDeleteBlog = async (id: string) => {
    await deleteDoc(doc(db, 'blogs', id));
  };

  // ====== Bible Study Lessons CRUD ======
  const handleAddLesson = async (lesson: BibleStudyLesson) => {
    await setDoc(doc(db, 'lessons', lesson.id), lesson);
  };

  const handleUpdateLesson = async (updatedLesson: BibleStudyLesson) => {
    await setDoc(doc(db, 'lessons', updatedLesson.id), updatedLesson);
  };

  const handleDeleteLesson = async (id: string) => {
    await deleteDoc(doc(db, 'lessons', id));
  };

  // Scroll to top on navigation
  const handleNavigate = (tab: 'home' | 'sermons' | 'bible' | 'blog' | 'admin') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between selection:bg-secondary-container">
      {/* Platform Header */}
      <Header activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Main View Router */}
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <HomeView 
                onNavigate={handleNavigate} 
                sermons={sermons} 
                events={events} 
                onPlaySermon={setPlayingSermon}
                onSubmitPrayer={handleAddPrayerRequest}
              />
            )}
            {activeTab === 'sermons' && (
              <SermonsView 
                sermons={sermons} 
                onPlaySermon={setPlayingSermon}
                onNavigateToStudy={() => handleNavigate('bible')}
              />
            )}
            {activeTab === 'bible' && (
              <BibleStudyView lessons={lessons} />
            )}
            {activeTab === 'blog' && (
              <BlogView blogs={blogs} />
            )}
            {activeTab === 'admin' && (
              <AdminDashboardView 
                sermons={sermons}
                onAddSermon={handleAddSermon}
                onUpdateSermon={handleUpdateSermon}
                onDeleteSermon={handleDeleteSermon}
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                prayers={prayers}
                onUpdatePrayerStatus={handleUpdatePrayerStatus}
                onDeletePrayer={handleDeletePrayer}
                blogs={blogs}
                onAddBlog={handleAddBlog}
                onUpdateBlog={handleUpdateBlog}
                onDeleteBlog={handleDeleteBlog}
                lessons={lessons}
                onAddLesson={handleAddLesson}
                onUpdateLesson={handleUpdateLesson}
                onDeleteLesson={handleDeleteLesson}
                logs={logs}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Platform Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile-only bottom app bar */}
      <BottomNavbar activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Media Player overlay */}
      <MediaPlayer sermon={playingSermon} onClose={() => setPlayingSermon(null)} />
    </div>
  );
}
