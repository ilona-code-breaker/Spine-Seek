import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArchiveModal } from './components/ArchiveModal';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ResultsModal } from './components/ResultsModal';
import { PUZZLES, TIER_ORDER } from './data/puzzles';
import {
  evaluateGuess,
  formatReadableDate,
  getDailyPuzzleIndex,
  shuffleArray,
} from './lib/gameLogic';
import {
  createInitialProgress,
  loadAllProgress,
  loadPlayerStats,
  loadPuzzleProgress,
  recordPuzzleCompletion,
  savePuzzleProgress,
} from './lib/storage';
import { PlayerStats, PuzzleGroup, PuzzleProgress } from './types/game';

export default function App() {
  const todayPuzzle = useMemo(() => {
    const index = getDailyPuzzleIndex();
    return PUZZLES[index] ?? PUZZLES[0];
  }, []);

  const todayFormatted = useMemo(() => formatReadableDate(), []);

  const [activePuzzleId, setActivePuzzleId] = useState<string>(todayPuzzle.id);
  const [progressMap, setProgressMap] = useState<Record<string, PuzzleProgress>>(
    () => {
      const savedAll = loadAllProgress();
      if (!savedAll[todayPuzzle.id]) {
        savedAll[todayPuzzle.id] = loadPuzzleProgress(todayPuzzle);
      }
      return savedAll;
    }
  );
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());

  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [shakingTiles, setShakingTiles] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const toastTimerRef = useRef<number | null>(null);
  const shakeTimerRef = useRef<number | null>(null);
  const modalTimerRef = useRef<number | null>(null);

  const activePuzzle = useMemo(
    () => PUZZLES.find((p) => p.id === activePuzzleId) ?? todayPuzzle,
    [activePuzzleId, todayPuzzle]
  );

  const activeProgress = useMemo(() => {
    return progressMap[activePuzzle.id] ?? createInitialProgress(activePuzzle);
  }, [progressMap, activePuzzle]);

  const clearPendingTimers = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    if (shakeTimerRef.current !== null) {
      window.clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = null;
    }
    if (modalTimerRef.current !== null) {
      window.clearTimeout(modalTimerRef.current);
      modalTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearPendingTimers();
  }, [clearPendingTimers]);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  const updateActiveProgress = useCallback((next: PuzzleProgress) => {
    savePuzzleProgress(next);
    setProgressMap((prev) => ({
      ...prev,
      [next.puzzleId]: next,
    }));
  }, []);

  const handleSelectPuzzle = useCallback(
    (puzzleId: string) => {
      clearPendingTimers();
      setToastMessage(null);
      setShakingTiles([]);
      setSelectedTiles([]);

      const targetPuzzle = PUZZLES.find((p) => p.id === puzzleId);
      if (!targetPuzzle) return;

      setProgressMap((prev) => {
        if (prev[puzzleId]) return prev;
        const initialized = loadPuzzleProgress(targetPuzzle);
        return { ...prev, [puzzleId]: initialized };
      });
      setActivePuzzleId(puzzleId);
    },
    [clearPendingTimers]
  );

  const handleToggleTile = useCallback(
    (tile: string) => {
      if (activeProgress.status !== 'playing') return;

      setSelectedTiles((prev) => {
        if (prev.includes(tile)) {
          return prev.filter((item) => item !== tile);
        }
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, tile];
      });
    },
    [activeProgress.status]
  );

  const handleShuffle = useCallback(() => {
    if (activeProgress.status !== 'playing') return;
    const shuffledOrder = shuffleArray(activeProgress.tileOrder);
    updateActiveProgress({
      ...activeProgress,
      tileOrder: shuffledOrder,
      updatedAt: Date.now(),
    });
  }, [activeProgress, updateActiveProgress]);

  const handleDeselectAll = useCallback(() => {
    setSelectedTiles([]);
  }, []);

  const triggerShake = useCallback((tiles: string[]) => {
    if (shakeTimerRef.current !== null) {
      window.clearTimeout(shakeTimerRef.current);
    }
    setShakingTiles(tiles);
    shakeTimerRef.current = window.setTimeout(() => {
      setShakingTiles([]);
      shakeTimerRef.current = null;
    }, 450);
  }, []);

  const handleSubmit = useCallback(() => {
    if (activeProgress.status !== 'playing' || selectedTiles.length !== 4) {
      return;
    }

    const outcome = evaluateGuess(
      activePuzzle,
      selectedTiles,
      activeProgress.guesses
    );

    if (outcome.type === 'already-guessed') {
      showToast('Already guessed!');
      triggerShake(selectedTiles);
      return;
    }

    const nextGuesses = [...activeProgress.guesses, [...selectedTiles]];

    if (outcome.type === 'correct') {
      const solvedGroup = outcome.group;
      const nextSolvedIds = [...activeProgress.solvedGroupIds, solvedGroup.id];
      const nextTileOrder = activeProgress.tileOrder.filter(
        (tile) => !solvedGroup.items.includes(tile)
      );
      const isWin = nextSolvedIds.length === 4;

      const nextProgress: PuzzleProgress = {
        ...activeProgress,
        solvedGroupIds: nextSolvedIds,
        guesses: nextGuesses,
        tileOrder: nextTileOrder,
        status: isWin ? 'won' : 'playing',
        updatedAt: Date.now(),
      };

      updateActiveProgress(nextProgress);
      setSelectedTiles([]);

      if (isWin) {
        const updatedStats = recordPuzzleCompletion(activePuzzle.id, true);
        setStats(updatedStats);
        modalTimerRef.current = window.setTimeout(() => {
          setIsResultsOpen(true);
          modalTimerRef.current = null;
        }, 550);
      }
      return;
    }

    // Wrong or One away
    triggerShake(selectedTiles);
    if (outcome.type === 'one-away') {
      showToast('One away...');
    }

    const nextMistakes = Math.max(0, activeProgress.mistakesRemaining - 1);
    const isLoss = nextMistakes === 0;

    const nextProgress: PuzzleProgress = {
      ...activeProgress,
      guesses: nextGuesses,
      mistakesRemaining: nextMistakes,
      status: isLoss ? 'lost' : 'playing',
      updatedAt: Date.now(),
    };

    updateActiveProgress(nextProgress);

    if (isLoss) {
      setSelectedTiles([]);
      const updatedStats = recordPuzzleCompletion(activePuzzle.id, false);
      setStats(updatedStats);
      modalTimerRef.current = window.setTimeout(() => {
        setIsResultsOpen(true);
        modalTimerRef.current = null;
      }, 850);
    }
  }, [
    activeProgress,
    activePuzzle,
    selectedTiles,
    showToast,
    triggerShake,
    updateActiveProgress,
  ]);

  const solvedGroups = useMemo(() => {
    return activeProgress.solvedGroupIds
      .map((id) => activePuzzle.groups.find((g) => g.id === id))
      .filter((group): group is PuzzleGroup => Boolean(group));
  }, [activeProgress.solvedGroupIds, activePuzzle.groups]);

  const missedGroups = useMemo(() => {
    const solvedSet = new Set(activeProgress.solvedGroupIds);
    return activePuzzle.groups
      .filter((group) => !solvedSet.has(group.id))
      .sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
      );
  }, [activeProgress.solvedGroupIds, activePuzzle.groups]);

  const isTodaySelected = activePuzzle.id === todayPuzzle.id;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      <Header
        isTodaySelected={isTodaySelected}
        onSelectToday={() => handleSelectPuzzle(todayPuzzle.id)}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenStats={() => setIsResultsOpen(true)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-[660px] mx-auto">
          <section
            aria-label="Edition details"
            className="pb-4 sm:pb-5 border-b border-[#E5E0D8]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#57534E]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1C1917] tabular-nums">
                  Edition No. {String(activePuzzle.editionNumber).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span>{isTodaySelected ? todayFormatted : 'Archive Edition'}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsArchiveOpen(true)}
                className="text-xs sm:text-sm font-medium text-[#1C1917] underline underline-offset-4 decoration-[#1C1917]/30 hover:decoration-[#1C1917] cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] rounded"
              >
                Play Previous ({PUZZLES.length} Editions)
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-[32px] font-bold tracking-tight text-[#1C1917] mt-2 text-balance leading-tight">
              {activePuzzle.title}
            </h1>
            <p className="text-sm text-[#57534E] mt-1">
              A daily bookish connections puzzle
            </p>
          </section>

          <div
            className="h-10 flex items-center justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {toastMessage && (
              <div className="px-4 py-1.5 rounded-lg bg-[#1C1917] text-[#FAF8F5] text-xs sm:text-sm font-semibold shadow-md animate-banner-reveal">
                {toastMessage}
              </div>
            )}
          </div>

          <GameBoard
            solvedGroups={solvedGroups}
            missedGroups={missedGroups}
            remainingTiles={activeProgress.tileOrder}
            selectedTiles={selectedTiles}
            shakingTiles={shakingTiles}
            status={activeProgress.status}
            onToggleTile={handleToggleTile}
          />

          <GameControls
            status={activeProgress.status}
            mistakesRemaining={activeProgress.mistakesRemaining}
            selectedCount={selectedTiles.length}
            onShuffle={handleShuffle}
            onDeselectAll={handleDeselectAll}
            onSubmit={handleSubmit}
            onViewResults={() => setIsResultsOpen(true)}
            onOpenArchive={() => setIsArchiveOpen(true)}
          />
        </div>
      </main>

      <footer className="border-t border-[#E5E0D8] py-5 px-4 text-center text-xs text-[#78716C]">
        Spine &amp; Seek · A daily bookish connections puzzle · Progress saved locally in your browser
      </footer>

      <ResultsModal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
        puzzle={activePuzzle}
        status={activeProgress.status}
        guesses={activeProgress.guesses}
        stats={stats}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onCopySuccess={() => showToast('Copied!')}
      />

      <ArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        puzzles={PUZZLES}
        activePuzzleId={activePuzzle.id}
        todayPuzzleId={todayPuzzle.id}
        progressMap={progressMap}
        onSelectPuzzle={handleSelectPuzzle}
      />

      <HowToPlayModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
