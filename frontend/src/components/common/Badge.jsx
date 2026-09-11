import React from 'react';

const stampStyles = {
  // Statuses & Verifications (Solid Forest Green Fill)
  available: 'bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-600 dark:border-emerald-500 shadow-2xs',
  approved: 'bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-600 dark:border-emerald-500 shadow-2xs',
  paid: 'bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-600 dark:border-emerald-500 shadow-2xs',
  resolved: 'bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-600 dark:border-emerald-500 shadow-2xs',
  active: 'bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-600 dark:border-emerald-500 shadow-2xs',

  // Pending & Dues (Solid Ochre/Amber Fill)
  pending: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 dark:border-amber-500 shadow-2xs',
  due: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 dark:border-amber-500 shadow-2xs',
  medium: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 dark:border-amber-500 shadow-2xs',
  in_progress: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 dark:border-amber-500 shadow-2xs',
  submitted: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 dark:border-amber-500 shadow-2xs',

  // Alerts & Urgencies (Solid Deep Red Fill)
  rejected: 'bg-[#991B1B] text-white border-[#991B1B] dark:bg-rose-700 dark:border-rose-600 shadow-2xs',
  overdue: 'bg-[#991B1B] text-white border-[#991B1B] dark:bg-rose-700 dark:border-rose-600 shadow-2xs',
  high: 'bg-[#991B1B] text-white border-[#991B1B] dark:bg-rose-700 dark:border-rose-600 shadow-2xs',
  urgent: 'bg-[#991B1B] text-white border-[#991B1B] dark:bg-rose-700 dark:border-rose-600 shadow-2xs',

  // Lease Occupied & Completed (Solid Dark Stone Fill)
  rented: 'bg-[#44403C] text-white border-[#44403C] dark:bg-stone-700 dark:border-stone-600 shadow-2xs',
  maintenance: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 dark:border-amber-500 shadow-2xs',
  completed: 'bg-[#44403C] text-white border-[#44403C] dark:bg-stone-700 dark:border-stone-600 shadow-2xs',
  closed: 'bg-[#44403C] text-white border-[#44403C] dark:bg-stone-700 dark:border-stone-600 shadow-2xs',

  // Roles
  tenant: 'bg-[#1B3B2B] text-white border-[#1B3B2B] dark:bg-emerald-600 shadow-2xs',
  owner: 'bg-[#B8860B] text-white border-[#B8860B] dark:bg-amber-600 shadow-2xs',
  admin: 'bg-[#991B1B] text-white border-[#991B1B] dark:bg-rose-700 shadow-2xs',
};

const Badge = ({ status = 'available', text, className = '' }) => {
  const normalizedKey = String(status).toLowerCase().replace(' ', '_');
  const style = stampStyles[normalizedKey] || 'bg-stone-800 text-white border-stone-700';

  return (
    <span
      className={`text-[10px] uppercase font-bold tracking-[0.14em] px-2.5 py-1 rounded-md inline-flex items-center gap-1 border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 shrink-0" />
      {text || status.replace('_', ' ')}
    </span>
  );
};

export default Badge;
