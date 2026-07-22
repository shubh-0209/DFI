import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Key, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

// Reusable toggle switch component
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: '24px',
      width: '44px',
      flexShrink: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: '9999px',
      border: '2px solid transparent',
      transition: 'background-color 200ms ease-in-out',
      backgroundColor: checked ? 'var(--color-primary)' : '#E5E7EB',
      outline: 'none',
      opacity: disabled ? 0.6 : 1
    }}
  >
    <span
      style={{
        pointerEvents: 'none',
        display: 'inline-block',
        height: '20px',
        width: '20px',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
        borderRadius: '9999px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 200ms ease-in-out'
      }}
    />
  </button>
);

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      dashboardNotifs: user?.notificationPreferences?.platformNotifications ?? true
    }
  });

  const dashboardNotifs = watch('dashboardNotifs');
  const newPassword = watch('newPassword');
  const currentPassword = watch('currentPassword');

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      let requiresRefresh = false;

      // 1. Process Password Update if fields are filled
      if (data.newPassword) {
        if (!data.currentPassword) {
          throw new Error('Current password is required to change password.');
        }
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: data.currentPassword,
        });

        if (signInError) {
          throw new Error('Current password is incorrect');
        }

        const { error: updateError } = await supabase.auth.updateUser({
          password: data.newPassword
        });

        if (updateError) throw updateError;
        toast.success('Password updated successfully');
        
        // Clear password fields after success
        setValue('currentPassword', '');
        setValue('newPassword', '');
        setValue('confirmPassword', '');
      }

      // 2. Process Notifications Update
      const profilePayload = {
        notificationPreferences: {
          ...user?.notificationPreferences,
          platformNotifications: data.dashboardNotifs
        }
      };

      await api.put('/users/me', profilePayload);
      requiresRefresh = true;

      if (requiresRefresh) {
        await refreshUser();
        toast.success('Settings saved successfully');
        
        // Reset form dirty state with new values
        reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          dashboardNotifs: data.dashboardNotifs
        });
      }

    } catch (error) {
      toast.error(error.message || error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          padding: 0.5rem 0 3rem;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .profile-header-container {
          margin-bottom: 2rem;
        }
        .profile-header-flex {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 800px;
          width: 100%;
        }
        .profile-card {
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
          border-color: var(--color-border);
          width: 100%;
          overflow: hidden;
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .profile-card-title {
          font-size: var(--text-xl);
          margin: 0;
          font-weight: 700;
          color: var(--color-heading);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .profile-pwd-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 400px;
          width: 100%;
        }
        .profile-notif-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .profile-notif-text {
          flex: 1;
          min-width: 0;
        }
        .profile-notif-title {
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--color-heading);
          margin: 0;
          word-break: break-word;
        }
        .profile-notif-desc {
          font-size: var(--text-base);
          color: var(--color-body);
          margin: 0.35rem 0 0 0;
          max-width: 32rem;
          word-break: break-word;
        }
        .profile-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
          padding-top: 1rem;
        }

        /* MOBILE RESPONSIVE OVERRIDES */
        @media (max-width: 767px) {
          .profile-wrapper {
            padding: 0.5rem 1rem 2rem;
          }
          .page-title {
            font-size: clamp(1.65rem, 4vw, 2.4rem) !important;
          }
          .page-description {
            font-size: 0.75rem !important;
          }
          .profile-form {
            gap: 1.25rem;
          }
          .profile-card {
            padding: 1.25rem !important;
          }
          .profile-card-title {
            font-size: 0.95rem !important;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
          }
          .form-label {
            font-size: 0.65rem !important;
          }
          .form-control {
            font-size: 0.75rem !important;
            padding: 0.6rem 0.8rem;
          }
          .profile-pwd-container {
            max-width: 100%;
          }
          .profile-notif-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .profile-notif-title {
            font-size: 0.75rem !important;
          }
          .profile-notif-desc {
            font-size: 0.75rem !important;
          }
          .profile-actions {
            flex-direction: column;
            width: 100%;
          }
          .profile-actions button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="profile-header-container">
        <div className="profile-header-flex">
          <div style={{ width: '100%' }}>
            <h1 className="page-title" style={{ color: 'var(--color-heading)', margin: 0, wordBreak: 'break-word' }}>
              Settings
            </h1>
            <p className="page-description" style={{ color: 'var(--color-body)', margin: '0.3rem 0 0', wordBreak: 'break-word' }}>
              Manage your account preferences and security.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        
        {/* 1. Account Security Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            Account Security
          </h2>
          
          <div className="profile-pwd-container">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  {...register('currentPassword', { 
                    required: newPassword ? 'Current password is required to set a new password' : false 
                  })}
                  className="form-control"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                />
                <Key size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
              </div>
              {errors.currentPassword && <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '0.25rem', display: 'block' }}>{errors.currentPassword.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  {...register('newPassword', {
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    required: currentPassword ? 'New password is required if changing password' : false
                  })}
                  className="form-control"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                />
                <Key size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
              </div>
              {errors.newPassword && <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '0.25rem', display: 'block' }}>{errors.newPassword.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    validate: value => {
                      if (newPassword && value !== newPassword) return 'Passwords do not match';
                      if (newPassword && !value) return 'Please confirm your new password';
                      return true;
                    }
                  })}
                  className="form-control"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                />
                <Key size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
              </div>
              {errors.confirmPassword && <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '0.25rem', display: 'block' }}>{errors.confirmPassword.message}</span>}
            </div>
          </div>
        </div>

        {/* 2. Notifications Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            Notifications
          </h2>
          
          <div className="profile-notif-container">
            <div className="profile-notif-text">
              <h4 className="profile-notif-title">
                Receive dashboard notifications
              </h4>
              <p className="profile-notif-desc">
                Show a badge on the bell icon when you have new messages, announcements, or updates.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Toggle 
                checked={dashboardNotifs} 
                onChange={(val) => setValue('dashboardNotifs', val, { shouldDirty: true })} 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="btn btn-primary"
            style={{ opacity: (!isDirty || isSaving) ? 0.6 : 1, cursor: (!isDirty || isSaving) ? 'not-allowed' : 'pointer' }}
          >
            {isSaving ? <SimpleLoader /> : <Save size={18} />}
            Save Changes
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="btn btn-secondary"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-heading)' }}
          >
            <X size={18} />
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default Settings;
