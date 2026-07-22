import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, AlertCircle } from 'lucide-react';

const NotificationFilters = React.memo(({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  readStatus,
  onReadStatusChange,
  sortBy,
  onSortByChange,
  onClear,
  error,
}) => {
  const categories = useMemo(() => [
    { value: '', label: 'All Categories' },
    { value: 'application', label: 'Applications' },
    { value: 'program', label: 'Programs' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'certificate', label: 'Certificates' },
    { value: 'reward', label: 'Rewards' },
    { value: 'leaderboard', label: 'Leaderboard' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'security', label: 'Security' },
    { value: 'system', label: 'System' },
    { value: 'message', label: 'Messages' },
  ], []);

  const priorities = useMemo(() => [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ], []);

  const readStatuses = useMemo(() => [
    { value: '', label: 'All Status' },
    { value: 'false', label: 'Unread' },
    { value: 'true', label: 'Read' },
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
  ], []);

  const hasActiveFilters = useMemo(() => category || priority || readStatus || search, [category, priority, readStatus, search]);

  const handleSearchChange = useCallback((e) => {
    onSearchChange?.(e.target.value);
  }, [onSearchChange]);

  const handleCategoryChange = useCallback((e) => {
    onCategoryChange?.(e.target.value);
  }, [onCategoryChange]);

  const handlePriorityChange = useCallback((e) => {
    onPriorityChange?.(e.target.value);
  }, [onPriorityChange]);

  const handleReadStatusChange = useCallback((e) => {
    onReadStatusChange?.(e.target.value);
  }, [onReadStatusChange]);

  const handleSortByChange = useCallback((e) => {
    onSortByChange?.(e.target.value);
  }, [onSortByChange]);

  const handleClear = useCallback(() => {
    onClear?.();
  }, [onClear]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && search) {
      onSearchChange?.('');
    }
  }, [search, onSearchChange]);

  return (
    <motion.div
      className="notif-filters-container"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1rem',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SlidersHorizontal size={16} style={{ color: 'var(--color-body)' }} aria-hidden="true" />
        <span style={{ color: 'var(--color-heading)' }}>
          Filters
        </span>
        {hasActiveFilters && (
          <span style={{ color: 'var(--color-primary)' }}>
            Active
          </span>
        )}
        {onClear && hasActiveFilters && (
          <button
            onClick={handleClear}
            aria-label="Clear all filters"
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--color-error)',
              background: 'none',
              border: 'none',
              cursor: 'pointer' }}
          >
            <X size={14} aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          borderRadius: 8,
          backgroundColor: '#FEE2E2',
          color: '#991B1B' }} role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="notif-search-container" style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} aria-hidden="true" />
        <input
          className="notif-search-input"
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          aria-label="Search notifications"
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem 0.625rem 2.5rem',
            borderRadius: 10,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-heading)',
            outline: 'none' }}
        />
      </div>

      <div className="notif-filters-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '0.5rem',
        '@media (max-width: 640px)': {
          gridTemplateColumns: '1fr',
        }
      }}>
        <select
          value={category}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            minHeight: 40 }}
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={handlePriorityChange}
          aria-label="Filter by priority"
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            minHeight: 40 }}
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          value={readStatus}
          onChange={handleReadStatusChange}
          aria-label="Filter by read status"
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            minHeight: 40 }}
        >
          {readStatuses.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={handleSortByChange}
          aria-label="Sort notifications by"
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            minHeight: 40 }}
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
});

NotificationFilters.displayName = 'NotificationFilters';

export default NotificationFilters;

