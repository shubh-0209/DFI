/**
 * Programs.jsx  —  Volunteer Opportunities Page
 *
 * Data flow:
 *  • React Query fetches `GET /programs` (backend auto-filters to status=published
 *    for non-admin roles, so volunteers only ever see published programs).
 *  • staleTime: 60 s — fresh data on every visit without hammering the API.
 *  • refetchOnWindowFocus: true — snaps back to current data when volunteer
 *    switches tabs and returns.
 *  • Socket events keep the cache in sync without a full re-fetch:
 *      program-published  → insert into cache (if not already there)
 *      program-updated    → patch the matching entry in cache
 *      program-deleted    → remove from cache
 *      program-archived   → remove from cache (no longer visible to volunteers)
 *      program-status-updated → patch or remove depending on new status
 *      reconnect          → invalidate query (refetch from server)
 *
 * Filtering is 100 % client-side so it's instant with no extra round trips.
 */

import React, { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Search, MapPin, Calendar, Users, Filter,
  BookOpen, Leaf, Heart, Globe, Shield, Zap, Grid3X3, Coins,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SimpleLoader from '../components/common/SimpleLoader';
import { getPrograms } from '../services/programsService';
import useSocket from '../hooks/useSocket';

/* ─── config ──────────────────────────────────────────────────────────────── */

const CATEGORY_META = {
  Education: { icon: BookOpen, color: '#3b82f6' },
  Environment: { icon: Leaf, color: '#22c55e' },
  Health: { icon: Heart, color: '#ef4444' },
  Community: { icon: Users, color: '#a855f7' },
  'Animal Welfare': { icon: Shield, color: '#f59e0b' },
  'Disaster Relief': { icon: Zap, color: 'var(--primary-blue)' },
  Other: { icon: Globe, color: '#6b7280' },
};

const STATUS_LABEL = {
  published: { label: 'Open', color: '#22c55e' },
  registration_closed: { label: 'Reg. Closed', color: 'var(--primary-blue)' },
  ongoing: { label: 'Ongoing', color: '#3b82f6' },
};

// Statuses that should be visible to volunteers
const VOLUNTEER_VISIBLE = new Set(['published', 'registration_closed', 'ongoing']);

/* ─── program card ────────────────────────────────────────────────────────── */

const ProgramCard = ({ program }) => {
  const { title, shortDescription, description, category, city, state,
    mode, startDate, endDate, maxVolunteers, status, _id } = program;

  const location = [city, state].filter(Boolean).join(', ');
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const IconComp = meta.icon;
  const statusInfo = STATUS_LABEL[status] || { label: status, color: '#6b7280' };
  const displayDesc = shortDescription || description || 'No description available.';

  return (
    <div
      className="card"
      style={{
        display: 'flex', flexDirection: 'column', gap: 0,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        overflow: 'hidden', padding: 0 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ height: '4px', backgroundColor: meta.color, width: '100%' }} />

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.3rem 0.75rem', borderRadius: '999px',
            backgroundColor: `${meta.color}18`, color: meta.color }}>
            <IconComp size={13} />
            {category || 'General'}
          </span>
          <span style={{ padding: '0.25rem 0.6rem',
            borderRadius: '999px', backgroundColor: `${statusInfo.color}18`, color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--color-body)', textTransform: 'capitalize' }}>
            {mode} program
          </span>
        </div>

        <h4 style={{ margin: 0, color: 'var(--color-heading)' }}>
          {title || 'Untitled Program'}
        </h4>

        <p style={{ color: 'var(--color-body)', margin: 0, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {displayDesc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          {program.rewardCoins > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309' }}>
              <Coins size={13} style={{ color: '#D97706' }} /> Earn +{program.rewardCoins} Disha Coins
            </span>
          )}
          {location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
              <MapPin size={13} /> {location}
            </span>
          )}
          {startDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
              <Calendar size={13} />
              Starts {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {endDate && ` · Ends ${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </span>
          )}
          {maxVolunteers && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
              <Users size={13} /> Up to {maxVolunteers.toLocaleString()} volunteers
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <Link
          to={`/programs/${_id}`}
          className="btn btn-primary"
          style={{ width: '100%', textAlign: 'center', display: 'block' }}
        >
          View & Apply
        </Link>
      </div>
    </div>
  );
};

/* ─── skeleton cards ──────────────────────────────────────────────────────── */

const SkeletonCard = () => (
  <div className="card" style={{ height: '320px', overflow: 'hidden', padding: 0 }}>
    <div className="skeleton" style={{ height: '4px', width: '100%' }} />
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div className="skeleton" style={{ height: 28, width: '40%', borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 20, width: '25%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 24, width: '80%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
    </div>
  </div>
);

/* ─── main component ──────────────────────────────────────────────────────── */

const Programs = () => {
  const queryClient = useQueryClient();
  const { on, isConnected } = useSocket();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('all');

  /* ── data fetch via React Query ───────────────────────────────── */

  const { data, isLoading } = useQuery({
    queryKey: ['volunteer-programs'],
    queryFn: async () => {
      const res = await getPrograms();
      // Backend already filters to status=published for volunteers;
      // apply an extra client-side guard just in case.
      return (res.programs || []).filter((p) => VOLUNTEER_VISIBLE.has(p.status));
    },
    staleTime: 5 * 60 * 1000,       // re-use cached data for 5 mins
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Don't refetch on tab switch to feel faster
  });

  const programs = data || [];

  /* ── socket: precise cache updates (no extra HTTP round-trip) ─── */

  useEffect(() => {
    // A new program was published — insert into list if not already there
    const unsubPublished = on('program-published', ({ program }) => {
      if (!program || !VOLUNTEER_VISIBLE.has(program.status)) return;
      queryClient.setQueryData(['volunteer-programs'], (old = []) => {
        if (old.some((p) => p._id === program._id)) {
          return old.map((p) => (p._id === program._id ? program : p));
        }
        return [program, ...old];
      });
    });

    // A program was updated — patch in place
    const unsubUpdated = on('program-updated', ({ program }) => {
      if (!program) return;
      queryClient.setQueryData(['volunteer-programs'], (old = []) => {
        if (!VOLUNTEER_VISIBLE.has(program.status)) {
          // Programme dropped out of volunteer-visible statuses → remove it
          return old.filter((p) => p._id !== program._id);
        }
        if (old.some((p) => p._id === program._id)) {
          return old.map((p) => (p._id === program._id ? program : p));
        }
        return [program, ...old]; // newly visible
      });
    });

    // A program was hard-deleted — remove from list
    const unsubDeleted = on('program-deleted', ({ programId }) => {
      if (!programId) return;
      queryClient.setQueryData(['volunteer-programs'], (old = []) =>
        old.filter((p) => p._id !== programId && p.programId !== programId)
      );
    });

    // A program was archived — remove from volunteer list
    const unsubArchived = on('program-archived', ({ program }) => {
      if (!program) return;
      queryClient.setQueryData(['volunteer-programs'], (old = []) =>
        old.filter((p) => p._id !== program._id)
      );
    });

    // Status changed — patch or remove
    const unsubStatus = on('program-status-updated', ({ program }) => {
      if (!program) return;
      queryClient.setQueryData(['volunteer-programs'], (old = []) => {
        if (!VOLUNTEER_VISIBLE.has(program.status)) {
          return old.filter((p) => p._id !== program._id);
        }
        if (old.some((p) => p._id === program._id)) {
          return old.map((p) => (p._id === program._id ? program : p));
        }
        return old;
      });
    });

    // Socket reconnected — do a full refetch to catch anything missed
    const unsubReconnect = on('reconnect', () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-programs'] });
    });

    return () => {
      unsubPublished();
      unsubUpdated();
      unsubDeleted();
      unsubArchived();
      unsubStatus();
      unsubReconnect();
    };
  }, [on, queryClient]);

  /* ── client-side filtering ────────────────────────────────────── */

  const categories = useMemo(() => ['All', ...Object.keys(CATEGORY_META)], []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return programs.filter((p) => {
      const matchSearch = !q
        || p.title?.toLowerCase().includes(q)
        || p.description?.toLowerCase().includes(q)
        || p.category?.toLowerCase().includes(q)
        || p.city?.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchMode = selectedMode === 'all' || p.mode === selectedMode;
      return matchSearch && matchCat && matchMode;
    });
  }, [programs, search, selectedCategory, selectedMode]);

  if (isLoading) {
    return <SimpleLoader />;
  }

  /* ── render ───────────────────────────────────────────────────── */

  return (
    <div style={{ padding: '0.5rem 0 3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
          Browse Opportunities
        </h1>
        <p className="page-description" style={{ color: 'var(--color-body)' }}>
          Discover social campaigns, teaching initiatives, and ecological programs you can join.
          {isConnected && (
            <span style={{ color: '#22c55e', marginLeft: '0.5rem' }}>● Live</span>
          )}
        </p>
      </div>

      {/* Search + mode filter */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
        padding: '1.25rem', backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
          <input
            type="text"
            placeholder="Search programs, cities, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} style={{ color: 'var(--color-body)' }} />
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="form-control"
            style={{ minWidth: '140px' }}
          >
            <option value="all">All Modes</option>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '999px',
                cursor: 'pointer', border: 'none', transition: 'all 0.15s ease',
                backgroundColor: isActive ? (meta?.color || 'var(--color-primary)') : 'var(--color-card)',
                color: isActive ? '#fff' : 'var(--color-body)',
                boxShadow: isActive ? `0 0 0 2px ${meta?.color || 'var(--color-primary)'}40` : 'none',
                borderWidth: '1px', borderStyle: 'solid',
                borderColor: isActive ? 'transparent' : 'var(--color-border)' }}
            >
              {cat === 'All' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Grid3X3 size={13} /> All
                </span>
              ) : cat}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      {!isLoading && (
        <p style={{ color: 'var(--color-body)', marginBottom: '1.25rem' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{programs.length}</strong> programs
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>No programs found</h3>
          <p style={{ color: 'var(--color-body)' }}>
            {programs.length === 0
              ? 'No programs are currently published. Check back soon!'
              : 'Try adjusting your search or filters.'}
          </p>
          {(search || selectedCategory !== 'All' || selectedMode !== 'all') && (
            <button
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedMode('all'); }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((prog) => (
            <ProgramCard key={prog._id} program={prog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
