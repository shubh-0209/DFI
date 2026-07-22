import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnnouncements, deleteAnnouncement, archiveAnnouncement, publishAnnouncement, pinAnnouncement, unpinAnnouncement } from '../../services/announcementsService';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementFilters from '../../components/announcements/AnnouncementFilters';
import AnnouncementSkeleton from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import AnnouncementPagination from '../../components/announcements/AnnouncementPagination';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const PAGE_SIZE = 9;

const AdminAnnouncementDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE, sortBy: 'createdAt', order: 'desc' };
    if (search) p.search = search;
    if (type) p.type = type;
    if (priority) p.priority = priority;
    if (status) p.status = status;
    return p;
  }, [page, search, type, priority, status]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-announcements', params],
    queryFn: async () => {
      setError(null);
      const res = await getAnnouncements(params);
      if (res.success) {
        return { announcements: res.data?.announcements || [], total: res.data?.pagination?.total || 0, page: res.data?.pagination?.page || 1, totalPages: res.data?.pagination?.totalPages || 1 };
      }
      throw new Error(res.message || 'Failed to load announcements');
    },
    staleTime: 0,               // always fetch fresh — admin edits data directly
    refetchOnWindowFocus: true, // catch changes made in other tabs
  });

  const announcements = data?.announcements || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      setDeleting(true);
      const res = await deleteAnnouncement(confirmDelete);
      if (res.success) {
        toast.success('Announcement deleted successfully');
        setConfirmDelete(null);
        queryClient.invalidateQueries(['admin-announcements']);
        queryClient.invalidateQueries(['announcements']);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await publishAnnouncement(id);
      if (res.success) { toast.success('Announcement published'); queryClient.invalidateQueries(['admin-announcements']); }
    } catch (err) { toast.error(err.message || 'Failed to publish'); }
  };

  const handleArchive = async (id) => {
    try {
      const res = await archiveAnnouncement(id);
      if (res.success) { toast.success('Announcement archived'); queryClient.invalidateQueries(['admin-announcements']); }
    } catch (err) { toast.error(err.message || 'Failed to archive'); }
  };

  const handlePin = async (id) => {
    try {
      const res = await pinAnnouncement(id);
      if (res.success) {
        toast.success('Announcement pinned successfully');
        queryClient.invalidateQueries(['admin-announcements']);
        queryClient.invalidateQueries(['announcements']);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to pin announcement');
    }
  };

  const handleUnpin = async (id) => {
    try {
      const res = await unpinAnnouncement(id);
      if (res.success) {
        toast.success('Announcement unpinned successfully');
        queryClient.invalidateQueries(['admin-announcements']);
        queryClient.invalidateQueries(['announcements']);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to unpin announcement');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setPriority('');
    setStatus('');
  };

  const [headerActionsEl, setHeaderActionsEl] = useState(null);
  
  useEffect(() => {
    // Wait for the next tick to ensure layout is mounted
    setTimeout(() => {
      const el = document.getElementById('dashboard-header-actions');
      if (el) setHeaderActionsEl(el);
    }, 0);
  }, []);

  return (
    <div className="admin-dashboard-page">
      {headerActionsEl && createPortal(
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/admin/announcements/create')}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} aria-hidden="true" /> Create Announcement
        </motion.button>,
        headerActionsEl
      )}

      <AnnouncementFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} priority={priority} onPriorityChange={setPriority} status={status} onStatusChange={setStatus} showAdminFilters={true} onClear={handleClearFilters} />

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <AlertCircle size={18} aria-hidden="true" /> {error}
        </motion.div>
      )}


      {isLoading ? (
        <AnnouncementSkeleton count={PAGE_SIZE} />
      ) : announcements.length === 0 ? (
        <AnnouncementEmptyState title="No announcements found" description="Create your first announcement to broadcast important updates to your users." onAction={() => navigate('/admin/announcements/create')} actionLabel="Create Announcement" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id || announcement.announcementId}
                announcement={announcement}
                onClick={() => navigate(`/announcements/${announcement._id || announcement.announcementId}`)}
                showActions={true}
                onPublish={handlePublish}
                onArchive={handleArchive}
                onDelete={(id) => setConfirmDelete(id)}
                onPin={handlePin}
                onUnpin={handleUnpin}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <AnnouncementPagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={PAGE_SIZE} onPageChange={(newPage) => { setPage(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          )}
        </>
      )}

      <ConfirmModal isOpen={Boolean(confirmDelete)} title="Delete Announcement" message="Are you sure you want to permanently delete this announcement? This action cannot be undone." onCancel={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default AdminAnnouncementDashboard;
