import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnnouncementPagination = ({ currentPage, totalPages, totalItems, itemsPerPage = 9, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Announcement pagination"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '0.5rem 0' }}
    >
      <div style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        Showing <strong style={{ color: 'var(--color-heading)' }}>{startItem}</strong> to <strong style={{ color: 'var(--color-heading)' }}>{endItem}</strong> of <strong style={{ color: 'var(--color-heading)' }}>{totalItems}</strong> results
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{
            padding: '0.5rem 0.625rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: currentPage === 1 ? 'var(--color-border)' : 'var(--color-heading)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)' }}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </motion.button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{ padding: '0.5rem 0.25rem', color: 'var(--color-body)' }}>…</span>
            ) : (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                style={{
                  minWidth: 34,
                  height: 34,
                  padding: '0 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: page === currentPage ? 'var(--color-primary)' : 'var(--color-card)',
                  border: `1px solid ${page === currentPage ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: page === currentPage ? '#fff' : 'var(--color-heading)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' }}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          style={{
            padding: '0.5rem 0.625rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: currentPage === totalPages ? 'var(--color-border)' : 'var(--color-heading)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)' }}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default AnnouncementPagination;
