import React from 'react';
import { FileText, Clock, Tag, FolderOpen } from 'lucide-react';

const ContributionSummary = ({ data }) => {
  const getCategoryName = (catId) => {
    const map = {
      graphic_design: 'Graphic Design',
      content_writing: 'Content Writing',
      digital_marketing: 'Digital Marketing',
      photography: 'Photography',
      videography: 'Videography',
      teaching: 'Teaching',
      web_development: 'Web Development',
      ui_ux: 'UI/UX Design',
      event_management: 'Event Management',
      social_media: 'Social Media',
      research: 'Research',
      other: 'Other',
    };
    return map[catId] || catId;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
          <FileText size={16} /> Title
        </div>
        <div style={{ color: 'var(--color-heading)', paddingLeft: '1.5rem' }}>
          {data.title}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
          <FileText size={16} /> Description
        </div>
        <div style={{ color: 'var(--color-heading)', paddingLeft: '1.5rem', whiteSpace: 'pre-wrap' }}>
          {data.description}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
            <FolderOpen size={16} /> Category
          </div>
          <div style={{ color: 'var(--color-heading)', paddingLeft: '1.5rem' }}>
            {getCategoryName(data.category)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
            <Clock size={16} /> Hours Worked
          </div>
          <div style={{ color: 'var(--color-heading)', paddingLeft: '1.5rem' }}>
            {data.hoursWorked || 0} hrs
          </div>
        </div>
      </div>

      {data.skillsUsed && data.skillsUsed.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
            <Tag size={16} /> Skills Used
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingLeft: '1.5rem' }}>
            {data.skillsUsed.map((skill, i) => (
              <span key={i} className="badge badge-blue" style={{ margin: 0 }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {data.tags && data.tags.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
            <Tag size={16} /> Tags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingLeft: '1.5rem' }}>
            {data.tags.map((tag, i) => (
              <span key={i} className="badge badge-green" style={{ margin: 0 }}>{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionSummary;
