import React from 'react';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const AdminCreateAnnouncement = () => {
  return (
    <div className="admin-dashboard-page">
      <AnnouncementForm onSuccess={() => window.location.href = '/admin/announcements'} />
    </div>
  );
};

export default AdminCreateAnnouncement;
