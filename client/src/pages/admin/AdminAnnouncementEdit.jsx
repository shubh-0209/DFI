import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const AdminEditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '0.5rem 0 2rem 0', maxWidth: 900, margin: '0 auto', minHeight: '100vh' }}>
      <AnnouncementForm announcementId={id} onSuccess={() => navigate('/admin/announcements')} />
    </div>
  );
};

export default AdminEditAnnouncement;
