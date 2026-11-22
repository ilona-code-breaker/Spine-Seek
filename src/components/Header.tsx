interface HeaderProps {
  isTodaySelected: boolean;
  onSelectToday: () => void;
  onOpenArchive: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
}

export function Header({
  isTodaySelected,
  onSelectToday,
  onOpenArchive,
  onOpenRules,
  onOpenStats,
}: HeaderProps) {
  return (
    <header className="border-b border-[#E5E0D8] bg-[#FAF8F5]/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-8">
        <button
          type="button"
          onClick={onSelectToday}
          className="font-serif text-xl sm:text-[26px] font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] rounded-md px-1 -ml-1"
        >
          Spine &amp; Seek
        </button>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#57534E]"
        >
          <button
            type="button"
            onClick={onSelectToday}
            className={`whitespace-nowrap shrink-0 py-2 cursor-pointer transition-colors hover:text-[#1C1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] rounded ${
              isTodaySelected
                ? 'text-[#1C1917] underline underline-offset-4 decoration-[#1C1917]/40'
                : ''
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={onOpenArchive}
            className="whitespace-nowrap shrink-0 py-2 cursor-pointer transition-colors hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#1C1917]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] rounded"
          >
            Archive
          </button>
          <button
            type="button"
            onClick={onOpenRules}
            className="whitespace-nowrap shrink-0 py-2 cursor-pointer transition-colors hover:text-[#1C1917] hover:underline underline-offset-4 decoration-[#1C1917]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] rounded"
          >
            Rules
          </button>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenStats}
            className="min-h-[40px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#1C1917] bg-[#F3EFE8] hover:bg-[#EAE4DA] border border-[#DDD7CC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
          >
            Stats
          </button>
        </div>
      </div>
    </header>
  );
}
