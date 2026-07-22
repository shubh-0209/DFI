import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Users, FileText, Activity, RefreshCw, AlertCircle,
  Plus, CheckCircle, Upload, Send
} from 'lucide-react';
import {
  getWorkspaceById,
  joinWorkspace,
  leaveWorkspace,
  addNote,
  addFile,
  assignTask,
  updateTaskStatus,
  getWorkspaceActivityLog,
  requestToJoin,
  getPendingJoinRequests,
  reviewJoinRequest,
  updateMemberRole,
  getActivityTimeline,
} from '../../services/collaborationService';
import MemberRoleManager from '../../components/collaboration/MemberRoleManager';
import ActivityFeed from '../../components/collaboration/ActivityFeed';
import ActivityTimeline from '../../components/collaboration/ActivityTimeline';
import CollaborationSkeleton from '../../components/collaboration/CollaborationSkeleton';
import JoinRequestBanner from '../../components/collaboration/JoinRequestBanner';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <Activity size={16} aria-hidden="true" /> },
  { id: 'members', label: 'Members', icon: <Users size={16} aria-hidden="true" /> },
  { id: 'notes', label: 'Notes', icon: <FileText size={16} aria-hidden="true" /> },
  { id: 'files', label: 'Files', icon: <Upload size={16} aria-hidden="true" /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckCircle size={16} aria-hidden="true" /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={16} aria-hidden="true" /> },
  { id: 'timeline', label: 'Timeline', icon: <Activity size={16} aria-hidden="true" /> },
];

const WorkspaceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showJoinRequestForm, setShowJoinRequestForm] = useState(false);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const [joinRequests, setJoinRequests] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['collaboration-workspace', id],
    queryFn: async () => {
      setError(null);
      const res = await getWorkspaceById(id);
      if (res.success) return res.data?.workspace;
      throw new Error(res.message || 'Failed to load workspace');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  const workspace = data;

  const { data: pendingRequestsData, refetch: refetchPendingRequests } = useQuery({
    queryKey: ['collaboration-pending-requests', id],
    queryFn: async () => {
      const res = await getPendingJoinRequests(id);
      if (res.success) return res.data?.joinRequests || [];
      return [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!id && !!workspace,
  });

  useEffect(() => {
    if (pendingRequestsData) {
      setJoinRequests(pendingRequestsData);
    }
  }, [pendingRequestsData]);

  const joinMutation = useMutation({
    mutationFn: async () => joinWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', id]);
      queryClient.invalidateQueries(['collaboration-workspaces']);
      setIsJoining(false);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => leaveWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', id]);
      queryClient.invalidateQueries(['collaboration-workspaces']);
      setIsLeaving(false);
    },
  });

  const requestToJoinMutation = useMutation({
    mutationFn: async (message) => requestToJoin(id, message),
    onSuccess: () => {
      setShowJoinRequestForm(false);
      setJoinRequestMessage('');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ requestIndex, action }) => reviewJoinRequest(id, requestIndex, action),
    onSuccess: () => {
      refetchPendingRequests();
      queryClient.invalidateQueries(['collaboration-workspace', id]);
      queryClient.invalidateQueries(['collaboration-workspaces']);
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: async ({ userId, role }) => updateMemberRole(id, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', id]);
    },
  });

  const handleJoin = () => {
    setIsJoining(true);
    joinMutation.mutate();
  };

  const handleLeave = () => {
    setIsLeaving(true);
    leaveMutation.mutate();
  };

  const handleRequestToJoin = (e) => {
    e.preventDefault();
    if (!joinRequestMessage.trim()) return;
    requestToJoinMutation.mutate(joinRequestMessage.trim());
  };

  const handleReview = (requestIndex, action) => {
    setReviewLoading(true);
    reviewMutation.mutate({ requestIndex, action }, { onSettled: () => setReviewLoading(false) });
  };

  const handleRoleChange = (userId, role) => {
    roleChangeMutation.mutate({ userId, role });
  };

  const isMember = user ? workspace?.members?.some(m => m.toString() === user._id?.toString()) : false;
  const isCreator = user ? workspace?.createdBy?._id === user._id : false;
  const isAdmin = workspace?.memberDetails?.some(m => m.userId?.toString() === user?._id?.toString() && m.role === 'admin');

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1240, margin: '0 auto' }}>
        <CollaborationSkeleton count={1} />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1240, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-error)' }}>Workspace not found</p>
        <Link to="/collaboration/workspaces" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none', display: 'inline-flex' }}>Back to Workspaces</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1240, margin: '0 auto', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <Link to="/collaboration/workspaces" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '0.5rem' }}>
          <ArrowLeft size={16} aria-hidden="true" /> Workspaces
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h1 style={{ color: 'var(--color-heading)', margin: 0 }}>
              {workspace.name}
            </h1>
            <p style={{ color: 'var(--color-body)', margin: '0.5rem 0 0' }}>
              {workspace.description || 'No description provided'}
            </p>
          </div>
          <motion.div
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
            layout
          >
            {!isMember ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleJoin}
                  disabled={joinMutation.isPending || isJoining}
                  className="btn btn-success"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {isJoining ? 'Joining...' : 'Join Workspace'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowJoinRequestForm(true)}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Send size={16} aria-hidden="true" /> Request to Join
                </motion.button>
              </>
            ) : !isCreator ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLeave}
                disabled={leaveMutation.isPending || isLeaving}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              >
                {isLeaving ? 'Leaving...' : 'Leave Workspace'}
              </motion.button>
            ) : null}
          </motion.div>
        </div>
      </motion.div>

      {showJoinRequestForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-heading)' }}>Request to Join</h4>
          <form onSubmit={handleRequestToJoin}>
            <div className="form-group">
              <label className="form-label" htmlFor="join-message">Message (optional)</label>
              <textarea id="join-message" value={joinRequestMessage} onChange={(e) => setJoinRequestMessage(e.target.value)} className="form-control" rows={2} placeholder="Introduce yourself and explain why you want to join..." />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setShowJoinRequestForm(false); setJoinRequestMessage(''); }} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={requestToJoinMutation.isPending}>
                {requestToJoinMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isAdmin && joinRequests.length > 0 && activeTab !== 'members' && (
        <JoinRequestBanner
          requests={joinRequests}
          onApprove={(idx) => handleReview(idx, 'approved')}
          onDecline={(idx) => handleReview(idx, 'declined')}
          loading={reviewLoading}
        />
      )}

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

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--color-border)',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-border) transparent' }} role="tablist" aria-label="Workspace tabs">
        {TABS.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-body)',
              backgroundColor: activeTab === tab.id ? 'rgba(37,99,235,0.05)' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              position: 'relative' }}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--color-primary)',
                  borderRadius: '2px 2px 0 0' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
            >
              {[
                { label: 'Members', value: workspace.members?.length || 0, icon: <Users size={24} aria-hidden="true" />, color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
                { label: 'Notes', value: workspace.sharedNotes?.length || 0, icon: <FileText size={24} aria-hidden="true" />, color: 'var(--color-secondary)', bg: 'rgba(16,185,129,0.08)' },
                { label: 'Files', value: workspace.sharedFiles?.length || 0, icon: <Upload size={24} aria-hidden="true" />, color: 'var(--color-info)', bg: 'rgba(37,99,235,0.08)' },
                { label: 'Tasks', value: workspace.taskAssignments?.length || 0, icon: <CheckCircle size={24} aria-hidden="true" />, color: 'var(--color-accent)', bg: 'rgba(217,119,6,0.08)' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card"
                  style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: stat.bg,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0 }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-body)', marginBottom: '0.25rem' }}>{stat.label}</div>
                    <div style={{ color: 'var(--color-heading)' }}>{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'members' && (
            <MemberRoleManager
              members={workspace.memberDetails || []}
              currentUserId={user?._id}
              workspaceCreatorId={workspace.createdBy?._id}
              onRoleChange={handleRoleChange}
              loading={roleChangeMutation.isPending}
            />
          )}

          {activeTab === 'notes' && (
            <SharedNotesTab workspaceId={id} notes={workspace.sharedNotes || []} />
          )}

          {activeTab === 'files' && (
            <FilesTab workspaceId={id} files={workspace.sharedFiles || []} />
          )}

          {activeTab === 'tasks' && (
            <TasksTab workspaceId={id} tasks={workspace.taskAssignments || []} />
          )}

          {activeTab === 'activity' && (
            <ActivityLogTab workspaceId={id} />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab workspaceId={id} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SharedNotesTab = ({ workspaceId, notes }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addMutation = useMutation({
    mutationFn: (data) => addNote(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', workspaceId]);
      setTitle('');
      setContent('');
      setIsAdding(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addMutation.mutate({ title: title.trim() || undefined, content: content.trim() });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ color: 'var(--color-heading)' }}>Shared Notes</h4>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} aria-hidden="true" /> Add Note
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="note-title">Title (optional)</label>
            <input id="note-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Note title" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="note-content">Content</label>
            <textarea id="note-content" value={content} onChange={(e) => setContent(e.target.value)} className="form-control" rows={3} placeholder="Write your note..." required />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => { setIsAdding(false); setTitle(''); setContent(''); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      )}

      {notes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notes.map((note, idx) => (
            <div key={idx} className="card" style={{ padding: '1rem 1.25rem' }}>
              {note.title && <h5 style={{ marginBottom: '0.5rem', color: 'var(--color-heading)' }}>{note.title}</h5>}
              <p style={{ color: 'var(--color-body)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <div style={{ color: 'var(--color-body)', marginTop: '0.75rem', opacity: 0.7 }}>
                {note.createdBy?.name || 'Unknown'} • {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)' }}>No notes yet. Be the first to add one!</div>
      )}
    </div>
  );
};

const FilesTab = ({ workspaceId, files }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [size, setSize] = useState('');

  const addMutation = useMutation({
    mutationFn: (data) => addFile(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', workspaceId]);
      setName('');
      setUrl('');
      setFileType('');
      setSize('');
      setIsAdding(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMutation.mutate({
      name: name.trim(),
      url: url.trim() || undefined,
      fileType: fileType.trim() || undefined,
      size: size ? Number(size) : undefined,
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ color: 'var(--color-heading)' }}>Shared Files</h4>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} aria-hidden="true" /> Add File
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="file-name">File Name</label>
            <input id="file-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="e.g. Event Report.pdf" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="file-url">URL (optional)</label>
            <input id="file-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="form-control" placeholder="https://..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="file-type">Type (optional)</label>
              <input id="file-type" type="text" value={fileType} onChange={(e) => setFileType(e.target.value)} className="form-control" placeholder="pdf, image, doc..." />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="file-size">Size (bytes, optional)</label>
              <input id="file-size" type="number" value={size} onChange={(e) => setSize(e.target.value)} className="form-control" placeholder="0" min="0" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => { setIsAdding(false); setName(''); setUrl(''); setFileType(''); setSize(''); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Saving...' : 'Save File'}
            </button>
          </div>
        </form>
      )}

      {files.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {files.map((file, idx) => (
            <div key={idx} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(37,99,235,0.08)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Upload size={20} aria-hidden="true" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                <div style={{ color: 'var(--color-body)' }}>
                  {file.fileType || 'Unknown type'} {file.size ? `• ${(file.size / 1024).toFixed(1)} KB` : ''}
                </div>
              </div>
              {file.url && (
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', textDecoration: 'none' }}>Open</a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)' }}>No files shared yet.</div>
      )}
    </div>
  );
};

const TasksTab = ({ workspaceId, tasks }) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const addMutation = useMutation({
    mutationFn: (data) => assignTask(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', workspaceId]);
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
      setIsAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskIndex, data }) => updateTaskStatus(workspaceId, taskIndex, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-workspace', workspaceId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
    });
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'badge-orange',
      in_progress: 'badge-blue',
      completed: 'badge-green',
      cancelled: 'badge-red',
    };
    return map[status] || 'badge-blue';
  };

  const cycleStatus = (current) => {
    const order = ['pending', 'in_progress', 'completed', 'cancelled'];
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ color: 'var(--color-heading)' }}>Task Assignments</h4>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} aria-hidden="true" /> Assign Task
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Task Title</label>
            <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="e.g. Design posters" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description (optional)</label>
            <textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows={2} placeholder="Task details..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-assignee">Assignee ID (optional)</label>
              <input id="task-assignee" type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="form-control" placeholder="User ID" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-due">Due Date (optional)</label>
              <input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-control" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => { setIsAdding(false); setTitle(''); setDescription(''); setAssignedTo(''); setDueDate(''); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      )}

      {tasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((task, idx) => (
            <div key={idx} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ color: 'var(--color-heading)', marginBottom: '0.25rem' }}>{task.title}</div>
                <div style={{ color: 'var(--color-body)', whiteSpace: 'pre-wrap' }}>{task.description || 'No description'}</div>
                <div style={{ color: 'var(--color-body)', marginTop: '0.5rem', opacity: 0.7 }}>
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </div>
              </div>
              <span className={`badge ${statusBadge(task.status)}`} style={{ textTransform: 'capitalize' }}>{task.status?.replace('_', ' ')}</span>
              <button
                onClick={() => updateMutation.mutate({ taskIndex: idx, data: { status: cycleStatus(task.status) } })}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem' }}
                disabled={updateMutation.isPending}
              >
                Cycle Status
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)' }}>No tasks assigned yet.</div>
      )}
    </div>
  );
};

const ActivityLogTab = ({ workspaceId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['collaboration-workspace-activity', workspaceId],
    queryFn: async () => {
      const res = await getWorkspaceActivityLog(workspaceId);
      if (res.success) return res.data?.activityLog || [];
      throw new Error(res.message || 'Failed to load activity log');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <CollaborationSkeleton count={1} />;

  return <ActivityFeed activities={data} />;
};

const TimelineTab = ({ workspaceId }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['collaboration-timeline', workspaceId, page],
    queryFn: async () => {
      const res = await getActivityTimeline(workspaceId, { page, limit: 20 });
      if (res.success) return res.data;
      throw new Error(res.message || 'Failed to load timeline');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <CollaborationSkeleton count={1} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ color: 'var(--color-heading)' }}>Activity Timeline</h4>
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === 1} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>Previous</button>
            <button onClick={() => { setPage(p => Math.min(data.pagination.totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === data.pagination.totalPages} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>Next</button>
          </div>
        )}
      </div>
      <ActivityTimeline timeline={data?.timeline || []} />
    </div>
  );
};

export default WorkspaceDetails;
