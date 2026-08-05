export interface FitnessEntry {
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // in ml
  steps: number;
  workoutMinutes: number;
  weight?: number; // in kg
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number; // ml
  steps: number;
  workoutMinutes: number;
  weight: number; // kg
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  gender: string;
  age: number;
  height: number; // cm
  joinedDate: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  category: 'wearable' | 'smart-scale' | 'app';
  iconName: string;
}

export interface PulseFitSettings {
  profile: UserProfile;
  goals: Goals;
  appearance: {
    theme: 'dark' | 'light';
    compactMode: boolean;
    glassEffectStrength: 'subtle' | 'medium' | 'maximum';
  };
  integrations: Integration[];
}

// Initial dataset provided by the user
export const INITIAL_DATASET: FitnessEntry[] = [
  {
    date: "2026-07-05",
    calories: 1215,
    protein: 133,
    carbs: 28,
    fat: 66,
    water: 1250,
    steps: 4200,
    workoutMinutes: 0,
    notes: "8 large whole eggs, 20g oil, 1 scoop Nutrabox soy protein, 45g Nakpro protein, 2 khakras",
    createdAt: "2026-07-11T08:48:42.384Z",
    updatedAt: "2026-07-11T08:48:42.384Z"
  },
  {
    date: "2026-07-06",
    calories: 1385,
    protein: 172,
    carbs: 47,
    fat: 54,
    water: 1800,
    steps: 6100,
    workoutMinutes: 0,
    notes: "62g Nakpro vanilla protein, 120g cooked tomato pasta, 125g beef liver, 3 small eggs, 10g oil, 2 khakras, 60g beef kaleji, 100g additional pasta",
    createdAt: "2026-07-11T08:48:42.384Z",
    updatedAt: "2026-07-11T08:48:42.384Z"
  },
  {
    date: "2026-07-07",
    calories: 1470,
    protein: 172,
    carbs: 53,
    fat: 47,
    water: 2100,
    steps: 5300,
    workoutMinutes: 0,
    notes: "400g chicken, 65g soya chunks, 25g Biscoff biscuits, 30g popcorn, 1 plain biscuit, 18g peanuts, 36g Nutrabox soy isolate, 45g Nakpro soy isolate, 20g tomato pasta sauce, 2 Zero Cokes, 30g fresh coconut",
    createdAt: "2026-07-11T08:48:42.384Z",
    updatedAt: "2026-07-11T08:48:42.384Z"
  },
  {
    date: "2026-07-08",
    calories: 1920,
    protein: 198,
    carbs: 74,
    fat: 87,
    water: 1500,
    steps: 3200,
    workoutMinutes: 0,
    notes: "100g biryani rice, 70g beef fry, Amul Tricone ice cream, 350g egg whites, 150g egg yolk, 50g mozzarella cheese, 20g tomato sauce, 20g oil, 60g Nakpro soy isolate, 100g baigan ka salan",
    createdAt: "2026-07-11T08:48:42.384Z",
    updatedAt: "2026-07-11T08:48:42.384Z"
  },
  {
    date: "2026-07-09",
    calories: 1565,
    protein: 144,
    carbs: 11,
    fat: 106,
    water: 2500,
    steps: 2100,
    workoutMinutes: 0,
    notes: "Recovery day after kidney stone procedure",
    createdAt: "2026-07-11T08:48:42.384Z",
    updatedAt: "2026-07-11T08:48:42.384Z"
  },
  {
    date: "2026-07-10",
    calories: 1330,
    protein: 145,
    carbs: 21,
    fat: 77,
    water: 2200,
    steps: 4800,
    workoutMinutes: 0,
    notes: "8 eggs, 30g ghee, 40g Nutrabox soy isolate, 20g peanut butter",
    createdAt: "2026-07-11T08:48:42.384Z",
    updatedAt: "2026-07-11T08:48:42.384Z"
  },
  {
    date: "2026-07-11",
    calories: 1600,
    protein: 120,
    carbs: 150,
    fat: 70,
    weight: 93.5,
    water: 3100,
    steps: 8400,
    workoutMinutes: 40,
    notes: "170 g boiled beef\n50 g beef\n1 small beef meatball\n400 g biryani rice (200 g + 200 g)\n65 g cooked white rice (40 g + 25 g)\n1.5 small pav\n25 g peanut chocolate butter\nUpdated estimated totals\nCalories: ~1,605 kcal\nProtein: ~98.4 g\nFat: ~68.4 g\nNet Carbs: ~148 g",
    createdAt: "2026-07-12T12:01:48.071Z",
    updatedAt: "2026-07-12T12:01:48.071Z"
  }
];

export const DEFAULT_GOALS: Goals = {
  calories: 2000,
  protein: 160,
  carbs: 180,
  fat: 65,
  water: 2500, // 2.5L
  steps: 8000,
  workoutMinutes: 30,
  weight: 85.0
};

export const DEFAULT_PROFILE: UserProfile = {
  name: "Riyan Shoaib",
  email: "shoaibriyan1@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  gender: "Male",
  age: 26,
  height: 182,
  joinedDate: "2026-07-01"
};

export const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: "apple-health", name: "Apple Health", description: "Sync workouts, steps, heart rate and calories directly with Apple Health.", connected: true, category: "wearable", iconName: "Heart" },
  { id: "whoop", name: "WHOOP", description: "Sync sleep stages, daily strain, recovery score, and respiratory rate.", connected: true, category: "wearable", iconName: "Activity" },
  { id: "myfitnesspal", name: "MyFitnessPal", description: "Automatically pull nutrition entries and macronutrient distributions.", connected: false, category: "app", iconName: "Apple" },
  { id: "withings", name: "Withings Scale", description: "Sync body weight, fat percentage, muscle mass, and body water percentage.", connected: true, category: "smart-scale", iconName: "Scale" },
  { id: "google-fit", name: "Google Fit", description: "Import steps, passive activity calories, and elevation metrics.", connected: false, category: "app", iconName: "Gauge" }
];
