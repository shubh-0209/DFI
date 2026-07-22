import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ticket, Search, Plus, Inbox, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getUserTickets, getAllTickets } from '../../services/supportTicketsService';
import EmptyState from '../../components/volunteer/EmptyState';

import TicketDetailModal from './TicketDetailModal';
import CreateTicketModal from './CreateTicketModal';

const statCards = [
  { key: 'all', label: 'My Tickets', color: 'var(--color-primary)', Icon: Ticket },
  { key: 'open', label: 'Open', color: 'var(--color-info)', Icon: Inbox },
  { key: 'in_progress', label: 'In Progress', color: 'var(--color-accent)', Icon: Clock },
  { key: 'resolved', label: 'Resolved', color: 'var(--color-secondary)', Icon: CheckCircle },
  { key: 'closed', label: 'Closed', color: 'var(--color-purple)', Icon: XCircle },
];

const Support = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = ['COORDINATOR', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role?.toUpperCase());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['support-tickets', filter],
    queryFn: async () => {
      const res = isAdmin
        ? await getAllTickets({ page: 1, limit: 50, status: filter === 'all' ? null : filter })
        : await getUserTickets({ page: 1, limit: 50, status: filter === 'all' ? null : filter });
      return res || {};
    },
    enabled: !authLoading && !!user,
  });

  const tickets = useMemo(() => data?.tickets || [], [data]);

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const ticketId = searchParams.get('id') || searchParams.get('ticketId');
      if (ticketId) {
        const found = tickets.find(t => t.ticketId === ticketId || t._id === ticketId);
        if (found) {
          setSelectedTicket(found);
          // Clean the query parameters so reloading doesn't keep reopening the modal
          navigate(location.pathname, { replace: true });
        }
      }
    }
  }, [location.search, tickets, location.pathname, navigate]);

  const stats = useMemo(() => {
    const all = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    return { all, open, inProgress, resolved, closed };
  }, [tickets]);

  const values = useMemo(() => ({
    all: stats.all,
    open: stats.open,
    in_progress: stats.inProgress,
    resolved: stats.resolved,
    closed: stats.closed,
  }), [stats]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(t =>
      t.subject?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.ticketId?.toLowerCase().includes(q) ||
      t.user?.name?.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

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

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && selectedTicket) setSelectedTicket(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedTicket]);

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--color-error)', margin: '0 0 0.5rem 0' }}>Failed to load tickets</h3>
          <p style={{ color: 'var(--color-body)', margin: '0 0 1rem 0' }}>{(error?.message || 'Something went wrong. Please try again.')}</p>
          <button onClick={() => refetch()} className="btn btn-secondary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Ticket size={28} color="var(--primary-blue)" />
            Support Tickets
          </h1>
          <p style={{ margin: 0, color: 'var(--color-body)' }}>
            Manage and track your support requests
          </p>
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

      <div className="grid grid-cols-5" style={{ marginBottom: '2rem', gap: '1rem' }}>
        {statCards.map(({ key: valueKey, label, color, Icon }) => (
          <motion.div
            key={label}
            className="card"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: `4px solid ${color}` }}
          >
            <div style={{ padding: '0.6rem', borderRadius: '50%', background: `${color}15`, color }}>
              <Icon size={20} />
            </div>
            <div>
              <div style={{ color: 'var(--color-heading)' }}>
                {values[valueKey]}
              </div>
              <div style={{ color: 'var(--color-body)', whiteSpace: 'nowrap' }}>{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
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
                padding: '0.5rem 1rem', cursor: 'pointer',
                backgroundColor: filter === key ? 'var(--color-primary)' : 'var(--color-bg)',
                color: filter === key ? '#fff' : 'var(--color-body)',
                border: 'none', borderRadius: 'var(--radius-md)' }}
              aria-pressed={filter === key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ overflow: 'hidden' }}>
          <SimpleLoader />
        </div>
      ) : filteredTickets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmptyState
            type="applications"
            title="No tickets found"
            description="You don't have any support tickets yet or try adjusting your filters."
          />
        </motion.div>
      ) : (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {filteredTickets.map((ticket, index) => {
              const pConfig = getPriorityConfig(ticket.priority);
              const sConfig = getStatusConfig(ticket.status);
              return (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.005, transition: { duration: 0.15 } }}
                  className="card"
                  style={{
                    cursor: 'pointer', padding: '1.15rem 1.5rem',
                    boxShadow: 'var(--shadow-xs)' }}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ticket.subject}
                        </h4>
                        <span className={`badge ${pConfig.color}`}>{pConfig.label}</span>
                        <span className={`badge ${sConfig.color}`}>{sConfig.label}</span>
                      </div>
                      <p style={{ margin: '0 0 0.4rem 0', color: 'var(--color-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ticket.description}
                      </p>
                      <span style={{ color: 'var(--color-body)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Ticket size={12} /> {ticket.ticketId}
                      </span>
                    </div>
                    <span style={{ color: 'var(--color-body)', whiteSpace: 'nowrap' }}>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          isAdmin={isAdmin}
          onRefresh={refetch}
        />
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default Support;
