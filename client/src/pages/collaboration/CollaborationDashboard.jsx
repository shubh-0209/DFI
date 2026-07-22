import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Users, RefreshCw, AlertCircle, X } from 'lucide-react';
import { getWorkspaces, createWorkspace, joinWorkspace, leaveWorkspace, getPendingInvitations, acceptInvitation, declineInvitation } from '../../services/collaborationService';
import WorkspaceCard from '../../components/collaboration/WorkspaceCard';
import CollaborationSkeleton from '../../components/collaboration/CollaborationSkeleton';
import CollaborationEmptyState from '../../components/collaboration/CollaborationEmptyState';
import CollaborationFilters from '../../components/collaboration/CollaborationFilters';
import InvitationBanner from '../../components/collaboration/InvitationBanner';

const PAGE_SIZE = 12;

const CollaborationDashboard = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [invitationLoading, setInvitationLoading] = useState(false);

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE };
    if (search) p.search = search;
    return p;
  }, [page, search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['collaboration-workspaces', params],
    queryFn: async () => {
      setError(null);
      const res = await getWorkspaces(params);
      if (res.success) return res.data;
      throw new Error(res.message || 'Failed to load workspaces');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const { data: invitationsData } = useQuery({
    queryKey: ['collaboration-invitations'],
    queryFn: async () => {
      const res = await getWorkspaces({ limit: 100 });
      if (res.success) {
        const allInvitations = [];
        for (const ws of res.data?.workspaces || []) {
          const invRes = await getPendingInvitations(ws._id);
          if (invRes.success && invRes.data?.invitations?.length > 0) {
            allInvitations.push(...invRes.data.invitations.map(inv => ({ ...inv, workspaceName: ws.name, workspaceId: ws._id })));
          }
        }
        return allInvitations;
      }
      return [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (invitationsData) {
      setInvitations(invitationsData);
    }
  }, [invitationsData]);

  const createMutation = useMutation({
    mutationFn: async (formData) => createWorkspace(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspaces']);
      setShowCreateModal(false);
      setCreateName('');
      setCreateDescription('');
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (id) => joinWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspaces']);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async (id) => leaveWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspaces']);
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: async ({ workspaceId, token }) => acceptInvitation(workspaceId, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['collaboration-workspaces']);
      queryClient.invalidateQueries(['collaboration-invitations']);
      setInvitations(prev => prev.filter(inv => inv.token !== variables.token));
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: async ({ workspaceId, token }) => declineInvitation(workspaceId, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['collaboration-invitations']);
      setInvitations(prev => prev.filter(inv => inv.token !== variables.token));
    },
  });

  const handleAcceptInvitation = (invitation) => {
    setInvitationLoading(true);
    acceptInvitationMutation.mutate({ workspaceId: invitation.workspaceId, token: invitation.token }, {
      onSettled: () => setInvitationLoading(false),
    });
  };

  const handleDeclineInvitation = (invitation) => {
    setInvitationLoading(true);
    declineInvitationMutation.mutate({ workspaceId: invitation.workspaceId, token: invitation.token }, {
      onSettled: () => setInvitationLoading(false),
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createName.trim()) return;
    createMutation.mutate({ name: createName.trim(), description: createDescription.trim() || undefined });
  };

  const workspaces = data?.workspaces || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1240, margin: '0 auto', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '0.5rem' }}>
          ← Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Users size={26} style={{ color: 'var(--color-primary)', flexShrink: 0 }} aria-hidden="true" />
            <h1 style={{ color: 'var(--color-heading)', margin: 0 }}>Collaboration</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} aria-hidden="true" /> New Workspace
          </motion.button>
        </div>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Create and manage collaborative workspaces with your team.</p>
      </motion.div>

      <CollaborationFilters search={search} onSearchChange={setSearch} onClear={() => setSearch('')} />

      <InvitationBanner
        invitations={invitations}
        onAccept={handleAcceptInvitation}
        onDecline={handleDeclineInvitation}
        loading={invitationLoading}
      />

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <AlertCircle size={18} aria-hidden="true" /> {error}
        </motion.div>
      )}

      {isFetching && !isLoading && (
        <div style={{ marginBottom: '1rem', color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.4rem' }} aria-live="polite">
          <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Refreshing...
        </div>
      )}

      {isLoading ? (
        <CollaborationSkeleton count={PAGE_SIZE} />
      ) : workspaces.length === 0 && !error ? (
        <CollaborationEmptyState
          title="No workspaces found"
          description={search ? 'Try adjusting your search to find what you are looking for.' : 'Create your first workspace to start collaborating with your team.'}
          action={!search ? { label: 'Create Workspace', onClick: () => setShowCreateModal(true) } : null}
        />
      ) : (
        <>
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
          >
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onJoin={(id) => joinMutation.mutate(id)}
                onLeave={(id) => leaveMutation.mutate(id)}
                isMember={workspace.isMember}
                isCreator={workspace.isCreator}
              />
            ))}
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 1}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', opacity: page === 1 ? 0.5 : 1 }}
              >
                Previous
              </motion.button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', color: 'var(--color-body)' }}>
                Page {page} of {totalPages}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', opacity: page === totalPages ? 0.5 : 1 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="card" style={{ position: 'relative', width: '100%', maxWidth: '500px', padding: '2rem', zIndex: 10, boxShadow: 'var(--shadow-xl)' }}>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCreateModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-body)', padding: '0.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Close create workspace modal"
              >
                <X size={20} />
              </motion.button>
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-heading)' }}>Create Workspace</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ws-name">Workspace Name</label>
                  <input id="ws-name" type="text" value={createName} onChange={(e) => setCreateName(e.target.value)} className="form-control" placeholder="e.g. Event Planning Team" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ws-desc">Description (optional)</label>
                  <textarea id="ws-desc" value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} className="form-control" rows={3} placeholder="What is this workspace for?" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="btn btn-primary"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Workspace'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaborationDashboard;
