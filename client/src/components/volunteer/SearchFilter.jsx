import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchFilter = ({ 
  searchValue, 
  onSearchChange, 
  filters = [], 
  activeFilters = {}, 
  onFilterChange, 
  onClearFilters, 
  placeholder = 'Search...' 
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(val => val !== '' && val !== 'all');

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {/* Search Bar & Mobile Toggle */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ 
            position: 'relative', flex: 1, display: 'flex', alignItems: 'center' 
          }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--color-body)' }} />
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="form-control"
              style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--color-card)' }}
            />
            {searchValue && (
              <button 
                onClick={() => onSearchChange('')}
                style={{ position: 'absolute', right: '1rem', color: 'var(--color-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <button 
            className="btn btn-secondary"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{ display: 'flex', padding: '0.75rem', gap: '0.5rem', alignItems: 'center' }}
          >
            <Filter size={18} />
            <span className="mobile-hidden">Filters</span>
            {hasActiveFilters && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
            )}
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {(showMobileFilters || window.innerWidth > 768) && filters.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', overflow: 'hidden' }}
            >
              {filters.map((filter) => (
                <div key={filter.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {filter.label && <span style={{ color: 'var(--color-body)' }}>{filter.label}:</span>}
                  
                  {filter.type === 'tabs' ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {filter.options.map(opt => {
                        const isActive = activeFilters[filter.key] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => onFilterChange(filter.key, opt.value)}
                            style={{
                              padding: '0.4rem 1rem',
                              borderRadius: '99px',
                              color: isActive ? 'var(--color-primary)' : 'var(--color-body)',
                              backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'var(--color-card)',
                              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                      style={{ padding: '0.4rem 2rem 0.4rem 1rem', width: 'auto', minWidth: '150px' }}
                    >
                      {filter.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              
              {hasActiveFilters && (
                <button 
                  onClick={onClearFilters}
                  style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem' }}
                >
                  <X size={14} /> Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-hidden { display: inline-block; }
          /* Hide filter toggle on desktop */
          .btn-secondary:has(.mobile-hidden) { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-hidden { display: none; }
        }
      `}</style>
    </div>
  );
};

export default SearchFilter;
