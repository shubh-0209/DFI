import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { CATEGORIES, CONTRIBUTION_TYPES, SKILLS_OPTIONS, TAGS_OPTIONS } from '../../constants/contributionConstants';

const ContributionInfoStep = ({ data, onChange, errors = {} }) => {
  const selectedSkills = data.skillsUsed || [];
  const selectedTags = data.tags || [];

  const toggleSkill = (skill) => {
    const current = data.skillsUsed || [];
    const updated = current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill];
    onChange({ ...data, skillsUsed: updated });
  };

  const toggleTag = (tag) => {
    const current = data.tags || [];
    const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    onChange({ ...data, tags: updated });
  };

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <input
          id="title"
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="form-control"
          placeholder="Enter a descriptive title for your contribution"
          maxLength={255}
        />
        {errors.title && (
          <span style={{ color: 'var(--color-error)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertCircle size={14} /> {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description <span style={{ color: 'var(--color-error)' }}>*</span>
        </label>
        <textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="form-control"
          rows={5}
          placeholder="Describe your contribution in detail. What did you do? What impact did it have?"
          maxLength={2000}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          {errors.description && (
            <span style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertCircle size={14} /> {errors.description}
            </span>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--color-body)' }}>
            {(data.description || '').length}/2000
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <select
            id="category"
            value={data.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="form-control"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && (
            <span style={{ color: 'var(--color-error)', marginTop: '0.25rem', display: 'block' }}>
              {errors.category}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contributionType">
            Contribution Type
          </label>
          <select
            id="contributionType"
            value={data.contributionType || 'other'}
            onChange={(e) => handleChange('contributionType', e.target.value)}
            className="form-control"
          >
            {CONTRIBUTION_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hoursWorked">
          Hours Worked
        </label>
        <input
          id="hoursWorked"
          type="number"
          min="0.1"
          max="1000"
          step="0.1"
          value={data.hoursWorked || ''}
          onChange={(e) => handleChange('hoursWorked', parseFloat(e.target.value) || 0)}
          className="form-control"
          placeholder="Number of hours spent on this contribution"
        />
        {errors.hoursWorked && (
          <span style={{ color: 'var(--color-error)', marginTop: '0.25rem', display: 'block' }}>
            {errors.hoursWorked}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Skills Used <span style={{ color: 'var(--color-body)' }}>(optional)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(211, 84, 0, 0.10)',
                color: 'var(--color-primary)' }}
            >
              {skill}
              <button
                type="button"
                onClick={() => toggleSkill(skill)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--color-primary)' }}
                aria-label={`Remove ${skill}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <select
          value=""
          onChange={(e) => { if (e.target.value) toggleSkill(e.target.value); }}
          className="form-control"
          
          aria-label="Add a skill"
        >
          <option value="">Add a skill...</option>
          {SKILLS_OPTIONS.filter((s) => !selectedSkills.includes(s)).map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Tags <span style={{ color: 'var(--color-body)' }}>(optional)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(5, 150, 105, 0.10)',
                color: 'var(--color-secondary)' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--color-secondary)' }}
                aria-label={`Remove ${tag}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <select
          value=""
          onChange={(e) => { if (e.target.value) toggleTag(e.target.value); }}
          className="form-control"
          
          aria-label="Add a tag"
        >
          <option value="">Add a tag...</option>
          {TAGS_OPTIONS.filter((t) => !selectedTags.includes(t)).map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default ContributionInfoStep;
