import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CalendarCheck, Award, Flame } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import StatCard from '../../components/volunteer/StatCard';

import AttendanceCalendar from '../../components/volunteer/AttendanceCalendar';
import CheckInButton from '../../components/volunteer/CheckInButton';
import SimpleLoader from '../../components/common/SimpleLoader';

const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const { 
    attendanceDashboard, 
    attendanceLoading, 
    fetchAttendanceDashboard,
    checkInStatus,
    volunteerHours,
    fetchVolunteerHours,
    joinedPrograms,
    fetchJoinedPrograms
  } = useVolunteer();

  useEffect(() => {
    fetchAttendanceDashboard();
    fetchVolunteerHours();
    fetchJoinedPrograms();
  }, [fetchAttendanceDashboard, fetchVolunteerHours, fetchJoinedPrograms]);

  if (attendanceLoading || !attendanceDashboard) {
    return <div className="page-container" style={{ padding: '2rem' }}><SimpleLoader /></div>;
  }

  const activePrograms = joinedPrograms.filter(
    (p) => p && (p.status === 'ongoing' || p.status === 'published' || p.status === 'active')
  );

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Attendance Hub</h1>
          <p style={{ color: 'var(--color-body)' }}>Track your volunteering sessions, hours, and milestones.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/attendance/history')} className="btn btn-secondary">
            View History
          </button>
          <button onClick={() => navigate('/attendance/hours')} className="btn btn-secondary">
            Hours Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard 
          icon={<Clock size={24} />} 
          value={volunteerHours?.today || 0} 
          label="Hours Today" 
          color="primary"
          suffix="h"
        />
        <StatCard 
          icon={<CalendarCheck size={24} />} 
          value={attendanceDashboard.summary?.presentCount || 0} 
          label="Sessions Attended" 
          color="secondary"
        />
        <StatCard 
          icon={<Flame size={24} />} 
          value={`${attendanceDashboard.summary?.attendanceRate || 0}%`} 
          label="Attendance Rate" 
          color="accent"
        />
        <StatCard 
          icon={<Award size={24} />} 
          value={volunteerHours?.lifetime || 0} 
          label="Lifetime Hours" 
          color="purple"
          suffix="h"
        />
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        
        {/* Left Col - Check In & Today */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <motion.div 
            className="card glow-card"
            whileHover={{ y: -4, boxShadow: 'var(--shadow-xl)' }}
            style={{ 
              textAlign: 'center', 
              padding: '2.5rem 2rem',
              background: checkInStatus.checkedIn 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' 
                : 'var(--color-card)',
              border: checkInStatus.checkedIn ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--color-border)'
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>
              {checkInStatus.checkedIn ? 'You are checked in!' : 'Ready to volunteer?'}
            </h3>
            <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
              {checkInStatus.checkedIn 
                ? 'Don\'t forget to check out when you finish your session.' 
                : 'Record your attendance to start tracking your hours.'}
            </p>
            
            {checkInStatus.checkedIn ? (
              <button 
                onClick={() => navigate('/attendance/checkout')} 
                className="btn btn-primary check-out-hero"
                style={{ width: '100%', padding: '1rem' }}
              >
                Check Out Now
              </button>
            ) : (
              <CheckInButton 
                onCheckIn={() => navigate('/attendance/check-in')} 
                disabled={activePrograms.length === 0}
              />
            )}
            
            {activePrograms.length === 0 && !checkInStatus.checkedIn && (
              <p style={{ color: 'var(--color-error)', marginTop: '1rem' }}>
                You need an active program to check in.
              </p>
            )}
          </motion.div>

          {/* Recent Sessions */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarCheck size={18} className="text-primary" /> Recent Sessions
            </h3>
            
            {attendanceDashboard.recentAttendance?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(attendanceDashboard.recentAttendance || []).slice(0, 3).map(session => (
                  <div key={session._id} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)',
                      padding: '0.5rem', borderRadius: 'var(--radius-sm)', minWidth: '55px'
                    }}>
                      <span style={{ textTransform: 'uppercase' }}>
                        {new Date(session.attendanceDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span >
                        {new Date(session.attendanceDate).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{session.program?.title || 'Program Session'}</h4>
                      <div style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={12} /> {session.totalHours ? `${session.totalHours} hours` : session.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-body)', textAlign: 'center', padding: '2rem 0' }}>
                No recent sessions found.
              </p>
            )}
          </div>
        </div>

        {/* Right Col - Calendar */}
        <div style={{ gridColumn: 'span 2' }}>
          <AttendanceCalendar 
            records={attendanceDashboard.recentAttendance || []} 
            selectedMonth={new Date()}
          />
        </div>
        
      </div>
    </div>
  );
};

export default AttendanceDashboard;
