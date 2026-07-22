import SimpleLoader from '../../components/common/SimpleLoader';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ContributionDetail from '../../components/contributions/ContributionDetail';

const ContributionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1000px', margin: '0 auto' }}>
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/contributions')}
        className="btn btn-secondary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Back to My Contributions
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}
      >
        {id ? (
          <ContributionDetail
            contributionId={id}
            onClose={() => navigate('/contributions')}
            onContinueEdit={(contrib) => navigate(`/contributions/${contrib.contributionId || contrib._id}/edit`)}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <SimpleLoader />
            <SimpleLoader />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContributionDetailPage;
