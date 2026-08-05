export interface Quote {
  id: string;
  text: string;
  author: string;
  category: 'Discipline' | 'Grit' | 'Strength' | 'Wisdom';
  intensity: 'Calm' | 'Focus' | 'High Intensity';
}

export const FITNESS_QUOTES: Quote[] = [
  {
    id: "q1",
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "Discipline",
    intensity: "Focus"
  },
  {
    id: "q2",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "Discipline",
    intensity: "Focus"
  },
  {
    id: "q3",
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
    category: "Strength",
    intensity: "Calm"
  },
  {
    id: "q4",
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "Discipline",
    intensity: "Focus"
  },
  {
    id: "q5",
    text: "No citizen has a right to be an amateur in the matter of physical training. What a disgrace it is to grow old without seeing the beauty and strength of which the body is capable.",
    author: "Socrates",
    category: "Wisdom",
    intensity: "Calm"
  },
  {
    id: "q6",
    text: "The iron never lies to you. Two hundred pounds is always two hundred pounds. It is the ultimate reference point.",
    author: "Henry Rollins",
    category: "Strength",
    intensity: "High Intensity"
  },
  {
    id: "q7",
    text: "Today I will do what others won't, so tomorrow I can accomplish what others can't.",
    author: "Jerry Rice",
    category: "Grit",
    intensity: "High Intensity"
  },
  {
    id: "q8",
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon",
    category: "Grit",
    intensity: "Focus"
  },
  {
    id: "q9",
    text: "Small daily improvements over time lead to stunning results. Trust the compound effect.",
    author: "Robin Sharma",
    category: "Discipline",
    intensity: "Calm"
  },
  {
    id: "q10",
    text: "It never gets easier, you just get better. Your threshold expands as you adapt.",
    author: "Greg LeMond",
    category: "Grit",
    intensity: "High Intensity"
  },
  {
    id: "q11",
    text: "If you think lifting weights is dangerous, try being weak. Being weak is dangerous.",
    author: "Bret Contreras",
    category: "Strength",
    intensity: "High Intensity"
  },
  {
    id: "q12",
    text: "Energy and persistence conquer all things. The steady drip hollows the stone.",
    author: "Benjamin Franklin",
    category: "Grit",
    intensity: "Focus"
  },
  {
    id: "q13",
    text: "Do not pray for an easy life, pray for the strength to endure a difficult one.",
    author: "Bruce Lee",
    category: "Wisdom",
    intensity: "Calm"
  },
  {
    id: "q14",
    text: "The resistance you fight physically in the gym and the resistance you fight in life can only build a strong character.",
    author: "Arnold Schwarzenegger",
    category: "Strength",
    intensity: "Focus"
  },
  {
    id: "q15",
    text: "Sleep is the golden chain that ties health and our bodies together. Never compromise recovery.",
    author: "Thomas Dekker",
    category: "Wisdom",
    intensity: "Calm"
  }
];

export function getRandomQuote(category?: string): Quote {
  const filtered = category
    ? FITNESS_QUOTES.filter(q => q.category === category)
    : FITNESS_QUOTES;
  
  if (filtered.length === 0) {
    return FITNESS_QUOTES[0];
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getQuoteById(id: string): Quote | undefined {
  return FITNESS_QUOTES.find(q => q.id === id);
}

export function getAllCategories(): ('Discipline' | 'Grit' | 'Strength' | 'Wisdom')[] {
  return ['Discipline', 'Grit', 'Strength', 'Wisdom'];
}
