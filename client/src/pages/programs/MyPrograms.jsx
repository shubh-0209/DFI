import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, ShieldCheck } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import JoinedProgramCard from '../../components/volunteer/JoinedProgramCard';

import EmptyState from '../../components/volunteer/EmptyState';

const MyPrograms = () => {
  const navigate = useNavigate();
  const { joinedPrograms, joinedProgramsLoading, fetchJoinedPrograms } = useVolunteer();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJoinedPrograms();
  }, [fetchJoinedPrograms]);

  const filteredPrograms = joinedPrograms.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const activeCount = joinedPrograms.filter(
    (p) => p && (p.status === 'ongoing' || p.status === 'published' || p.status === 'active')
  ).length;
  const completedCount = joinedPrograms.filter(p => p.status === 'completed').length;

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>My Enrolled Programs</h1>
          <p style={{ color: 'var(--color-body)' }}>Manage your active volunteer programs and track progress.</p>
        </div>
        <button onClick={() => navigate('/programs')} className="btn btn-primary">
          Find New Programs
        </button>
      </div>

      {!joinedProgramsLoading && joinedPrograms.length > 0 && (
        <div className="grid grid-cols-2" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
          <div className="card glow-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}>
              <PlayCircle size={32} />
            </div>
            <div>
              <div >{activeCount}</div>
              <div style={{ color: 'var(--color-body)' }}>Active Programs</div>
            </div>
          </div>
          <div className="card glow-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', borderRadius: '50%' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <div >{completedCount}</div>
              <div style={{ color: 'var(--color-body)' }}>Completed Programs</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['all', 'active', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '99px',
              backgroundColor: filter === status ? 'var(--color-primary)' : 'var(--color-card)',
              color: filter === status ? '#fff' : 'var(--color-heading)',
              border: `1px solid ${filter === status ? 'var(--color-primary)' : 'var(--color-border)'}`,
              textTransform: 'capitalize',
              transition: 'var(--transition-fast)'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {joinedProgramsLoading ? (
        <SimpleLoader />
      ) : filteredPrograms.length > 0 ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2" 
          style={{ gap: '2rem' }}
        >
          {filteredPrograms.map(program => (
            <JoinedProgramCard 
              key={program.id}
              program={program}
              onOpen={(id) => navigate(`/programs/${id}`)}
              onMarkAttendance={(id) => navigate(`/attendance/check-in?program=${id}`)}
              onViewCertificate={() => alert('Certificate feature coming soon!')}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState 
          type="programs"
          title="No programs found"
          description={filter === 'all' ? "You are not enrolled in any programs yet." : `You have no ${filter} programs.`}
          action={filter === 'all' ? { label: 'Explore Programs', onClick: () => navigate('/programs') } : null}
        />
      )}
    </div>
  );
};

export default MyPrograms;
