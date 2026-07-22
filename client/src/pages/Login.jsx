import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import DashboardLoader from '../components/common/DashboardLoader';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import BackToWebsite from '../components/BackToWebsite';
import AuthLeftColumn from '../components/AuthLeftColumn';
import BrandLogo from '../components/BrandLogo';
import '../layouts/AuthLayout.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading && !isSubmitting) {
      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'];
      if (adminRoles.includes(user?.role?.toUpperCase())) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate, isSubmitting]);

  // Show a message if session expired or Google Auth failed
  const expired = searchParams.get('expired');
  const errorParam = searchParams.get('error');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      const { user: loggedInUser } = await login(email, password);
      
      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'];
      if (adminRoles.includes(loggedInUser?.role?.toUpperCase())) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setLocalError(err.message || 'Login failed. Check your credentials.');
      setIsSubmitting(false); // Only stop submitting if error occurs
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { supabase } = await import('../services/supabaseClient');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setLocalError(err.message || 'Google authentication failed.');
    }
  };

  if (loading || isSubmitting) {
    return <DashboardLoader />;
  }

  return (
    <div className="auth-page">
      <BackToWebsite />

      <AuthLeftColumn />

      {/* Right Column: Auth Form */}
      <div className="auth-right-section animate-slide-up">
        <div style={{ maxWidth: '440px', width: '100%' }}>

          <div className="card auth-form-container" style={{
            boxShadow: '0 8px 32px rgba(11, 59, 145, 0.04)',
            borderRadius: '24px',
            border: '1px solid #D9E6F5',
            padding: '2rem',
            backgroundColor: '#FFFFFF'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <BrandLogo className="mobile-auth-logo" />
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#24344D', marginBottom: '0.5rem' }}>Welcome Back</h2>
              <p className="text-[13px]" style={{ color: '#64748B' }}>Continue your journey with Disha For India</p>
            </div>

            {expired && (
              <div style={{
                display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)',
                borderRadius: '12px', marginBottom: '1.25rem' }}>
                <AlertCircle size={15} />
                <span className="text-[13px]">Session expired. Please log in again.</span>
              </div>
            )}

            {errorParam && (
              <div style={{
                display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)',
                borderRadius: '12px', marginBottom: '1.25rem' }}>
                <AlertCircle size={15} />
                <span className="text-[13px]">Authentication failed. Please try again.</span>
              </div>
            )}

            {localError && (
              <div style={{
                display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)',
                borderRadius: '12px', marginBottom: '1.25rem' }}>
                <AlertCircle size={15} />
                <span className="text-[13px]">{localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label text-[13px] font-medium" htmlFor="email" >Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="form-control text-[13px]"
                    placeholder="name@email.com"
                    style={{ paddingLeft: '44px', height: '44px', borderRadius: '10px', border: '1px solid #D9E6F5', width: '100%', boxSizing: 'border-box' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label text-[13px] font-medium" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                  <a href="#" className="text-[13px] font-medium" style={{ color: '#0B3B91', textDecoration: 'none' }}>Forgot Password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
                    <Lock size={16} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    className="form-control text-[13px]"
                    placeholder="••••••••"
                    style={{ paddingLeft: '44px', height: '44px', borderRadius: '10px', border: '1px solid #D9E6F5', width: '100%', boxSizing: 'border-box' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="text-[14px] font-medium"
                style={{ width: '100%', height: '44px', borderRadius: '10px', gap: '0.75rem', backgroundColor: '#0B3B91', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                disabled={isSubmitting}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#124AA0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0B3B91'}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#D9E6F5' }}></div>
              <span className="text-[13px]" style={{ color: '#64748B' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#D9E6F5' }}></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="text-[14px] font-medium"
              style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderRadius: '10px', border: '1px solid #D9E6F5', color: '#24344D', backgroundColor: 'white', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F9FF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <p className="text-[13px]" style={{ marginTop: '1.25rem', textAlign: 'center', color: '#64748B' }}>
              Don't have an account? <Link to="/register" className="font-medium" style={{ color: '#0B3B91', textDecoration: 'none' }}>Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
