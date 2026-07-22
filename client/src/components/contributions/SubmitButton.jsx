import SimpleLoader from '../common/SimpleLoader';
import React from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';

const SubmitButton = ({ onClick, loading = false, disabled = false, isValid = true }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading || !isValid}
      whileHover={{ scale: disabled || !isValid ? 1 : 1.02 }}
      whileTap={{ scale: disabled || !isValid ? 1 : 0.98 }}
      className="btn btn-primary"
      style={{
        padding: '0.875rem 2rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: (disabled || loading || !isValid) ? 0.6 : 1,
        cursor: (disabled || loading || !isValid) ? 'not-allowed' : 'pointer' }}
    >
      {loading ? (
        <SimpleLoader />
      ) : (
        <Send size={18} />
      )}
      {loading ? 'Submitting...' : 'Submit Contribution'}
      {!isValid && !loading && (
        <AlertCircle size={16} style={{ marginLeft: '0.25rem' }} />
      )}
    </motion.button>
  );
};

export default SubmitButton;
