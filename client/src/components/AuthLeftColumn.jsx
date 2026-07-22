import React from 'react';
import { GraduationCap, Users, Target } from 'lucide-react';
import BrandLogo from './BrandLogo';

const AuthLeftColumn = () => {
  return (
    <div className="auth-left-section">
      <div style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <BrandLogo />
        </div>

        <h1 className="auth-title font-bold leading-tight" style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', marginBottom: '1rem', color: '#24344D' }}>
          Empowering India's Youth Through <span style={{ color: '#0B3B91' }}>Skills</span>, Education and <span style={{ color: '#0B3B91' }}>Opportunities</span>
        </h1>
        
        <p className="auth-subtitle" style={{ fontSize: 'clamp(13px, 1.5vw, 14px)', color: '#64748B', marginBottom: '2rem' }}>
          Building brighter futures through mentorship, learning programs, and meaningful opportunities.
        </p>

        <div className="auth-features-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(11, 59, 145, 0.05)', flexShrink: 0 }}>
              <GraduationCap size={20} color="#0B3B91" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#24344D', marginBottom: '0.15rem' }}>Student Growth Programs</h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Access learning opportunities, mentorship, and skill development programs.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(11, 59, 145, 0.05)', flexShrink: 0 }}>
              <Users size={20} color="#0B3B91" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#24344D', marginBottom: '0.15rem' }}>Community & Mentorship</h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Connect with mentors and a supportive learning community.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(11, 59, 145, 0.05)', flexShrink: 0 }}>
              <Target size={20} color="#0B3B91" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontSize: '15px', color: '#24344D', marginBottom: '0.15rem' }}>Career Opportunities</h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>Discover opportunities that help students build successful futures.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthLeftColumn;
