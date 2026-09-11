import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no entries matching your ledger criteria at the moment.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white dark:bg-stone-900 border border-[#E2DACD] dark:border-stone-800 my-4 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-[#1B3B2B]/10 dark:bg-emerald-950/50 border border-[#1B3B2B]/20 dark:border-emerald-500/30 flex items-center justify-center text-[#1B3B2B] dark:text-emerald-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-serif font-bold text-[#1C1917] dark:text-stone-100 mb-1">{title}</h3>
      <p className="text-xs text-[#605A52] dark:text-stone-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-medium text-xs transition-colors shadow-sm active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
