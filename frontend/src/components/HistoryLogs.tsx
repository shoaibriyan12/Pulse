import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Download,
  Trash2,
  Edit2,
  Filter,
  FileSpreadsheet,
  FileCode,
  Flame,
  Apple,
  Dumbbell,
  Scale,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { FitnessEntry } from '../types';

interface HistoryLogsProps {
  entries: FitnessEntry[];
  onEditEntry: (entry: FitnessEntry) => void;
  onDeleteEntry: (date: string) => void;
}

export default function HistoryLogs({
  entries,
  onEditEntry,
  onDeleteEntry
}: HistoryLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'workout' | 'high-protein' | 'high-calorie'>('all');

  // Filter logs dynamically
  const filteredEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Descending (latest first)
      .filter((entry) => {
        const matchesSearch =
          entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.date.split("T")[0].includes(searchTerm) ||
          entry.calories.toString().includes(searchTerm);

        if (!matchesSearch) return false;

        if (filterType === 'workout') return entry.workoutMinutes > 0;
        if (filterType === 'high-protein') return entry.protein >= 150;
        if (filterType === 'high-calorie') return entry.calories >= 1800;

        return true;
      });
  }, [entries, searchTerm, filterType]);

  // General biometric summary statistics for cards
  const statsSummary = useMemo(() => {
    if (entries.length === 0) return { total: 0, peakProtein: 0, peakCal: 0, avgWeight: 'N/A' };
    const values = entries.reduce(
      (acc, curr) => {
        if (curr.protein > acc.peakProtein) acc.peakProtein = curr.protein;
        if (curr.calories > acc.peakCal) acc.peakCal = curr.calories;
        if (curr.weight) {
          acc.weightSum += curr.weight;
          acc.weightCount++;
        }
        return acc;
      },
      { peakProtein: 0, peakCal: 0, weightSum: 0, weightCount: 0 }
    );
    return {
      total: entries.length,
      peakProtein: values.peakProtein,
      peakCal: values.peakCal,
      avgWeight: values.weightCount > 0 ? (values.weightSum / values.weightCount).toFixed(1) : 'N/A'
    };
  }, [entries]);

  // Export functions - Real implementation!
  const exportCSV = () => {
    if (entries.length === 0) return;
    const headers = 'Date,Calories,Protein,Carbs,Fat,Water,Steps,WorkoutMinutes,Weight,Notes\n';
    const rows = entries
      .map(
        (e) =>
          `"${e.date}",${e.calories},${e.protein},${e.carbs},${e.fat},${e.water},${e.steps},${e.workoutMinutes},${e.weight || ''},"${e.notes.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pulsefit_biometric_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (entries.length === 0) return;
    const jsonStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pulsefit_biometric_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mini Chart data for the filter column
  const miniChartData = useMemo(() => {
    return filteredEntries
      .slice(0, 10)
      .reverse()
      .map((e) => ({
        day: new Date(e.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        calories: e.calories
      }));
  }, [filteredEntries]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/15 uppercase">
            Data Ledger
          </span>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mt-1.5">
            Biometric Activity Logs
          </h1>
          <p className="text-neutral-400 text-xs mt-0.5">
            Query historic dietary intake and physical efforts, and perform database exports.
          </p>
        </div>

        {/* Real Export triggers */}
        <div className="flex items-center gap-2.5">
          <button
            id="export-csv-btn"
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer active:scale-[0.98]"
            title="Export full log data to CSV"
          >
            <Download className="w-4 h-4 text-brand-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            id="export-json-btn"
            onClick={exportJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer active:scale-[0.98]"
            title="Export full log data to JSON schema"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 2. TOP CARDS BIOMETRIC STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider block">Total Logged Days</span>
          <p className="text-xl font-display font-bold text-white mt-1">{statsSummary.total} days</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider block">Peak Protein Day</span>
          <p className="text-xl font-display font-bold text-brand-primary mt-1">{statsSummary.peakProtein}g</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider block">Max Calorie Intake</span>
          <p className="text-xl font-display font-bold text-brand-warning mt-1">{statsSummary.peakCal} kcal</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider block">Mean Body Weight</span>
          <p className="text-xl font-display font-bold text-brand-secondary mt-1">{statsSummary.avgWeight} kg</p>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Search Filter Columns */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-secondary" /> Query Filters
            </h3>

            {/* Keyword Search Input */}
            <div className="relative">
              <input
                id="logs-search-input"
                type="text"
                placeholder="Search notes or calorie counts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white placeholder-neutral-500 transition-all outline-none focus:border-brand-primary"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
            </div>

            {/* Structured Segmented filter switcher */}
            <div className="flex flex-col gap-1.5 pt-2">
              {[
                { id: 'all', label: 'All Historic Logs', color: 'border-white/5' },
                { id: 'workout', label: 'Workout Intervals Only', color: 'border-brand-accent/20' },
                { id: 'high-protein', label: 'High Protein (>=150g)', color: 'border-brand-primary/20' },
                { id: 'high-calorie', label: 'High Calorie (>=1800 kcal)', color: 'border-brand-warning/20' }
              ].map((filter) => (
                <button
                  id={`logs-filter-btn-${filter.id}`}
                  key={filter.id}
                  onClick={() => setFilterType(filter.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    filterType === filter.id
                      ? 'bg-white/[0.05] text-white border-white/20'
                      : 'text-neutral-400 hover:text-white bg-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mini Inline Calories bar chart represent current filtered set */}
          {miniChartData.length > 0 && (
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
              <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider block mb-3 font-mono">
                Energy Trend (Filtered Entries)
              </span>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={miniChartData}>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0e17',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <XAxis dataKey="day" hide />
                    <Bar dataKey="calories" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Data Table Column (Col-span-3) */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-4 text-right">Calories</th>
                    <th className="py-4 px-4 text-right">Macros (P/C/F)</th>
                    <th className="py-4 px-4 text-center">Workouts</th>
                    <th className="py-4 px-6">Logged notes</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-neutral-300">
                  <AnimatePresence mode="popLayout">
                    {filteredEntries.map((entry) => (
                      <motion.tr
                        id={`logs-table-row-${entry.date}`}
                        key={entry.date}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Date cell */}
                        <td className="py-4 px-6 font-mono text-xs font-semibold whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                            {entry.date}
                          </div>
                        </td>

                        {/* Calories cell */}
                        <td className="py-4 px-4 text-right font-mono font-bold text-amber-400">
                          {entry.calories} <span className="text-[10px] text-neutral-500 font-normal">kcal</span>
                        </td>

                        {/* Macros summary cell */}
                        <td className="py-4 px-4 text-right font-mono text-xs whitespace-nowrap">
                          <span className="text-brand-primary font-bold">{entry.protein}g</span>
                          <span className="text-neutral-500 mx-1">/</span>
                          <span className="text-brand-secondary font-bold">{entry.carbs}g</span>
                          <span className="text-neutral-500 mx-1">/</span>
                          <span className="text-brand-accent font-bold">{entry.fat}g</span>
                        </td>

                        {/* Workout minutes cell */}
                        <td className="py-4 px-4 text-center font-mono">
                          {entry.workoutMinutes > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-bold border border-brand-accent/15">
                              <Dumbbell className="w-3 h-3" />
                              {entry.workoutMinutes} min
                            </span>
                          ) : (
                            <span className="text-neutral-600 font-bold">-</span>
                          )}
                        </td>

                        {/* Notes excerpt cell */}
                        <td className="py-4 px-6 max-w-[260px] truncate text-xs text-neutral-400 font-sans" title={entry.notes}>
                          {entry.notes || <span className="text-neutral-600 italic">No description</span>}
                        </td>

                        {/* Action buttons cell */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`logs-edit-btn-${entry.date}`}
                              onClick={() => onEditEntry(entry)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-brand-secondary transition-colors cursor-pointer"
                              title="Edit entry details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`logs-delete-btn-${entry.date}`}
                              onClick={() => onDeleteEntry(entry.date)}
                              className="p-1.5 rounded-lg hover:bg-brand-danger/10 text-neutral-400 hover:text-brand-danger transition-colors cursor-pointer"
                              title="Delete log record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Stack View */}
            <div className="block md:hidden divide-y divide-white/5">
              {filteredEntries.map((entry) => (
                <div key={entry.date} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
                      {entry.date}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="p-1.5 rounded bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry.date)}
                        className="p-1.5 rounded bg-brand-danger/10 text-brand-danger cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase font-semibold">Calories</span>
                      <p className="font-bold text-amber-400 mt-0.5">{entry.calories} kcal</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase font-semibold">Protein</span>
                      <p className="font-bold text-brand-primary mt-0.5">{entry.protein}g</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase font-semibold">Macros (C/F)</span>
                      <p className="text-neutral-300 mt-0.5">{entry.carbs}g / {entry.fat}g</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase font-semibold">Workouts</span>
                      <p className="text-neutral-300 mt-0.5">{entry.workoutMinutes > 0 ? `${entry.workoutMinutes} min` : '-'}</p>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="p-2.5 rounded bg-white/[0.01] border border-white/5 text-[11px] text-neutral-400 leading-normal">
                      {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty Adherence state block */}
            {filteredEntries.length === 0 && (
              <div className="text-center py-16">
                <Filter className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-400">No log records found matching queries</p>
                <p className="text-xs text-neutral-500 mt-1">Adjust keyword search or quick filter constraints.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
