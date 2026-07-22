import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './BackToWebsite.css';

const BackToWebsite = () => {
  const handleClick = () => {
    window.location.href = 'https://disha-for-indiaa.vercel.app';
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to Website"
      title="Back to Website"
      className="back-button"
    >
      <ArrowLeft size={20} color="#0B3B91" />
    </button>
  );
};

export default BackToWebsite;
