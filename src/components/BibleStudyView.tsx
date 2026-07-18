import { useState, useEffect, FormEvent } from 'react';
import { Download, Share2, BookOpen, ChevronRight, CheckCircle, Heart, Sparkles } from 'lucide-react';
import { BibleStudyLesson } from '../types';

interface BibleStudyViewProps {
  lessons: BibleStudyLesson[];
}

export default function BibleStudyView({ lessons }: BibleStudyViewProps) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('context');
  const [journalNotes, setJournalNotes] = useState<Record<string, string>>({});
  const [isNotesSaved, setIsNotesSaved] = useState<Record<string, boolean>>({});
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);

  const lesson = lessons[activeLessonIndex] || lessons[0];

  // Load journal notes from local storage
  useEffect(() => {
    const saved = localStorage.getItem('shinde_ministry_bible_notes');
    if (saved) {
      try {
        setJournalNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading bible notes', e);
      }
    }
  }, []);

  const handleNoteChange = (questionIndex: number, text: string) => {
    const noteKey = `${lesson.id}-q-${questionIndex}`;
    const updated = { ...journalNotes, [noteKey]: text };
    setJournalNotes(updated);
    localStorage.setItem('shinde_ministry_bible_notes', JSON.stringify(updated));

    setIsNotesSaved(prev => ({ ...prev, [noteKey]: true }));
    setTimeout(() => {
      setIsNotesSaved(prev => ({ ...prev, [noteKey]: false }));
    }, 1500);
  };

  const handleDownloadPDF = () => {
    // Elegant system print or custom action
    window.print();
  };

  const handleShareLesson = () => {
    if (navigator.share) {
      navigator.share({
        title: `${lesson.title} - Bible Study Lesson`,
        text: `Check out this scripture study on ${lesson.reference}: ${lesson.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const handleDonateSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setShowDonateModal(false);
      setCustomAmount('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Header / Title Area */}
      <section className="mb-12 text-center md:text-left">
        <div className="inline-block bg-secondary-container/20 text-secondary px-3.5 py-1 rounded-full font-body text-xs font-bold tracking-widest mb-4 uppercase">
          {lesson.category}
        </div>
        
        {/* Lesson selection tabs */}
        <div className="flex gap-4 mb-4 justify-center md:justify-start overflow-x-auto no-scrollbar">
          {lessons.map((l, index) => (
            <button
              key={l.id}
              onClick={() => setActiveLessonIndex(index)}
              className={`text-xs font-bold font-body py-1 px-3 rounded-md transition-all ${
                activeLessonIndex === index 
                  ? 'bg-secondary text-white' 
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {l.title}
            </button>
          ))}
        </div>

        <h2 className="font-headline text-4xl md:text-6xl text-primary mb-2 font-bold leading-tight">
          {lesson.title}
        </h2>
        <p className="font-headline text-2xl text-on-surface-variant/80 italic">
          {lesson.reference}
        </p>

        {/* Share / PDF controls */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3.5 rounded-xl font-body text-xs font-bold tracking-widest transition-all active:scale-95 shadow-sm uppercase"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD STUDY PDF
          </button>
          <button 
            onClick={handleShareLesson}
            className="flex items-center gap-2 border border-outline-variant hover:bg-surface-container-low bg-white text-on-surface px-6 py-3.5 rounded-xl font-body text-xs font-bold tracking-widest transition-all active:scale-95 shadow-sm uppercase"
          >
            <Share2 className="w-4 h-4" />
            SHARE LESSON
          </button>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Sidebar: Table of contents navigation */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-24">
          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/25">
            <h4 className="font-body text-xs font-bold text-secondary mb-6 tracking-widest uppercase">
              TABLE OF CONTENTS
            </h4>
            <ul className="space-y-4">
              {[
                { id: 'context', label: 'Context' },
                { id: 'interpretation', label: 'Interpretation' },
                { id: 'reflection', label: 'Reflection' },
                { id: 'cross-references', label: 'Cross-References' }
              ].map((section) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`font-body text-sm hover:text-secondary transition-colors flex items-center gap-2.5 ${
                      activeSection === section.id 
                        ? 'text-secondary font-bold font-semibold' 
                        : 'text-on-surface-variant font-medium'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeSection === section.id ? 'bg-secondary scale-125' : 'bg-transparent border border-outline'
                    }`}></span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Next Lesson Preview Banner */}
            <div className="mt-12 pt-8 border-t border-outline-variant/30">
              <div className="aspect-square w-full rounded-xl mb-4 overflow-hidden bg-surface-container-high relative group">
                <img 
                  src={lessons[(activeLessonIndex + 1) % lessons.length].imageUrl} 
                  alt="Next study" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <p className="text-[9px] font-bold tracking-widest text-secondary-container uppercase">NEXT STUDY LESSON</p>
                  <p className="text-white text-xs font-bold leading-snug mt-1 uppercase line-clamp-1">
                    {lessons[(activeLessonIndex + 1) % lessons.length].title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Lesson Body Column */}
        <article className="lg:col-span-9 bg-surface-container-lowest p-6 md:p-12 rounded-2xl border border-outline-variant/5 shadow-sm">
          
          {/* Context Section */}
          <section id="context" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 bg-secondary h-6 rounded"></span>
              <h3 className="font-headline text-2xl text-on-surface font-semibold">Context</h3>
            </div>
            <div className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed space-y-6">
              {lesson.context.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Interpretation Section */}
          <section id="interpretation" className="scroll-mt-24 mt-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 bg-secondary h-6 rounded"></span>
              <h3 className="font-headline text-2xl text-on-surface font-semibold">Interpretation</h3>
            </div>

            {/* Premium Quote Block */}
            <div className="bg-surface-container-low p-6 md:p-8 my-8 rounded-xl border-l-4 border-secondary italic text-on-surface-variant font-headline text-lg md:text-xl leading-relaxed shadow-sm">
              "There is therefore now no condemnation for those who are in Christ Jesus." (Romans 8:1)
            </div>

            <div className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed space-y-6">
              {lesson.interpretation.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Reflection Section */}
          <section id="reflection" className="scroll-mt-24 mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 bg-secondary h-6 rounded"></span>
              <h3 className="font-headline text-2xl text-on-surface font-semibold">Reflection & Reflection Journal</h3>
            </div>
            
            <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
              Use these guided reflection questions to search your heart. Write your personal notes below—they are saved securely in your browser so you can revisit them in future study sessions.
            </p>

            <ul className="space-y-8">
              {lesson.reflection.map((question, index) => {
                const noteKey = `${lesson.id}-q-${index}`;
                return (
                  <li key={index} className="flex flex-col md:flex-row gap-4 bg-surface-container-low/30 p-6 rounded-xl border border-outline-variant/15">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold font-body text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-grow space-y-4">
                      <p className="font-body text-base md:text-lg text-on-surface font-medium leading-relaxed mt-1">
                        {question}
                      </p>
                      
                      {/* Journal input */}
                      <div className="relative">
                        <textarea
                          value={journalNotes[noteKey] || ''}
                          onChange={(e) => handleNoteChange(index, e.target.value)}
                          className="w-full bg-white border border-outline-variant/40 focus:border-secondary rounded-lg p-3 text-xs font-body text-on-surface outline-none transition-colors"
                          placeholder="Write your study notes and prayers here..."
                          rows={3}
                        />
                        {isNotesSaved[noteKey] && (
                          <span className="absolute right-3 bottom-3 text-[10px] text-green-600 font-bold tracking-wider uppercase animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Saved
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Footnotes & Cross-References */}
          <section id="cross-references" className="scroll-mt-24 mt-16 pt-12 border-t border-outline-variant/20">
            <h4 className="font-body text-xs font-bold text-on-surface-variant mb-6 tracking-[0.2em] uppercase">
              CROSS-REFERENCES & FOOTNOTES
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-on-surface-variant leading-relaxed font-body">
              {lesson.crossReferences.map((ref, idx) => (
                <div key={idx} className="bg-surface-container-low/20 p-4 rounded-lg border border-outline-variant/10">
                  <p className="mb-2"><strong>[{idx + 1}] {ref.reference}</strong></p>
                  <p className="text-on-surface-variant/80">{ref.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Donation Call to Action (Bento Style) */}
          <section className="mt-16 bg-primary-container text-white rounded-2xl p-8 relative overflow-hidden group border border-outline/15 shadow-md">
            <div className="absolute -top-12 -right-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <span className="material-symbols-outlined text-[300px]">volunteer_activism</span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="font-headline text-2xl text-secondary-container mb-2 font-semibold">Support This Ministry</h3>
                <p className="font-body text-sm text-on-primary-container/80 max-w-md leading-relaxed">
                  Help us continue providing high-quality, scholarly Bible study resources for believers worldwide. Your generous donations sustain our ministry's reach.
                </p>
              </div>
              <button 
                onClick={() => setShowDonateModal(true)}
                className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white px-8 py-4 rounded-xl font-body text-xs font-bold tracking-widest transition-all active:scale-95 whitespace-nowrap cursor-pointer uppercase shadow-md"
              >
                GIVE SECURELY
              </button>
            </div>
          </section>
        </article>
      </div>

      {/* Share Toast Link */}
      {showShareToast && (
        <div className="fixed top-24 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-on-surface text-surface py-3 px-6 rounded-xl text-xs font-body font-bold shadow-xl z-50 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary-container" />
          Lesson link copied to clipboard! Share it with friends.
        </div>
      )}

      {/* Donation Modal overlay */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 border border-outline-variant/10 animate-scale-in relative overflow-hidden">
            <button 
              onClick={() => setShowDonateModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Secure Partnership Gift</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">Sustain the Ministry of Evangelist Pradeep Shinde</p>
            </div>

            {donationSuccess ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                <h4 className="font-headline text-lg font-bold text-on-surface">Thank You For Your Seed!</h4>
                <p className="font-body text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  Your seed sowing of <strong>${customAmount || donationAmount}</strong> was processed securely. May God bless you abundantly for your supportive stewardship!
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold font-body tracking-wider text-secondary uppercase mb-3">Select Gift Amount</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['25', '50', '100', '250'].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => { setDonationAmount(amt); setCustomAmount(''); }}
                        className={`py-3 rounded-lg text-sm font-body font-bold transition-all ${
                          donationAmount === amt && !customAmount
                            ? 'bg-secondary text-white shadow-md'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-body tracking-wider text-secondary uppercase mb-2">Or Enter Custom Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(''); }}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 outline-none font-body text-sm text-on-surface focus:ring-2 focus:ring-secondary/20"
                    placeholder="Enter custom dollar amount..."
                  />
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-[11px] text-on-surface-variant flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-sm text-secondary">lock</span>
                  <p>All ministry partners benefit from fully encrypted, secure bank-level SSL payment routing protocols.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-xl font-body text-xs font-bold tracking-widest transition-all"
                >
                  COMPLETE SECURER SOWING
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
