import { PlayerStats, Puzzle, PuzzleProgress } from '../types/game';
import { getInitialTileOrder, MAX_MISTAKES } from './gameLogic';

const PROGRESS_STORAGE_KEY = 'folio_connections_progress_v1';
const STATS_STORAGE_KEY = 'folio_connections_stats_v1';

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  completedPuzzleIds: [],
};

export function createInitialProgress(puzzle: Puzzle): PuzzleProgress {
  return {
    puzzleId: puzzle.id,
    solvedGroupIds: [],
    guesses: [],
    mistakesRemaining: MAX_MISTAKES,
    status: 'playing',
    tileOrder: getInitialTileOrder(puzzle),
    updatedAt: Date.now(),
  };
}

export function loadAllProgress(): Record<string, PuzzleProgress> {
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, PuzzleProgress>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function loadPuzzleProgress(puzzle: Puzzle): PuzzleProgress {
  const all = loadAllProgress();
  const saved = all[puzzle.id];
  if (!saved) {
    return createInitialProgress(puzzle);
  }

  // Validate saved tileOrder against current puzzle items in case puzzle data was edited
  const validItems = new Set(puzzle.groups.flatMap((g) => g.items));
  const solvedSet = new Set(saved.solvedGroupIds ?? []);
  const solvedItems = new Set(
    puzzle.groups
      .filter((g) => solvedSet.has(g.id))
      .flatMap((g) => g.items)
  );
  const expectedRemainingCount = 16 - solvedItems.size;
  const savedTileOrderValid =
    Array.isArray(saved.tileOrder) &&
    saved.tileOrder.length === expectedRemainingCount &&
    saved.tileOrder.every((tile) => validItems.has(tile) && !solvedItems.has(tile));

  if (!savedTileOrderValid) {
    return createInitialProgress(puzzle);
  }

  return saved;
}

export function savePuzzleProgress(progress: PuzzleProgress): void {
  try {
    const all = loadAllProgress();
    all[progress.puzzleId] = progress;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Ignore quota or storage restriction errors silently
  }
}

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as Partial<PlayerStats>;
    return {
      gamesPlayed: typeof parsed.gamesPlayed === 'number' ? parsed.gamesPlayed : 0,
      gamesWon: typeof parsed.gamesWon === 'number' ? parsed.gamesWon : 0,
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      maxStreak: typeof parsed.maxStreak === 'number' ? parsed.maxStreak : 0,
      completedPuzzleIds: Array.isArray(parsed.completedPuzzleIds)
        ? parsed.completedPuzzleIds
        : [],
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function recordPuzzleCompletion(puzzleId: string, won: boolean): PlayerStats {
  const current = loadPlayerStats();
  if (current.completedPuzzleIds.includes(puzzleId)) {
    return current;
  }

  const nextStreak = won ? current.currentStreak + 1 : 0;
  const nextStats: PlayerStats = {
    gamesPlayed: current.gamesPlayed + 1,
    gamesWon: current.gamesWon + (won ? 1 : 0),
    currentStreak: nextStreak,
    maxStreak: Math.max(current.maxStreak, nextStreak),
    completedPuzzleIds: [...current.completedPuzzleIds, puzzleId],
  };

  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(nextStats));
  } catch {
    // Ignore storage errors silently
  }

  return nextStats;
}
