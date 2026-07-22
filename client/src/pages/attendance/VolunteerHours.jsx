import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, Target, Heart } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import VolunteerHoursCard from '../../components/volunteer/VolunteerHoursCard';
import HoursChart from '../../components/volunteer/HoursChart';


const VolunteerHours = () => {
  const { volunteerHours, hoursLoading, fetchVolunteerHours } = useVolunteer();

  useEffect(() => {
    fetchVolunteerHours();
  }, [fetchVolunteerHours]);

  if (hoursLoading || !volunteerHours) {
    return <div className="page-container" style={{ padding: '2rem' }}><SimpleLoader /></div>;
  }

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Volunteer Hours</h1>
          <p style={{ color: 'var(--color-body)' }}>Track your impact and download your certificates.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> Download Summary Report
        </button>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <VolunteerHoursCard period="today" hours={volunteerHours.today} trend={12} icon={Heart} />
        <VolunteerHoursCard period="week" hours={volunteerHours.thisWeek} trend={5} />
        <VolunteerHoursCard period="month" hours={volunteerHours.thisMonth} trend={-2} />
        <VolunteerHoursCard period="lifetime" hours={volunteerHours.lifetime} icon={Award} />
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
        <HoursChart 
          data={volunteerHours.weeklyData} 
          type="weekly" 
          title="Hours Logged This Week" 
        />
        <HoursChart 
          data={volunteerHours.monthlyData} 
          type="monthly" 
          title="Hours Trend (Last 6 Months)" 
        />
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>

        {/* Breakdown */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Hours by Program</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {volunteerHours.programBreakdown?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-heading)' }}>{item.program}</span>
                    <span style={{ color: 'var(--color-heading)' }}>{item.hours} hrs</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.hours / volunteerHours.lifetime) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      style={{ height: '100%', backgroundColor: item.color || 'var(--color-primary)', borderRadius: '99px' }}
                    />
                  </div>
                </div>
                <div style={{ color: 'var(--color-body)', width: '40px', textAlign: 'right' }}>
                  {Math.round((item.hours / volunteerHours.lifetime) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification / Goals */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} className="text-accent" /> Next Milestone
          </h3>

          <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              100
            </div>
            <div style={{ color: 'var(--color-body)' }}>Bronze Volunteer Badge</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-body)' }}>Progress</span>
              <span style={{ color: 'var(--color-primary)' }}>{volunteerHours.lifetime} / 100 hrs</span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(volunteerHours.lifetime / 100) * 100}%`, backgroundColor: 'var(--color-primary)', borderRadius: '99px' }} />
            </div>
            <p style={{ color: 'var(--color-body)', marginTop: '0.75rem', textAlign: 'center' }}>
              You are {100 - volunteerHours.lifetime} hours away from your next badge!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerHours;
