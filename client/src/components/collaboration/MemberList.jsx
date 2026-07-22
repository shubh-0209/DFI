import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, User, Users } from 'lucide-react';

const MemberList = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: 'var(--color-body)',
          background: 'var(--color-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed var(--color-border)' }}
      >
        <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} aria-hidden="true" />
        <p >No members yet</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Members will appear here once they join</p>
      </motion.div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown size={14} aria-hidden="true" />;
      case 'viewer': return <Shield size={14} aria-hidden="true" />;
      default: return <User size={14} aria-hidden="true" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-purple';
      case 'viewer': return 'badge-orange';
      default: return 'badge-blue';
    }
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      'var(--primary-blue)',
      'linear-gradient(135deg, #059669, #10B981)',
      'var(--primary-blue)',
      'linear-gradient(135deg, #D97706, #F59E0B)',
      'linear-gradient(135deg, #2563EB, #3B82F6)',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {members.map((member, idx) => {
        const memberId = member.userId?._id || member.userId;
        const initial = (member.userId?.name || 'U').charAt(0).toUpperCase();

        return (
          <motion.div
            key={memberId || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            className="card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'default' }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: getAvatarGradient(idx),
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: 'var(--color-heading)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis' }}>
                {member.userId?.name || 'Unknown User'}
              </div>
              <div style={{
                color: 'var(--color-body)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis' }}>
                {member.userId?.email || ''}
              </div>
            </div>
            <span className={`badge ${getRoleBadgeClass(member.role)}`} style={{ textTransform: 'capitalize' }}>
              {getRoleIcon(member.role)} {member.role}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MemberList;
