import SimpleLoader from '../components/common/SimpleLoader';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Phone } from 'lucide-react';

/**
 * Read‑only view of the user's full profile.
 */
const ProfileView = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        if (res.success) {
          setProfile(res.data);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        setError(err.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <SimpleLoader />;
  }

  if (error) {
    return <div className="text-error py-5">{error}</div>;
  }

  if (!profile) return null;

  const formatArray = (arr) => (Array.isArray(arr) ? arr.join(', ') : arr);

  return (
    <div className="max-w-3xl mx-auto p-4" style={{ animation: 'fadeIn 0.5s' }}>
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="grid gap-4">
        <div><strong>Phone:</strong> {profile.phone}</div>
        <div><strong>College:</strong> {profile.college}</div>
        <div><strong>Course:</strong> {profile.course}</div>
        <div><strong>Graduation Year:</strong> {profile.graduationYear}</div>
        <div><strong>City:</strong> {profile.city}</div>
        <div><strong>State:</strong> {profile.state}</div>
        <div><strong>Skills:</strong> {formatArray(profile.skills)}</div>
        <div><strong>Languages:</strong> {formatArray(profile.languages)}</div>
        <div><strong>Interests:</strong> {formatArray(profile.interests)}</div>
        <div><strong>Availability:</strong> {profile.availability}</div>
        <div><strong>LinkedIn:</strong> {profile.linkedin}</div>
        <div><strong>Portfolio:</strong> {profile.portfolio}</div>
        <div><strong>Volunteer Info:</strong> {profile.volunteerInfo}</div>
      </div>
    </div>
  );
};

export default ProfileView;
