import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Code2, BookOpen, Video, Camera, TrendingUp, FileText, CalendarDays, Share2, MoreHorizontal, FolderOpen } from 'lucide-react';

const iconMap = {
  Palette,
  Code2,
  BookOpen,
  Video,
  Camera,
  TrendingUp,
  FileText,
  CalendarDays,
  Share2,
  MoreHorizontal,
};

const ContributionCategoryCard = ({ category, onClick }) => {
  const IconComponent = iconMap[category.icon] || FolderOpen;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        cursor: 'pointer' }}
      onClick={() => onClick?.(category.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(category.id); } }}
      tabIndex={0}
      role="button"
      aria-label={`${category.name} category`}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'rgba(211, 84, 0, 0.10)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0 }}>
        <IconComponent size={28} />
      </div>
      <h4 style={{ color: 'var(--color-heading)', margin: 0 }}>
        {category.name}
      </h4>
      <p style={{ color: 'var(--color-body)', margin: 0 }}>
        {category.description}
      </p>
    </motion.div>
  );
};

export default ContributionCategoryCard;
