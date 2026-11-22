import { TIER_META } from '../data/puzzles';
import { GameStatus, PuzzleGroup } from '../types/game';

interface GameBoardProps {
  solvedGroups: PuzzleGroup[];
  missedGroups: PuzzleGroup[];
  remainingTiles: string[];
  selectedTiles: string[];
  shakingTiles: string[];
  status: GameStatus;
  onToggleTile: (tile: string) => void;
}

function getTileFontClass(label: string): string {
  const words = label.split(/\s+/);
  const longestWord = words.reduce((max, word) => Math.max(max, word.length), 0);

  if (label.length >= 36) {
    return 'text-[9px] sm:text-[11px] leading-[1.12] tracking-[0.005em]';
  }
  if (label.length >= 23 || longestWord >= 13) {
    return 'text-[10px] sm:text-xs leading-[1.15] tracking-[0.01em]';
  }
  if (label.length >= 15 || longestWord >= 10) {
    return 'text-[11px] sm:text-[13px] leading-[1.18] tracking-[0.02em]';
  }
  return 'text-xs sm:text-sm leading-tight tracking-[0.03em]';
}

export function GameBoard({
  solvedGroups,
  missedGroups,
  remainingTiles,
  selectedTiles,
  shakingTiles,
  status,
  onToggleTile,
}: GameBoardProps) {
  const bannerGroups: Array<{ group: PuzzleGroup; wasMissed: boolean }> = [
    ...solvedGroups.map((group) => ({ group, wasMissed: false })),
    ...(status === 'lost'
      ? missedGroups.map((group) => ({ group, wasMissed: true }))
      : []),
  ];

  return (
    <div className="w-full space-y-2.5" aria-label="Puzzle board">
      {bannerGroups.length > 0 && (
        <div className="space-y-2 sm:space-y-2.5">
          {bannerGroups.map(({ group, wasMissed }) => {
            const style = TIER_META[group.tier];
            return (
              <div
                key={group.id}
                className={`w-full rounded-xl border ${style.bgClass} ${style.borderClass} ${style.textClass} px-4 py-3.5 sm:py-4 text-center animate-banner-reveal`}
              >
                <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-75 mb-0.5">
                  <span>Tier {style.roman}</span>
                  <span aria-hidden="true">·</span>
                  <span>{style.description}</span>
                  {wasMissed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Revealed</span>
                    </>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-[0.03em]">
                  {group.category}
                </h2>
                <p className="text-xs sm:text-sm font-medium mt-0.5 leading-snug opacity-90">
                  {group.items.join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {remainingTiles.length > 0 && status === 'playing' && (
        <div
          className="grid grid-cols-4 gap-2 sm:gap-2.5"
          role="group"
          aria-label="Word tiles"
        >
          {remainingTiles.map((tile) => {
            const isSelected = selectedTiles.includes(tile);
            const isShaking = shakingTiles.includes(tile);
            const fontClass = getTileFontClass(tile);

            return (
              <button
                key={tile}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleTile(tile)}
                className={`min-h-[76px] sm:min-h-[86px] px-1.5 sm:px-2.5 py-2 rounded-xl border font-semibold uppercase flex items-center justify-center text-center select-none cursor-pointer transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5] ${fontClass} ${
                  isSelected
                    ? 'bg-[#2B2623] text-[#FAF8F5] border-[#1C1917] shadow-sm animate-tile-pop'
                    : 'bg-[#EFECE6] text-[#1C1917] border-[#E2DDD5] hover:bg-[#E7E2D8] active:scale-[0.97]'
                } ${isShaking ? 'animate-tile-shake' : ''}`}
              >
                <span className="break-words max-w-full">{tile}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
