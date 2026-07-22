import SimpleLoader from '../common/SimpleLoader';
import React from 'react';
import { motion } from 'framer-motion';
import ContributionCard from './ContributionCard';
import ContributionEmptyState from './ContributionEmptyState';


const ContributionList = ({ contributions, loading, emptyTitle, emptyDescription, action }) => {
  if (loading) {
    return <SimpleLoader />;
  }

  if (!contributions || contributions.length === 0) {
    return (
      <ContributionEmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={action}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
      {contributions.map((contrib, index) => (
        <motion.div
          key={contrib._id || contrib.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <ContributionCard contribution={contrib} />
        </motion.div>
      ))}
    </div>
  );
};

export default ContributionList;
