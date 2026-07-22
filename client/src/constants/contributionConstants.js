export const CATEGORIES = [
  { id: 'graphic_design', name: 'Graphic Design' },
  { id: 'content_writing', name: 'Content Writing' },
  { id: 'digital_marketing', name: 'Digital Marketing' },
  { id: 'photography', name: 'Photography' },
  { id: 'videography', name: 'Videography' },
  { id: 'teaching', name: 'Teaching' },
  { id: 'web_development', name: 'Web Development' },
  { id: 'ui_ux', name: 'UI/UX Design' },
  { id: 'event_management', name: 'Event Management' },
  { id: 'social_media', name: 'Social Media' },
  { id: 'research', name: 'Research' },
  { id: 'other', name: 'Other' },
];

export const CONTRIBUTION_TYPES = [
  { id: 'pdf', name: 'PDF' },
  { id: 'image', name: 'Image' },
  { id: 'video', name: 'Video' },
  { id: 'zip', name: 'ZIP' },
  { id: 'ppt', name: 'PPT' },
  { id: 'doc', name: 'DOC' },
  { id: 'github', name: 'GitHub' },
  { id: 'figma', name: 'Figma' },
  { id: 'canva', name: 'Canva' },
  { id: 'google_drive', name: 'Google Drive' },
  { id: 'other', name: 'Other' },
];

export const SKILLS_OPTIONS = [
  'Graphic Design',
  'Web Development',
  'Content Writing',
  'Photography',
  'Videography',
  'Teaching',
  'Digital Marketing',
  'UI/UX Design',
  'Event Management',
  'Social Media',
  'Research',
  'Data Analysis',
  'Project Management',
  'Public Speaking',
  'Translation',
];

export const TAGS_OPTIONS = [
  'Beginner Friendly',
  'Advanced',
  'Trending',
  'Urgent',
  'Community Choice',
  'Collaborative',
  'Educational',
  'Creative',
  'Technical',
  'Non-Profit',
];

export const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILES = 10;
