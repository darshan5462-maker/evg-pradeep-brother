import { useState } from 'react';
import { Search, Calendar, User, Clock, ArrowRight, Share2, Sparkles, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogViewProps {
  blogs: BlogPost[];
}

type BlogCategory = 'All' | 'Devotional' | 'Theology' | 'Ministry Update' | 'Spiritual Growth';

export default function BlogView({ blogs }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  // Filter & Search
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: BlogCategory[] = ['All', 'Devotional', 'Theology', 'Ministry Update', 'Spiritual Growth'];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Blog Hero Heading */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <span className="font-body text-xs font-bold text-secondary mb-3 block tracking-widest uppercase">
          INSIGHTS & SPIRITUAL NOURISHMENT
        </span>
        <h2 className="font-headline text-3xl md:text-5xl text-on-surface font-semibold tracking-tight">
          The Ministry Blog Spot
        </h2>
        <p className="font-body text-sm text-on-surface-variant mt-3 leading-relaxed">
          Read theological insights, weekly devotionals, and official ministry notifications published directly by Bro Pradeep Shinde and his team.
        </p>
      </section>

      {/* Filters and Search Bar Row */}
      <section className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs or scriptures..."
            className="w-full bg-surface-container border border-outline-variant/30 rounded-full py-2.5 pl-10 pr-4 font-body text-xs text-on-surface outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/40 transition-all"
          />
          <Search className="w-4 h-4 text-on-surface-variant/70 absolute left-3.5 top-3" />
        </div>
      </section>

      {/* Blogs Main Listing Grid */}
      {filteredBlogs.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Blog Banner Image */}
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    src={blog.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB58HYK5MeZb_Ps2NVHScusVawOwPfvNQImbtvf5uN26n-8RvRft67jn--21cVucJg28waHcqkAVN980ltdsvygTZoIfzUPPJRUaCu4vo1BNf2800PGAFBzRuBqJCGXj-wUk1hWIPSChGfFYA6XkAlXoYg7veZ8z-r0EqzYdgeSclybX7-Z7C7fFLUCDYCdVMTck3sE4_tUqWw-B-8csZsAJfYBM0gBrQcUT64TjHWWMc_7gMemBdVJ6w"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-secondary font-body text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs border border-outline-variant/10">
                    {blog.category}
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[10px] font-bold font-body text-on-surface-variant/70 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      {blog.readTime || "5 min read"}
                    </span>
                  </div>

                  <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="font-body text-xs text-on-surface-variant mt-3 line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              {/* Footer action button */}
              <div className="px-6 pb-6 pt-2 border-t border-outline-variant/5 flex items-center justify-between">
                <span className="text-[10px] text-on-surface-variant font-medium font-body flex items-center gap-1">
                  <User className="w-3 h-3" /> By {blog.author.split(' ')[0]}
                </span>

                <button
                  onClick={() => setActiveBlog(blog)}
                  className="text-secondary font-body text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                >
                  READ ARTICLE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/10">
          <BookOpen className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4" />
          <h4 className="font-headline text-lg font-bold text-on-surface">No articles found</h4>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            Try adjusting your search terms or category selection filters.
          </p>
        </section>
      )}

      {/* Blog Details Modal Dialog */}
      {activeBlog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
          <div 
            className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/10 animate-scale-in my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="h-64 w-full overflow-hidden relative">
              <img 
                src={activeBlog.imageUrl} 
                alt={activeBlog.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveBlog(null)}
                className="absolute right-4 top-4 bg-black/40 text-white hover:bg-black/60 p-2 rounded-full transition-colors backdrop-blur-xs border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title & Category inside Banner */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <span className="bg-secondary text-white font-body text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                  {activeBlog.category}
                </span>
                <h3 className="font-headline text-xl md:text-3xl font-bold mt-3 leading-snug">
                  {activeBlog.title}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Contents */}
            <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto">
              {/* Author & Date Panel */}
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-outline-variant/10 mb-6 text-xs text-on-surface-variant font-body">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 font-bold text-on-surface">
                    <User className="w-4 h-4 text-secondary" />
                    Published by: {activeBlog.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-secondary" />
                    {activeBlog.date}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 font-bold text-secondary">
                  <Clock className="w-4 h-4" />
                  {activeBlog.readTime}
                </span>
              </div>

              {/* Actual Content Render (Expository / Devotional blocks) */}
              <div className="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed space-y-4 text-left">
                {activeBlog.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={index} className="font-headline text-base md:text-lg font-bold text-on-surface pt-4">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ') || paragraph.match(/^\d+\./)) {
                    // Render simple lists
                    return (
                      <div key={index} className="pl-4 border-l-2 border-secondary/30 space-y-2 my-2 italic">
                        {paragraph.split('\n').map((item, subIdx) => (
                          <p key={subIdx}>{item}</p>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="bg-surface-container-low px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/10">
              <span className="font-body text-[10px] text-on-surface-variant/70 font-semibold uppercase tracking-wider">
                Support our ministry by spreading the Word
              </span>

              <div className="flex gap-2">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this spiritual article "${activeBlog.title}" by Bro. Pradeep Shinde Ministry: ${window.location.origin}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-body px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
                </a>
                <button
                  onClick={() => setActiveBlog(null)}
                  className="bg-outline-variant/10 hover:bg-outline-variant/20 text-on-surface text-xs font-bold font-body px-4 py-2 rounded-lg transition-all"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
