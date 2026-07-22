import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBadgeRules, createBadgeRule, updateBadgeRule, deleteBadgeRule, restoreBadgeRule, toggleBadgeRule } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const BadgeManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-badge-rules', search],
    queryFn: async () => {
      const res = await getBadgeRules({ search, limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const rules = useMemo(() => {
    let items = data?.rules || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => (r.name || '').toLowerCase().includes(q) || (r.slug || '').toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', slug: '', description: '', eligibilityRules: '', isActive: true, visibility: 'public' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, slug: item.slug, description: item.description || '', eligibilityRules: item.eligibilityRules || '', isActive: item.isActive, visibility: item.visibility || 'public' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingItem) {
        await updateBadgeRule(editingItem._id, form);
        toast.success('Badge rule updated');
      } else {
        await createBadgeRule(form);
        toast.success('Badge rule created');
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
    if (!window.confirm(`Delete badge rule "${item.name}"?`)) return;
    try {
      await deleteBadgeRule(item._id);
      toast.success('Badge rule deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleBadgeRule(item._id, !item.isActive);
      toast.success(item.isActive ? 'Badge disabled' : 'Badge enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };
  const handleRestore = async (item) => {
    try {
      await restoreBadgeRule(item._id);
      toast.success('Badge rule restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };


  const columns = [
    { key: 'name', label: 'Badge Name', render: (val, row) => <><strong>{val}</strong><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>{row.slug}</div></> },
    { key: 'description', label: 'Description', render: (val) => val ? <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>{val.length > 50 ? val.slice(0, 50) + '...' : val}</span> : '-' },
    { key: 'visibility', label: 'Visibility', render: (val) => <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)', textTransform: 'capitalize' }}>{val || 'public'}</span> },
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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search badge rules..." style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Create Badge
        </button>
      </div>

      <ConfigTable columns={columns} data={rules} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} onRestore={handleRestore} emptyTitle="No badge rules" emptyDescription="Create badge rules to recognize outstanding contributions." />

      <ConfigModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Badge Rule' : 'Create Badge Rule'} loading={loading} footer={
        <>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.name || !form.slug} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.name || !form.slug ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.name || !form.slug ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
          </button>
        </>
      }>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Badge Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Star Contributor" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Slug <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. star-contributor" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Description</label>
          <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe eligibility..." rows={3} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Eligibility Rules</label>
          <textarea value={form.eligibilityRules || ''} onChange={(e) => setForm({ ...form, eligibilityRules: e.target.value })} placeholder="e.g. 10+ approved contributions" rows={2} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Visibility</label>
          <select value={form.visibility || 'public'} onChange={(e) => setForm({ ...form, visibility: e.target.value })} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </ConfigModal>
    </div>
  );
};

export default BadgeManager;
