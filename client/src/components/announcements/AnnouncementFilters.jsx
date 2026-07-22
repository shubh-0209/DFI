import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown, Tag, Calendar, AlertTriangle, Settings, Star, Users, Monitor, Minus, AlertCircle, Flag } from 'lucide-react';

const AnnouncementFilters = ({
  search, onSearchChange, type, onTypeChange, priority, onPriorityChange, status, onStatusChange, targetAudience, onTargetAudienceChange, showAdminFilters = false, onClear,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const hasActive = [search, type, priority, status, targetAudience].some((v) => v !== '' && v !== 'all');

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setShowMobileFilters(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const FilterSelect = ({ label, value, onChange, options, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {label && (
        <label style={{ color: 'var(--color-heading)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          {Icon && <Icon size={13} aria-hidden="true" style={{ color: 'var(--color-body)' }} />}
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          className="form-control"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{ padding: '0.5rem 2.25rem 0.5rem 0.875rem', width: 'auto', minWidth: '155px', appearance: 'none', backgroundColor: 'var(--color-card)' }}
        >
          <option value="">All</option>
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} aria-hidden="true" />
      </div>
    </div>
  );

  const typeOptions = [
    { value: 'general', label: 'General', icon: Tag },
    { value: 'program', label: 'Program', icon: Calendar },
    { value: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { value: 'maintenance', label: 'Maintenance', icon: Settings },
    { value: 'event', label: 'Event', icon: Star },
    { value: 'recruitment', label: 'Recruitment', icon: Users },
    { value: 'system', label: 'System', icon: Monitor },
  ];
  const priorityOptions = [
    { value: 'low', label: 'Low', icon: Minus },
    { value: 'medium', label: 'Medium', icon: Minus },
    { value: 'high', label: 'High', icon: AlertCircle },
    { value: 'critical', label: 'Critical', icon: Flag },
  ];
  const statusOptions = [
    { value: 'draft', label: 'Draft' }, { value: 'scheduled', label: 'Scheduled' }, { value: 'published', label: 'Published' }, { value: 'expired', label: 'Expired' }, { value: 'archived', label: 'Archived' },
  ];
  const audienceOptions = [
    { value: 'all_users', label: 'All Users' }, { value: 'volunteers', label: 'Volunteers' }, { value: 'ngos', label: 'NGOs' }, { value: 'admins', label: 'Admins' }, { value: 'specific_users', label: 'Specific Users' },
  ];

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={17} style={{ position: 'absolute', left: '0.875rem', color: 'var(--color-body)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search announcements..."
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.25rem' : '1rem', backgroundColor: 'var(--color-card)', height: '42px' }}
              aria-label="Search announcements by title or message"
            />
            {search && (
              <button onClick={() => onSearchChange?.('')} aria-label="Clear search" style={{ position: 'absolute', right: '0.625rem', color: 'var(--color-body)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
                <X size={15} />
              </button>
            )}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setShowMobileFilters((p) => !p)}
            style={{ display: 'flex', padding: '0 1rem', gap: '0.5rem', alignItems: 'center', height: '42px', position: 'relative' }}
            aria-expanded={showMobileFilters}
            aria-controls="announcement-filters-panel"
          >
            <Filter size={17} />
            <span className="mobile-hidden">Filters</span>
            {hasActive && (
              <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--color-primary)', position: 'absolute', top: 8, right: 12 }} />
            )}
            <motion.div animate={{ rotate: showMobileFilters ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'none' }} className="mobile-hidden">
              <ChevronDown size={14} aria-hidden="true" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div id="announcement-filters-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end', paddingTop: '0.5rem' }}>
                <FilterSelect label="Type" value={type} onChange={onTypeChange} options={typeOptions} />
                <FilterSelect label="Priority" value={priority} onChange={onPriorityChange} options={priorityOptions} />
                {showAdminFilters && <FilterSelect label="Status" value={status} onChange={onStatusChange} options={statusOptions} />}
                {!showAdminFilters && <FilterSelect label="Audience" value={targetAudience} onChange={onTargetAudienceChange} options={audienceOptions} />}
                {hasActive && (
                  <button onClick={onClear} style={{ color: 'var(--color-body)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', height: '38px' }} aria-label="Clear all filters">
                    <X size={14} /> Clear all
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-hidden { display: inline-flex !important; }
          .mobile-hidden-svg { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-hidden { display: none !important; }
          .mobile-hidden-svg { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementFilters;
