import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Target,
  Sliders,
  Database,
  Apple,
  Scale,
  Activity,
  Droplets,
  Flame,
  Heart,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Clock,
  Dumbbell
} from 'lucide-react';
import { UserProfile, Goals, Integration, PulseFitSettings } from '../types';

interface SettingsPanelProps {
  settings: PulseFitSettings;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateGoals: (goals: Goals) => void;
  onToggleIntegration: (id: string) => void;
  onResetToDefaults: () => void;
}

export default function SettingsPanel({
  settings,
  onUpdateProfile,
  onUpdateGoals,
  onToggleIntegration,
  onResetToDefaults
}: SettingsPanelProps) {
  // Nested active tab within settings panel
  const [activeSubSection, setActiveSubSection] = useState<'profile' | 'goals' | 'integrations' | 'advanced'>('profile');

  // Form edit states (initialized with current settings state)
  const [pName, setPName] = useState(settings.profile.name);
  const [pEmail, setPEmail] = useState(settings.profile.email);
  const [pAge, setPAge] = useState(settings.profile.age);
  const [pHeight, setPHeight] = useState(settings.profile.height);
  const [pGender, setPGender] = useState(settings.profile.gender);

  const [gCalories, setGCalories] = useState(settings.goals.calories);
  const [gProtein, setGProtein] = useState(settings.goals.protein);
  const [gCarbs, setGCarbs] = useState(settings.goals.carbs);
  const [gFat, setGFat] = useState(settings.goals.fat);
  const [gWater, setGWater] = useState(settings.goals.water);
  const [gSteps, setGSteps] = useState(settings.goals.steps);
  const [gWorkout, setGWorkout] = useState(settings.goals.workoutMinutes);
  const [gWeight, setGWeight] = useState(settings.goals.weight);

  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const subSections = [
    { id: 'profile', label: 'User Profile', icon: User, desc: 'Manage your biometric identity, stats, and metadata.' },
    { id: 'goals', label: 'Health Goals', icon: Target, desc: 'Set energy thresholds, macros, and sleep/workout goals.' },
    { id: 'integrations', label: 'Integrations Sync', icon: Smartphone, desc: 'Connect smartwatches, bio-straps, and health platforms.' },
    { id: 'advanced', label: 'Advanced & Diagnostics', icon: Database, desc: 'Manage database snapshots and restore operations.' }
  ];

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...settings.profile,
      name: pName,
      email: pEmail,
      age: Number(pAge),
      height: Number(pHeight),
      gender: pGender
    });
    triggerNotification();
  };

  const handleSaveGoals = (e: FormEvent) => {
    e.preventDefault();
    onUpdateGoals({
      calories: Number(gCalories),
      protein: Number(gProtein),
      carbs: Number(gCarbs),
      fat: Number(gFat),
      water: Number(gWater),
      steps: Number(gSteps),
      workoutMinutes: Number(gWorkout),
      weight: Number(gWeight)
    });
    triggerNotification();
  };

  const triggerNotification = () => {
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="pb-6 border-b border-white/5">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/15 uppercase">
          System Core
        </span>
        <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mt-1.5">
          Workspace Settings
        </h1>
        <p className="text-neutral-400 text-xs mt-0.5">
          Configure physical identity baselines, macronutrient target ranges, and third-party API sync.
        </p>
      </div>

      {/* DUAL COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* SETTINGS WORKSPACE LEFT NAVIGATION BAR (COL-SPAN-1) */}
        <div className="lg:col-span-1 space-y-2">
          {subSections.map((sec) => {
            const IsActive = activeSubSection === sec.id;
            const Icon = sec.icon;
            return (
              <button
                id={`settings-tab-btn-${sec.id}`}
                key={sec.id}
                onClick={() => setActiveSubSection(sec.id as any)}
                className={`w-full text-left p-3.5 rounded-xl border flex gap-3 transition-all cursor-pointer ${
                  IsActive
                    ? 'bg-white/[0.04] text-white border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
                    : 'bg-transparent text-neutral-400 hover:text-neutral-200 border-transparent hover:bg-white/[0.01]'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${IsActive ? 'text-brand-primary' : 'text-neutral-500'}`} />
                <div>
                  <h4 className="text-xs font-bold">{sec.label}</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal font-sans">{sec.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* SETTINGS ACTIVE SECTION CONTENT (COL-SPAN-3) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 soft-depth relative min-h-[400px]">
          
          <AnimatePresence mode="wait">
            
            {/* SUB-SECTION 1: PROFILE MANAGEMENT */}
            {activeSubSection === 'profile' && (
              <motion.div
                key="profile-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-4">
                  <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                    Biometric Identity Profiles
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Update height, age, and biological metrics to calibrate automatic metabolic algorithms.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name input */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Display Name
                      </label>
                      <input
                        id="settings-profile-name"
                        type="text"
                        required
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white transition-all outline-none focus:border-brand-primary focus:bg-white/[0.04]"
                      />
                    </div>

                    {/* Email address input */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Email Coordinates
                      </label>
                      <input
                        id="settings-profile-email"
                        type="email"
                        required
                        value={pEmail}
                        onChange={(e) => setPEmail(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white transition-all outline-none focus:border-brand-primary focus:bg-white/[0.04]"
                      />
                    </div>

                    {/* Gender options dropdown/segmented */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Biological Gender
                      </label>
                      <select
                        id="settings-profile-gender"
                        value={pGender}
                        onChange={(e) => setPGender(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white transition-all outline-none focus:border-brand-primary cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                      </select>
                    </div>

                    {/* Age counter input */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Age (Years)
                      </label>
                      <input
                        id="settings-profile-age"
                        type="number"
                        required
                        value={pAge}
                        onChange={(e) => setPAge(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white transition-all outline-none focus:border-brand-primary"
                      />
                    </div>

                    {/* Height input */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Height (Centimeters)
                      </label>
                      <input
                        id="settings-profile-height"
                        type="number"
                        required
                        value={pHeight}
                        onChange={(e) => setPHeight(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white transition-all outline-none focus:border-brand-primary"
                      />
                    </div>

                    {/* Platform Joined date details */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Member Status Since
                      </label>
                      <div className="w-full h-11 px-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center text-sm text-neutral-500 font-mono">
                        <Clock className="w-4 h-4 mr-2 text-neutral-600" />
                        {settings.profile.joinedDate} (Active Account)
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button
                      id="save-profile-btn"
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand-primary text-black font-display font-semibold hover:brightness-110 shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
                    >
                      Save Biometric Profile
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SUB-SECTION 2: HEALTH GOALS */}
            {activeSubSection === 'goals' && (
              <motion.div
                key="goals-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-4">
                  <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                    Anabolic & Metabolic Goal Calibration
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Establish caloric baselines, macronutrient bounds, and active daily performance thresholds.
                  </p>
                </div>

                <form onSubmit={handleSaveGoals} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Calorie Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-brand-warning" /> Calorie Goal (kcal)
                        </label>
                        <span className="text-xs font-mono font-bold text-brand-warning">{gCalories} kcal</span>
                      </div>
                      <input
                        id="settings-goal-calories"
                        type="number"
                        required
                        value={gCalories}
                        onChange={(e) => setGCalories(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-brand-warning"
                      />
                    </div>

                    {/* Weight Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-brand-secondary" /> Target weight (kg)
                        </label>
                        <span className="text-xs font-mono font-bold text-brand-secondary">{gWeight} kg</span>
                      </div>
                      <input
                        id="settings-goal-weight"
                        type="number"
                        step="0.1"
                        required
                        value={gWeight}
                        onChange={(e) => setGWeight(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-brand-secondary"
                      />
                    </div>

                    {/* Protein Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Apple className="w-4 h-4 text-brand-primary" /> Protein Goal (g)
                        </label>
                        <span className="text-xs font-mono font-bold text-brand-primary">{gProtein}g</span>
                      </div>
                      <input
                        id="settings-goal-protein"
                        type="number"
                        required
                        value={gProtein}
                        onChange={(e) => setGProtein(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-brand-primary"
                      />
                    </div>

                    {/* Carbohydrates Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-neutral-400" /> Carbs Goal (g)
                        </label>
                        <span className="text-xs font-mono font-bold text-neutral-300">{gCarbs}g</span>
                      </div>
                      <input
                        id="settings-goal-carbs"
                        type="number"
                        required
                        value={gCarbs}
                        onChange={(e) => setGCarbs(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-white/20"
                      />
                    </div>

                    {/* Fat Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-neutral-400" /> Fat Goal (g)
                        </label>
                        <span className="text-xs font-mono font-bold text-neutral-300">{gFat}g</span>
                      </div>
                      <input
                        id="settings-goal-fat"
                        type="number"
                        required
                        value={gFat}
                        onChange={(e) => setGFat(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-white/20"
                      />
                    </div>

                    {/* Hydration Target */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Droplets className="w-4 h-4 text-brand-secondary" /> Water Intake Target (ml)
                        </label>
                        <span className="text-xs font-mono font-bold text-brand-secondary">{gWater} ml</span>
                      </div>
                      <input
                        id="settings-goal-water"
                        type="number"
                        required
                        value={gWater}
                        onChange={(e) => setGWater(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-brand-secondary"
                      />
                    </div>

                    {/* Steps Goal */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-brand-primary" /> Daily Steps Goal
                        </label>
                        <span className="text-xs font-mono font-bold text-brand-primary">{gSteps} steps</span>
                      </div>
                      <input
                        id="settings-goal-steps"
                        type="number"
                        required
                        value={gSteps}
                        onChange={(e) => setGSteps(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-brand-primary"
                      />
                    </div>

                    {/* Workout Minutes Goal */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Dumbbell className="w-4 h-4 text-brand-accent" /> Active Workout Goal (min)
                        </label>
                        <span className="text-xs font-mono font-bold text-brand-accent">{gWorkout} min</span>
                      </div>
                      <input
                        id="settings-goal-workout"
                        type="number"
                        required
                        value={gWorkout}
                        onChange={(e) => setGWorkout(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#0e101b] text-sm text-white outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-end">
                    <button
                      id="save-goals-btn"
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand-primary text-black font-display font-semibold hover:brightness-110 shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
                    >
                      Calibrate Health Goals
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SUB-SECTION 3: SMART INTEGRATIONS SYNC */}
            {activeSubSection === 'integrations' && (
              <motion.div
                key="integrations-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-4">
                  <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                    Health Platforms Sync
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Integrate your bio-wearables and smart scale metrics automatically via direct Cloud connections.
                  </p>
                </div>

                <div className="space-y-4">
                  {settings.integrations.map((app) => (
                    <div
                      id={`integration-row-${app.id}`}
                      key={app.id}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Unique category avatar rendering */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                          app.connected
                            ? 'bg-brand-primary/10 border-brand-primary/25 text-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                            : 'bg-neutral-900 border-white/5 text-neutral-500'
                        }`}>
                          {app.id === 'apple-health' && <Heart className="w-5 h-5" />}
                          {app.id === 'whoop' && <Activity className="w-5 h-5" />}
                          {app.id === 'myfitnesspal' && <Apple className="w-5 h-5" />}
                          {app.id === 'withings' && <Scale className="w-5 h-5" />}
                          {app.id === 'google-fit' && <Smartphone className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {app.name}
                            {app.connected && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-bold font-mono uppercase bg-brand-primary/15 text-brand-primary px-1.5 py-0.5 rounded">
                                Connected
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1 leading-normal font-sans">
                            {app.description}
                          </p>
                        </div>
                      </div>

                      {/* Custom premium toggle switch */}
                      <button
                        id={`integration-toggle-${app.id}`}
                        onClick={() => {
                          onToggleIntegration(app.id);
                          triggerNotification();
                        }}
                        className={`w-12 h-6.5 rounded-full p-1.5 transition-all outline-none border cursor-pointer flex items-center shrink-0 ${
                          app.connected
                            ? 'bg-brand-primary/20 border-brand-primary/30 justify-end'
                            : 'bg-neutral-900 border-white/10 justify-start'
                        }`}
                      >
                        <motion.div
                          layout
                          className={`w-4 h-4 rounded-full ${
                            app.connected ? 'bg-brand-primary shadow-[0_0_8px_#10b981]' : 'bg-neutral-600'
                          }`}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SUB-SECTION 4: ADVANCED OPERATIONS */}
            {activeSubSection === 'advanced' && (
              <motion.div
                key="advanced-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-white/5 pb-4">
                  <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wider">
                    Advanced Diagnostics & Backups
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Reset local database states, reload standard athlete datasets, or perform general clearing operations.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Option 1: Load defaults */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Restore Standard Athlete Dataset</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-lg font-sans">
                        Re-inject the precise 7-day fitness dataset provided during your account onboarding (July 5th – July 11th). Overwrites any custom local logs.
                      </p>
                    </div>
                    <button
                      id="reset-defaults-action-btn"
                      onClick={() => {
                        onResetToDefaults();
                        triggerNotification();
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all whitespace-nowrap cursor-pointer active:scale-98 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Restore Demo Data
                    </button>
                  </div>

                  {/* Security certificate diagnostics check */}
                  <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex gap-3.5 items-start text-xs text-brand-primary">
                    <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">Database Status: Secure Sync</h4>
                      <p className="mt-1 leading-relaxed text-neutral-300 font-sans">
                        All local metrics are safely synchronized in the client cache block. There are no pending transfers. Biometric tracking calculations are certified secure.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Floating Save Notification Alert */}
          <AnimatePresence>
            {showSavedNotification && (
              <motion.div
                id="settings-save-notification"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/30 bg-[#0c0f16] shadow-2xl z-50 text-xs text-brand-primary font-mono"
              >
                <CheckCircle className="w-4 h-4 text-brand-primary" />
                <span>Configuration synchronized successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
