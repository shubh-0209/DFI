import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import BackToWebsite from '../components/BackToWebsite';
import AuthLeftColumn from '../components/AuthLeftColumn';
import BrandLogo from '../components/BrandLogo';
import api from '../services/api';
import { supabase } from '../services/supabaseClient';
import '../layouts/AuthLayout.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      // 1. Trigger backend API call (which uses Supabase resetPasswordForEmail)
      let sent = false;
      try {
        const res = await api.post('/auth/forgot-password', { email });
        if (res.success || res.message) {
          sent = true;
        }
      } catch (backendErr) {
        // Fallback directly to client Supabase SDK if API service is offline
        const redirectUrl = `${window.location.origin}/reset-password`;
        const { error: sbErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        if (sbErr) throw sbErr;
        sent = true;
      }

      if (sent) {
        setSuccessMsg('Password reset link sent! Please check your email inbox.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset email. Please try again.');
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
                Forgot Password?
              </h2>
              <p className="text-[13px]" style={{ color: '#64748B' }}>
                Enter your email address and we'll send you a link to reset your password.
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
              <div style={{ textAlign: 'center' }}>
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
                </div>
                <Link
                  to="/login"
                  className="text-[14px] font-medium"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#0B3B91',
                    textDecoration: 'none',
                  }}
                >
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label text-[13px] font-medium" htmlFor="email">
                    Email Address
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
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      className="form-control text-[13px]"
                      placeholder="name@email.com"
                      style={{
                        paddingLeft: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        border: '1px solid #D9E6F5',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  {isSubmitting ? 'Sending Link...' : 'Send Reset Link'} <ArrowRight size={16} />
                </button>

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <Link
                    to="/login"
                    className="text-[13px] font-medium"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#0B3B91',
                      textDecoration: 'none',
                    }}
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
