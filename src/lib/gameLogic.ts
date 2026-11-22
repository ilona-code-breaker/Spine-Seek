import { PUZZLES, TIER_META } from '../data/puzzles';
import { GuessOutcome, Puzzle, PuzzleGroup } from '../types/game';

export const MAX_MISTAKES = 4;

// Epoch aligned to 2026-11-22 so Edition #1 appears as today's puzzle initially.
const EPOCH_YEAR = 2026;
const EPOCH_MONTH_INDEX = 10; // November (0-indexed)
const EPOCH_DAY = 22;

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatReadableDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDailyPuzzleIndex(date: Date = new Date()): number {
  const epochUtc = Date.UTC(EPOCH_YEAR, EPOCH_MONTH_INDEX, EPOCH_DAY);
  const currentUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceEpoch = Math.round((currentUtc - epochUtc) / 86_400_000);
  const total = PUZZLES.length;
  return ((daysSinceEpoch % total) + total) % total;
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getInitialTileOrder(puzzle: Puzzle): string[] {
  const allItems = puzzle.groups.flatMap((group) => group.items);
  let seed = hashSeed(puzzle.id);

  const nextRandom = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const shuffled = [...allItems];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function normalizeGuessKey(tiles: string[]): string {
  return [...tiles].sort((a, b) => a.localeCompare(b)).join('||');
}

export function evaluateGuess(
  puzzle: Puzzle,
  selectedTiles: string[],
  previousGuesses: string[][]
): GuessOutcome {
  const candidateKey = normalizeGuessKey(selectedTiles);
  const alreadyGuessed = previousGuesses.some(
    (guess) => normalizeGuessKey(guess) === candidateKey
  );

  if (alreadyGuessed) {
    return { type: 'already-guessed' };
  }

  let bestMatchCount = 0;
  let matchedGroup: PuzzleGroup | null = null;

  for (const group of puzzle.groups) {
    const matchCount = selectedTiles.filter((tile) =>
      group.items.includes(tile)
    ).length;

    if (matchCount === 4) {
      matchedGroup = group;
      break;
    }

    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
    }
  }

  if (matchedGroup) {
    return { type: 'correct', group: matchedGroup };
  }

  if (bestMatchCount === 3) {
    return { type: 'one-away' };
  }

  return { type: 'incorrect' };
}

export function getTileGroup(puzzle: Puzzle, tile: string): PuzzleGroup | undefined {
  return puzzle.groups.find((group) => group.items.includes(tile));
}

export function buildShareGrid(puzzle: Puzzle, guesses: string[][]): string {
  const header = `Spine & Seek — Edition #${puzzle.editionNumber}\n${puzzle.title}`;
  const rows = guesses.map((guess) =>
    guess
      .map((tile) => {
        const group = getTileGroup(puzzle, tile);
        return group ? TIER_META[group.tier].emoji : '⬜';
      })
      .join('')
  );
  return `${header}\n${rows.join('\n')}`;
}
