import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Edit3, Star, Timer } from 'lucide-react';
import './ReviewStats.css';

const ReviewStats = ({ stats = {} }) => {
  const items = [
    { label: 'Pending Reviews', value: stats.pending ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100/50' },
    { label: 'Under Review', value: stats.underReview ?? 0, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100/50' },
    { label: 'Approved', value: stats.approvedToday ?? 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
    { label: 'Rejected', value: stats.rejectedToday ?? 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100/50' },
    { label: 'Needs Changes', value: stats.needsChanges ?? 0, icon: Edit3, color: 'text-orange-600', bg: 'bg-orange-100/50' },
    { label: 'Featured', value: stats.featured ?? 0, icon: Star, color: 'text-purple-600', bg: 'bg-purple-100/50' },
    { label: 'Avg Time', value: stats.avgReviewTime ?? '0h', icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
  ];

  return (
    <div className="contribution-stats-grid">
      {items.map((item) => (
        <div
          key={item.label}
          className="contribution-stat-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="contribution-stat-inner">
            <div className={`contribution-stat-icon-wrapper ${item.bg} ${item.color}`}>
              <item.icon className="contribution-stat-icon" strokeWidth={2} />
            </div>
            <div className="contribution-stat-content">
              <div className="contribution-stat-value text-slate-800">
                {item.value}
              </div>
              <div className="contribution-stat-label text-slate-500">
                {item.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewStats;
