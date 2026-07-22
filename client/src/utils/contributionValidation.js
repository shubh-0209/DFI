import { z } from 'zod';

export const contributionInfoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title cannot exceed 255 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description cannot exceed 2000 characters'),
  category: z.string().min(1, 'Please select a category'),
  contributionType: z.string().default('other'),
  skillsUsed: z.array(z.string()).optional().default([]),
  hoursWorked: z.number().min(0.1, 'Hours worked must be at least 0.1').max(1000, 'Hours worked seems too high').optional().default(0),
  tags: z.array(z.string()).optional().default([]),
});

export const contributionFilesSchema = z.object({
  files: z.array(z.any()).optional().default([]),
  githubUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).default(''),
  figmaUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).default(''),
  canvaUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).default(''),
  googleDriveUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).default(''),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
}).refine(
  (data) => {
    const hasFiles = data.files && data.files.length > 0;
    const hasLinks = !!(data.githubUrl || data.figmaUrl || data.canvaUrl || data.googleDriveUrl);
    return hasFiles || hasLinks;
  },
  {
    message: 'Please upload at least one file or add an external link',
    path: ['files'],
  }
);

export const fullContributionSchema = contributionInfoSchema.merge(contributionFilesSchema);

