import React from 'react';
import { Mail, Phone } from 'lucide-react';

const CoordinatorCard = ({ coordinator }) => {
  if (!coordinator) return null;

  const initials = coordinator.avatarInitials || 
    (coordinator.name ? coordinator.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'C');

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: 'var(--color-primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{coordinator.name}</h4>
          <span style={{ color: 'var(--color-body)' }}>Program Coordinator</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {coordinator.email && (
          <a href={`mailto:${coordinator.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-body)', textDecoration: 'none' }}>
            <div style={{ padding: '0.4rem', backgroundColor: 'var(--color-bg)', borderRadius: '50%', color: 'var(--color-primary)' }}>
              <Mail size={14} />
            </div>
            {coordinator.email}
          </a>
        )}
        {coordinator.phone && (
          <a href={`tel:${coordinator.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-body)', textDecoration: 'none' }}>
            <div style={{ padding: '0.4rem', backgroundColor: 'var(--color-bg)', borderRadius: '50%', color: 'var(--color-primary)' }}>
              <Phone size={14} />
            </div>
            {coordinator.phone}
          </a>
        )}
      </div>
    </div>
  );
};

export default CoordinatorCard;
