const ContributionCategory = require('../../modules/contribution/contribution-category.model');
const ContributionType = require('../../modules/contribution/contribution-type.model');
const CoinRule = require('../../modules/contribution/coin-rule.model');
const BadgeRule = require('../../modules/contribution/badge-rule.model');
const ReviewTemplate = require('../../modules/contribution/review-template.model');
const FileTypeConfig = require('../../modules/contribution/file-type-config.model');
const ContributionTag = require('../../modules/contribution/contribution-tag.model');
const PortfolioConfig = require('../../modules/contribution/portfolio-config.model');
const FeaturedConfig = require('../../modules/contribution/featured-config.model');
const ReviewConfig = require('../../modules/contribution/review-config.model');
const AutomationConfig = require('../../modules/contribution/automation-config.model');
const User = require('../../modules/user/user.model');
const ROLES = require('../../constants/roles.constants');

const seedContributionConfig = async () => {
  try {
    let superAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
    if (!superAdmin) {
      superAdmin = await User.findOne({ email: 'admin@dishaforindia.org' });
      if (superAdmin) {
        superAdmin.role = ROLES.SUPER_ADMIN;
        if (superAdmin.password && !superAdmin.password.startsWith('$2b$')) {
          superAdmin.password = await require('bcrypt').hash('changeme123', 10);
        }
        await superAdmin.save();
      } else {
        const hashedPassword = await require('bcrypt').hash('changeme123', 10);
        superAdmin = await User.create({
          name: 'Super Admin',
          username: 'superadmin',
          email: 'admin@dishaforindia.org',
          password: hashedPassword,
          role: ROLES.SUPER_ADMIN,
          status: 'active',
          permissions: [],
        });
      }
    } else {
      if (superAdmin.password && !superAdmin.password.startsWith('$2b$')) {
        superAdmin.password = await require('bcrypt').hash('changeme123', 10);
        await superAdmin.save();
      }
    }

    const adminId = superAdmin._id;

    // Seed Contribution Categories
    const categories = [
      { name: 'Graphic Design', slug: 'graphic_design', description: 'Logos, posters, banners, and visual designs', isActive: true, sortOrder: 1 },
      { name: 'Content Writing', slug: 'content_writing', description: 'Blogs, articles, and written content', isActive: true, sortOrder: 2 },
      { name: 'Digital Marketing', slug: 'digital_marketing', description: 'SEO, social media, and online campaigns', isActive: true, sortOrder: 3 },
      { name: 'Photography', slug: 'photography', description: 'Photos and image collections', isActive: true, sortOrder: 4 },
      { name: 'Videography', slug: 'videography', description: 'Videos and video content', isActive: true, sortOrder: 5 },
      { name: 'Teaching', slug: 'teaching', description: 'Educational content and tutoring', isActive: true, sortOrder: 6 },
      { name: 'Web Development', slug: 'web_development', description: 'Websites, web apps, and APIs', isActive: true, sortOrder: 7 },
      { name: 'UI/UX Design', slug: 'ui_ux', description: 'User interface and experience designs', isActive: true, sortOrder: 8 },
      { name: 'Event Management', slug: 'event_management', description: 'Event planning and execution', isActive: true, sortOrder: 9 },
      { name: 'Social Media', slug: 'social_media', description: 'Social media content and management', isActive: true, sortOrder: 10 },
      { name: 'Research', slug: 'research', description: 'Research papers and analysis', isActive: true, sortOrder: 11 },
      { name: 'Other', slug: 'other', description: 'Other contributions', isActive: true, sortOrder: 12 },
    ];

    let insertedCategories = 0;
    for (const cat of categories) {
      const existing = await ContributionCategory.findOne({ slug: cat.slug, isDeleted: false });
      if (!existing) {
        await ContributionCategory.create({ ...cat, createdBy: adminId, updatedBy: adminId });
        insertedCategories++;
      }
    }

    // Seed Contribution Types
    const types = [
      { name: 'PDF', slug: 'pdf', description: 'PDF documents', isActive: true, sortOrder: 1 },
      { name: 'Image', slug: 'image', description: 'Image files', isActive: true, sortOrder: 2 },
      { name: 'Video', slug: 'video', description: 'Video files', isActive: true, sortOrder: 3 },
      { name: 'ZIP', slug: 'zip', description: 'Compressed archives', isActive: true, sortOrder: 4 },
      { name: 'PPT', slug: 'ppt', description: 'Presentations', isActive: true, sortOrder: 5 },
      { name: 'DOC', slug: 'doc', description: 'Word documents', isActive: true, sortOrder: 6 },
      { name: 'GitHub', slug: 'github', description: 'GitHub repository links', isActive: true, sortOrder: 7 },
      { name: 'Figma', slug: 'figma', description: 'Figma design links', isActive: true, sortOrder: 8 },
      { name: 'Canva', slug: 'canva', description: 'Canva design links', isActive: true, sortOrder: 9 },
      { name: 'Google Drive', slug: 'google_drive', description: 'Google Drive links', isActive: true, sortOrder: 10 },
      { name: 'Other', slug: 'other', description: 'Other file types', isActive: true, sortOrder: 11 },
    ];

    let insertedTypes = 0;
    for (const type of types) {
      const existing = await ContributionType.findOne({ slug: type.slug, isDeleted: false });
      if (!existing) {
        await ContributionType.create({ ...type, createdBy: adminId, updatedBy: adminId });
        insertedTypes++;
      }
    }

    // Seed Coin Rules
    const graphicDesignCat = await ContributionCategory.findOne({ slug: 'graphic_design', isDeleted: false });
    const contentWritingCat = await ContributionCategory.findOne({ slug: 'content_writing', isDeleted: false });
    const webDevCat = await ContributionCategory.findOne({ slug: 'web_development', isDeleted: false });
    const photographyCat = await ContributionCategory.findOne({ slug: 'photography', isDeleted: false });
    const videographyCat = await ContributionCategory.findOne({ slug: 'videography', isDeleted: false });
    const teachingCat = await ContributionCategory.findOne({ slug: 'teaching', isDeleted: false });
    const uiUxCat = await ContributionCategory.findOne({ slug: 'ui_ux', isDeleted: false });

    const imageType = await ContributionType.findOne({ slug: 'image', isDeleted: false });
    const pdfType = await ContributionType.findOne({ slug: 'pdf', isDeleted: false });
    const videoType = await ContributionType.findOne({ slug: 'video', isDeleted: false });
    const githubType = await ContributionType.findOne({ slug: 'github', isDeleted: false });
    const figmaType = await ContributionType.findOne({ slug: 'figma', isDeleted: false });
    const docType = await ContributionType.findOne({ slug: 'doc', isDeleted: false });

    const coinRules = [
      { name: 'Graphic Design Default', contributionCategory: graphicDesignCat?._id, contributionType: imageType?._id, coins: 100, description: 'Default coins for graphic design images', isActive: true, priority: 1 },
      { name: 'Blog Writing Default', contributionCategory: contentWritingCat?._id, contributionType: pdfType?._id, coins: 80, description: 'Default coins for blog posts', isActive: true, priority: 1 },
      { name: 'Website Development', contributionCategory: webDevCat?._id, contributionType: githubType?._id, coins: 500, description: 'Default coins for website contributions', isActive: true, priority: 1 },
      { name: 'Photography Default', contributionCategory: photographyCat?._id, contributionType: imageType?._id, coins: 60, description: 'Default coins for photography', isActive: true, priority: 1 },
      { name: 'Video Content', contributionCategory: videographyCat?._id, contributionType: videoType?._id, coins: 200, description: 'Default coins for video content', isActive: true, priority: 1 },
      { name: 'Teaching Material', contributionCategory: teachingCat?._id, contributionType: pdfType?._id, coins: 90, description: 'Default coins for teaching materials', isActive: true, priority: 1 },
      { name: 'UI/UX Design', contributionCategory: uiUxCat?._id, contributionType: figmaType?._id, coins: 150, description: 'Default coins for UI/UX designs', isActive: true, priority: 1 },
      { name: 'Document Writing', contributionCategory: contentWritingCat?._id, contributionType: docType?._id, coins: 70, description: 'Default coins for document writing', isActive: true, priority: 1 },
    ];

    let insertedCoinRules = 0;
    for (const rule of coinRules) {
      const existing = await CoinRule.findOne({ name: rule.name, isDeleted: false });
      if (!existing) {
        await CoinRule.create({ ...rule, createdBy: adminId, updatedBy: adminId });
        insertedCoinRules++;
      }
    }

    // Seed Badge Rules
    const badgeRules = [
      { name: 'Designer', slug: 'designer', description: 'Awarded for design contributions', requirements: { approvedContributions: 10, totalCoins: 500 }, isActive: true, sortOrder: 1 },
      { name: 'Writer', slug: 'writer', description: 'Awarded for writing contributions', requirements: { approvedContributions: 10, totalCoins: 500 }, isActive: true, sortOrder: 2 },
      { name: 'Developer', slug: 'developer', description: 'Awarded for development contributions', requirements: { approvedContributions: 10, totalCoins: 1000 }, isActive: true, sortOrder: 3 },
      { name: 'Photographer', slug: 'photographer', description: 'Awarded for photography contributions', requirements: { approvedContributions: 10, totalCoins: 500 }, isActive: true, sortOrder: 4 },
      { name: 'Videographer', slug: 'videographer', description: 'Awarded for video contributions', requirements: { approvedContributions: 10, totalCoins: 800 }, isActive: true, sortOrder: 5 },
      { name: 'Teacher', slug: 'teacher', description: 'Awarded for teaching contributions', requirements: { approvedContributions: 10, totalCoins: 500 }, isActive: true, sortOrder: 6 },
      { name: 'Researcher', slug: 'researcher', description: 'Awarded for research contributions', requirements: { approvedContributions: 10, totalCoins: 1000 }, isActive: true, sortOrder: 7 },
      { name: 'Rising Star', slug: 'rising_star', description: 'Awarded for early contributions', requirements: { approvedContributions: 5, totalCoins: 200 }, isActive: true, sortOrder: 8 },
    ];

    let insertedBadgeRules = 0;
    for (const rule of badgeRules) {
      const existing = await BadgeRule.findOne({ slug: rule.slug, isDeleted: false });
      if (!existing) {
        await BadgeRule.create({ ...rule, createdBy: adminId, updatedBy: adminId });
        insertedBadgeRules++;
      }
    }

    // Seed Review Templates
    const reviewTemplates = [
      { name: 'Excellent Work', templateText: 'Excellent work! This contribution meets all quality standards.', action: 'approved', category: '', isActive: true, sortOrder: 1 },
      { name: 'Good Effort', templateText: 'Good effort. Minor improvements could make it even better.', action: 'approved', category: '', isActive: true, sortOrder: 2 },
      { name: 'Needs Better Resolution', templateText: 'The resolution or quality of this contribution needs improvement.', action: 'needs_changes', category: '', isActive: true, sortOrder: 3 },
      { name: 'Wrong Category', templateText: 'This contribution does not belong to the selected category.', action: 'rejected', category: '', isActive: true, sortOrder: 4 },
      { name: 'Duplicate Submission', templateText: 'This appears to be a duplicate of an existing contribution.', action: 'rejected', category: '', isActive: true, sortOrder: 5 },
      { name: 'Incomplete Submission', templateText: 'This contribution is incomplete. Please provide all required materials.', action: 'needs_changes', category: '', isActive: true, sortOrder: 6 },
      { name: 'Spam', templateText: 'This contribution appears to be spam or irrelevant.', action: 'rejected', category: '', isActive: true, sortOrder: 7 },
      { name: 'Low Quality', templateText: 'The quality of this contribution is below our standards.', action: 'rejected', category: '', isActive: true, sortOrder: 8 },
    ];

    let insertedReviewTemplates = 0;
    for (const template of reviewTemplates) {
      const existing = await ReviewTemplate.findOne({ name: template.name, isDeleted: false });
      if (!existing) {
        await ReviewTemplate.create({ ...template, createdBy: adminId, updatedBy: adminId });
        insertedReviewTemplates++;
      }
    }

    // Seed File Type Configs
    const fileTypeConfigs = [
      { name: 'JPEG Image', mimeType: 'image/jpeg', extension: 'jpg', category: 'image', maxSize: 10, isActive: true },
      { name: 'PNG Image', mimeType: 'image/png', extension: 'png', category: 'image', maxSize: 10, isActive: true },
      { name: 'GIF Image', mimeType: 'image/gif', extension: 'gif', category: 'image', maxSize: 10, isActive: true },
      { name: 'WebP Image', mimeType: 'image/webp', extension: 'webp', category: 'image', maxSize: 10, isActive: true },
      { name: 'SVG Image', mimeType: 'image/svg+xml', extension: 'svg', category: 'image', maxSize: 5, isActive: true },
      { name: 'PDF Document', mimeType: 'application/pdf', extension: 'pdf', category: 'document', maxSize: 25, isActive: true },
      { name: 'Word Document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: 'docx', category: 'document', maxSize: 10, isActive: true },
      { name: 'PowerPoint', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extension: 'pptx', category: 'document', maxSize: 25, isActive: true },
      { name: 'Excel Spreadsheet', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: 'xlsx', category: 'document', maxSize: 10, isActive: true },
      { name: 'Text File', mimeType: 'text/plain', extension: 'txt', category: 'document', maxSize: 1, isActive: true },
      { name: 'MP4 Video', mimeType: 'video/mp4', extension: 'mp4', category: 'video', maxSize: 100, isActive: true },
      { name: 'WebM Video', mimeType: 'video/webm', extension: 'webm', category: 'video', maxSize: 100, isActive: true },
      { name: 'ZIP Archive', mimeType: 'application/zip', extension: 'zip', category: 'archive', maxSize: 50, isActive: true },
      { name: 'RAR Archive', mimeType: 'application/vnd.rar', extension: 'rar', category: 'archive', maxSize: 50, isActive: true },
      { name: '7Z Archive', mimeType: 'application/x-7z-compressed', extension: '7z', category: 'archive', maxSize: 50, isActive: true },
    ];

    let insertedFileTypes = 0;
    for (const ft of fileTypeConfigs) {
      const existing = await FileTypeConfig.findOne({ extension: ft.extension, isDeleted: false });
      if (!existing) {
        await FileTypeConfig.create({ ...ft, createdBy: adminId, updatedBy: adminId });
        insertedFileTypes++;
      }
    }

    // Seed Contribution Tags
    const tags = [
      { name: 'Beginner Friendly', slug: 'beginner_friendly', category: 'general', description: 'Suitable for beginners', isActive: true },
      { name: 'Advanced', slug: 'advanced', category: 'general', description: 'Requires advanced skills', isActive: true },
      { name: 'Trending', slug: 'trending', category: 'general', description: 'Currently trending', isActive: true },
      { name: 'Urgent', slug: 'urgent', category: 'general', description: 'Urgent contribution needed', isActive: true },
      { name: 'Community Choice', slug: 'community_choice', category: 'general', description: 'Selected by the community', isActive: true },
      { name: 'Collaborative', slug: 'collaborative', category: 'general', description: 'Open for collaboration', isActive: true },
      { name: 'Educational', slug: 'educational', category: 'general', description: 'Educational content', isActive: true },
      { name: 'Creative', slug: 'creative', category: 'general', description: 'Creative contribution', isActive: true },
      { name: 'Technical', slug: 'technical', category: 'general', description: 'Technical contribution', isActive: true },
      { name: 'Non-Profit', slug: 'non_profit', category: 'general', description: 'For non-profit causes', isActive: true },
    ];

    let insertedTags = 0;
    for (const tag of tags) {
      const existing = await ContributionTag.findOne({ slug: tag.slug, isDeleted: false });
      if (!existing) {
        await ContributionTag.create({ ...tag, createdBy: adminId, updatedBy: adminId });
        insertedTags++;
      }
    }

    // Seed Portfolio Configs
    const portfolioConfigs = [
      { key: 'max_contributions_per_volunteer', value: 50, description: 'Maximum contributions a volunteer can submit', isActive: true },
      { key: 'allow_public_portfolios', value: true, description: 'Allow public viewing of volunteer portfolios', isActive: true },
      { key: 'portfolio_sort_by', value: 'recent', description: 'Default sort order for portfolio (recent, popular, coins)', isActive: true },
      { key: 'show_coin_balance', value: true, description: 'Show coin balance on portfolio', isActive: true },
      { key: 'show_badges', value: true, description: 'Show badges on portfolio', isActive: true },
      { key: 'portfolio_items_per_page', value: 12, description: 'Number of items to show per page on portfolio', isActive: true },
    ];

    let insertedPortfolioConfigs = 0;
    for (const config of portfolioConfigs) {
      const existing = await PortfolioConfig.findOne({ key: config.key, isDeleted: false });
      if (!existing) {
        await PortfolioConfig.create({ ...config, createdBy: adminId, updatedBy: adminId });
        insertedPortfolioConfigs++;
      }
    }

    // Seed Featured Configs
    const featuredConfigs = [
      { key: 'max_featured_contributions', value: 10, description: 'Maximum number of featured contributions to display', isActive: true },
      { key: 'featured_auto_select', value: true, description: 'Automatically feature high-quality contributions', isActive: true },
      { key: 'featured_min_coins', value: 200, description: 'Minimum coins required for auto-featuring', isActive: true },
      { key: 'featured_duration_days', value: 30, description: 'Duration in days for which a contribution stays featured', isActive: true },
    ];

    let insertedFeaturedConfigs = 0;
    for (const config of featuredConfigs) {
      const existing = await FeaturedConfig.findOne({ key: config.key, isDeleted: false });
      if (!existing) {
        await FeaturedConfig.create({ ...config, createdBy: adminId, updatedBy: adminId });
        insertedFeaturedConfigs++;
      }
    }

    // Seed Review Configs
    const reviewConfigs = [
      { key: 'require_review_for_approval', value: true, description: 'Require review before contribution approval', isActive: true },
      { key: 'allow_self_review', value: false, description: 'Allow volunteers to review their own contributions', isActive: true },
      { key: 'min_reviewers', value: 1, description: 'Minimum number of reviewers required', isActive: true },
      { key: 'auto_approve_after_days', value: 7, description: 'Auto-approve contributions after specified days without review', isActive: true },
      { key: 'review_deadline_days', value: 5, description: 'Deadline in days for reviewers to complete review', isActive: true },
      { key: 'notify_on_review', value: true, description: 'Send notification when a review is submitted', isActive: true },
    ];

    let insertedReviewConfigs = 0;
    for (const config of reviewConfigs) {
      const existing = await ReviewConfig.findOne({ key: config.key, isDeleted: false });
      if (!existing) {
        await ReviewConfig.create({ ...config, createdBy: adminId, updatedBy: adminId });
        insertedReviewConfigs++;
      }
    }

    // Seed Automation Configs
    const automationConfigs = [
      { key: 'auto_assign_reviewers', value: true, description: 'Automatically assign reviewers to contributions', isActive: true },
      { key: 'auto_coin_award', value: true, description: 'Automatically award coins on approval', isActive: true },
      { key: 'auto_badge_award', value: true, description: 'Automatically award badges when criteria met', isActive: true },
      { key: 'auto_feature_on_milestone', value: true, description: 'Automatically feature contributions on milestone achievements', isActive: true },
      { key: 'duplicate_check_enabled', value: true, description: 'Enable automatic duplicate submission detection', isActive: true },
      { key: 'spam_detection_enabled', value: true, description: 'Enable automatic spam detection', isActive: true },
      { key: 'auto_archive_after_days', value: 90, description: 'Auto-archive contributions after specified days of inactivity', isActive: true },
    ];

    let insertedAutomationConfigs = 0;
    for (const config of automationConfigs) {
      const existing = await AutomationConfig.findOne({ key: config.key, isDeleted: false });
      if (!existing) {
        await AutomationConfig.create({ ...config, createdBy: adminId, updatedBy: adminId });
        insertedAutomationConfigs++;
      }
    }

    // eslint-disable-next-line no-console
    console.log('Contribution config seeded', {
      categories: insertedCategories,
      types: insertedTypes,
      coinRules: insertedCoinRules,
      badgeRules: insertedBadgeRules,
      reviewTemplates: insertedReviewTemplates,
      fileTypes: insertedFileTypes,
      tags: insertedTags,
      portfolioConfigs: insertedPortfolioConfigs,
      featuredConfigs: insertedFeaturedConfigs,
      reviewConfigs: insertedReviewConfigs,
      automationConfigs: insertedAutomationConfigs,
    });

    return {
      inserted: insertedCategories + insertedTypes + insertedCoinRules + insertedBadgeRules + insertedReviewTemplates + insertedFileTypes + insertedTags + insertedPortfolioConfigs + insertedFeaturedConfigs + insertedReviewConfigs + insertedAutomationConfigs,
      skipped: 0,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Contribution config seeding failed:', error.message);
    return { inserted: 0, skipped: 0, error: error.message };
  }
};

module.exports = { seedContributionConfig };
