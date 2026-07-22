import api from './api';

const CATEGORIES = [
  { id: 'graphic_design', name: 'Graphic Design', icon: 'Palette', description: 'Logos, posters, banners, and visual designs' },
  { id: 'development', name: 'Development', icon: 'Code2', description: 'Websites, web apps, and APIs' },
  { id: 'teaching', name: 'Teaching', icon: 'BookOpen', description: 'Educational content and tutoring' },
  { id: 'video_editing', name: 'Video Editing', icon: 'Video', description: 'Video content and post-production' },
  { id: 'photography', name: 'Photography', icon: 'Camera', description: 'Photos and image collections' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', description: 'SEO, social media, and campaigns' },
  { id: 'content_writing', name: 'Content Writing', icon: 'FileText', description: 'Blogs, articles, and written content' },
  { id: 'event_management', name: 'Event Management', icon: 'CalendarDays', description: 'Event planning and execution' },
  { id: 'social_media', name: 'Social Media', icon: 'Share2', description: 'Social media content and management' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', description: 'Other contributions' },
];

const MOCK_CONTRIBUTIONS = [
  {
    _id: 'contrib-001',
    title: 'Rural Digital Literacy Workshop Materials',
    category: 'teaching',
    status: 'approved',
    coins: 120,
    hoursContributed: 8,
    createdAt: '2026-07-01T10:00:00Z',
    featured: true,
    author: { name: 'Priya Sharma', avatar: 'PS' },
    description: 'Developed comprehensive workshop materials for digital literacy camps across 5 villages in Rajasthan.',
  },
  {
    _id: 'contrib-002',
    title: 'NGO Website Redesign',
    category: 'development',
    status: 'approved',
    coins: 500,
    hoursContributed: 24,
    createdAt: '2026-06-28T14:30:00Z',
    featured: true,
    author: { name: 'Arjun Kapoor', avatar: 'AK' },
    description: 'Complete redesign of the partner NGO website with responsive layout and accessibility improvements.',
  },
  {
    _id: 'contrib-003',
    title: 'Event Photography - Health Camp',
    category: 'photography',
    status: 'approved',
    coins: 80,
    hoursContributed: 6,
    createdAt: '2026-06-25T09:15:00Z',
    featured: false,
    author: { name: 'Rahul Verma', avatar: 'RV' },
    description: 'Professional event coverage for the mobile health clinic camp serving 200+ patients.',
  },
  {
    _id: 'contrib-004',
    title: 'Social Media Campaign - Clean River',
    category: 'social_media',
    status: 'pending',
    coins: 0,
    hoursContributed: 4,
    createdAt: '2026-07-03T16:00:00Z',
    featured: false,
    author: { name: 'Kavitha Nair', avatar: 'KN' },
    description: 'Multi-platform awareness campaign for the Sabarmati river cleanup initiative.',
  },
  {
    _id: 'contrib-005',
    title: 'Promotional Video - Youth Coding Bootcamp',
    category: 'video_editing',
    status: 'approved',
    coins: 200,
    hoursContributed: 12,
    createdAt: '2026-06-20T11:00:00Z',
    featured: true,
    author: { name: 'Neha Joshi', avatar: 'NJ' },
    description: 'Edited and produced a 3-minute promotional video showcasing student achievements.',
  },
  {
    _id: 'contrib-006',
    title: 'Blog Series - Volunteer Stories',
    category: 'content_writing',
    status: 'approved',
    coins: 90,
    hoursContributed: 6,
    createdAt: '2026-06-18T08:45:00Z',
    featured: false,
    author: { name: 'Aditya Kumar', avatar: 'AK' },
    description: 'A 5-part blog series highlighting inspiring volunteer journeys across India.',
  },
  {
    _id: 'contrib-007',
    title: 'Logo Design - Green Missions Wing',
    category: 'graphic_design',
    status: 'under_review',
    coins: 0,
    hoursContributed: 3,
    createdAt: '2026-07-04T13:20:00Z',
    featured: false,
    author: { name: 'Anita Desai', avatar: 'AD' },
    description: 'Created a modern logo and brand identity for the new environmental wing.',
  },
  {
    _id: 'contrib-008',
    title: 'Marketing Strategy - Women Empowerment',
    category: 'marketing',
    status: 'approved',
    coins: 150,
    hoursContributed: 10,
    createdAt: '2026-06-15T10:30:00Z',
    featured: false,
    author: { name: 'Rohan Shah', avatar: 'RS' },
    description: 'Developed a comprehensive digital marketing strategy for the upcoming workshop series.',
  },
];

export const getCategories = async () => {
  try {
    const res = await api.get('/contributions/config/categories');
    if (res?.success && Array.isArray(res.data?.categories)) {
      return res.data.categories.map(cat => ({
        id: cat.slug || cat._id,
        name: cat.name,
        icon: 'FolderOpen',
        description: cat.description || '',
      }));
    }
  } catch {
    console.warn('Falling back to local categories');
  }
  return CATEGORIES;
};

export const getContributions = async (params = {}) => {
  try {
    const res = await api.get('/contributions', { params });
    if (res?.success && Array.isArray(res.data?.contributions)) {
      return res.data.contributions;
    }
  } catch {
    console.warn('Falling back to mock contributions');
  }
  return MOCK_CONTRIBUTIONS;
};

export const getFeaturedContributions = async () => {
  try {
    const res = await api.get('/contributions', { params: { featured: true, status: 'approved' } });
    if (res?.success && Array.isArray(res.data?.contributions)) {
      return res.data.contributions.filter(c => c.featured);
    }
  } catch {
    console.warn('Falling back to mock featured contributions');
  }
  return MOCK_CONTRIBUTIONS.filter(c => c.featured && c.status === 'approved');
};

export const getContributionStats = async () => {
  try {
    const res = await api.get('/contributions/stats');
    if (res?.success && res.data) {
      return res.data;
    }
  } catch {
    console.warn('Falling back to mock stats');
  }
  return {
    approvedContributions: 24,
    pendingReviews: 3,
    coinsEarned: 1840,
    hoursContributed: 156,
    featuredContributions: 5,
    currentLevel: 'Contributor',
  };
};

export const getContributionTimeline = async () => {
  try {
    const res = await api.get('/contributions/timeline');
    if (res?.success && Array.isArray(res.data?.timeline)) {
      return res.data.timeline;
    }
  } catch {
    console.warn('Falling back to mock timeline');
  }
  return [
    { stage: 'Register', icon: 'UserPlus', description: 'Create your volunteer profile and set your interests.' },
    { stage: 'Choose Category', icon: 'FolderOpen', description: 'Pick a contribution category that matches your skills.' },
    { stage: 'Create Contribution', icon: 'PlusCircle', description: 'Upload your work with title, description, and files.' },
    { stage: 'Submit for Review', icon: 'Send', description: 'Send your contribution for NGO partner verification.' },
    { stage: 'Get Verified', icon: 'ShieldCheck', description: 'Partner reviews and approves your contribution.' },
    { stage: 'Earn Rewards', icon: 'Award', description: 'Receive coins, badges, and certificates for your work.' },
  ];
};

const categoryIconMap = {
  graphic_design: 'Palette',
  development: 'Code2',
  teaching: 'BookOpen',
  video_editing: 'Video',
  photography: 'Camera',
  marketing: 'TrendingUp',
  content_writing: 'FileText',
  event_management: 'CalendarDays',
  social_media: 'Share2',
  other: 'MoreHorizontal',
};

export const getCategoryIcon = (categoryId) => {
  return categoryIconMap[categoryId] || 'FolderOpen';
};

export { CATEGORIES, MOCK_CONTRIBUTIONS };

export default {
  getCategories,
  getContributions,
  getFeaturedContributions,
  getContributionStats,
  getContributionTimeline,
  getCategoryIcon,
};
