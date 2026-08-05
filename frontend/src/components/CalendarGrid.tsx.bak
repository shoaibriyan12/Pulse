import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Apple,
  Dumbbell,
  Droplets,
  Scale,
  Sparkles,
  Plus,
  Edit2,
  CalendarDays,
  Info
} from 'lucide-react';
import { FitnessEntry, Goals } from '../types';

interface CalendarGridProps {
  entries: FitnessEntry[];
  goals: Goals;
  onAddEntryForDate: (date: string) => void;
  onEditEntry: (entry: FitnessEntry) => void;
}

export default function CalendarGrid({
  entries,
  goals,
  onAddEntryForDate,
  onEditEntry
}: CalendarGridProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed, 6 is July

  // Heatmap View Mode: 'calories' or 'protein'
  const [heatmapMode, setHeatmapMode] = useState<'calories' | 'protein'>('calories');

  // Selected date cell for deep inspector
  const [inspectedDate, setInspectedDate] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setInspectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setInspectedDate(null);
  };

  // Days in month calculation
  const { daysInMonth, startDayOffset, daysArray } = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Day of week of the first day of month (0 = Sun, 1 = Mon...)
    const startOffset = new Date(currentYear, currentMonth, 1).getDay();

    const arr = [];
    for (let i = 1; i <= totalDays; i++) {
      const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      arr.push({ day: i, dateString: dStr });
    }
    return { daysInMonth: totalDays, startDayOffset: startOffset, daysArray: arr };
  }, [currentYear, currentMonth]);

  // Map entries to helper dictionary for instant lookup
  const entryMap = useMemo(() => {
    const map: Record<string, FitnessEntry> = {};
    entries.forEach(e => {
      map[e.date] = e;
    });
    return map;
  }, [entries]);

  // Selected entry from click inspector
  const inspectedEntry = useMemo(() => {
    if (!inspectedDate) return null;
    return entryMap[inspectedDate] || null;
  }, [inspectedDate, entryMap]);

  // Heatmap intensity calculation color class
  const getHeatmapColor = (entry: FitnessEntry | undefined) => {
    if (!entry) return 'bg-white/[0.02] border-white/5 hover:bg-white/10';

    if (heatmapMode === 'calories') {
      const pct = entry.calories / goals.calories;
      if (pct >= 1.1) return 'bg-amber-600/60 text-white border-amber-500/40 hover:bg-amber-600/80'; // surplus
      if (pct >= 0.85) return 'bg-amber-500/40 text-amber-200 border-amber-400/30 hover:bg-amber-500/60'; // hitting target
      if (pct >= 0.5) return 'bg-amber-500/20 text-amber-300/80 border-amber-500/10 hover:bg-amber-500/40'; // intermediate
      return 'bg-amber-500/10 text-amber-400/60 border-amber-500/5 hover:bg-amber-500/25';
    } else {
      const pct = entry.protein / goals.protein;
      if (pct >= 1.0) return 'bg-emerald-600/60 text-white border-emerald-500/40 hover:bg-emerald-600/80'; // hit protein target
      if (pct >= 0.8) return 'bg-emerald-500/35 text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/55';
      if (pct >= 0.5) return 'bg-emerald-500/20 text-emerald-300/80 border-emerald-500/10 hover:bg-emerald-500/40';
      return 'bg-emerald-500/10 text-emerald-400/60 border-emerald-500/5 hover:bg-emerald-500/25';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/15 uppercase">
            Somatic Calendar
          </span>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mt-1.5">
            Biometric Log Heatmap
          </h1>
          <p className="text-neutral-400 text-xs mt-0.5">
            Visually audit adherence streaks, workout densities, and macro scores.
          </p>
        </div>

        {/* Month switcher + heat toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Heat selector toggler */}
          <div className="flex rounded-xl bg-white/[0.03] border border-white/5 p-1 text-xs">
            <button
              id="heatmap-toggle-calories"
              onClick={() => setHeatmapMode('calories')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                heatmapMode === 'calories'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Calorie Burn
            </button>
            <button
              id="heatmap-toggle-protein"
              onClick={() => setHeatmapMode('protein')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                heatmapMode === 'protein'
                  ? 'bg-emerald-500/15 text-brand-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Protein Intake
            </button>
          </div>

          {/* Month switcher controls */}
          <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-1">
            <button
              id="calendar-prev-month"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-white min-w-[110px] text-center">
              {months[currentMonth]} {currentYear}
            </span>
            <button
              id="calendar-next-month"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR BODY AND INSPECTOR ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* HEATMAP CALENDAR GRID CONTAINER (COL-SPAN-3) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 soft-depth">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2.5">
            {/* Empty Offsets */}
            {Array.from({ length: startDayOffset }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-square rounded-xl bg-white/[0.005] border border-transparent opacity-30"
              />
            ))}

            {/* Active Cells */}
            {daysArray.map((cell) => {
              const entry = entryMap[cell.dateString];
              const intensityColorClass = getHeatmapColor(entry);
              const isSelected = inspectedDate === cell.dateString;

              return (
                <button
                  id={`calendar-day-cell-${cell.dateString}`}
                  key={cell.day}
                  onClick={() => setInspectedDate(cell.dateString)}
                  className={`relative aspect-square rounded-xl border flex flex-col justify-between p-2.5 transition-all duration-300 group cursor-pointer ${intensityColorClass} ${
                    isSelected ? 'ring-2 ring-brand-secondary ring-offset-2 ring-offset-[#080911] scale-[1.03]' : ''
                  }`}
                >
                  {/* Day number */}
                  <span className="text-xs font-mono font-bold tracking-tighter opacity-80 group-hover:opacity-100">
                    {cell.day}
                  </span>

                  {/* Badges indicator section */}
                  {entry && (
                    <div className="flex items-center gap-1 mt-auto">
                      {entry.workoutMinutes > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_5px_#8b5cf6]" title="Workout logged" />
                      )}
                      {entry.water > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shadow-[0_0_5px_#06b6d4]" title="Hydration logged" />
                      )}
                      {entry.weight && (
                        <span className="text-[8px] font-mono font-bold text-neutral-400 bg-black/40 px-1 py-0.2 rounded leading-none shrink-0" title="Weight logged">
                          {entry.weight}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Mini Hover Tooltip details */}
                  {entry && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 origin-bottom bg-neutral-950 border border-white/10 p-2.5 rounded-lg shadow-2xl text-[10px] font-mono text-neutral-300 leading-normal pointer-events-none z-20 w-44">
                      <p className="font-bold text-white border-b border-white/5 pb-1 mb-1.5 text-center">{entry.date}</p>
                      <div className="flex justify-between"><span>Calories:</span> <span className="text-amber-400 font-bold">{entry.calories} kcal</span></div>
                      <div className="flex justify-between"><span>Protein:</span> <span className="text-emerald-400 font-bold">{entry.protein}g</span></div>
                      {entry.workoutMinutes > 0 && (
                        <div className="flex justify-between text-brand-accent"><span>Workout:</span> <span>{entry.workoutMinutes} min</span></div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Color Legend explanation bar */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Info className="w-4 h-4" />
              <span>Grid colors indicate relative target accomplishment percentages.</span>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
              <span>Less</span>
              <div className={`w-3.5 h-3.5 rounded ${heatmapMode === 'calories' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`} />
              <div className={`w-3.5 h-3.5 rounded ${heatmapMode === 'calories' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`} />
              <div className={`w-3.5 h-3.5 rounded ${heatmapMode === 'calories' ? 'bg-amber-500/40' : 'bg-emerald-500/35'}`} />
              <div className={`w-3.5 h-3.5 rounded ${heatmapMode === 'calories' ? 'bg-amber-600/60' : 'bg-emerald-600/60'}`} />
              <span>More</span>
            </div>
          </div>

        </div>

        {/* DEEP DATE INSPECTOR PANEL */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {inspectedDate ? (
              <motion.div
                key={inspectedDate}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0b0c15] h-full flex flex-col justify-between soft-depth"
              >
                <div>
                  <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider font-mono">Selected Cell</span>
                      <h3 className="font-display text-sm font-extrabold text-white mt-0.5">
                        {new Date(inspectedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </h3>
                    </div>
                    <button
                      id="close-inspector-btn"
                      onClick={() => setInspectedDate(null)}
                      className="text-[10px] text-neutral-500 hover:text-white cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>

                  {inspectedEntry ? (
                    <div className="space-y-5">
                      {/* Calories count row */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-semibold text-neutral-300">Energy Intake</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-amber-400">{inspectedEntry.calories} kcal</span>
                      </div>

                      {/* Protein count row */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="flex items-center gap-2">
                          <Apple className="w-4 h-4 text-brand-primary" />
                          <span className="text-xs font-semibold text-neutral-300">Protein Synthesis</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-brand-primary">{inspectedEntry.protein}g</span>
                      </div>

                      {/* Split details values */}
                      <div className="space-y-2.5 font-mono text-xs border-y border-white/5 py-3">
                        <div className="flex justify-between text-neutral-400">
                          <span>Carbohydrates:</span>
                          <span className="text-neutral-200">{inspectedEntry.carbs}g</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Fats index:</span>
                          <span className="text-neutral-200">{inspectedEntry.fat}g</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Active steps:</span>
                          <span className="text-neutral-200">{inspectedEntry.steps}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Workout log:</span>
                          <span className="text-brand-accent font-semibold">{inspectedEntry.workoutMinutes} mins</span>
                        </div>
                        {inspectedEntry.weight && (
                          <div className="flex justify-between text-neutral-400">
                            <span>Body Weight:</span>
                            <span className="text-brand-secondary font-bold">{inspectedEntry.weight} kg</span>
                          </div>
                        )}
                      </div>

                      {/* Logged Notes */}
                      <div>
                        <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block mb-1.5">Diet notes & recovery details</span>
                        <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-neutral-300 leading-relaxed font-sans max-h-36 overflow-y-auto">
                          {inspectedEntry.notes || 'No food items or recovery notes registered.'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarDays className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                      <p className="text-xs font-semibold text-neutral-400">No logs for this cell date</p>
                      <p className="text-[10px] text-neutral-500 mt-1">Keep your records airtight to capture trends.</p>
                    </div>
                  )}
                </div>

                {/* Date-Inspector footer triggers */}
                <div className="pt-4 border-t border-white/5 mt-6">
                  {inspectedEntry ? (
                    <button
                      id="inspector-edit-btn"
                      onClick={() => onEditEntry(inspectedEntry)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-neutral-200 transition-all border border-white/5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Adjust Biometric Entry
                    </button>
                  ) : (
                    <button
                      id="inspector-create-btn"
                      onClick={() => onAddEntryForDate(inspectedDate)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-primary text-black text-xs font-bold transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:brightness-110 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Entry Now
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center border border-white/5 flex flex-col justify-center items-center h-full min-h-[250px] text-neutral-400">
                <Sparkles className="w-8 h-8 text-neutral-500 animate-pulse mb-3" />
                <h4 className="font-display text-sm font-bold text-white mb-1">Interactive Somatic Hub</h4>
                <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed">
                  Click on any calendar day block to deep-inspect biometric ratios and notes.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
