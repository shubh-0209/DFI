import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import ContributionStatusBadge from '../../contributions/ContributionStatusBadge';

const ContributionQueueCard = ({ contribution, onClick, isActive }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const volunteer = contribution.submittedBy || {};
  const volunteerName = volunteer.name || 'Unknown Volunteer';
  const volunteerInitials = (volunteerName || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm cursor-pointer transition ${
        isActive ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/40' : 'border-slate-200 hover:shadow-md'
      }`}
      style={{ padding: '1.25rem', marginBottom: '1rem' }}
      onClick={() => onClick?.(contribution)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(contribution);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Review contribution: ${contribution.title}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="bg-slate-100 text-slate-700 font-semibold w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs md:text-sm">
              {volunteerInitials}
            </div>
            <div className="text-[13px] md:text-sm font-semibold text-slate-800">{volunteerName}</div>
          </div>
          <div style={{ flexShrink: 0 }}>
             <ContributionStatusBadge status={contribution.status} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div className="text-[11px] md:text-xs uppercase tracking-wide text-slate-500">
            {contribution.category?.replace(/_/g, ' ') || 'General'}
          </div>
          <div className="text-base md:text-lg font-semibold text-slate-900 leading-snug">
            {contribution.title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
             <Calendar size={13} color="#94a3b8" />
             <span>{formatDate(contribution.createdAt)}</span>
          </div>
          <div className="text-[13px] md:text-sm font-semibold text-blue-600 flex items-center gap-1">
             {isActive ? 'Reviewing' : 'View Details'} <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionQueueCard;
