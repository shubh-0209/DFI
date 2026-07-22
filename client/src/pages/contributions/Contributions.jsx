import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getCategories, getContributions, getFeaturedContributions, getContributionStats, getContributionTimeline } from '../../services/contributionService';
import ContributionHero from '../../components/contributions/ContributionHero';
import ContributionStatsCard from '../../components/contributions/ContributionStatsCard';
import ContributionCategoryCard from '../../components/contributions/ContributionCategoryCard';
import ContributionList from '../../components/contributions/ContributionList';
import ContributionFilterBar from '../../components/contributions/ContributionFilterBar';
import ContributionSearch from '../../components/contributions/ContributionSearch';

import ContributionTimeline from '../../components/contributions/ContributionTimeline';
import ContributionCard from '../../components/contributions/ContributionCard';
import { Award, Clock, Briefcase, Star, Trophy, Flame } from 'lucide-react';

const Contributions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['contribution-stats'],
    queryFn: getContributionStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['contribution-categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: contributions, isLoading: contributionsLoading } = useQuery({
    queryKey: ['contributions', { search: searchQuery, ...filters, category: selectedCategory }],
    queryFn: async () => {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filters.status) params.status = filters.status;
      if (selectedCategory) params.category = selectedCategory;
      return getContributions(params);
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-contributions'],
    queryFn: getFeaturedContributions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['contribution-timeline'],
    queryFn: getContributionTimeline,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isLoading = statsLoading || categoriesLoading || contributionsLoading || featuredLoading || timelineLoading;
  
  if (isLoading) {
    return <SimpleLoader />;
  }

  const statCards = [
    { label: 'Approved', value: stats?.approvedContributions ?? 0, icon: <Award size={20} />, color: 'success' },
    { label: 'Pending', value: stats?.pendingReviews ?? 0, icon: <Clock size={20} />, color: 'warning' },
    { label: 'Coins', value: stats?.coinsEarned ?? 0, icon: <Trophy size={20} />, color: 'primary' },
    { label: 'Hours', value: stats?.hoursContributed ?? 0, icon: <Flame size={20} />, color: 'accent' },
    { label: 'Featured', value: stats?.featuredContributions ?? 0, icon: <Star size={20} />, color: 'purple' },
    { label: 'Level', value: stats?.currentLevel ?? 'New', icon: <Briefcase size={20} />, color: 'info', suffix: '' },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleStartContributing = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <ContributionHero onStartContributing={handleStartContributing} />

      {/* Statistics Section */}
      <section style={{ background: 'white', padding: '3rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Your Impact at a Glance
            </h2>
            <p style={{ color: 'var(--color-body)', maxWidth: '480px', margin: '0 auto' }}>
              Track your contributions, coins, and progress in real time.
            </p>
          </div>
          {statsLoading ? (
            <SimpleLoader />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              {statCards.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ContributionStatsCard
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    color={stat.color}
                    suffix={stat.suffix}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ background: 'var(--color-bg)', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Contribution Categories
            </h2>
            <p style={{ color: 'var(--color-body)', maxWidth: '520px', margin: '0 auto' }}>
              Choose a category that matches your skills and start making an impact.
            </p>
          </div>
          {categoriesLoading ? (
            <SimpleLoader />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
              {(categories || []).map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ContributionCategoryCard
                    category={category}
                    onClick={handleCategoryClick}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Contributions Section */}
      <section style={{ background: 'white', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Recent Contributions
            </h2>
            <p style={{ color: 'var(--color-body)', maxWidth: '520px', margin: '0 auto' }}>
              See the latest work from volunteers across the platform.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <ContributionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search contributions..." />
            <ContributionFilterBar filters={filters} onFilterChange={setFilters} categories={categories || []} />
          </div>

          <ContributionList
            contributions={contributions}
            loading={contributionsLoading}
            emptyTitle="No contributions found"
            emptyDescription="Be the first to share your work and inspire others."
            action={{ label: 'Start Contributing', onClick: handleStartContributing }}
          />
        </div>
      </section>

      {/* Featured Contributions Section */}
      <section style={{ background: 'var(--color-bg)', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Featured Contributions
            </h2>
            <p style={{ color: 'var(--color-body)', maxWidth: '520px', margin: '0 auto' }}>
              Outstanding work verified and highlighted by our partner NGOs.
            </p>
          </div>
          {featuredLoading ? (
            <SimpleLoader />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
              {(featured || []).map((item, i) => (
                <motion.div
                  key={item._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ContributionCard contribution={item} />
                </motion.div>
              ))}
            </div>
          )}
          {!featuredLoading && (!featured || featured.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-body)' }}>
              <Star size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>No featured contributions yet. Keep contributing to get featured!</p>
            </div>
          )}
        </div>
      </section>

      {/* Timeline / How It Works */}
      <section style={{ background: 'white', padding: '4rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              How Contributions Work
            </h2>
            <p style={{ color: 'var(--color-body)', maxWidth: '520px', margin: '0 auto' }}>
              From creation to recognition — a transparent journey for every contribution.
            </p>
          </div>
          {timelineLoading ? (
            <SimpleLoader />
          ) : (
            <ContributionTimeline steps={timeline} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'var(--primary-blue)', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>
              Ready to Make an Impact?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '480px', margin: '0 auto 2rem' }}>
              Join thousands of volunteers who are already contributing to social change.
            </p>
            <button onClick={handleStartContributing} className="btn" style={{ background: 'white', color: 'var(--color-primary)', padding: '0.875rem 2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              Start Contributing Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contributions;
