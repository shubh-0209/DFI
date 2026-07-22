import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';

const VolunteerInfoCard = ({ volunteer }) => {
  if (!volunteer) return null;

  return (
    <div style={{ padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', marginBottom: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={18} color="#2563eb" /> Volunteer Information
      </h4>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
            {(volunteer.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{volunteer.name}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em', marginTop: '0.125rem' }}>{volunteer.role?.replace(/_/g, ' ') || 'Volunteer'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
          {volunteer.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
              <Mail size={16} color="#94a3b8" /> {volunteer.email}
            </div>
          )}
          {volunteer.createdAt && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
              <Calendar size={16} color="#94a3b8" /> Joined {new Date(volunteer.createdAt).toLocaleDateString('en-IN')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerInfoCard;
