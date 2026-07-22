import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const AdminCreateAnnouncement = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-dashboard-page">
      <AnnouncementForm onSuccess={() => navigate('/admin/announcements')} />
    </div>
  );
};

export default AdminCreateAnnouncement;
