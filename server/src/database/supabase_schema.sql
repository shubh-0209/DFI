-- Supabase DDL SQL Schema Script
-- Run this in your Supabase SQL Editor if connecting via HTTP REST API Client

-- 1. users
CREATE TABLE IF NOT EXISTS "users" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_users_doc_gin" ON "users" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_username_unique" ON "users" ((document->>'username'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email_unique" ON "users" ((document->>'email'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_volunteerid_unique" ON "users" ((document->>'volunteerId')) WHERE (document->>'volunteerId') IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_googleid_unique" ON "users" ((document->>'googleId')) WHERE (document->>'googleId') IS NOT NULL;

-- 2. supporttickets
CREATE TABLE IF NOT EXISTS "supporttickets" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_supporttickets_doc_gin" ON "supporttickets" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_supporttickets_ticketid_unique" ON "supporttickets" ((document->>'ticketId'));

-- 3. ticketreplies
CREATE TABLE IF NOT EXISTS "ticketreplies" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_ticketreplies_doc_gin" ON "ticketreplies" USING gin (document);

-- 4. tickethistories
CREATE TABLE IF NOT EXISTS "tickethistories" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_tickethistories_doc_gin" ON "tickethistories" USING gin (document);

-- 5. roles
CREATE TABLE IF NOT EXISTS "roles" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_roles_doc_gin" ON "roles" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_roles_roleid_unique" ON "roles" ((document->>'roleId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_roles_slug_unique" ON "roles" ((document->>'slug'));

-- 6. rewardtransactions
CREATE TABLE IF NOT EXISTS "rewardtransactions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_rewardtransactions_doc_gin" ON "rewardtransactions" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_rewardtransactions_txnid_unique" ON "rewardtransactions" ((document->>'transactionId'));

-- 7. rewardredemptions
CREATE TABLE IF NOT EXISTS "rewardredemptions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_rewardredemptions_doc_gin" ON "rewardredemptions" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_rewardredemptions_redemptionid_unique" ON "rewardredemptions" ((document->>'redemptionId'));

-- 8. rewardcatalogs
CREATE TABLE IF NOT EXISTS "rewardcatalogs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_rewardcatalogs_doc_gin" ON "rewardcatalogs" USING gin (document);

-- 9. rewards
CREATE TABLE IF NOT EXISTS "rewards" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_rewards_doc_gin" ON "rewards" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_rewards_rewardid_unique" ON "rewards" ((document->>'rewardId'));

-- 10. reports
CREATE TABLE IF NOT EXISTS "reports" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_reports_doc_gin" ON "reports" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_reports_reportid_unique" ON "reports" ((document->>'reportId'));

-- 11. programs
CREATE TABLE IF NOT EXISTS "programs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_programs_doc_gin" ON "programs" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_programs_programid_unique" ON "programs" ((document->>'programId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_programs_slug_unique" ON "programs" ((document->>'slug'));

-- 12. permissions
CREATE TABLE IF NOT EXISTS "permissions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_permissions_doc_gin" ON "permissions" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_permissions_permissionid_unique" ON "permissions" ((document->>'permissionId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_permissions_code_unique" ON "permissions" ((document->>'code'));

-- 13. organizations
CREATE TABLE IF NOT EXISTS "organizations" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_organizations_doc_gin" ON "organizations" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_organizations_orgid_unique" ON "organizations" ((document->>'organizationId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_organizations_slug_unique" ON "organizations" ((document->>'slug'));

-- 14. messages
CREATE TABLE IF NOT EXISTS "messages" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_messages_doc_gin" ON "messages" USING gin (document);

-- 15. notificationpreferences
CREATE TABLE IF NOT EXISTS "notificationpreferences" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_notificationpreferences_doc_gin" ON "notificationpreferences" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_notificationpreferences_user_unique" ON "notificationpreferences" ((document->>'user'));

-- 16. notifications
CREATE TABLE IF NOT EXISTS "notifications" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_notifications_doc_gin" ON "notifications" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_notifications_notificationid_unique" ON "notifications" ((document->>'notificationId'));

-- 17. recommendations
CREATE TABLE IF NOT EXISTS "recommendations" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_recommendations_doc_gin" ON "recommendations" USING gin (document);

-- 18. badges
CREATE TABLE IF NOT EXISTS "badges" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_badges_doc_gin" ON "badges" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_badges_badgeid_unique" ON "badges" ((document->>'badgeId'));

-- 19. leaderboards
CREATE TABLE IF NOT EXISTS "leaderboards" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_leaderboards_doc_gin" ON "leaderboards" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_leaderboards_leaderboardid_unique" ON "leaderboards" ((document->>'leaderboardId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_leaderboards_user_unique" ON "leaderboards" ((document->>'user'));

-- 20. achievements
CREATE TABLE IF NOT EXISTS "achievements" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_achievements_doc_gin" ON "achievements" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_achievements_achievementid_unique" ON "achievements" ((document->>'achievementId'));

-- 21. userbadges
CREATE TABLE IF NOT EXISTS "userbadges" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_userbadges_doc_gin" ON "userbadges" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_userbadges_user_badge_unique" ON "userbadges" ((document->>'user'), (document->>'badge'));

-- 22. userachievements
CREATE TABLE IF NOT EXISTS "userachievements" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_userachievements_doc_gin" ON "userachievements" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_userachievements_user_achievement_unique" ON "userachievements" ((document->>'user'), (document->>'achievement'));

-- 23. volunteerlevels
CREATE TABLE IF NOT EXISTS "volunteerlevels" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_volunteerlevels_doc_gin" ON "volunteerlevels" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_volunteerlevels_levelid_unique" ON "volunteerlevels" ((document->>'levelId'));

-- 24. contributioncategories
CREATE TABLE IF NOT EXISTS "contributioncategories" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributioncategories_doc_gin" ON "contributioncategories" USING gin (document);

-- 25. contributionrewards
CREATE TABLE IF NOT EXISTS "contributionrewards" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributionrewards_doc_gin" ON "contributionrewards" USING gin (document);

-- 26. contributionstatistics
CREATE TABLE IF NOT EXISTS "contributionstatistics" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributionstatistics_doc_gin" ON "contributionstatistics" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contributionstatistics_statid_unique" ON "contributionstatistics" ((document->>'statisticsId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contributionstatistics_user_unique" ON "contributionstatistics" ((document->>'user'));

-- 27. contributiontags
CREATE TABLE IF NOT EXISTS "contributiontags" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributiontags_doc_gin" ON "contributiontags" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contributiontags_slug_unique" ON "contributiontags" ((document->>'slug'));

-- 28. contributiontypes
CREATE TABLE IF NOT EXISTS "contributiontypes" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributiontypes_doc_gin" ON "contributiontypes" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contributiontypes_slug_unique" ON "contributiontypes" ((document->>'slug'));

-- 29. contributions
CREATE TABLE IF NOT EXISTS "contributions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributions_doc_gin" ON "contributions" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contributions_contrid_unique" ON "contributions" ((document->>'contributionId'));

-- 30. featuredconfigs
CREATE TABLE IF NOT EXISTS "featuredconfigs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_featuredconfigs_doc_gin" ON "featuredconfigs" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_featuredconfigs_key_unique" ON "featuredconfigs" ((document->>'key'));

-- 31. filetypeconfigs
CREATE TABLE IF NOT EXISTS "filetypeconfigs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_filetypeconfigs_doc_gin" ON "filetypeconfigs" USING gin (document);

-- 32. files
CREATE TABLE IF NOT EXISTS "files" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_files_doc_gin" ON "files" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_files_fileid_unique" ON "files" ((document->>'fileId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_files_url_unique" ON "files" ((document->>'url'));

-- 33. portfolioconfigs
CREATE TABLE IF NOT EXISTS "portfolioconfigs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_portfolioconfigs_doc_gin" ON "portfolioconfigs" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_portfolioconfigs_key_unique" ON "portfolioconfigs" ((document->>'key'));

-- 34. portfolios
CREATE TABLE IF NOT EXISTS "portfolios" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_portfolios_doc_gin" ON "portfolios" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_portfolios_portfolioid_unique" ON "portfolios" ((document->>'portfolioId'));
CREATE UNIQUE INDEX IF NOT EXISTS "idx_portfolios_contrid_unique" ON "portfolios" ((document->>'contributionId'));

-- 35. reviewconfigs
CREATE TABLE IF NOT EXISTS "reviewconfigs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_reviewconfigs_doc_gin" ON "reviewconfigs" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_reviewconfigs_key_unique" ON "reviewconfigs" ((document->>'key'));

-- 36. reviewtemplates
CREATE TABLE IF NOT EXISTS "reviewtemplates" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_reviewtemplates_doc_gin" ON "reviewtemplates" USING gin (document);

-- 37. coinrules
CREATE TABLE IF NOT EXISTS "coinrules" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_coinrules_doc_gin" ON "coinrules" USING gin (document);

-- 38. badgerules
CREATE TABLE IF NOT EXISTS "badgerules" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_badgerules_doc_gin" ON "badgerules" USING gin (document);

-- 39. automationconfigs
CREATE TABLE IF NOT EXISTS "automationconfigs" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_automationconfigs_doc_gin" ON "automationconfigs" USING gin (document);

-- 40. analyticsevents
CREATE TABLE IF NOT EXISTS "analyticsevents" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_analyticsevents_doc_gin" ON "analyticsevents" USING gin (document);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_analyticsevents_eventid_unique" ON "analyticsevents" ((document->>'eventId'));

-- 41. activitytimelines
CREATE TABLE IF NOT EXISTS "activitytimelines" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_activitytimelines_doc_gin" ON "activitytimelines" USING gin (document);

-- 42. conversations
CREATE TABLE IF NOT EXISTS "conversations" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_conversations_doc_gin" ON "conversations" USING gin (document);

-- 43. certificates
CREATE TABLE IF NOT EXISTS "certificates" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_certificates_doc_gin" ON "certificates" USING gin (document);

-- 44. collaborationworkspaces
CREATE TABLE IF NOT EXISTS "collaborationworkspaces" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_collaborationworkspaces_doc_gin" ON "collaborationworkspaces" USING gin (document);

-- 45. attendances
CREATE TABLE IF NOT EXISTS "attendances" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_attendances_doc_gin" ON "attendances" USING gin (document);

-- 46. applications
CREATE TABLE IF NOT EXISTS "applications" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_applications_doc_gin" ON "applications" USING gin (document);

-- 47. announcements
CREATE TABLE IF NOT EXISTS "announcements" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_announcements_doc_gin" ON "announcements" USING gin (document);

-- 48. contributionversions
CREATE TABLE IF NOT EXISTS "contributionversions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributionversions_doc_gin" ON "contributionversions" USING gin (document);

-- 49. contributionreviews
CREATE TABLE IF NOT EXISTS "contributionreviews" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_contributionreviews_doc_gin" ON "contributionreviews" USING gin (document);

-- 50. badgedefinitions
CREATE TABLE IF NOT EXISTS "badgedefinitions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_badgedefinitions_doc_gin" ON "badgedefinitions" USING gin (document);

-- 51. achievementdefinitions
CREATE TABLE IF NOT EXISTS "achievementdefinitions" (
  _id TEXT PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_achievementdefinitions_doc_gin" ON "achievementdefinitions" USING gin (document);
