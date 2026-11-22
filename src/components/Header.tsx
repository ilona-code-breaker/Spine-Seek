import { User } from 'firebase/auth';
import { BarChart2, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  isTodaySelected: boolean;
  user: User | null;
  authLoading: boolean;
  onSelectToday: () => void;
  onOpenArchive: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function Header({
  isTodaySelected,
  user,
  authLoading,
  onSelectToday,
  onOpenArchive,
  onOpenRules,
  onOpenStats,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  const firstName =
    user?.displayName?.split(/\s+/)[0] || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="border-b border-[#E5E0D8] bg-[#FAF8F5]/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        <button
          type="button"
          onClick={onSelectToday}
          className="font-serif text-lg sm:text-[26px] font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917] rounded-md px-1 -ml-1"
        >
          Spine &amp; Seek
        </button>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#57534E]"
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenStats}
            aria-label="Statistics"
            className="min-h-[40px] min-w-[40px] px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-[#1C1917] bg-[#F3EFE8] hover:bg-[#EAE4DA] border border-[#DDD7CC] rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
          >
            <BarChart2 className="w-4 h-4 sm:hidden" aria-hidden="true" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {!authLoading &&
            (user ? (
              <button
                type="button"
                onClick={onSignOut}
                title={`Signed in as ${user.email || firstName}. Click to sign out.`}
                className="min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#1C1917] bg-white/80 hover:bg-white border border-[#DDD7CC] rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-[#2B2623] text-[#FAF8F5] text-[10px] font-bold flex items-center justify-center">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden md:inline max-w-[90px] truncate">
                  {firstName}
                </span>
                <LogOut
                  className="w-3.5 h-3.5 text-[#57534E]"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="min-h-[40px] px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#FAF8F5] bg-[#1C1917] hover:bg-[#2E2925] rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1917]"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign in</span>
              </button>
            ))}
        </div>
      </div>
    </header>
  );
}
