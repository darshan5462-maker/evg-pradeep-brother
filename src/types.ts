export type SermonType = 'video' | 'audio' | 'series';
export type LanguageType = 'English' | 'Kannada' | 'Hindi';

export interface Sermon {
  id: string;
  title: string;
  description: string;
  topic: string;
  book: string;
  language: LanguageType;
  type: SermonType;
  duration: string;
  date: string;
  speaker: string;
  imageUrl: string;
  mediaUrl: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  need: string;
  date: string;
  status: 'Pending' | 'Reviewed' | 'Prayed For';
  isUrgent: boolean;
}

export interface MinistryEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'prayer' | 'bible_study' | 'live';
  imageUrl: string;
}

export interface BibleStudyLesson {
  id: string;
  title: string;
  reference: string;
  category: string;
  context: string;
  interpretation: string;
  reflection: string[];
  crossReferences: { reference: string; text: string }[];
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: 'Devotional' | 'Theology' | 'Ministry Update' | 'Spiritual Growth';
  imageUrl: string;
  readTime: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: 'sermon' | 'prayer' | 'donation';
  details: string;
}
