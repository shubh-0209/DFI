import React from 'react';
import { Clock, Eye, Check, X, Hourglass, AlertCircle, Info, Activity, Award } from 'lucide-react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const getStatusConfig = (statusString) => {
    switch (statusString?.toLowerCase()) {
      case 'pending':
        return { color: 'badge-orange', icon: Clock, label: 'Pending' };
      case 'under_review':
        return { color: 'badge-blue', icon: Eye, label: 'Under Review' };
      case 'approved':
        return { color: 'badge-green', icon: Check, label: 'Approved' };
      case 'rejected':
        return { color: 'badge-red', icon: X, label: 'Rejected' };
      case 'waitlisted':
        return { color: 'badge-purple', icon: Hourglass, label: 'Waitlisted' };
      case 'present':
        return { color: 'badge-green', icon: Check, label: 'Present' };
      case 'absent':
        return { color: 'badge-red', icon: X, label: 'Absent' };
      case 'late':
        return { color: 'badge-orange', icon: AlertCircle, label: 'Late' };
      case 'excused':
        return { color: 'badge-blue', icon: Info, label: 'Excused' };
      case 'active':
        return { color: 'badge-green', icon: Activity, label: 'Active' };
      case 'completed':
        return { color: 'badge-purple', icon: Award, label: 'Completed' };
      default:
        return { color: 'badge-blue', icon: Info, label: statusString || 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const padding = size === 'lg' ? '0.5rem 1rem' : size === 'md' ? '0.35rem 0.75rem' : '0.25rem 0.6rem';
  const fontSize = size === 'lg' ? '0.9rem' : size === 'md' ? '0.8rem' : '0.75rem';
  const iconSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12;

  return (
    <span className={`badge ${config.color}`} style={{ padding, fontSize }}>
      <Icon size={iconSize} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
