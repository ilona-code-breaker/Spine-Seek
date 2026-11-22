import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { TIER_META } from '../data/puzzles';
import { buildShareGrid, getTileGroup } from '../lib/gameLogic';
import { GameStatus, PlayerStats, Puzzle } from '../types/game';
import { Modal } from './Modal';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzle: Puzzle;
  status: GameStatus;
  guesses: string[][];
  stats: PlayerStats;
  onOpenArchive: () => void;
  onCopySuccess?: () => void;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function ResultsModal({
  isOpen,
  onClose,
  puzzle,
  status,
  guesses,
  stats,
  onOpenArchive,
  onCopySuccess,
}: ResultsModalProps) {
  const [copied, setCopied] = useState(false);

  const winPercentage =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const modalTitle =
    status === 'won'
      ? 'Edition Complete'
      : status === 'lost'
        ? 'Out of Attempts'
        : 'Reader Statistics';

  const handleShare = async () => {
    const summary = buildShareGrid(puzzle, guesses);
    const success = await copyTextToClipboard(summary);
    if (success) {
      setCopied(true);
      onCopySuccess?.();
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={`Edition #${String(puzzle.editionNumber).padStart(2, '0')} · ${puzzle.title}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-2 py-4 border-y border-[#E5E0D8] text-center">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">
              {stats.gamesPlayed}
            </div>
            <div className="text-[11px] sm:text-xs text-[#57534E] mt-0.5">
              Played
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">
              {winPercentage}%
            </div>
            <div className="text-[11px] sm:text-xs text-[#57534E] mt-0.5">
              Win Rate
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">
              {stats.currentStreak}
            </div>
            <div className="text-[11px] sm:text-xs text-[#57534E] mt-0.5">
              Streak
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#1C1917] tabular-nums">
              {stats.maxStreak}
            </div>
            <div className="text-[11px] sm:text-xs text-[#57534E] mt-0.5">
              Best Streak
            </div>
          </div>
        </div>

        {guesses.length > 0 && (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-[0.06em] text-[#57534E] text-center">
              Guess Sequence
            </div>
            <div
              className="flex flex-col items-center gap-1.5"
              aria-label="Visual summary of your guesses"
            >
              {guesses.map((guess, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-1.5">
                  {guess.map((tile, colIndex) => {
                    const group = getTileGroup(puzzle, tile);
                    const colorHex = group
                      ? TIER_META[group.tier].swatchHex
                      : '#D6D0C6';
                    return (
                      <span
                        key={`${rowIndex}-${colIndex}`}
                        className="w-6 h-6 rounded-[5px] border border-black/10"
                        style={{ backgroundColor: colorHex }}
                        title={group ? TIER_META[group.tier].label : 'Tile'}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          {status !== 'playing' && (
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2925] active:scale-[0.98] transition-all duration-150 inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  <span>Share Result</span>
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenArchive();
            }}
            className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D6D0C6] bg-white/80 text-[#1C1917] text-sm font-semibold hover:bg-white active:scale-[0.98] transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
          >
            Browse Archive
          </button>
        </div>
      </div>
    </Modal>
  );
}
