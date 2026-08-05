import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, Dumbbell, Apple, Calendar, ArrowUpRight, X, Clock } from 'lucide-react';
import { FitnessEntry } from '../types';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entries: FitnessEntry[];
  onSelectEntry: (date: string) => void;
}

export default function SearchDialog({
  isOpen,
  onClose,
  entries,
  onSelectEntry
}: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const quickTags = [
    { label: 'High Protein', value: 'high-protein', icon: Apple },
    { label: 'Workouts', value: 'workouts', icon: Dumbbell },
    { label: 'High Calorie', value: 'high-calorie', icon: Flame },
  ];

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Apply search query
      const matchesQuery =
        searchQuery === '' ||
        entry.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.date.includes(searchQuery) ||
        entry.calories.toString().includes(searchQuery) ||
        entry.protein.toString().includes(searchQuery);

      // Apply quick tag filter
      if (!matchesQuery) return false;

      if (activeTag === 'high-protein') {
        return entry.protein >= 150;
      }
      if (activeTag === 'workouts') {
        return entry.workoutMinutes > 0;
      }
      if (activeTag === 'high-calorie') {
        return entry.calories >= 1500;
      }

      return true;
    });
  }, [entries, searchQuery, activeTag]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 p-1"
          >
            <div id="search-spotlight-container" className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0c0e17]">
              {/* Search input header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/[0.01]">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  id="spotlight-search-input"
                  ref={inputRef}
                  type="text"
                  placeholder="Type a date, food item, protein amount, or workout minutes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 outline-none border-none py-1"
                />
                <button
                  id="spotlight-close-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick tags */}
              <div className="px-4 py-2 border-b border-white/5 flex gap-2 overflow-x-auto bg-neutral-900/30">
                {quickTags.map((tag) => {
                  const isSelected = activeTag === tag.value;
                  const Icon = tag.icon;
                  return (
                    <button
                      id={`tag-btn-${tag.value}`}
                      key={tag.value}
                      onClick={() => setActiveTag(isSelected ? null : tag.value)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : 'bg-white/[0.02] text-neutral-400 border-white/5 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              {/* Results Area */}
              <div className="max-h-[350px] overflow-y-auto p-2">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-10">
                    <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-neutral-400">No fitness entries found</p>
                    <p className="text-xs text-neutral-500 mt-1">Try refining your keyword query or filters.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Matches ({filteredEntries.length})
                    </div>
                    {filteredEntries.map((entry) => (
                      <button
                        id={`search-result-row-${entry.date}`}
                        key={entry.date}
                        onClick={() => {
                          onSelectEntry(entry.date);
                          onClose();
                        }}
                        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/[0.03] transition-all text-left border border-transparent hover:border-white/5 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 text-neutral-300">
                            <Calendar className="w-4 h-4 text-brand-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-neutral-400 font-mono">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-neutral-200 truncate pr-4 font-medium mt-0.5">
                              {entry.notes || 'No log details recorded'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right shrink-0">
                          <div>
                            <p className="text-xs text-neutral-300 font-bold font-mono">
                              {entry.calories} kcal
                            </p>
                            <p className="text-[10px] text-brand-primary font-bold font-mono mt-0.5">
                              {entry.protein}g P
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Spotlight footer */}
              <div className="flex justify-between items-center px-4 py-2 bg-neutral-950/80 border-t border-white/5 text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Search history instantly
                </span>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
