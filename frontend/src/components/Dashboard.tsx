import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Apple,
  Droplets,
  Dumbbell,
  Scale,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { FitnessEntry, Goals, UserProfile } from '../types';
import MotivationWidget from './MotivationWidget';

interface DashboardProps {
  entries: FitnessEntry[];
  goals: Goals;
  profile: UserProfile;
  onNavigateToTab: (tab: string) => void;
  onEditEntry: (entry: FitnessEntry) => void;
}

export default function Dashboard({
  entries,
  goals,
  profile,
  onNavigateToTab,
  onEditEntry
}: DashboardProps) {
  // We'll set the active focus date to the latest entry by default
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  const latestEntryDate = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1].date : '';
  const [selectedDate, setSelectedDate] = useState(latestEntryDate);

  const activeEntry = useMemo(() => {
    const entry = entries.find(e => e.date.split("T")[0] === selectedDate.split("T")[0]);
    return entry || sortedEntries[sortedEntries.length - 1];
  }, [entries, selectedDate, sortedEntries]);

  // Handle case where no entries exist
  if (!activeEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
        <Activity className="w-16 h-16 text-brand-primary/40 animate-pulse mb-4" />
        <h3 className="font-display text-xl font-bold text-white mb-2">No Health Data Available</h3>
        <p className="text-neutral-400 text-sm max-w-md">Create your first daily log entry in the sidebar to light up the health command center.</p>
      </div>
    );
  }

  // --- Calculations & Insights Formulas ---
  // 1. Streak calculation (consecutive days)
  const streak = useMemo(() => {
    if (sortedEntries.length === 0) return 0;
    let currentStreak = 1;
    for (let i = sortedEntries.length - 1; i > 0; i--) {
      const prev = new Date(sortedEntries[i - 1].date);
      const curr = new Date(sortedEntries[i].date);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    return currentStreak;
  }, [sortedEntries]);

  // 2. Daily Readiness Score (Formula-based, max 100)
  const readinessScore = useMemo(() => {
    let score = 55; // Base line
    // Protein target achievement (up to 15 points)
    const pPct = activeEntry.protein / goals.protein;
    score += Math.min(15, Math.floor(pPct * 15));

    // Calories target proximity (up to 15 points)
    const calDiffRatio = Math.abs(activeEntry.calories - goals.calories) / goals.calories;
    if (calDiffRatio <= 0.1) score += 15;
    else if (calDiffRatio <= 0.25) score += 8;

    // Workout minutes logged (up to 15 points)
    if (activeEntry.workoutMinutes >= goals.workoutMinutes) score += 15;
    else if (activeEntry.workoutMinutes > 0) score += 7;

    // Steps logged (up to 15 points)
    if (activeEntry.steps >= goals.steps) score += 15;
    else if (activeEntry.steps > 0) score += 7;

    // Cap at 100
    return Math.min(100, score);
  }, [activeEntry, goals]);

  // 3. Consistency Score (% of goals hit in last 7 entries)
  const consistencyScore = useMemo(() => {
    if (entries.length === 0) return 0;
    const lastSeven = entries.slice(-7);
    let goalsMet = 0;
    lastSeven.forEach(e => {
      if (e.protein >= goals.protein) goalsMet++;
      if (e.calories <= goals.calories && e.calories >= goals.calories - 400) goalsMet++;
    });
    return Math.round((goalsMet / (lastSeven.length * 2)) * 100);
  }, [entries, goals]);

  // 4. Smart Recommendations list
  const recommendations = useMemo(() => {
    const list = [];
    // Protein check
    if (activeEntry.protein < goals.protein) {
      list.push({
        type: 'nutrition',
        title: 'Protein Deficit Detected',
        text: `You are short by ${goals.protein - activeEntry.protein}g protein today. Consuming high-quality whey or white meats will aid muscle synthesis.`,
        urgency: 'high'
      });
    } else {
      list.push({
        type: 'success',
        title: 'Protein Baseline Met',
        text: 'Superb protein intake today! Your muscles have abundant building blocks for recovery.',
        urgency: 'low'
      });
    }

    // Hydration check
    if (activeEntry.water < goals.water) {
      list.push({
        type: 'hydration',
        title: 'Optimize Fluid Levels',
        text: `Hydration levels are at ${Math.round((activeEntry.water / goals.water) * 100)}%. Drink another ${goals.water - activeEntry.water}ml to assist kidney filtration and cellular transport.`,
        urgency: 'medium'
      });
    }

    // Activity check
    if (activeEntry.workoutMinutes === 0) {
      list.push({
        type: 'activity',
        title: 'Active Recovery Phase',
        text: 'No formal workout registered. Treat today as a recovery interval, or opt for a light 20-minute stretching session.',
        urgency: 'low'
      });
    } else {
      list.push({
        type: 'success',
        title: 'Anabolic Stimulus Delivered',
        text: `Logged a powerful ${activeEntry.workoutMinutes}-minute session. Maintain steady sodium intake to prevent cramps.`,
        urgency: 'low'
      });
    }

    return list;
  }, [activeEntry, goals]);

  // 5. Weekly Averages
  const weeklyAverages = useMemo(() => {
    const lastSeven = entries.slice(-7);
    if (lastSeven.length === 0) return { calories: 0, protein: 0, weight: 0 };
    const sums = lastSeven.reduce(
      (acc, curr) => {
        acc.calories += curr.calories;
        acc.protein += curr.protein;
        if (curr.weight) {
          acc.weightSum += curr.weight;
          acc.weightCount++;
        }
        return acc;
      },
      { calories: 0, protein: 0, weightSum: 0, weightCount: 0 }
    );
    return {
      calories: Math.round(sums.calories / lastSeven.length),
      protein: Math.round(sums.protein / lastSeven.length),
      weight: sums.weightCount > 0 ? (sums.weightSum / sums.weightCount).toFixed(1) : 'N/A'
    };
  }, [entries]);

  // 6. Macro balance stats
  const macroStats = useMemo(() => {
    const pKcal = activeEntry.protein * 4;
    const cKcal = activeEntry.carbs * 4;
    const fKcal = activeEntry.fat * 9;
    const totalCalc = pKcal + cKcal + fKcal;
    if (totalCalc === 0) return { proteinPct: 33, carbsPct: 33, fatPct: 34 };
    return {
      proteinPct: Math.round((pKcal / totalCalc) * 100),
      carbsPct: Math.round((cKcal / totalCalc) * 100),
      fatPct: Math.round((fKcal / totalCalc) * 100),
    };
  }, [activeEntry]);

  // Percentage indicators
  const caloriePercent = Math.min(100, Math.round((activeEntry.calories / goals.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((activeEntry.protein / goals.protein) * 100));
  const waterPercent = Math.min(100, Math.round((activeEntry.water / goals.water) * 100));
  const stepsPercent = Math.min(100, Math.round((activeEntry.steps / goals.steps) * 100));

  // Custom Chart formatting helpers
  const formatChartDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 cosmic-grid pb-12">
      {/* 1. HERO SECTION & DATE SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/15 uppercase">
              Athlete Level: Pro
            </span>
            <div className="flex items-center gap-1 text-[11px] text-brand-secondary font-mono font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{streak} Day Logging Streak</span>
            </div>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Fitness Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Center</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Analyzing biometric trends and cellular recovery metrics.
          </p>
        </div>

        {/* Date Selector Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            History Frame:
          </span>
          {sortedEntries.slice(-6).map((e) => {
            const isSelected = selectedDate === e.date;
            const formatted = new Date(e.date).toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
            });
            return (
              <button
                id={`dashboard-date-tab-${e.date}`}
                key={e.date}
                onClick={() => setSelectedDate(e.date)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-primary/15 text-brand-primary border-brand-primary/35 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.02] text-neutral-400 border-white/5 hover:bg-white/5'
                }`}
              >
                {formatted}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROW 1 CARD 1: TODAY'S PROGRESS RINGS & READY SCORE */}
        <div id="readiness-summary-card" className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden soft-depth">
          {/* Subtle Ambient glow behind the gauge */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                Daily Biofeedback
              </span>
              <h2 className="font-display text-lg font-bold text-white mt-0.5">
                Readiness & Goal Tracking
              </h2>
            </div>
            <button
              id="refine-entry-btn"
              onClick={() => onEditEntry(activeEntry)}
              className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
            >
              Adjust Entry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Animated Readiness Gauge */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-3">
                Readiness Score
              </span>
              <div className="relative flex items-center justify-center w-32 h-32">
                {/* SVG Radial Progress Background */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="rgba(255, 255, 255, 0.03)"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="url(#emeraldGradient)"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * readinessScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-display font-extrabold text-white tracking-tighter">
                    {readinessScore}%
                  </span>
                  <span className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                    {readinessScore >= 85 ? 'Peak State' : readinessScore >= 70 ? 'Moderate' : 'Rest Focus'}
                  </span>
                </div>
              </div>
            </div>

            {/* Calories circular ring */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-3">
                Calorie Index
              </span>
              <div className="relative flex items-center justify-center w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="rgba(255, 255, 255, 0.03)"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="#f59e0b"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * caloriePercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-mono font-bold text-white tracking-tight">
                    {activeEntry.calories}
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">
                    / {goals.calories} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Protein Ring */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-3">
                Protein Synthesis
              </span>
              <div className="relative flex items-center justify-center w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="rgba(255, 255, 255, 0.03)"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    strokeWidth="8"
                    stroke="#10b981"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * proteinPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-mono font-bold text-white tracking-tight">
                    {activeEntry.protein}g
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">
                    / {goals.protein}g
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ROW 1 CARD 2: STREAKS & KEY STATS ACROSS TIME */}
        <div id="metric-streaks-card" className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between soft-depth">
          <div>
            <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
              System Consistency
            </span>
            <h2 className="font-display text-lg font-bold text-white mt-0.5 mb-4">
              Achievements & Score
            </h2>

            <div className="space-y-4">
              {/* Consistency Score gauge */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                  <span>Adherence Score (7 Days)</span>
                  <span className="text-brand-secondary">{consistencyScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"
                    style={{ width: `${consistencyScore}%` }}
                  />
                </div>
              </div>

              {/* Achievements row */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-brand-warning/15 text-brand-warning flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Consistency Master</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Unlocked by logging calorie data consistently for 7 consecutive days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-6 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">
                Workout Target
              </span>
              <p className="text-sm font-semibold text-neutral-300 font-mono mt-0.5">
                {activeEntry.workoutMinutes} / <span className="text-neutral-500">{goals.workoutMinutes}m</span>
              </p>
            </div>
            <div>
              <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">
                Water Target
              </span>
              <p className="text-sm font-semibold text-neutral-300 font-mono mt-0.5">
                {activeEntry.water} / <span className="text-neutral-500">{goals.water}ml</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. DUAL GRID: CHARTS VS LIVE RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHARTS CONTAINER (COL-SPAN-2) */}
        <div id="analytics-charts-panel" className="lg:col-span-2 space-y-6">
          
          {/* Chart 1: Energy & Nitrogen (Protein) Trends */}
          <div className="glass-card rounded-2xl p-6 soft-depth">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                  Continuous Biometrics
                </span>
                <h3 className="font-display text-lg font-bold text-white mt-0.5">
                  Calorie & Protein Correlation
                </h3>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-brand-warning">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-warning inline-block" />
                  Calories (kcal)
                </span>
                <span className="flex items-center gap-1.5 text-brand-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block" />
                  Protein (g)
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedEntries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    stroke="rgba(255, 255, 255, 0.3)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="rgba(255, 255, 255, 0.3)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="rgba(255, 255, 255, 0.3)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0e17',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="calories"
                    name="Calories"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCalories)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="protein"
                    name="Protein"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProtein)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Body Weight splines over time */}
          <div className="glass-card rounded-2xl p-6 soft-depth">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
                  Somatic Matrix
                </span>
                <h3 className="font-display text-lg font-bold text-white mt-0.5">
                  Body Weight Dynamics
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Goal: <span className="text-brand-secondary font-bold font-mono">{goals.weight} kg</span>
              </p>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sortedEntries.filter(e => e.weight !== undefined)}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    stroke="rgba(255, 255, 255, 0.3)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    stroke="rgba(255, 255, 255, 0.3)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0e17',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* SIDE BAR DASHBOARD CARD: MACRO PROFILE & DYNAMIC INSIGHTS */}
        <div className="space-y-6">

          {/* Motivation & Daily Mindset Focus Widget */}
          <MotivationWidget selectedDate={selectedDate} />

          {/* Card: Macro Balance distribution stacked bar */}
          <div id="macro-split-card" className="glass-card rounded-2xl p-6 soft-depth">
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">
              Anabolic Composition
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-0.5 mb-4">
              Macronutrient Balance
            </h3>

            {/* Stacked visually clean progress bar representation */}
            <div className="w-full h-4 rounded-full overflow-hidden flex mb-4 border border-white/5 bg-neutral-950">
              <div
                className="h-full bg-brand-primary"
                style={{ width: `${macroStats.proteinPct}%` }}
                title={`Protein: ${macroStats.proteinPct}%`}
              />
              <div
                className="h-full bg-brand-secondary"
                style={{ width: `${macroStats.carbsPct}%` }}
                title={`Carbs: ${macroStats.carbsPct}%`}
              />
              <div
                className="h-full bg-brand-accent"
                style={{ width: `${macroStats.fatPct}%` }}
                title={`Fat: ${macroStats.fatPct}%`}
              />
            </div>

            {/* Explanatory grams list */}
            <div className="space-y-3 font-mono text-xs text-neutral-300">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" />
                  Protein
                </span>
                <span>{activeEntry.protein}g ({macroStats.proteinPct}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary inline-block" />
                  Carbohydrates
                </span>
                <span>{activeEntry.carbs}g ({macroStats.carbsPct}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
                  Fat
                </span>
                <span>{activeEntry.fat}g ({macroStats.fatPct}%)</span>
              </div>
            </div>
          </div>

          {/* Card: Smart Recommendations list */}
          <div id="smart-insights-card" className="glass-card rounded-2xl p-6 soft-depth">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <h3 className="font-display text-base font-bold text-white">
                Coaching & Recovery
              </h3>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => {
                let badgeClass = 'text-brand-secondary bg-brand-secondary/10';
                if (rec.urgency === 'high') badgeClass = 'text-brand-danger bg-brand-danger/10';
                return (
                  <div key={index} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-neutral-200">{rec.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{rec.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info card */}
          <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex gap-3 text-xs text-brand-primary">
            <Info className="w-5 h-5 shrink-0" />
            <p className="leading-relaxed">
              Your metabolism is operating efficiently. Keep protein over <strong>{goals.protein}g</strong> to support your active routines.
            </p>
          </div>

        </div>

      </div>

      {/* 4. HISTORICAL HIGHLIGHTS AND STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">Average Daily Calories</span>
          <p className="text-2xl font-display font-extrabold text-white mt-1">{weeklyAverages.calories} <span className="text-xs text-neutral-400 font-normal">kcal</span></p>
          <div className="mt-2 text-[10px] text-brand-primary font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Steady energy balance preserved
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">Average Protein (7d)</span>
          <p className="text-2xl font-display font-extrabold text-white mt-1">{weeklyAverages.protein} <span className="text-xs text-neutral-400 font-normal">g</span></p>
          <div className="mt-2 text-[10px] text-neutral-400">Target goal: {goals.protein}g</div>
        </div>
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">Estimated Lean Mass Base</span>
          <p className="text-2xl font-display font-extrabold text-white mt-1">{weeklyAverages.weight} <span className="text-xs text-neutral-400 font-normal">kg</span></p>
          <div className="mt-2 text-[10px] text-neutral-400">Goal weight setting: {goals.weight}kg</div>
        </div>
      </div>
    </div>
  );
}
