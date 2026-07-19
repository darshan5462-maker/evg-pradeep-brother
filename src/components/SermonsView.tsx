import { useState, useMemo } from 'react';
import { Search, ChevronDown, Video, Mic, BookOpen, Volume2, ArrowRight, PlayCircle, Headphones, Check } from 'lucide-react';
import { Sermon, SermonType, LanguageType } from '../types';

interface SermonsViewProps {
  sermons: Sermon[];
  onPlaySermon: (sermon: Sermon) => void;
  onNavigateToStudy: () => void;
}

export default function SermonsView({ sermons, onPlaySermon, onNavigateToStudy }: SermonsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Topic');
  const [selectedBook, setSelectedBook] = useState('Book');
  const [selectedLanguage, setSelectedLanguage] = useState('Language');
  const [selectedChip, setSelectedChip] = useState('All Messages');
  const [currentPage, setCurrentPage] = useState(1);

  // Available filters extracted from data
  const topics = useMemo(() => {
    const list = new Set(sermons.map(s => s.topic));
    return ['Topic', ...Array.from(list)];
  }, [sermons]);

  const books = useMemo(() => {
    const list = new Set(sermons.map(s => s.book));
    return ['Book', ...Array.from(list)];
  }, [sermons]);

  const languages = useMemo(() => {
    const list = new Set(sermons.map(s => s.language));
    return ['Language', ...Array.from(list)];
  }, [sermons]);

  // Handle filtering
  const filteredSermons = useMemo(() => {
    return sermons.filter(sermon => {
      // Search text match
      const matchesSearch = 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.book.toLowerCase().includes(searchTerm.toLowerCase());

      // Topic selector match
      const matchesTopic = selectedTopic === 'Topic' || sermon.topic === selectedTopic;

      // Book selector match
      const matchesBook = selectedBook === 'Book' || sermon.book === selectedBook;

      // Language selector match
      const matchesLanguage = selectedLanguage === 'Language' || sermon.language === selectedLanguage;

      // Chip match presets
      let matchesChip = true;
      if (selectedChip === 'Latest Releases') {
        matchesChip = sermon.date.includes('2024') || sermon.id === 'sermon-1';
      } else if (selectedChip === 'Most Watched') {
        matchesChip = sermon.type === 'video';
      } else if (selectedChip === 'Series Teachings') {
        matchesChip = sermon.type === 'series';
      }

      return matchesSearch && matchesTopic && matchesBook && matchesLanguage && matchesChip;
    });
  }, [sermons, searchTerm, selectedTopic, selectedBook, selectedLanguage, selectedChip]);

  // Paginate filtered sermons
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredSermons.length / itemsPerPage) || 1;
  const paginatedSermons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSermons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSermons, currentPage]);

  const handleChipClick = (chip: string) => {
    setSelectedChip(chip);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTopic('Topic');
    setSelectedBook('Book');
    setSelectedLanguage('Language');
    setSelectedChip('All Messages');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Header Section */}
      <section className="mb-12 text-left">
        <h2 className="font-headline text-4xl md:text-5xl mb-4 text-on-surface font-semibold">
          Sermon Library
        </h2>
        <p className="font-body text-base md:text-lg text-on-surface-variant max-w-2xl">
          Explore our collection of teachings, biblical insights, and spiritual messages delivered by Bro. Pradeep Shinde.
        </p>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-16 md:top-20 z-30 mb-12 py-4 bg-background/95 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative w-full lg:flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 outline-none font-body text-sm placeholder:text-on-surface-variant/70 text-on-surface shadow-sm transition-all"
              placeholder="Search by title, scripture, or keyword..."
            />
          </div>

          {/* Filters Selectors */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Topic Filter */}
            <div className="relative min-w-[130px] flex-1 lg:flex-none">
              <select 
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-surface-container-low border-none rounded-xl py-3.5 pl-4 pr-10 font-body text-xs font-bold tracking-wider uppercase focus:ring-2 focus:ring-secondary/20 text-on-surface cursor-pointer shadow-sm"
              >
                {topics.map(t => (
                  <option key={t} value={t}>{t === 'Topic' ? 'Topic' : t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>

            {/* Book Filter */}
            <div className="relative min-w-[130px] flex-1 lg:flex-none">
              <select 
                value={selectedBook}
                onChange={(e) => { setSelectedBook(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-surface-container-low border-none rounded-xl py-3.5 pl-4 pr-10 font-body text-xs font-bold tracking-wider uppercase focus:ring-2 focus:ring-secondary/20 text-on-surface cursor-pointer shadow-sm"
              >
                {books.map(b => (
                  <option key={b} value={b}>{b === 'Book' ? 'Book' : b}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>

            {/* Language Filter */}
            <div className="relative min-w-[130px] flex-1 lg:flex-none">
              <select 
                value={selectedLanguage}
                onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-surface-container-low border-none rounded-xl py-3.5 pl-4 pr-10 font-body text-xs font-bold tracking-wider uppercase focus:ring-2 focus:ring-secondary/20 text-on-surface cursor-pointer shadow-sm"
              >
                {languages.map(l => (
                  <option key={l} value={l}>{l === 'Language' ? 'Language' : l}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex justify-between items-center mt-6 overflow-x-auto pb-2 no-scrollbar gap-4">
          <div className="flex gap-2 shrink-0">
            {['All Messages', 'Latest Releases', 'Most Watched', 'Series Teachings'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`px-4 py-1.5 rounded-full font-body text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                  selectedChip === chip 
                    ? 'bg-secondary-container text-on-secondary-container font-semibold' 
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container/20'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {(searchTerm || selectedTopic !== 'Topic' || selectedBook !== 'Book' || selectedLanguage !== 'Language' || selectedChip !== 'All Messages') && (
            <button 
              onClick={clearFilters}
              className="text-xs font-bold text-secondary underline hover:text-primary transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Sermon Grid (Bento style) */}
      {paginatedSermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedSermons.map((sermon) => {
            const isVideo = sermon.type === 'video';
            const isAudio = sermon.type === 'audio';
            const isSeries = sermon.type === 'series';

            return (
              <article 
                key={sermon.id} 
                className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {/* Media Image / Cover Container */}
                <div className="relative aspect-video overflow-hidden bg-black/5 shrink-0">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all z-10"></div>
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${sermon.imageUrl}')` }}
                  ></div>

                  {/* Format Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-secondary text-white px-3 py-1 rounded-full font-body text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                      {isVideo && <Video className="w-3.5 h-3.5" />}
                      {isAudio && <Mic className="w-3.5 h-3.5" />}
                      {isSeries && <BookOpen className="w-3.5 h-3.5" />}
                      {sermon.type}
                    </span>
                  </div>

                  {/* Duration/Language tag */}
                  <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
                    {sermon.language === 'Kannada' && (
                      <span className="bg-black/60 text-white px-2.5 py-0.5 rounded-md font-body text-[10px] font-bold uppercase tracking-wider">
                        Kannada
                      </span>
                    )}
                    <span className="bg-black/60 text-white px-2 py-0.5 rounded-md font-body text-[10px] font-bold uppercase tracking-wider">
                      {sermon.duration}
                    </span>
                  </div>
                </div>

                {/* Sermon Info */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-body text-[10px] font-bold tracking-widest text-secondary uppercase">
                        {sermon.topic}
                      </p>
                      <p className="font-body text-[10px] text-on-surface-variant font-medium">
                        {sermon.date}
                      </p>
                    </div>

                    <h3 className="font-headline text-lg font-bold mb-3 group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                      {sermon.title}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                      {sermon.description}
                    </p>
                  </div>

                  {/* Footer Card Row */}
                  <div className="mt-auto pt-4 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-body font-extrabold text-[10px] tracking-tighter">
                        PS
                      </div>
                      <span className="font-body text-[11px] font-bold text-on-surface tracking-wide">
                        {sermon.speaker}
                      </span>
                    </div>

                    {isSeries ? (
                      <button 
                        onClick={onNavigateToStudy}
                        className="flex items-center gap-1.5 text-secondary font-bold font-body text-[10px] tracking-wider uppercase hover:translate-x-1 transition-transform"
                      >
                        VIEW SERIES <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onPlaySermon(sermon)}
                        className="flex items-center gap-1.5 text-secondary font-bold font-body text-[10px] tracking-wider uppercase hover:translate-x-1 transition-transform cursor-pointer"
                      >
                        {isVideo ? 'WATCH' : 'LISTEN'}
                        <PlayCircle className="w-4 h-4 text-secondary fill-secondary/10" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-outline-variant rounded-2xl max-w-xl mx-auto px-6">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">search_off</span>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-2">No Sermons Found</h3>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            We couldn't find any sermons matching your search filter parameters. Try clearing filters or searching for something else.
          </p>
          <button 
            onClick={clearFilters}
            className="mt-6 bg-secondary text-white px-6 py-2.5 rounded-lg font-body text-xs font-bold tracking-wider uppercase hover:bg-primary transition-all duration-300"
          >
            Show All Sermons
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-secondary-container transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-body text-xs font-bold transition-all ${
                currentPage === page 
                  ? 'bg-secondary text-white font-bold shadow-md' 
                  : 'hover:bg-secondary-container transition-colors'
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-secondary-container transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
