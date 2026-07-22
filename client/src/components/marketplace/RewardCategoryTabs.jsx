import React from 'react';
import { useNavigate } from 'react-router-dom';

const RewardCategoryTabs = ({ categories, selected, onChange }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}
      role="tablist"
      aria-label="Reward categories"
    >
      {categories.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            aria-label={`${cat} category${isActive ? ', selected' : ''}`}
            onClick={() => onChange(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: isActive ? 'var(--color-primary)' : 'var(--color-card)',
              color: isActive ? 'white' : 'var(--color-body)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default RewardCategoryTabs;
