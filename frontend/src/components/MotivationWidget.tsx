import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RotateCw,
  Copy,
  Check,
  Lock,
  Compass,
  Bookmark,
  Award
} from 'lucide-react';
import { Quote, getRandomQuote, FITNESS_QUOTES, getAllCategories } from '../utils/quotes';

interface MotivationWidgetProps {
  selectedDate: string;
}

export default function MotivationWidget({ selectedDate }: MotivationWidgetProps) {
  // State for active category filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // State for currently displayed quote
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => getRandomQuote());
  
  // State for copy to clipboard feedback
  const [isCopied, setIsCopied] = useState(false);

  // Load and store commitments: Record<date_string, quote_id>
  const [commitments, setCommitments] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('pulsefit_mindset_commits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored mindset commitments', e);
      }
    }
    return {};
  });

  // Track if the quote for the selectedDate is already committed
  const committedQuoteId = commitments[selectedDate];
  const isCommittedToday = !!committedQuoteId;

  // Whenever selectedDate changes, check if there's a committed quote for that day
  useEffect(() => {
    if (isCommittedToday) {
      const found = FITNESS_QUOTES.find(q => q.id === committedQuoteId);
      if (found) {
        setCurrentQuote(found);
        setSelectedCategory(found.category);
        return;
      }
    }
    // If nothing committed for this date, fetch a random one matching active category
    const categoryFilter = selectedCategory === 'All' ? undefined : selectedCategory;
    setCurrentQuote(getRandomQuote(categoryFilter));
  }, [selectedDate, committedQuoteId]);

  // Sync commitments to localStorage
  useEffect(() => {
    localStorage.setItem('pulsefit_mindset_commits', JSON.stringify(commitments));
  }, [commitments]);

  // Cycle to a new random quote from the selected category
  const handleCycleQuote = () => {
    if (isCommittedToday) return; // Prevent cycling if locked/committed
    const categoryFilter = selectedCategory === 'All' ? undefined : selectedCategory;
    
    // Pick a random quote, ensuring it's different if possible
    let nextQuote = getRandomQuote(categoryFilter);
    const availableQuotes = FITNESS_QUOTES.filter(q => selectedCategory === 'All' || q.category === selectedCategory);
    
    if (availableQuotes.length > 1) {
      while (nextQuote.id === currentQuote.id) {
        nextQuote = getRandomQuote(categoryFilter);
      }
    }
    
    setCurrentQuote(nextQuote);
  };

  // Change category filter
  const handleCategoryChange = (category: string) => {
    if (isCommittedToday) return; // Locked when committed
    setSelectedCategory(category);
    const categoryFilter = category === 'All' ? undefined : category;
    setCurrentQuote(getRandomQuote(categoryFilter));
  };

  // Copy quote to clipboard
  const handleCopyQuote = () => {
    const copyText = `"${currentQuote.text}" — ${currentQuote.author} (${currentQuote.category} focus)`;
    navigator.clipboard.writeText(copyText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Lock in / Commit to today's mindset focus
  const handleCommitMindset = () => {
    setCommitments(prev => ({
      ...prev,
      [selectedDate]: currentQuote.id
    }));
  };

  // Unlock/change focus
  const handleUnlockMindset = () => {
    if (window.confirm("Do you want to clear your committed mindset for this day?")) {
      setCommitments(prev => {
        const updated = { ...prev };
        delete updated[selectedDate];
        return updated;
      });
    }
  };

  // Pre-configured styling colors for intensities
  const intensityStyles = {
    'Calm': 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    'Focus': 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5',
    'High Intensity': 'border-purple-500/20 text-purple-400 bg-purple-500/5'
  };

  return (
    <div 
      id="motivation-mindset-widget"
      className={`glass-card rounded-2xl p-6 soft-depth relative overflow-hidden transition-all duration-500 ${
        isCommittedToday 
          ? 'border border-brand-primary/20 shadow-[0_0_25px_rgba(16,185,129,0.06)] bg-gradient-to-br from-brand-bg-dark to-brand-primary/[0.02]' 
          : 'border border-white/5'
      }`}
    >
      {/* Background glow when committed */}
      {isCommittedToday && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isCommittedToday ? 'text-brand-primary animate-pulse' : 'text-brand-secondary'}`} />
          <h3 className="font-display text-base font-bold text-white">
            Daily Mindset Focus
          </h3>
        </div>
        
        {isCommittedToday ? (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> Locked Focus
          </span>
        ) : (
          <span className="text-[10px] text-neutral-500 font-mono">
            Biometric Alignment
          </span>
        )}
      </div>

      {/* Category Selection Filter (disabled when committed to prevent cheating/accidents) */}
      {!isCommittedToday && (
        <div className="flex flex-wrap gap-1 mb-4">
          {['All', ...getAllCategories()].map((cat) => (
            <button
              id={`quote-cat-btn-${cat.toLowerCase()}`}
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30'
                  : 'bg-white/[0.01] text-neutral-500 border-white/5 hover:bg-white/5 hover:text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Quote Display Block with smooth AnimatePresence transition */}
      <div className="min-h-[110px] flex flex-col justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Quote marks background */}
            <span className="absolute -top-1 -left-1 text-5xl font-serif text-white/[0.03] select-none leading-none">
              “
            </span>

            <p className="text-[12.5px] leading-relaxed text-neutral-200 font-medium italic relative z-10">
              {currentQuote.text}
            </p>
            
            <div className="flex items-center justify-between pt-1 z-10 relative">
              <span className="text-[11px] font-display font-semibold text-brand-secondary tracking-wide">
                — {currentQuote.author}
              </span>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono border ${intensityStyles[currentQuote.intensity]}`}>
                  {currentQuote.intensity}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-neutral-900 border border-white/5 text-neutral-400">
                  {currentQuote.category}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interaction Controls */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <div className="flex gap-2">
          {/* Copy Button */}
          <button
            id="quote-copy-btn"
            onClick={handleCopyQuote}
            title="Copy quote to clipboard"
            className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-brand-primary" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Cycle Button (hidden when committed) */}
          {!isCommittedToday && (
            <button
              id="quote-cycle-btn"
              onClick={handleCycleQuote}
              title="Get another random quote"
              className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center group"
            >
              <RotateCw className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Commitment Button logic */}
        {isCommittedToday ? (
          <button
            id="quote-unlock-btn"
            onClick={handleUnlockMindset}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 text-[10px] text-neutral-400 hover:text-neutral-200 border border-white/5 hover:border-white/10 transition-all cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            Change Focus
          </button>
        ) : (
          <button
            id="quote-commit-btn"
            onClick={handleCommitMindset}
            className="px-3.5 py-1.5 rounded-xl bg-brand-primary text-black text-[10.5px] font-bold hover:bg-brand-primary/95 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            <Bookmark className="w-3 h-3 fill-current" /> Commit to Focus
          </button>
        )}
      </div>

      {/* Success commitment prompt */}
      {isCommittedToday && (
        <div className="mt-3.5 p-2.5 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-2 text-[10px] text-brand-primary font-medium animate-fadeIn">
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span>Mindset locked for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}! Stay aligned.</span>
        </div>
      )}
    </div>
  );
}
