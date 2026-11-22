import { TIER_META, TIER_ORDER } from '../data/puzzles';
import { Modal } from './Modal';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
      subtitle="Find four groups of four literary terms that share a thread."
    >
      <div className="space-y-5 text-sm text-[#3F3A36] leading-relaxed">
        <ul className="space-y-2.5 list-disc pl-5">
          <li>
            Select <strong>four tiles</strong> that share a common bookish theme,
            trope, or wordplay connection, then tap <strong>Submit</strong>.
          </li>
          <li>
            Watch for literary red herrings—some words look as though they belong
            to another shelf.
          </li>
          <li>
            If three of your four tiles belong to the same group, you will see a{' '}
            <strong>&ldquo;One away...&rdquo;</strong> notice.
          </li>
          <li>
            Find all four groups before running out of your{' '}
            <strong>four mistakes</strong>. Repeating an identical guess will not
            cost an extra mistake.
          </li>
        </ul>

        <div className="pt-3 border-t border-[#E5E0D8] space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-[#57534E]">
            Category Tiers
          </div>
          <div className="space-y-2">
            {TIER_ORDER.map((tier) => {
              const style = TIER_META[tier];
              return (
                <div key={tier} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                    style={{ backgroundColor: style.swatchHex }}
                    aria-hidden="true"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-[#1C1917]">
                      Tier {style.roman} ({style.label})
                    </span>
                    <span className="text-[#57534E]"> — {style.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
