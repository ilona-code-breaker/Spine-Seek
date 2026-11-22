import { Archive, BarChart2, Shuffle } from 'lucide-react';
import { MAX_MISTAKES } from '../lib/gameLogic';
import { GameStatus } from '../types/game';

interface GameControlsProps {
  status: GameStatus;
  mistakesRemaining: number;
  selectedCount: number;
  onShuffle: () => void;
  onDeselectAll: () => void;
  onSubmit: () => void;
  onViewResults: () => void;
  onOpenArchive: () => void;
}

export function GameControls({
  status,
  mistakesRemaining,
  selectedCount,
  onShuffle,
  onDeselectAll,
  onSubmit,
  onViewResults,
  onOpenArchive,
}: GameControlsProps) {
  if (status !== 'playing') {
    return (
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onViewResults}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2925] active:scale-[0.98] transition-all duration-150 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
        >
          <BarChart2 className="w-4 h-4" aria-hidden="true" />
          <span>View Results</span>
        </button>
        <button
          type="button"
          onClick={onOpenArchive}
          className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D6D0C6] bg-white/70 text-[#1C1917] text-sm font-semibold hover:bg-white active:scale-[0.98] transition-all duration-150 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
        >
          <Archive className="w-4 h-4" aria-hidden="true" />
          <span>Play Archive</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-5">
      <div
        className="flex items-center justify-center gap-3"
        aria-label={`${mistakesRemaining} of ${MAX_MISTAKES} mistakes remaining`}
      >
        <span className="text-sm text-[#57534E] font-medium">
          Mistakes remaining
        </span>
        <div className="flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: MAX_MISTAKES }).map((_, index) => {
            const isRemaining = index < mistakesRemaining;
            return (
              <span
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  isRemaining
                    ? 'bg-[#2B2623] scale-100'
                    : 'bg-transparent border border-[#C6BFB3] scale-90'
                }`}
              />
            );
          })}
        </div>
        <span className="text-xs font-medium text-[#78716C] tabular-nums">
          {mistakesRemaining}/{MAX_MISTAKES}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onShuffle}
          className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl border border-[#D6D0C6] bg-white/80 text-[#1C1917] text-sm font-semibold hover:bg-white active:scale-[0.98] transition-all duration-150 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
        >
          <Shuffle className="w-4 h-4" aria-hidden="true" />
          <span>Shuffle</span>
        </button>

        <button
          type="button"
          onClick={onDeselectAll}
          disabled={selectedCount === 0}
          className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl border border-[#D6D0C6] bg-white/80 text-[#1C1917] text-sm font-semibold hover:bg-white active:scale-[0.98] transition-all duration-150 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
        >
          Deselect All
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={selectedCount !== 4}
          className="min-h-[44px] px-6 sm:px-7 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2925] active:scale-[0.98] transition-all duration-150 whitespace-nowrap cursor-pointer disabled:bg-[#D6D0C6] disabled:text-[#78716C] disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5]"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
