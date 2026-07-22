import React from 'react';

/**
 * Component for entering social links (LinkedIn and Portfolio).
 * Props:
 * - linkedin: string
 * - portfolio: string
 * - onLinkedInChange: (value:string)=>void
 * - onPortfolioChange: (value:string)=>void
 */
const SocialLinks = ({ linkedin, portfolio, onLinkedInChange, onPortfolioChange }) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="linkedin">LinkedIn URL</label>
      <input
        id="linkedin"
        type="url"
        className="form-control"
        placeholder="https://linkedin.com/in/username"
        value={linkedin}
        onChange={(e) => onLinkedInChange(e.target.value)}
      />
      <label className="form-label" htmlFor="portfolio" style={{ marginTop: '0.5rem' }}>Portfolio URL</label>
      <input
        id="portfolio"
        type="url"
        className="form-control"
        placeholder="https://myportfolio.com"
        value={portfolio}
        onChange={(e) => onPortfolioChange(e.target.value)}
      />
    </div>
  );
};

export default SocialLinks;
