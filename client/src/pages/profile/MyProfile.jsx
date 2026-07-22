import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Save, X, User, Phone, MapPin, GraduationCap, Code, Globe, Trash2, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const MyProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // States
  const [isSaving, setIsSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      state: user?.state || '',
      college: user?.college || '',
      course: user?.course || '',
      graduationYear: user?.graduationYear || '',
      about: user?.about || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || ''),
      languages: Array.isArray(user?.languages) ? user.languages.join(', ') : (user?.languages || ''),
      interests: Array.isArray(user?.interests) ? user.interests.join(', ') : (user?.interests || ''),
      linkedin: user?.linkedin || '',
      portfolio: user?.portfolio || '',
    },
  });

  // Handlers
  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setPhotoUploading(true);
      const formData = new FormData();
      formData.append('profilePhoto', file);

      await api.patch('/users/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await refreshUser();
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setPhotoUploading(true);
      await api.put('/users/me', { profilePhoto: '' });
      await refreshUser();
      toast.success('Profile photo removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);

      const parseArrayField = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      };

      const profilePayload = {
        name: data.name,
        phone: data.phone,
        city: data.city,
        state: data.state,
        college: data.college,
        course: data.course,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : undefined,
        about: data.about,
        skills: parseArrayField(data.skills),
        languages: parseArrayField(data.languages),
        interests: parseArrayField(data.interests),
        linkedin: data.linkedin,
        portfolio: data.portfolio,
      };

      await api.put('/users/me', profilePayload);
      await refreshUser();
      toast.success('Profile updated successfully');

      reset({
        ...data,
      });
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || 'Failed to save profile');
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
          gap: 1rem;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          width: 100%;
        }
        .profile-card {
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          width: 100%;
          overflow: hidden;
          background: white;
          border-radius: var(--radius-lg);
        }
        .profile-card-title {
          font-size: var(--text-lg);
          margin: 0;
          font-weight: 700;
          color: var(--color-heading);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .profile-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }
        .profile-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.25rem;
        }
        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .profile-avatar-container {
          position: relative;
          flex-shrink: 0;
        }
        .profile-avatar-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background-color: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-3xl);
          font-weight: bold;
          box-shadow: var(--shadow-md);
        }
        .profile-avatar-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        }
        .profile-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
          padding-top: 1rem;
        }

        @media (max-width: 767px) {
          .profile-wrapper {
            padding: 0.5rem 1rem 2rem;
          }
          .profile-grid-2, .profile-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 1rem;
          }
          .profile-card {
            padding: 1.25rem !important;
          }
          .profile-avatar-row {
            flex-direction: column;
            align-items: flex-start;
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

      {/* Header */}
      <div className="profile-header-container">
        <div className="profile-header-flex">
          <div>
            <h1 className="page-title" style={{ color: 'var(--color-heading)', margin: 0 }}>
              My Profile
            </h1>
            <p className="page-description" style={{ color: 'var(--color-body)', margin: '0.3rem 0 0' }}>
              Manage your personal information, education, and volunteer credentials.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="profile-badge">
              <Award size={14} /> Role: {user?.role?.toUpperCase() || 'VOLUNTEER'}
            </span>
            {user?.volunteerId && (
              <span className="profile-badge" style={{ background: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' }}>
                <Sparkles size={14} /> ID: {user.volunteerId}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        {/* 1. Avatar & System Info Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            <User size={18} /> Profile Picture & Overview
          </h2>
          <div className="profile-avatar-row">
            <div className="profile-avatar-container">
              <div className="profile-avatar-circle">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="profile-avatar-actions">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', gap: '0.4rem' }}
                >
                  {photoUploading ? <SimpleLoader /> : <Camera size={16} />} Upload New Photo
                </button>

                {user?.profilePhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={photoUploading}
                    className="btn btn-secondary"
                    style={{ color: 'var(--color-error)', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.85rem', gap: '0.4rem' }}
                  >
                    <Trash2 size={16} /> Remove Photo
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-body)', marginTop: '0.5rem', margin: 0 }}>
                Allowed formats: PNG, JPG, or WebP. Maximum file size: 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Personal Information Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            <User size={18} /> Basic Details
          </h2>
          <div className="profile-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="form-control"
                placeholder="John Doe"
              />
              {errors.name && <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '0.25rem', display: 'block' }}>{errors.name.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                {...register('phone')}
                className="form-control"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <input
                value={user?.username || ''}
                disabled
                className="form-control"
                style={{ backgroundColor: '#F8FAFC', color: 'var(--color-body)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                value={user?.email || ''}
                disabled
                className="form-control"
                style={{ backgroundColor: '#F8FAFC', color: 'var(--color-body)', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
            <label className="form-label">About / Bio</label>
            <textarea
              {...register('about')}
              rows={3}
              className="form-control"
              placeholder="Tell us a little bit about yourself, your goals, and your passion for volunteering..."
              maxLength={500}
            />
          </div>
        </div>

        {/* 3. Location & Education Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            <GraduationCap size={18} /> Location & Education
          </h2>
          <div className="profile-grid-2" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City</label>
              <input
                {...register('city')}
                className="form-control"
                placeholder="New Delhi"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State</label>
              <input
                {...register('state')}
                className="form-control"
                placeholder="Delhi"
              />
            </div>
          </div>

          <div className="profile-grid-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">College / Institution</label>
              <input
                {...register('college')}
                className="form-control"
                placeholder="Delhi University, IIT, etc."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Course / Degree</label>
              <input
                {...register('course')}
                className="form-control"
                placeholder="B.Tech, B.Sc, BA, etc."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                {...register('graduationYear')}
                className="form-control"
                placeholder="2027"
              />
            </div>
          </div>
        </div>

        {/* 4. Skills, Languages & Socials */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            <Code size={18} /> Skills & Links
          </h2>
          <div className="profile-grid-2" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Skills (comma separated)</label>
              <input
                {...register('skills')}
                className="form-control"
                placeholder="Teaching, Public Speaking, Management"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Languages (comma separated)</label>
              <input
                {...register('languages')}
                className="form-control"
                placeholder="English, Hindi, Regional"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Interests (comma separated)</label>
            <input
              {...register('interests')}
              className="form-control"
              placeholder="Education, Healthcare, Environment, Youth"
            />
          </div>

          <div className="profile-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                {...register('linkedin')}
                className="form-control"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Portfolio / Website URL</label>
              <input
                {...register('portfolio')}
                className="form-control"
                placeholder="https://yourwebsite.com"
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
            style={{ opacity: !isDirty || isSaving ? 0.6 : 1, cursor: !isDirty || isSaving ? 'not-allowed' : 'pointer' }}
          >
            {isSaving ? <SimpleLoader /> : <Save size={18} />} Save Profile Changes
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="btn btn-secondary"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-heading)' }}
          >
            <X size={18} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
