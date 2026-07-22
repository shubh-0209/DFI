import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Clock, Users, CalendarCheck, Search, Download } from 'lucide-react';
import { adminGetAttendance } from "../../services/attendanceService";
import toast from 'react-hot-toast';
import StatusBadge from "../../components/volunteer/StatusBadge";


const AdminAttendance = () => {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const listRes = await adminGetAttendance();
        if (listRes.success) {
          setStats(listRes.data?.stats || null);
          setRecords(listRes.data?.records || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);



  const [headerActionsEl, setHeaderActionsEl] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('dashboard-header-actions');
      if (el) setHeaderActionsEl(el);
    }, 0);
  }, []);

  return (
    <div className="page-container" style={{ padding: '0.5rem 0 2rem 0' }}>
      {headerActionsEl && createPortal(
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Export
          </button>
        </div>,
        headerActionsEl
      )}

      {loading ? <SimpleLoader /> : (
        <>
          {stats && (
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stats.todayPresent ?? 0}</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>Present Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stats.todayAbsent ?? 0}</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>Absent Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><Clock size={24} /></div>
                <div><div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stats.totalHoursToday ?? 0}</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>Hours Logged Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}><CalendarCheck size={24} /></div>
                <div><div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stats.programsRunning ?? 0}</div><div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>Active Programs</div></div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Today's Check-ins</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                  <input type="text" placeholder="Search..." className="form-control" style={{ paddingLeft: '2.25rem' }} />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Volunteer</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Program</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Check In</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Check Out</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{record.volunteerName}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-base)' }}>{record.programTitle}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-base)', color: 'var(--color-body)' }}>{record.checkInTime || '-'}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-base)', color: 'var(--color-body)' }}>{record.checkOutTime || '-'}</td>
                      <td style={{ padding: '1rem 1.5rem' }}><StatusBadge status={record.status} /></td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>{record.hoursWorked || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAttendance;
