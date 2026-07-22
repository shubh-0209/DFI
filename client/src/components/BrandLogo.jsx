import React from 'react';
import './BrandLogo.css';

const BrandLogo = ({ className = '' }) => {
  return (
    <div className={`brand-logo-container ${className}`}>
      <img 
        src="/logo-nobg.png" 
        alt="Disha For India Logo" 
        className="brand-logo-img" 
      />
      <div className="brand-logo-text-wrapper">
        <h1 className="brand-logo-title">DISHA For India</h1>
        <p className="brand-logo-tagline">Growth & Opportunity</p>
      </div>
    </div>
  );
};

export default BrandLogo;
