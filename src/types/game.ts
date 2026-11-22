export type DifficultyTier = 'yellow' | 'green' | 'blue' | 'purple';

export interface PuzzleGroup {
  id: string;
  tier: DifficultyTier;
  category: string;
  items: [string, string, string, string];
}

export interface Puzzle {
  id: string;
  editionNumber: number;
  title: string;
  groups: [PuzzleGroup, PuzzleGroup, PuzzleGroup, PuzzleGroup];
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface PuzzleProgress {
  puzzleId: string;
  solvedGroupIds: string[];
  guesses: string[][];
  mistakesRemaining: number;
  status: GameStatus;
  tileOrder: string[];
  updatedAt: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  completedPuzzleIds: string[];
}

export type GuessOutcome =
  | { type: 'correct'; group: PuzzleGroup }
  | { type: 'one-away' }
  | { type: 'incorrect' }
  | { type: 'already-guessed' };
