import React from 'react';
import { FileText, Clock, Tag, FolderOpen, Calendar } from 'lucide-react';
import ContributionStatusBadge from '../../contributions/ContributionStatusBadge';

const ContributionInfoCard = ({ contribution }) => {
  if (!contribution) return null;

  return (
    <div style={{ padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', marginBottom: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={18} color="#2563eb" /> Contribution Information
      </h4>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>{contribution.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
          <ContributionStatusBadge status={contribution.status} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
            <FolderOpen size={12} /> {contribution.category?.replace(/_/g, ' ') || 'General'}
          </span>
          {contribution.createdAt && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
              <Calendar size={12} /> Submitted {new Date(contribution.createdAt).toLocaleDateString('en-IN')}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.625, marginBottom: '1.5rem' }}>{contribution.description || 'No description provided.'}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>
            <Clock size={16} color="#94a3b8" /> {contribution.hoursWorked || 0} hours logged
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>
            <Tag size={16} color="#94a3b8" /> {(contribution.tags || []).length} tags
          </div>
        </div>

        {(contribution.skillsUsed?.length > 0 || contribution.tags?.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {contribution.skillsUsed?.map((skill) => (
              <span key={skill} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#fff7ed', color: '#ea580c', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #ffedd5' }}>{skill}</span>
            ))}
            {contribution.tags?.map((tag) => (
              <span key={tag} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #d1fae5' }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionInfoCard;
