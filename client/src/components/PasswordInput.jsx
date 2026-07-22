import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordInput – reusable password field with visibility toggle.
 * Props are passed directly to the underlying <input> element.
 */
const PasswordInput = ({ showToggle = true, ...props }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible((v) => !v);

  return (
    <div style={{ position: 'relative' }}>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className="form-control"
        style={{ paddingRight: showToggle ? '2.5rem' : undefined }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-body)' }}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
