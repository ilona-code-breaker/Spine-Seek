import { CheckCircle2, CircleDot, XCircle } from 'lucide-react';
import { TIER_META } from '../data/puzzles';
import { Puzzle, PuzzleProgress } from '../types/game';
import { Modal } from './Modal';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzles: Puzzle[];
  activePuzzleId: string;
  todayPuzzleId: string;
  progressMap: Record<string, PuzzleProgress>;
  onSelectPuzzle: (puzzleId: string) => void;
}

export function ArchiveModal({
  isOpen,
  onClose,
  puzzles,
  activePuzzleId,
  todayPuzzleId,
  progressMap,
  onSelectPuzzle,
}: ArchiveModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edition Archive"
      subtitle="Play today's puzzle or revisit any past literary edition."
    >
      <div className="divide-y divide-[#E5E0D8] -mx-2">
        {puzzles.map((puzzle) => {
          const progress = progressMap[puzzle.id];
          const isCurrent = puzzle.id === activePuzzleId;
          const isToday = puzzle.id === todayPuzzleId;
          const status = progress?.status ?? 'playing';
          const solvedCount = progress?.solvedGroupIds.length ?? 0;

          let statusLabel = 'Unplayed';
          if (status === 'won') statusLabel = 'Solved';
          else if (status === 'lost') statusLabel = 'Missed';
          else if (solvedCount > 0 || (progress?.guesses.length ?? 0) > 0) {
            statusLabel = `${solvedCount}/4 groups`;
          }

          return (
            <button
              key={puzzle.id}
              type="button"
              onClick={() => {
                onSelectPuzzle(puzzle.id);
                onClose();
              }}
              className={`w-full min-h-[56px] px-3 py-3 flex items-center justify-between gap-3 text-left rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] ${
                isCurrent ? 'bg-[#EFECE6]' : 'hover:bg-[#F3EFE8]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <span className="font-semibold tabular-nums text-[#1C1917]">
                    No. {String(puzzle.editionNumber).padStart(2, '0')}
                  </span>
                  {isToday && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#1C1917]">
                        Today&apos;s Edition
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{statusLabel}</span>
                </div>
                <div className="text-sm sm:text-base font-serif font-semibold text-[#1C1917] truncate mt-0.5">
                  {puzzle.title}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {progress && progress.solvedGroupIds.length > 0 && (
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {progress.solvedGroupIds.map((groupId) => {
                      const grp = puzzle.groups.find((g) => g.id === groupId);
                      if (!grp) return null;
                      return (
                        <span
                          key={groupId}
                          className="w-2.5 h-2.5 rounded-[3px]"
                          style={{ backgroundColor: TIER_META[grp.tier].swatchHex }}
                        />
                      );
                    })}
                  </div>
                )}

                {status === 'won' ? (
                  <CheckCircle2
                    className="w-4 h-4 text-[#4B6F50]"
                    aria-hidden="true"
                  />
                ) : status === 'lost' ? (
                  <XCircle className="w-4 h-4 text-[#9E4747]" aria-hidden="true" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4 text-[#1C1917]" aria-hidden="true" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
