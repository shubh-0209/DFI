import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPortfolioConfigs, createPortfolioConfig, updatePortfolioConfig, deletePortfolioConfig, restorePortfolioConfig, togglePortfolioConfig } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const PortfolioSettings = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-portfolio', search],
    queryFn: async () => {
      const res = await getPortfolioConfigs({ search, limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const configs = useMemo(() => {
    let items = data?.configs || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c => (c.key || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ key: '', value: '', description: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ key: item.key, value: item.value, description: item.description || '', isActive: item.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingItem) {
        await updatePortfolioConfig(editingItem._id, form);
        toast.success('Portfolio config updated');
      } else {
        await createPortfolioConfig(form);
        toast.success('Portfolio config created');
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
    if (!window.confirm(`Delete portfolio config "${item.key}"?`)) return;
    try {
      await deletePortfolioConfig(item._id);
      toast.success('Config deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleToggle = async (item) => {
    try {
      await togglePortfolioConfig(item._id, !item.isActive);
      toast.success(item.isActive ? 'Config disabled' : 'Config enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };
  const handleRestore = async (item) => {
    try {
      await restorePortfolioConfig(item._id);
      toast.success('Config restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };


  const columns = [
    { key: 'key', label: 'Key', render: (val) => <code style={{ fontSize: 'var(--text-sm)', background: 'rgba(37,99,235,0.06)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--color-primary)' }}>{val}</code> },
    { key: 'value', label: 'Value', render: (val) => <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{typeof val === 'object' ? JSON.stringify(val) : String(val || '')}</span> },
    { key: 'description', label: 'Description', render: (val) => val ? <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>{val.length > 50 ? val.slice(0, 50) + '...' : val}</span> : '-' },
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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search portfolio configs..." style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Add Config
        </button>
      </div>

      <ConfigTable columns={columns} data={configs} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} onRestore={handleRestore} emptyTitle="No portfolio configs" emptyDescription="Set up portfolio display preferences." />

      <ConfigModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Portfolio Config' : 'Add Portfolio Config'} loading={loading} footer={
        <>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.key} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.key ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.key ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
          </button>
        </>
      }>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Key <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.key || ''} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. auto_publish" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Value <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <textarea value={typeof form.value === 'string' ? form.value : JSON.stringify(form.value, null, 2)} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder='{"enabled": true}' rows={4} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Description</label>
          <input type="text" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this setting..." style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
      </ConfigModal>
    </div>
  );
};

export default PortfolioSettings;
