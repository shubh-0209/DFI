import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import BackToWebsite from '../components/BackToWebsite';
import AuthLeftColumn from '../components/AuthLeftColumn';
import BrandLogo from '../components/BrandLogo';
import '../layouts/AuthLayout.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '', // added for backend compatibility
    role: 'volunteer', // Default to volunteer
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      await register(formData);
      // After registration, redirect to login page with a success message
      navigate('/login?registered=true');
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <BackToWebsite />

      <AuthLeftColumn />

      {/* Right Column: Auth Form */}
      <div className="auth-right-section animate-slide-up py-8">
        <div style={{ maxWidth: '440px', width: '100%' }}>

          <div className="card auth-form-container" style={{
            boxShadow: '0 8px 32px rgba(11, 59, 145, 0.04)',
            borderRadius: '24px',
            border: '1px solid #D9E6F5',
            padding: '1.5rem 2rem',
            backgroundColor: '#FFFFFF'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <BrandLogo className="mobile-auth-logo" />
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#24344D', marginBottom: '0.25rem' }}>Create Your Account</h2>
              <p className="text-[13px]" style={{ color: '#64748B' }}>Join thousands of students creating a better future</p>
            </div>

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
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label text-[13px] font-medium" htmlFor="name" >Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                    <User size={16} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    className="form-control text-[13px]"
                    placeholder="John Doe"
                    style={{ paddingLeft: '44px', height: '44px', borderRadius: '10px', border: '1px solid #D9E6F5', width: '100%', boxSizing: 'border-box' }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label text-[13px] font-medium" htmlFor="username" >Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
                    <UserCheck size={16} />
                  </span>
                  <input
                    id="username"
                    type="text"
                    className="form-control text-[13px]"
                    placeholder="johndoe12"
                    style={{ paddingLeft: '44px', height: '44px', borderRadius: '10px', border: '1px solid #D9E6F5', width: '100%', boxSizing: 'border-box' }}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label text-[13px] font-medium" htmlFor="email" >Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="form-control text-[13px]"
                    placeholder="john@example.com"
                    style={{ paddingLeft: '44px', height: '44px', borderRadius: '10px', border: '1px solid #D9E6F5', width: '100%', boxSizing: 'border-box' }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label text-[13px] font-medium" htmlFor="password" >Password (min 8 characters)</label>
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
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
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
                {isSubmitting ? 'Registering...' : 'Register'} <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-[13px]" style={{ marginTop: '1.25rem', textAlign: 'center', color: '#64748B' }}>
              Already have an account? <Link to="/login" className="font-medium" style={{ color: '#0B3B91', textDecoration: 'none' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
