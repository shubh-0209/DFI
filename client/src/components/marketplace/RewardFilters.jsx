import React, { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const RewardFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onInStockChange,
  coinRange,
  onCoinRangeChange,
}) => {
  const [showSort, setShowSort] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const sortRef = React.useRef(null);
  const coinRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
      if (coinRef.current && !coinRef.current.contains(e.target)) setShowCoin(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowSort(false);
        setShowCoin(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'lowest', label: 'Lowest Coins' },
    { value: 'highest', label: 'Highest Coins' },
  ];

  const coinOptions = [
    { value: 'all', label: 'All Coins' },
    { value: '0-500', label: '0 - 500' },
    { value: '500-1000', label: '500 - 1,000' },
    { value: '1000-5000', label: '1,000 - 5,000' },
    { value: '5000+', label: '5,000+' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center'
      }}
    >
      <div ref={sortRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowSort(!showSort); setShowCoin(false); }}
          aria-expanded={showSort}
          aria-label="Sort rewards"
          aria-haspopup="listbox"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          <SlidersHorizontal size={16} />
          Sort
          <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showSort ? 'rotate(180deg)' : 'none' }} />
        </button>
        {showSort && (
          <div
            role="listbox"
            aria-label="Sort options"
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50,
              minWidth: '180px',
              overflow: 'hidden'
            }}
          >
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                role="option"
                aria-selected={sortBy === opt.value}
                onClick={() => {
                  onSortChange(opt.value);
                  setShowSort(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.625rem 1rem',
                  border: 'none',
                  background: sortBy === opt.value ? 'rgba(37,99,235,0.06)' : 'transparent',
                  color: sortBy === opt.value ? 'var(--color-primary)' : 'var(--color-heading)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-fast)'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={coinRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowCoin(!showCoin); setShowSort(false); }}
          aria-expanded={showCoin}
          aria-label="Filter by coins"
          aria-haspopup="listbox"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Coins
          <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showCoin ? 'rotate(180deg)' : 'none' }} />
        </button>
        {showCoin && (
          <div
            role="listbox"
            aria-label="Coin range options"
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50,
              minWidth: '180px',
              overflow: 'hidden'
            }}
          >
            {coinOptions.map((opt) => (
              <button
                key={opt.value}
                role="option"
                aria-selected={coinRange === opt.value}
                onClick={() => {
                  onCoinRangeChange(opt.value);
                  setShowCoin(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.625rem 1rem',
                  border: 'none',
                  background: coinRange === opt.value ? 'rgba(37,99,235,0.06)' : 'transparent',
                  color: coinRange === opt.value ? 'var(--color-primary)' : 'var(--color-heading)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-fast)'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          color: 'var(--color-heading)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'var(--transition-fast)'
        }}
      >
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockChange(e.target.checked)}
          style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
        />
        In Stock Only
      </label>
    </div>
  );
};

export default RewardFilters;
