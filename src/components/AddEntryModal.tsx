import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Flame,
  Scale,
  Apple,
  Dumbbell,
  Droplets,
  Activity,
  Heart,
  Save,
  MessageSquare
} from 'lucide-react';
import { FitnessEntry } from '../types';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: FitnessEntry) => void;
  editingEntry?: FitnessEntry | null;
}

export default function AddEntryModal({
  isOpen,
  onClose,
  onSave,
  editingEntry
}: AddEntryModalProps) {
  // Field States
  const [date, setDate] = useState('');
  const [calories, setCalories] = useState<number>(1800);
  const [protein, setProtein] = useState<number>(150);
  const [carbs, setCarbs] = useState<number>(150);
  const [fat, setFat] = useState<number>(60);
  const [water, setWater] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [workoutMinutes, setWorkoutMinutes] = useState<number>(0);
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Floating focus state effects
  const [activeField, setActiveField] = useState<string | null>(null);

  // Load entry if editing
  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setCalories(editingEntry.calories);
      setProtein(editingEntry.protein);
      setCarbs(editingEntry.carbs);
      setFat(editingEntry.fat);
      setWater(editingEntry.water);
      setSteps(editingEntry.steps);
      setWorkoutMinutes(editingEntry.workoutMinutes);
      setWeight(editingEntry.weight ? editingEntry.weight.toString() : '');
      setNotes(editingEntry.notes || '');
    } else {
      // Default values for new entry
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setCalories(1800);
      setProtein(140);
      setCarbs(150);
      setFat(60);
      setWater(1500);
      setSteps(5000);
      setWorkoutMinutes(30);
      setWeight('');
      setNotes('');
    }
  }, [editingEntry, isOpen]);

  // Derived Macro Calorie calculation to assist user
  const calculatedMacroCalories = (protein * 4) + (carbs * 4) + (fat * 9);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const entry: FitnessEntry = {
      date,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      water: Number(water),
      steps: Number(steps),
      workoutMinutes: Number(workoutMinutes),
      weight: weight ? Number(weight) : undefined,
      notes: notes.trim(),
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(entry);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-2xl pointer-events-auto bg-[#0a0c16]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {editingEntry ? 'Refine Fitness Entry' : 'Log Daily Activity'}
                  </h3>
                </div>
                <button
                  id="add-entry-close-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Date Input */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Target Log Date
                    </label>
                    <div className="relative">
                      <input
                        id="entry-form-date"
                        type="date"
                        required
                        disabled={!!editingEntry} // Lock date on edit
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full h-11 px-4 rounded-xl border bg-white/[0.02] text-sm text-white placeholder-neutral-500 transition-all outline-none ${
                          editingEntry ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 focus:border-brand-primary focus:bg-white/[0.04]'
                        }`}
                      />
                      <Calendar className="absolute right-3.5 top-3 w-5 h-5 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Body Weight Input */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Body Weight (kg)
                    </label>
                    <div className="relative">
                      <input
                        id="entry-form-weight"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 84.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white placeholder-neutral-500 transition-all outline-none focus:border-brand-primary focus:bg-white/[0.04]"
                      />
                      <Scale className="absolute right-3.5 top-3 w-5 h-5 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Calories Budget Section */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-brand-warning" />
                      <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Energy Budget (Calories)
                      </span>
                    </div>
                    <span className="text-sm font-mono font-bold text-brand-warning">
                      {calories} kcal
                    </span>
                  </div>
                  <input
                    id="entry-form-calories-slider"
                    type="range"
                    min="500"
                    max="5000"
                    step="10"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-warning"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                    <span>500 kcal</span>
                    <span>2500 kcal</span>
                    <span>5000 kcal</span>
                  </div>
                </div>

                {/* Macronutrient Distribution Matrix */}
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                    Daily Macros Matrix (Protein, Carbs, Fat)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Protein Input Card */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block" />
                          Protein
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-primary">{protein}g</span>
                      </div>
                      <input
                        id="entry-form-protein-slider"
                        type="range"
                        min="20"
                        max="300"
                        step="5"
                        value={protein}
                        onChange={(e) => setProtein(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                      />
                      <p className="text-[10px] text-neutral-500 mt-2 font-mono text-right">
                        {(protein * 4)} kcal
                      </p>
                    </div>

                    {/* Carbs Input Card */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary inline-block" />
                          Carbohydrates
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-secondary">{carbs}g</span>
                      </div>
                      <input
                        id="entry-form-carbs-slider"
                        type="range"
                        min="20"
                        max="500"
                        step="5"
                        value={carbs}
                        onChange={(e) => setCarbs(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                      />
                      <p className="text-[10px] text-neutral-500 mt-2 font-mono text-right">
                        {(carbs * 4)} kcal
                      </p>
                    </div>

                    {/* Fat Input Card */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-accent inline-block" />
                          Fat
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-accent">{fat}g</span>
                      </div>
                      <input
                        id="entry-form-fat-slider"
                        type="range"
                        min="10"
                        max="200"
                        step="2"
                        value={fat}
                        onChange={(e) => setFat(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                      />
                      <p className="text-[10px] text-neutral-500 mt-2 font-mono text-right">
                        {(fat * 9)} kcal
                      </p>
                    </div>
                  </div>

                  {/* Macro Vs Budget Status Sync */}
                  <div className="mt-3 flex justify-between items-center px-4 py-2.5 rounded-lg bg-neutral-900/60 border border-white/5 text-xs font-mono">
                    <span className="text-neutral-400">Sum of macronutrient calories:</span>
                    <span className={calculatedMacroCalories > calories ? 'text-brand-danger font-semibold' : 'text-neutral-300'}>
                      {calculatedMacroCalories} kcal / <span className="text-neutral-500">{calories} kcal goal</span>
                    </span>
                  </div>
                </div>

                {/* Hydration & Active Steps Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Water Tracker */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        <Droplets className="w-4 h-4 text-brand-secondary" /> Water Intake
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-secondary">{water} ml</span>
                    </div>
                    <div className="flex gap-1.5 mb-2.5">
                      <button
                        id="water-add-250"
                        type="button"
                        onClick={() => setWater(water + 250)}
                        className="flex-1 py-1 text-[10px] font-semibold font-mono rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-neutral-300 cursor-pointer"
                      >
                        +250ml
                      </button>
                      <button
                        id="water-add-500"
                        type="button"
                        onClick={() => setWater(water + 500)}
                        className="flex-1 py-1 text-[10px] font-semibold font-mono rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-neutral-300 cursor-pointer"
                      >
                        +500ml
                      </button>
                      <button
                        id="water-reset"
                        type="button"
                        onClick={() => setWater(0)}
                        className="py-1 px-2 text-[10px] font-semibold font-mono rounded bg-brand-danger/10 text-brand-danger border border-brand-danger/15 hover:bg-brand-danger/20 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <input
                      id="entry-form-water-input"
                      type="number"
                      placeholder="Custom ml"
                      value={water || ''}
                      onChange={(e) => setWater(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 px-3 rounded-lg border border-white/5 bg-[#0e101b] text-xs text-white outline-none focus:border-brand-secondary"
                    />
                  </div>

                  {/* Steps Tracker */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        <Activity className="w-4 h-4 text-brand-primary" /> Active Steps
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-primary">{steps}</span>
                    </div>
                    <div className="flex gap-1.5 mb-2.5">
                      <button
                        id="steps-add-1000"
                        type="button"
                        onClick={() => setSteps(steps + 1000)}
                        className="flex-1 py-1 text-[10px] font-semibold font-mono rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-neutral-300 cursor-pointer"
                      >
                        +1K Steps
                      </button>
                      <button
                        id="steps-add-5000"
                        type="button"
                        onClick={() => setSteps(steps + 5000)}
                        className="flex-1 py-1 text-[10px] font-semibold font-mono rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-neutral-300 cursor-pointer"
                      >
                        +5K Steps
                      </button>
                    </div>
                    <input
                      id="entry-form-steps-input"
                      type="number"
                      placeholder="Custom steps"
                      value={steps || ''}
                      onChange={(e) => setSteps(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 px-3 rounded-lg border border-white/5 bg-[#0e101b] text-xs text-white outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Workout Minutes */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        <Dumbbell className="w-4 h-4 text-brand-accent" /> Active Workout
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-accent">{workoutMinutes} min</span>
                    </div>
                    <div className="flex gap-1.5 mb-2.5">
                      <button
                        id="workout-add-15"
                        type="button"
                        onClick={() => setWorkoutMinutes(workoutMinutes + 15)}
                        className="flex-1 py-1 text-[10px] font-semibold font-mono rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-neutral-300 cursor-pointer"
                      >
                        +15 Min
                      </button>
                      <button
                        id="workout-add-30"
                        type="button"
                        onClick={() => setWorkoutMinutes(workoutMinutes + 30)}
                        className="flex-1 py-1 text-[10px] font-semibold font-mono rounded bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-neutral-300 cursor-pointer"
                      >
                        +30 Min
                      </button>
                    </div>
                    <input
                      id="entry-form-workout-input"
                      type="number"
                      placeholder="Custom min"
                      value={workoutMinutes || ''}
                      onChange={(e) => setWorkoutMinutes(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 px-3 rounded-lg border border-white/5 bg-[#0e101b] text-xs text-white outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                {/* Notes & Foods Detail */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    <MessageSquare className="w-4 h-4 text-brand-primary" /> Detail Notes & Logged Foods
                  </div>
                  <textarea
                    id="entry-form-notes"
                    placeholder="e.g. 6 boiled eggs, 150g raw rice, whey shake, beef kaleji. Recovery feel: excellent."
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.01] text-sm text-white placeholder-neutral-500 transition-all outline-none focus:border-brand-primary focus:bg-white/[0.04] resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    id="entry-form-cancel-btn"
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    id="entry-form-save-btn"
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-black font-display font-semibold hover:brightness-110 shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Log Entry</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
