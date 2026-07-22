import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AttendanceCalendar = ({ records = [], selectedMonth = new Date(), onMonthChange }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Create array of day objects
  const days = [];
  
  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    days.push({ empty: true, key: `empty-start-${i}` });
  }
  
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const record = records.find(r => {
      if (!r) return false;
      const rDate = r.attendanceDate 
        ? new Date(r.attendanceDate).toISOString().split('T')[0] 
        : r.date;
      return rDate === dateStr;
    });
    days.push({
      date: i,
      fullDate: dateStr,
      status: record?.status || 'none',
      record,
      key: `day-${i}`
    });
  }

  const handlePrevMonth = () => {
    if (onMonthChange) {
      onMonthChange(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (onMonthChange) {
      onMonthChange(new Date(year, month + 1, 1));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'var(--color-success)';
      case 'absent': return 'var(--color-error)';
      case 'late': return 'var(--color-accent)';
      case 'excused': return 'var(--color-info)';
      default: return 'var(--color-border)';
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: 0 }}>{monthNames[month]} {year}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrevMonth} style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg)' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={handleNextMonth} style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '0.5rem' }}>
        {dayNames.map(day => (
          <div key={day} style={{ textAlign: 'center', color: 'var(--color-body)' }}>
            {day}
          </div>
        ))}
      </div>

      <div className="attendance-calendar">
        {days.map((day) => {
          if (day.empty) return <div key={day.key} />;
          
          return (
            <div 
              key={day.key} 
              className="attendance-calendar-day"
              style={{
                backgroundColor: 'var(--color-bg)',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredDay(day.date)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>{day.date}</span>
              
              {day.status !== 'none' && (
                <div style={{
                  position: 'absolute',
                  inset: '2px',
                  borderRadius: '4px',
                  backgroundColor: getStatusColor(day.status),
                  opacity: 0.2,
                  zIndex: 1
                }} />
              )}
              
              {day.status !== 'none' && (
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(day.status),
                  zIndex: 2
                }} />
              )}

              {/* Tooltip */}
              {hoveredDay === day.date && day.status !== 'none' && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-heading)',
                  color: 'var(--color-bg)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  marginBottom: '4px'
                }}>
                  {day.record?.programTitle && <div >{day.record.programTitle}</div>}
                  <div style={{ textTransform: 'capitalize' }}>{day.status} {day.record?.hoursWorked ? `(${day.record.hoursWorked}h)` : ''}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', color: 'var(--color-body)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} /> Present
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-error)' }} /> Absent
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} /> Late
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-info)' }} /> Excused
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
