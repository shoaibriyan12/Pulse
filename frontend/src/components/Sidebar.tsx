import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  History,
  Settings,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Award,
  Command,
  User,
  Activity
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  onAddEntry: () => void;
  onSearchOpen: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  onAddEntry,
  onSearchOpen
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showKbdHelp, setShowKbdHelp] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar Grid', icon: Calendar },
    { id: 'history', label: 'History & Logs', icon: History },
    { id: 'settings', label: 'Settings Panel', icon: Settings },
  ];

  // Global hotkeys handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchOpen();
      }
      // Cmd/Ctrl + N for New Entry
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        onAddEntry();
      }
      // 1-4 for quick tab switches
      if ((e.metaKey || e.ctrlKey) && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < menuItems.length) {
          setActiveTab(menuItems[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddEntry, onSearchOpen, setActiveTab]);

  return (
    <motion.aside
      id="pulsefit-sidebar"
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative z-30 flex flex-col h-screen border-r border-white/5 glass-card shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
            <Activity className="w-5 h-5 font-bold" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400"
              >
                PULSE<span className="text-brand-primary">FIT</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        <button
          id="sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-[#0c0d16] hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer z-40"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick Search Trigger */}
      <div className="px-4 py-4">
        {isCollapsed ? (
          <button
            id="sidebar-search-icon"
            onClick={onSearchOpen}
            className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Search Logs (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <button
            id="sidebar-search-bar"
            onClick={onSearchOpen}
            className="flex items-center justify-between w-full h-11 px-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-left text-xs text-neutral-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
              <span>Search metrics, logs...</span>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono tracking-widest text-neutral-400">
              <Command className="w-2.5 h-2.5" />K
            </div>
          </button>
        )}
      </div>

      {/* Action Button: Add Entry */}
      <div className="px-4 mb-4">
        {isCollapsed ? (
          <button
            id="sidebar-add-btn-collapsed"
            onClick={onAddEntry}
            className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-brand-primary text-black hover:scale-105 shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            title="Add Log Entry (Ctrl+N)"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <button
            id="sidebar-add-btn-expanded"
            onClick={onAddEntry}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-display text-sm font-semibold text-black hover:brightness-110 shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Fitness Entry</span>
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              id={`sidebar-nav-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center w-full h-12 px-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                isActive
                  ? 'text-brand-primary bg-brand-primary/[0.04] font-medium'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {/* Active Indicator Glow Slider */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 rounded-r-full bg-brand-primary shadow-[0_0_10px_#10b981]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-brand-primary' : 'text-neutral-400 group-hover:text-neutral-300'
                }`}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3.5 text-sm tracking-wide overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left bg-neutral-900 border border-white/10 text-white text-xs rounded-md px-2.5 py-1.5 shadow-xl whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Section & Key Shortcuts */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        {/* Keyboard shortcut info */}
        {!isCollapsed && (
          <div className="mb-4 px-2 py-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-secondary" />
              Keyboard Shortcuts
            </span>
            <button 
              id="shortcuts-toggle-btn"
              onClick={() => setShowKbdHelp(!showKbdHelp)}
              className="hover:text-neutral-300 underline cursor-pointer"
            >
              Show
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <img
            id="sidebar-profile-avatar"
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-10 h-10 rounded-xl object-cover border border-white/10"
          />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p id="sidebar-profile-name" className="text-sm font-semibold text-neutral-200 truncate">
                  {profile.name}
                </p>
                <p id="sidebar-profile-email" className="text-xs text-brand-primary font-medium truncate">
                  Pro Athlete
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal Help */}
      {showKbdHelp && (
        <div id="shortcuts-modal" className="absolute bottom-16 left-4 right-4 p-4 rounded-xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-md z-50 text-xs text-neutral-300">
          <div className="flex justify-between font-semibold border-b border-white/5 pb-1.5 mb-2">
            <span>Navigation Shortcuts</span>
            <button onClick={() => setShowKbdHelp(false)} className="text-neutral-500 hover:text-white cursor-pointer">✕</button>
          </div>
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between"><span>Ctrl+K</span> <span className="text-neutral-500">Search logs</span></div>
            <div className="flex justify-between"><span>Ctrl+N</span> <span className="text-neutral-500">New log entry</span></div>
            <div className="flex justify-between"><span>Ctrl+1</span> <span className="text-neutral-500">Go to Dashboard</span></div>
            <div className="flex justify-between"><span>Ctrl+2</span> <span className="text-neutral-500">Go to Calendar</span></div>
            <div className="flex justify-between"><span>Ctrl+3</span> <span className="text-neutral-500">Go to History</span></div>
            <div className="flex justify-between"><span>Ctrl+4</span> <span className="text-neutral-500">Go to Settings</span></div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
