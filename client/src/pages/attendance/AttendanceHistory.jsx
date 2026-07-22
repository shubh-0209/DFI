import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVolunteer } from '../../context/VolunteerContext';
import AttendanceCard from '../../components/volunteer/AttendanceCard';
import SearchFilter from '../../components/volunteer/SearchFilter';
import Pagination from '../../components/volunteer/Pagination';

import EmptyState from '../../components/volunteer/EmptyState';
import { Download } from 'lucide-react';

const AttendanceHistory = () => {
  const { attendanceHistory, attendanceLoading, fetchAttendanceHistory, joinedPrograms, fetchJoinedPrograms } = useVolunteer();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination config
  const itemsPerPage = 8;
  
  useEffect(() => {
    if (fetchJoinedPrograms && joinedPrograms.length === 0) {
      fetchJoinedPrograms();
    }
  }, [fetchJoinedPrograms, joinedPrograms.length]);

  useEffect(() => {
    fetchAttendanceHistory({ ...activeFilters, search: searchValue, page: currentPage, limit: itemsPerPage });
  }, [fetchAttendanceHistory, activeFilters, searchValue, currentPage]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchValue('');
    setCurrentPage(1);
  };

  const programOptions = [
    { value: 'all', label: 'All Programs' },
    ...joinedPrograms.map(p => ({ value: p._id || p.id, label: p.title || p.programTitle || 'Untitled Program' }))
  ];

  const records = attendanceHistory?.records || [];
  const pagination = attendanceHistory?.pagination || {};

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'tabs',
      options: [
        { value: 'all', label: 'All' },
        { value: 'present', label: 'Present' },
        { value: 'absent', label: 'Absent' },
        { value: 'late', label: 'Late' },
        { value: 'excused', label: 'Excused' }
      ]
    },
    {
      key: 'program',
      label: 'Program',
      type: 'select',
      options: programOptions
    },
    {
      key: 'month',
      label: 'Month',
      type: 'select',
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'current', label: 'This Month' },
        { value: 'last', label: 'Last Month' },
        { value: '3months', label: 'Last 3 Months' }
      ]
    }
  ];

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Attendance History</h1>
          <p style={{ color: 'var(--color-body)' }}>Review all your past volunteering sessions.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <SearchFilter 
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          placeholder="Search by program name or location..."
        />
      </div>

      {attendanceLoading ? (
        <SimpleLoader />
      ) : records.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {records.map(record => (
            <AttendanceCard key={record._id || record.id || record.attendanceId} record={record} />
          ))}
          
          <Pagination 
            currentPage={currentPage}
            totalPages={pagination.totalPages || Math.ceil((pagination.total || records.length) / itemsPerPage) || 1}
            onPageChange={setCurrentPage}
            totalItems={pagination.total || records.length}
            itemsPerPage={itemsPerPage}
          />
        </motion.div>
      ) : (
        <EmptyState 
          type="attendance"
          title="No records found"
          description="We couldn't find any attendance records matching your current filters."
          action={{ label: 'Clear Filters', onClick: clearFilters }}
        />
      )}
    </div>
  );
};

export default AttendanceHistory;
