import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Calendar,
  Sparkles,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import SearchDialog from './components/SearchDialog';
import AddEntryModal from './components/AddEntryModal';
import Dashboard from './components/Dashboard';
import CalendarGrid from './components/CalendarGrid';
import HistoryLogs from './components/HistoryLogs';
import SettingsPanel from './components/SettingsPanel';
import {
  FitnessEntry,
  Goals,
  UserProfile,
  Integration,
  PulseFitSettings,
  INITIAL_DATASET,
  DEFAULT_GOALS,
  DEFAULT_PROFILE,
  DEFAULT_INTEGRATIONS
} from './types';

export default function App() {
  // --- STATE SYSTEM (BACKED BY LOCALSTORAGE PERSISTENCE) ---
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [entries, setEntries] = useState<FitnessEntry[]>(() => {
    const saved = localStorage.getItem('pulsefit_logs_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored logs, falling back to default', e);
      }
    }
    return INITIAL_DATASET;
  });

  const [settings, setSettings] = useState<PulseFitSettings>(() => {
    const saved = localStorage.getItem('pulsefit_settings_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored settings, falling back to default', e);
      }
    }
    return {
      profile: DEFAULT_PROFILE,
      goals: DEFAULT_GOALS,
      appearance: {
        theme: 'dark',
        compactMode: false,
        glassEffectStrength: 'medium'
      },
      integrations: DEFAULT_INTEGRATIONS
    };
  });

  // Dialog state triggers
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FitnessEntry | null>(null);
  const [customAddDate, setCustomAddDate] = useState<string | null>(null);

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('pulsefit_logs_db', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('pulsefit_settings_db', JSON.stringify(settings));
  }, [settings]);

  // Real-time ticking clock for display
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- CONTROLLER FUNCTIONS ---

  // Create or Update log entry
  const handleSaveEntry = (newEntry: FitnessEntry) => {
    setEntries((prev) => {
      const existsIndex = prev.findIndex((e) => e.date === newEntry.date);
      if (existsIndex > -1) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...prev[existsIndex],
          ...newEntry,
          updatedAt: new Date().toISOString()
        };
        return updated;
      } else {
        return [...prev, newEntry];
      }
    });
    setEditingEntry(null);
    setCustomAddDate(null);
  };

  // Erase log record
  const handleDeleteEntry = (date: string) => {
    if (window.confirm(`Are you sure you want to delete the log record for ${date}?`)) {
      setEntries((prev) => prev.filter((e) => e.date !== date));
    }
  };

  // Trigger modal for editing an existing record
  const triggerEditEntry = (entry: FitnessEntry) => {
    setEditingEntry(entry);
    setIsAddEntryOpen(true);
  };

  // Trigger modal for creating an entry on a specific date
  const triggerAddForDate = (date: string) => {
    setCustomAddDate(date);
    setEditingEntry(null);
    setIsAddEntryOpen(true);
  };

  // Profile fields sync
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setSettings((prev) => ({
      ...prev,
      profile: newProfile
    }));
  };

  // Goals calibrations sync
  const handleUpdateGoals = (newGoals: Goals) => {
    setSettings((prev) => ({
      ...prev,
      goals: newGoals
    }));
  };

  // Integration toggle switch
  const handleToggleIntegration = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      integrations: prev.integrations.map((app) =>
        app.id === id ? { ...app, connected: !app.connected } : app
      )
    }));
  };

  // Restore baseline demo data helper
  const handleResetToDefaults = () => {
    if (window.confirm('This will wipe your current records and restore the original 7-day onboarding logs. Proceed?')) {
      setEntries(INITIAL_DATASET);
      setSettings({
        profile: DEFAULT_PROFILE,
        goals: DEFAULT_GOALS,
        appearance: {
          theme: 'dark',
          compactMode: false,
          glassEffectStrength: 'medium'
        },
        integrations: DEFAULT_INTEGRATIONS
      });
      setActiveTab('dashboard');
    }
  };

  // Quick navigation link handlers
  const handleSpotlightSelectDate = (date: string) => {
    // If date has log, edit it; if empty, add it!
    const found = entries.find((e) => e.date === date);
    if (found) {
      triggerEditEntry(found);
    } else {
      triggerAddForDate(date);
    }
  };

  return (
    <div className="flex bg-brand-bg-dark text-white min-h-screen font-sans antialiased overflow-hidden select-none">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={settings.profile}
        onAddEntry={() => {
          setEditingEntry(null);
          setCustomAddDate(null);
          setIsAddEntryOpen(true);
        }}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      {/* RIGHT VIEWPORT WRAPPER */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto px-6 lg:px-12 relative">
        {/* Subtle top-light gradient flare */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent pointer-events-none" />

        {/* BREADCRUMB / STATUS HEADER BAR */}
        <header className="flex items-center justify-between h-20 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-brand-primary font-bold uppercase tracking-wider">
              {activeTab === 'dashboard' && 'Command Center'}
              {activeTab === 'calendar' && 'Somatic Grid'}
              {activeTab === 'history' && 'Biometric Ledger'}
              {activeTab === 'settings' && 'System Config'}
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Realtime UTC digital counter */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] font-mono text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-brand-secondary" />
              <span>{currentTime || '05:28:34'}</span>
              <span className="text-neutral-600">|</span>
              <span>UTC</span>
            </div>

            {/* User status info bubble */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Pulse Sync OK
              </span>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT ROUTER FRAME */}
        <div className="flex-1 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <Dashboard
                  entries={entries}
                  goals={settings.goals}
                  profile={settings.profile}
                  onNavigateToTab={setActiveTab}
                  onEditEntry={triggerEditEntry}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarGrid
                  entries={entries}
                  goals={settings.goals}
                  onAddEntryForDate={triggerAddForDate}
                  onEditEntry={triggerEditEntry}
                />
              )}

              {activeTab === 'history' && (
                <HistoryLogs
                  entries={entries}
                  onEditEntry={triggerEditEntry}
                  onDeleteEntry={handleDeleteEntry}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPanel
                  settings={settings}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateGoals={handleUpdateGoals}
                  onToggleIntegration={handleToggleIntegration}
                  onResetToDefaults={handleResetToDefaults}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- FLOATING GLOBAL OVERLAYS --- */}

      {/* Ctrl+K Spotlight Search modal */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        entries={entries}
        onSelectEntry={handleSpotlightSelectDate}
      />

      {/* Ctrl+N Log entry creator/editor modal */}
      <AddEntryModal
        isOpen={isAddEntryOpen}
        onClose={() => {
          setIsAddEntryOpen(false);
          setEditingEntry(null);
          setCustomAddDate(null);
        }}
        onSave={handleSaveEntry}
        editingEntry={
          editingEntry ||
          (customAddDate
            ? {
                date: customAddDate,
                calories: 1800,
                protein: 150,
                carbs: 150,
                fat: 60,
                water: 1500,
                steps: 5000,
                workoutMinutes: 30,
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : null)
        }
      />

    </div>
  );
}
