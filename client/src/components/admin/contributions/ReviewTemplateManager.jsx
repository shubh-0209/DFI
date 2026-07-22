import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getReviewTemplates, createReviewTemplate, updateReviewTemplate, deleteReviewTemplate, restoreReviewTemplate, toggleReviewTemplate } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const ACTION_OPTIONS = [
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'needs_changes', label: 'Needs Changes' },
];

const ReviewTemplateManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-review-templates', search],
    queryFn: async () => {
      const res = await getReviewTemplates({ search, limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const templates = useMemo(() => {
    let items = data?.templates || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t => (t.name || '').toLowerCase().includes(q) || (t.action || '').toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', templateText: '', action: 'approved', category: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, templateText: item.templateText || item.template || '', action: item.action || 'approved', category: item.category || '', isActive: item.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = { ...form, templateText: form.templateText };
      if (editingItem) {
        await updateReviewTemplate(editingItem._id, payload);
        toast.success('Template updated');
      } else {
        await createReviewTemplate(payload);
        toast.success('Template created');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete template "${item.name}"?`)) return;
    try {
      await deleteReviewTemplate(item._id);
      toast.success('Template deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleReviewTemplate(item._id, !item.isActive);
      toast.success(item.isActive ? 'Template disabled' : 'Template enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };
  const handleRestore = async (item) => {
    try {
      await restoreReviewTemplate(item._id);
      toast.success('Template restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };


  const columns = [
    { key: 'name', label: 'Template Name', render: (val) => <strong>{val}</strong> },
    { key: 'action', label: 'Action', render: (val) => (
      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, background: val === 'approved' ? 'rgba(16,185,129,0.1)' : val === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: val === 'approved' ? 'var(--color-success)' : val === 'rejected' ? 'var(--color-error)' : '#F59E0B', textTransform: 'capitalize' }}>
        {(val || 'approved').replace('_', ' ')}
      </span>
    )},
    { key: 'templateText', label: 'Preview', render: (val) => <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>{(val || '').length > 60 ? (val || '').slice(0, 60) + '...' : (val || '')}</span> },
    { key: 'isActive', label: 'Status', render: (val) => (
      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700, background: val ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: val ? 'var(--color-success)' : 'var(--color-error)' }}>
        {val ? 'Active' : 'Disabled'}
      </span>
    )},
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Create Template
        </button>
      </div>

      <ConfigTable columns={columns} data={templates} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} onRestore={handleRestore} emptyTitle="No review templates" emptyDescription="Create reusable templates to speed up contribution reviews." />

      <ConfigModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Template' : 'Create Template'} loading={loading} footer={
        <>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.name || !form.templateText} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.name || !form.templateText ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.name || !form.templateText ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
          </button>
        </>
      }>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Template Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Excellent Work" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Template Text <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <textarea value={form.templateText || ''} onChange={(e) => setForm({ ...form, templateText: e.target.value })} placeholder="Write the review message..." rows={4} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Action</label>
          <select value={form.action || 'approved'} onChange={(e) => setForm({ ...form, action: e.target.value })} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }}>
            {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </ConfigModal>
    </div>
  );
};

export default ReviewTemplateManager;
