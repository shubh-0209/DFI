import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useMemo } from 'react';
import { Shield, Ticket, Search, Plus, MoreVertical, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllTickets, deleteTicket } from '../../services/supportTicketsService';
import toast from 'react-hot-toast';
import EmptyState from '../../components/volunteer/EmptyState';

import TicketDetailModal from './TicketDetailModal';
import CreateTicketModal from './CreateTicketModal';
import ConfirmModal from '../../components/admin/ConfirmModal';

const AdminSupport = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-support-tickets', filter],
    queryFn: async () => {
      const res = await getAllTickets({ page: 1, limit: 100, status: filter === 'all' ? null : filter });
      return res || {};
    },
  });

  const tickets = useMemo(() => data?.tickets || [], [data]);

  const stats = useMemo(() => {
    const all = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    return { all, open, inProgress, resolved, closed };
  }, [tickets]);

  const deleteMutation = useMutation({
    mutationFn: (ticketId) => deleteTicket(ticketId),
    onSuccess: () => {
      toast.success('Ticket deleted successfully');
      queryClient.invalidateQueries(['admin-support-tickets']);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete ticket'),
  });

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t =>
      t.subject?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.ticketId?.toLowerCase().includes(q) ||
      t.user?.name?.toLowerCase().includes(q) ||
      t.user?.email?.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  const handleDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
    setMenuOpenId(null);
  };

  const getPriorityConfig = (p) => {
    switch (p) {
      case 'urgent': return { label: 'Urgent', color: 'badge-red' };
      case 'high': return { label: 'High', color: 'badge-orange' };
      case 'medium': return { label: 'Medium', color: 'badge-blue' };
      case 'low': return { label: 'Low', color: 'badge-purple' };
      default: return { label: p || 'Unknown', color: 'badge-blue' };
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

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--color-error)', margin: '0 0 0.5rem 0' }}>Something went wrong</h3>
          <p style={{ color: 'var(--color-body)', margin: '0 0 1rem 0' }}>{(error?.message || 'Failed to load support tickets.')}</p>
          <button onClick={() => refetch()} className="btn btn-secondary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', margin: '0 0 0.5rem 0' }}>Support Tickets</h1>
          <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>Manage and resolve all platform support requests.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Create Ticket
        </motion.button>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-5" style={{ marginBottom: '2rem', gap: '1rem' }}>
          {[
            { label: 'Total', value: stats.all, color: 'var(--color-primary)', Icon: Ticket },
            { label: 'Open', value: stats.open, color: 'var(--color-info)', Icon: Inbox },
            { label: 'In Progress', value: stats.inProgress, color: 'var(--color-accent)', Icon: Ticket },
            { label: 'Resolved', value: stats.resolved, color: 'var(--color-secondary)', Icon: Ticket },
            { label: 'Closed', value: stats.closed, color: 'var(--color-purple)', Icon: Ticket },
          ].map(({ label, value, color, Icon }) => (
            <motion.div
              key={label}
              className="card"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${color}` }}
            >
              <div style={{ padding: '0.65rem', borderRadius: '50%', background: `${color}15`, color }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-heading)', lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', whiteSpace: 'nowrap' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
            <input
              type="text"
              placeholder="Search tickets by subject, ID, or user..."
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
              aria-label="Search tickets"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'open', label: 'Open' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'resolved', label: 'Resolved' },
              { key: 'closed', label: 'Closed' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`badge ${filter === key ? '' : 'badge-blue'}`}
                style={{
                  padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer',
                  backgroundColor: filter === key ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: filter === key ? '#fff' : 'var(--color-body)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                }}
                aria-pressed={filter === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SimpleLoader />
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            type="applications"
            title="No tickets found"
            description="There are no support tickets matching your filters right now."
          />
        ) : (
          <div style={{ overflowX: 'auto', '-webkit-overflow-scrolling': 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'left' }}>Ticket</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'left' }}>Priority</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-body)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTickets.map((ticket) => {
                    const pConfig = getPriorityConfig(ticket.priority);
                    const sConfig = getStatusConfig(ticket.status);
                    return (
                      <motion.tr
                        key={ticket._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-heading)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {ticket.subject}
                            </span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>{ticket.ticketId}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
                          {ticket.user?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)', textTransform: 'capitalize' }}>
                          {ticket.category || 'General'}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span className={`badge ${sConfig.color}`}>{sConfig.label}</span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span className={`badge ${pConfig.color}`}>{pConfig.label}</span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)', whiteSpace: 'nowrap' }}>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', position: 'relative' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === ticket._id ? null : ticket._id); }}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)',
                                padding: '0.35rem', borderRadius: 'var(--radius-sm)',
                              }}
                              aria-label="Actions"
                              aria-haspopup="true"
                              aria-expanded={menuOpenId === ticket._id}
                            >
                              <MoreVertical size={18} />
                            </button>
                            {menuOpenId === ticket._id && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                style={{
                                  position: 'absolute', top: '100%', right: 0, zIndex: 20, minWidth: 150,
                                  background: 'var(--color-card)', border: '1px solid var(--color-border)',
                                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
                                }}
                              >
                                <button
                                  style={{
                                    width: '100%', textAlign: 'left', padding: '0.65rem 1rem', border: 'none',
                                    background: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-heading)',
                                  }}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => { setSelectedTicket(ticket); setMenuOpenId(null); }}
                                >
                                  View Details
                                </button>
                                <button
                                  style={{
                                    width: '100%', textAlign: 'left', padding: '0.65rem 1rem', border: 'none',
                                    background: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-error)',
                                  }}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => { setDeleteTargetId(ticket._id); setShowDeleteConfirm(true); setMenuOpenId(null); }}
                                >
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          isAdmin={true}
          onRefresh={refetch}
        />
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          isAdmin={true}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Ticket"
        message="Are you sure you want to permanently delete this ticket? This action cannot be undone."
        onCancel={() => { setShowDeleteConfirm(false); setDeleteTargetId(null); }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminSupport;
