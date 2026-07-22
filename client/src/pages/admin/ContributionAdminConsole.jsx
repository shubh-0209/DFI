import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import ConfigurationSidebar, { SIDEBAR_ITEMS } from '../../components/admin/contributions/ConfigurationSidebar';
import AdminOverview from '../../components/admin/contributions/AdminOverview';
import CategoryManager from '../../components/admin/contributions/CategoryManager';
import ContributionTypeManager from '../../components/admin/contributions/ContributionTypeManager';
import CoinRuleManager from '../../components/admin/contributions/CoinRuleManager';
import BadgeManager from '../../components/admin/contributions/BadgeManager';
import ReviewTemplateManager from '../../components/admin/contributions/ReviewTemplateManager';
import RewardCatalogManager from '../../components/admin/contributions/RewardCatalogManager';
import UploadSettingsManager from '../../components/admin/contributions/UploadSettingsManager';
import PortfolioSettings from '../../components/admin/contributions/PortfolioSettings';
import AutomationSettings from '../../components/admin/contributions/AutomationSettings';
import GeneralSettings from '../../components/admin/contributions/GeneralSettings';

const SECTION_COMPONENTS = {
  overview: AdminOverview,
  categories: CategoryManager,
  types: ContributionTypeManager,
  'coin-rules': CoinRuleManager,
  'badge-rules': BadgeManager,
  'review-templates': ReviewTemplateManager,
  'reward-catalog': RewardCatalogManager,
  'upload-settings': UploadSettingsManager,
  'portfolio-settings': PortfolioSettings,
  'automation-settings': AutomationSettings,
  'general-settings': GeneralSettings,
};

const ContributionAdminConsole = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const ActiveComponent = SECTION_COMPONENTS[activeSection] || AdminOverview;

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--background)' }}>
      <ConfigurationSidebar active={activeSection} onChange={setActiveSection} />

      <main style={{ flex: 1, padding: '0.5rem 0 2rem 0', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: 'clamp(1rem, 3vw, 1.5rem)', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContributionAdminConsole;
