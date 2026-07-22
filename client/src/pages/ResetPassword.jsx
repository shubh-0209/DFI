import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import BackToWebsite from '../components/BackToWebsite';
import AuthLeftColumn from '../components/AuthLeftColumn';
import BrandLogo from '../components/BrandLogo';
import { supabase } from '../services/supabaseClient';
import '../layouts/AuthLayout.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if recovery event or session token is present
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // If there's no session or hash tokens, we still allow input, but log session state if needed
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccessMsg('Your password has been reset successfully!');
      setTimeout(() => {
        navigate('/login?reset=success', { replace: true });
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password. The reset link may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <BackToWebsite />
      <AuthLeftColumn />

      <div className="auth-right-section animate-slide-up">
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div
            className="card auth-form-container"
            style={{
              boxShadow: '0 8px 32px rgba(11, 59, 145, 0.04)',
              borderRadius: '24px',
              border: '1px solid #D9E6F5',
              padding: '2rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <BrandLogo className="mobile-auth-logo" />
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#24344D', marginBottom: '0.5rem' }}>
                Reset Password
              </h2>
              <p className="text-[13px]" style={{ color: '#64748B' }}>
                Please enter your new password below.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-error)',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={15} />
                <span className="text-[13px]">{errorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--color-secondary)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                }}
              >
                <CheckCircle size={32} />
                <span className="text-[14px] font-medium" style={{ textAlign: 'center' }}>
                  {successMsg}
                </span>
                <span className="text-[12px]" style={{ color: '#64748B' }}>
                  Redirecting to login...
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label text-[13px] font-medium" htmlFor="password">
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748B',
                      }}
                    >
                      <Lock size={16} />
                    </span>
                    <input
                      id="password"
                      type="password"
                      className="form-control text-[13px]"
                      placeholder="••••••••"
                      style={{
                        paddingLeft: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        border: '1px solid #D9E6F5',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label text-[13px] font-medium" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748B',
                      }}
                    >
                      <Lock size={16} />
                    </span>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control text-[13px]"
                      placeholder="••••••••"
                      style={{
                        paddingLeft: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        border: '1px solid #D9E6F5',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="text-[14px] font-medium"
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '10px',
                    gap: '0.75rem',
                    backgroundColor: '#0B3B91',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  disabled={isSubmitting}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#124AA0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0B3B91')}
                >
                  {isSubmitting ? 'Updating Password...' : 'Reset Password'} <ArrowRight size={16} />
                </button>

                <p className="text-[13px]" style={{ marginTop: '1.25rem', textAlign: 'center', color: '#64748B' }}>
                  Remembered your password?{' '}
                  <Link to="/login" className="font-medium" style={{ color: '#0B3B91', textDecoration: 'none' }}>
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
