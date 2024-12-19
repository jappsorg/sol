// Grade levels supported in the app
export type Grade = 1 | 2 | 3 | 4 | 5;

// Difficulty levels for words
export type Difficulty = "easy" | "medium" | "hard";

// Word object structure returned by Anthropic service
export interface Word {
  word: string;
  definition: string;
  sentence: string;
  difficulty: Difficulty;
  grade: Grade;
}

// Structure for word list by grade
export interface WordList {
  grade: Grade;
  words: Word[];
}

// User progress tracking
export interface Progress {
  correctWords: string[];
  incorrectWords: string[];
  totalAttempts: number;
  correctAttempts: number;
}

// Progress data structure stored in AsyncStorage
export interface StoredProgress {
  [key: string]: {
    practice: Progress;
    quiz: Progress;
  };
}

// Game mode types
export type GameMode = "practice" | "quiz";

// Score structure for current game session
export interface Score {
  current: number;
  total: number;
  streak: number;
}

// Quiz session state
export interface QuizState {
  currentWord: Word | null;
  score: Score;
  isComplete: boolean;
  remainingWords: Word[];
}

// Practice session state
export interface PracticeState {
  currentWord: Word | null;
  score: Score;
  wordsAttempted: string[];
}

// Response structure from Anthropic API
export interface AnthropicResponse {
  words: Word[];
  error?: string;
}

// Storage keys for AsyncStorage
export const StorageKeys = {
  PROGRESS: "spelling_bee_progress",
  CURRENT_GRADE: "current_grade",
  LAST_PLAYED: "last_played_timestamp",
} as const;

// Grade-specific word counts
export const WORDS_PER_GRADE: Record<Grade, number> = {
  1: 10,
  2: 12,
  3: 15,
  4: 18,
  5: 20,
};

// Quiz-specific constants
export const QUIZ_CONSTANTS = {
  WORDS_PER_QUIZ: 10,
  TIME_PER_WORD: 30, // seconds
  POINTS_PER_CORRECT: 10,
  STREAK_BONUS: 5,
} as const;

// Practice mode constants
export const PRACTICE_CONSTANTS = {
  DAILY_WORD_LIMIT: 50,
  POINTS_PER_CORRECT: 5,
  RETRY_LIMIT: 3,
} as const;

// Achievement thresholds
export interface Achievement {
  id: string;
  title: string;
  description: string;
  threshold: number;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_perfect",
    title: "Perfect Start",
    description: "Complete your first perfect quiz",
    threshold: 1,
    icon: "🌟",
  },
  {
    id: "streak_master",
    title: "Streak Master",
    description: "Achieve a 10-word streak",
    threshold: 10,
    icon: "🔥",
  },
  {
    id: "word_hunter",
    title: "Word Hunter",
    description: "Learn 100 new words",
    threshold: 100,
    icon: "📚",
  },
  {
    id: "spelling_champion",
    title: "Spelling Champion",
    description: "Get 1000 points total",
    threshold: 1000,
    icon: "👑",
  },
];
