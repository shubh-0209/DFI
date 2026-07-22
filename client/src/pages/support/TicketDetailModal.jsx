import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Tag, AlertTriangle, Send, ShieldAlert, MessageSquare } from 'lucide-react';
import { getTicket, assignTicket, resolveTicket, closeTicket, createReply, getReplies, escalateTicket } from '../../services/supportTicketsService';
import { getUsers } from '../../services/adminService';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

const TicketDetailModal = ({ ticket, onClose, isAdmin, onRefresh }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignEmail, setAssignEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [resolution, setResolution] = useState('');
  const [showClose, setShowClose] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const repliesEndRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getTicket(ticket._id || ticket.ticketId);
        if (res?.success) setDetail(res.data?.ticket || ticket);
      } catch (err) {
        console.error('Failed to fetch ticket detail:', err);
        toast.error('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [ticket]);

  // Fetch replies when ticket loads
  useEffect(() => {
    const fetchReplies = async () => {
      const ticketId = ticket._id || ticket.ticketId;
      if (!ticketId) return;
      setRepliesLoading(true);
      try {
        const res = await getReplies(ticketId);
        if (res?.success) setReplies(res.data?.replies || []);
      } catch (err) {
        console.error('Failed to fetch replies:', err);
      } finally {
        setRepliesLoading(false);
      }
    };
    fetchReplies();
  }, [ticket]);

  // Auto-scroll to latest reply
  useEffect(() => {
    if (repliesEndRef.current) {
      repliesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [replies]);

  useEffect(() => {
    if (showAssign && users.length === 0) {
      getUsers()
        .then(res => {
          if (res?.success && Array.isArray(res.data?.users)) setUsers(res.data.users);
        })
        .catch(() => {});
    }
  }, [showAssign, users.length]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const ticketData = detail || ticket;
  const displayId = ticketData.ticketId || ticketData._id;

  const handleAssign = async () => {
    const selected = users.find(u => u.email === assignEmail || u._id === assignEmail);
    if (!selected) return toast.error('Select a valid user');
    setActionLoading(true);
    try {
      const res = await assignTicket(ticketData._id, selected._id);
      if (res?.success) {
        toast.success('Ticket assigned successfully');
        setShowAssign(false);
        setAssignEmail('');
        setShowUsers(false);
        onRefresh?.();
      } else {
        toast.error(res?.message || 'Failed to assign ticket');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return toast.error('Resolution is required');
    setActionLoading(true);
    try {
      const res = await resolveTicket(ticketData._id, resolution);
      if (res?.success) {
        toast.success('Ticket resolved successfully');
        setShowResolve(false);
        setResolution('');
        onRefresh?.();
      } else {
        toast.error(res?.message || 'Failed to resolve ticket');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resolve ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    setActionLoading(true);
    try {
      const res = await closeTicket(ticketData._id);
      if (res?.success) {
        toast.success('Ticket closed successfully');
        setShowClose(false);
        onRefresh?.();
      } else {
        toast.error(res?.message || 'Failed to close ticket');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to close ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityConfig = (p) => {
    switch (p) {
      case 'urgent': return { label: 'Urgent', color: 'badge-red', Icon: AlertTriangle };
      case 'high': return { label: 'High', color: 'badge-orange', Icon: AlertTriangle };
      case 'medium': return { label: 'Medium', color: 'badge-blue', Icon: Tag };
      case 'low': return { label: 'Low', color: 'badge-purple', Icon: Tag };
      default: return { label: p || 'Unknown', color: 'badge-blue', Icon: Tag };
    }
  };

  const getStatusConfig = (s) => {
    switch (s) {
      case 'open': return { label: 'Open', color: 'badge-blue' };
      case 'in_progress': return { label: 'In Progress', color: 'badge-orange' };
      case 'resolved': return { label: 'Resolved', color: 'badge-green' };
      case 'closed': return { label: 'Closed', color: 'badge-purple' };
      default: return { label: s || 'Unknown', color: 'badge-blue' };
    }
  };

  const priorityConfig = getPriorityConfig(ticketData.priority);
  const statusConfig = getStatusConfig(ticketData.status);
  const PriorityIcon = priorityConfig.Icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--color-card)', borderRadius: 'var(--radius-xl)',
            width: '100%', maxWidth: 560, maxHeight: '85vh', overflow: 'auto',
            boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ticket-detail-title"
        >
          {loading ? (
            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton" style={{ height: 28, width: '60%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 100, width: '100%', borderRadius: 8 }} />
            </div>
          ) : (
            <>
              <div style={{
                padding: '1.5rem 1.5rem 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className={`badge ${priorityConfig.color}`}>
                      <PriorityIcon size={12} /> {priorityConfig.label}
                    </span>
                    <span className={`badge ${statusConfig.color}`}>{statusConfig.label}</span>
                  </div>
                  <h3 id="ticket-detail-title" style={{ margin: '0 0 0.25rem 0' }}>
                    {ticketData.subject}
                  </h3>
                  <span style={{ color: 'var(--color-body)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Tag size={12} /> {displayId}
                  </span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem' }} aria-label="Close detail">
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
                    <User size={14} /> {ticketData.user?.name || 'N/A'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
                    <Calendar size={14} /> {new Date(ticketData.createdAt).toLocaleDateString()}
                  </span>
                  {ticketData.assignedTo && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
                      Assigned: {ticketData.assignedTo?.name || ticketData.assignedTo}
                    </span>
                  )}
                </div>

                <div style={{
                  padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)' }}>
                  <p style={{ margin: 0, color: 'var(--color-body)', whiteSpace: 'pre-wrap' }}>
                    {ticketData.description}
                  </p>
                </div>

                {ticketData.resolution && (
                  <div style={{
                    padding: '1rem', borderRadius: 'var(--radius-md)',
                    background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-success)' }}>Resolution</h4>
                    <p style={{ margin: 0, color: 'var(--color-body)', whiteSpace: 'pre-wrap' }}>
                      {ticketData.resolution}
                    </p>
                  </div>
                )}

                {/* ── Replies / Comments Thread ──────────────────── */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-heading)' }}>
                    <MessageSquare size={16} /> Replies ({replies.length})
                  </h4>

                  <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {repliesLoading ? (
                      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-body)' }}>Loading replies…</div>
                    ) : replies.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>No replies yet. Start the conversation below.</div>
                    ) : (
                      replies.map((reply, idx) => (
                        <div key={reply._id || idx} style={{
                          padding: '0.75rem', borderRadius: 'var(--radius-md)',
                          background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-heading)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <User size={12} /> {reply.user?.name || reply.createdBy?.name || 'User'}
                            </span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: 'var(--color-body)', fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>{reply.content}</p>
                        </div>
                      ))
                    )}
                    <div ref={repliesEndRef} />
                  </div>

                  {/* ── Reply Composer ──────────────────────────── */}
                  {ticketData.status !== 'closed' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Write a reply…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ flex: 1, resize: 'vertical' }}
                      />
                      <button
                        onClick={async () => {
                          if (!replyText.trim()) return;
                          setSendingReply(true);
                          try {
                            const res = await createReply(ticketData._id, replyText.trim());
                            if (res?.success) {
                              setReplyText('');
                              // Refetch replies
                              const repliesRes = await getReplies(ticketData._id);
                              if (repliesRes?.success) setReplies(repliesRes.data?.replies || []);
                              toast.success('Reply sent');
                            } else {
                              toast.error(res?.message || 'Failed to send reply');
                            }
                          } catch (err) {
                            toast.error(err.message || 'Failed to send reply');
                          } finally {
                            setSendingReply(false);
                          }
                        }}
                        disabled={sendingReply || !replyText.trim()}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', alignSelf: 'flex-end', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Send size={14} /> {sendingReply ? 'Sending…' : 'Send'}
                      </button>
                    </div>
                  )}
                </div>

                {isAdmin && ticketData.status !== 'resolved' && ticketData.status !== 'closed' && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowAssign(true)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => setShowResolve(true)}
                      className="btn btn-gradient"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={async () => {
                        setEscalating(true);
                        try {
                          const res = await escalateTicket(ticketData._id);
                          if (res?.success) {
                            toast.success('Ticket escalated');
                            onRefresh?.();
                          } else {
                            toast.error(res?.message || 'Failed to escalate');
                          }
                        } catch (err) {
                          toast.error(err.message || 'Failed to escalate');
                        } finally {
                          setEscalating(false);
                        }
                      }}
                      disabled={escalating}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', borderColor: 'var(--color-warning)', color: 'var(--color-warning)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <ShieldAlert size={14} /> {escalating ? 'Escalating…' : 'Escalate'}
                    </button>
                    <button
                      onClick={() => setShowClose(true)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        <AnimatePresence>
          {showAssign && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 1100, padding: '1.5rem' }}
              onClick={() => setShowAssign(false)}
            >
              <motion.div
                style={{
                  background: 'var(--color-card)', borderRadius: 'var(--radius-xl)',
                  width: '100%', maxWidth: 400, padding: '1.5rem',
                  boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 style={{ margin: '0 0 1rem 0' }}>Assign Ticket</h4>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Search user by email..."
                    className="form-control"
                    value={assignEmail}
                    onChange={(e) => { setAssignEmail(e.target.value); setShowUsers(true); }}
                    onFocus={() => setShowUsers(true)}
                    autoFocus
                  />
                  {showUsers && users.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                      background: 'var(--color-card)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', marginTop: '0.25rem', maxHeight: 200, overflow: 'auto',
                      boxShadow: 'var(--shadow-md)' }}>
                      {users.filter(u => u.email.toLowerCase().includes(assignEmail.toLowerCase())).map((u) => (
                        <button
                          key={u._id}
                          style={{
                            width: '100%', textAlign: 'left', padding: '0.75rem 1rem',
                            border: 'none', background: 'none', cursor: 'pointer',
                            borderBottom: '1px solid var(--color-border)' }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setAssignEmail(u.email); setShowUsers(false); }}
                        >
                          <div >{u.name}</div>
                          <div style={{ color: 'var(--color-body)' }}>{u.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowAssign(false)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                  <button onClick={handleAssign} disabled={actionLoading} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    {actionLoading ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResolve && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 1100, padding: '1.5rem' }}
              onClick={() => setShowResolve(false)}
            >
              <motion.div
                style={{
                  background: 'var(--color-card)', borderRadius: 'var(--radius-xl)',
                  width: '100%', maxWidth: 420, padding: '1.5rem',
                  boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 style={{ margin: '0 0 1rem 0' }}>Resolve Ticket</h4>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter resolution details..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  autoFocus
                  style={{ marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowResolve(false)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                  <button onClick={handleResolve} disabled={actionLoading} className="btn btn-gradient" style={{ padding: '0.5rem 1rem' }}>
                    {actionLoading ? 'Resolving...' : 'Resolve'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmModal
          isOpen={showClose}
          title="Close Ticket"
          message="Are you sure you want to close this ticket?"
          onCancel={() => setShowClose(false)}
          onConfirm={handleClose}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TicketDetailModal;
