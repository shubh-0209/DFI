import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, CheckCircle, MapPin } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import StatusBadge from '../../components/volunteer/StatusBadge';
import CoordinatorCard from '../../components/volunteer/CoordinatorCard';
import ApplicationTimeline from '../../components/volunteer/ApplicationTimeline';
import ConfirmModal from '../../components/volunteer/ConfirmModal';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentApplication, fetchApplicationById, applicationsLoading, withdrawApplication } = useVolunteer();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  useEffect(() => {
    fetchApplicationById(id);
  }, [id, fetchApplicationById]);

  if (applicationsLoading || !currentApplication) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <SimpleLoader />
      </div>
    );
  }

  const isPending = currentApplication.status === 'pending' || currentApplication.status === 'under_review';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container" 
      style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}
    >
      <button 
        onClick={() => navigate(-1)} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: 0, backgroundColor: 'transparent', color: 'var(--color-body)' }}
      >
        <ArrowLeft size={18} /> Back to Applications
      </button>

      {/* Header Banner */}
      <div className="card" style={{ 
        padding: 0, 
        overflow: 'hidden', 
        marginBottom: '2rem',
        border: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ 
          background: currentApplication.bannerColor || 'var(--gradient-primary)', 
          padding: '2.5rem 2rem', 
          color: '#fff',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
            <StatusBadge status={currentApplication.status} size="lg" />
          </div>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '99px', display: 'inline-block', marginBottom: '1rem' }}>
            {currentApplication.programCategory}
          </span>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{currentApplication.programTitle}</h1>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {currentApplication.programLocation}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Applied: {new Date(currentApplication.appliedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column - Details */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} className="text-primary" /> Application Details
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--color-body)', marginBottom: '0.5rem' }}>Motivation Statement</h4>
              <p style={{ color: 'var(--color-heading)', backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                {currentApplication.motivationStatement}
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--color-body)', marginBottom: '0.75rem' }}>Relevant Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {currentApplication.skills?.map((skill, index) => (
                  <span key={index} style={{ padding: '0.4rem 1rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '99px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {currentApplication.documents?.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ color: 'var(--color-body)', marginBottom: '0.75rem' }}>Submitted Documents</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentApplication.documents.map((doc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                      <CheckCircle size={16} className="text-success" />
                      <span >{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {isPending && (
            <div className="card" style={{ borderColor: 'var(--color-error)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-error)' }}>Withdraw Application</h3>
              <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>
                If you are no longer able to participate in this program, you can withdraw your application. This action cannot be undone.
              </p>
              <button 
                onClick={() => setWithdrawModalOpen(true)} 
                className="btn btn-danger"
              >
                Withdraw Application
              </button>
            </div>
          )}

          <ConfirmModal
            isOpen={withdrawModalOpen}
            onClose={() => setWithdrawModalOpen(false)}
            onConfirm={async () => {
              await withdrawApplication(id);
              setWithdrawModalOpen(false);
              navigate('/applications');
            }}
            title="Withdraw Application"
            message="Are you sure you want to withdraw this application? This action cannot be undone."
            confirmLabel="Withdraw"
            confirmVariant="danger"
          />
        </div>

        {/* Right Column - Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <CoordinatorCard 
            coordinator={{
              name: currentApplication.coordinatorName,
              email: currentApplication.coordinatorEmail,
              phone: currentApplication.coordinatorPhone
            }} 
          />
          
          {currentApplication.coordinatorNotes && (
            <div className="card" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Note from Coordinator</h4>
              <p style={{ color: 'var(--color-heading)' }}>{currentApplication.coordinatorNotes}</p>
            </div>
          )}

          <ApplicationTimeline 
            timeline={currentApplication.timeline} 
            currentStatus={currentApplication.status} 
          />
          
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetails;
