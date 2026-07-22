import SimpleLoader from '../common/SimpleLoader';
import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const DraftSaveButton = ({ onClick, loading = false, disabled = false }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="btn btn-secondary"
      style={{
        padding: '0.75rem 1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: (disabled || loading) ? 0.6 : 1,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer' }}
    >
      {loading ? (
        <SimpleLoader />
      ) : (
        <Save size={16} />
      )}
      {loading ? 'Saving...' : 'Save Draft'}
    </motion.button>
  );
};

export default DraftSaveButton;
