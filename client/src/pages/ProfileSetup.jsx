import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, CheckCircle } from 'lucide-react';
import api from '../services/api';
import LanguagesInput from '../components/profile/LanguagesInput';
import InterestsInput from '../components/profile/InterestsInput';
import AvailabilitySelect from '../components/profile/AvailabilitySelect';
import SocialLinks from '../components/profile/SocialLinks';
import VolunteerInfo from '../components/profile/VolunteerInfo';

const ProfileSetup = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    college: user?.college || '',
    course: user?.course || '',
    graduationYear: user?.graduationYear || '',
    city: user?.city || '',
    state: user?.state || '',
    skills: user?.skills?.join(', ') || '',
    languages: user?.languages?.join(', ') || '',
    interests: user?.interests?.join(', ') || '',
    availability: user?.availability || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    volunteerInfo: user?.volunteerInfo || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format skills back into an array
    const formattedData = {
      ...formData,
      graduationYear: Number(formData.graduationYear) || undefined,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      languages: formData.languages ? formData.languages.split(',').map(s => s.trim()) : [],
      interests: formData.interests ? formData.interests.split(',').map(s => s.trim()) : [],
      availability: formData.availability || undefined,
      linkedin: formData.linkedin || undefined,
      portfolio: formData.portfolio || undefined,
      volunteerInfo: formData.volunteerInfo || undefined,
    };

    try {
      // Put to /users/me backend endpoint
      const res = await api.put('/users/me', formattedData);
      if (res.success) {
        setSuccess(true);
        await refreshUser(); // Update state context
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }} className="animate-slide-up">
      <div className="card" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Complete Your Profile</h2>
        <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
          Please fill in the details below to complete your volunteer registration and unlock all opportunities.
        </p>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> Profile updated successfully! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                className="form-control"
                placeholder="+919999999999"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="graduationYear">Graduation Year</label>
              <input
                id="graduationYear"
                type="number"
                className="form-control"
                placeholder="2027"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="college">College Name</label>
            <input
              id="college"
              type="text"
              className="form-control"
              placeholder="Delhi University, IIT, atc."
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="course">Course Name</label>
            <input
              id="course"
              type="text"
              className="form-control"
              placeholder="B.Tech Computer Science, B.Sc, etc."
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                className="form-control"
                placeholder="New Delhi"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                className="form-control"
                placeholder="Delhi"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">Skills (comma separated)</label>
            <input
              id="skills"
              type="text"
              className="form-control"
              placeholder="Teaching, Public Speaking, Content Writing"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>
          <LanguagesInput id="languages" value={formData.languages} onChange={(val) => setFormData(prev => ({ ...prev, languages: val }))} />
          <InterestsInput id="interests" value={formData.interests} onChange={(val) => setFormData(prev => ({ ...prev, interests: val }))} />
          <AvailabilitySelect id="availability" value={formData.availability} onChange={(val) => setFormData(prev => ({ ...prev, availability: val }))} />
          <SocialLinks
            linkedin={formData.linkedin}
            portfolio={formData.portfolio}
            onLinkedInChange={(val) => setFormData(prev => ({ ...prev, linkedin: val }))}
            onPortfolioChange={(val) => setFormData(prev => ({ ...prev, portfolio: val }))}
          />
          <VolunteerInfo value={formData.volunteerInfo} onChange={(val) => setFormData(prev => ({ ...prev, volunteerInfo: val }))} />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Saving Profile...' : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
