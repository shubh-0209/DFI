import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import ApplicationCard from '../../components/volunteer/ApplicationCard';

import EmptyState from '../../components/volunteer/EmptyState';
import ConfirmModal from '../../components/volunteer/ConfirmModal';

const MyApplications = () => {
  const navigate = useNavigate();
  const { 
    applications, 
    applicationsLoading, 
    applicationsError, 
    applicationStats,
    fetchApplications,
    withdrawApplication
  } = useVolunteer();

  const [activeTab, setActiveTab] = useState('all');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    fetchApplications(activeTab !== 'all' ? { status: activeTab } : {});
  }, [activeTab, fetchApplications]);

  if (applicationsLoading) {
    return <SimpleLoader />;
  }

  const handleWithdrawClick = (id) => {
    setSelectedAppId(id);
    setWithdrawModalOpen(true);
  };

  const confirmWithdraw = async () => {
    if (selectedAppId) {
      await withdrawApplication(selectedAppId);
      setWithdrawModalOpen(false);
      setSelectedAppId(null);
    }
  };

  const tabs = [
    { id: 'all',       label: 'All Applications' },
    { id: 'applied',   label: 'Pending Review'   },
    { id: 'approved',  label: 'Approved'          },
    { id: 'joined',    label: 'Joined'            },
    { id: 'rejected',  label: 'Rejected'          },
    { id: 'withdrawn', label: 'Withdrawn'         },
  ];

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>My Applications</h1>
          <p style={{ color: 'var(--color-body)' }}>Track the status of your volunteer applications.</p>
        </div>
      </div>

      {/* Stats Summary */}
      {!applicationsLoading && applicationStats && (
        <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><Clock size={24} /></div>
            <div><div >{applicationStats.pending ?? applicationStats.applied ?? 0}</div><div style={{ color: 'var(--color-body)' }}>Pending</div></div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><CheckCircle size={24} /></div>
            <div><div >{applicationStats.approved ?? applicationStats.joined ?? 0}</div><div style={{ color: 'var(--color-body)' }}>Approved</div></div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: '50%' }}><XCircle size={24} /></div>
            <div><div >{applicationStats.rejected ?? 0}</div><div style={{ color: 'var(--color-body)' }}>Rejected</div></div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', borderRadius: '50%' }}><Filter size={24} /></div>
            <div><div >{applicationStats.total ?? 0}</div><div style={{ color: 'var(--color-body)' }}>Total</div></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeTab === tab.id ? '#fff' : 'var(--color-heading)',
              border: `1px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {applicationsError && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {applicationsError}
        </div>
      )}

      {/* Grid */}
      {applications.length > 0 ? (
        <div className="grid grid-cols-3">
          {applications.map((app) => (
            <ApplicationCard 
              key={app.id} 
              application={app} 
              onViewDetails={(id) => navigate(`/applications/${id}`)}
              onWithdraw={handleWithdrawClick}
              onContact={(email) => window.location.href = `mailto:${email}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          type="applications"
          title="No applications found"
          description={activeTab === 'all' ? "You haven't applied to any programs yet." : `No applications found with status '${activeTab}'.`}
          action={activeTab === 'all' ? { label: 'Find Programs', onClick: () => navigate('/programs') } : null}
        />
      )}

      <ConfirmModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onConfirm={confirmWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmLabel="Withdraw"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MyApplications;
