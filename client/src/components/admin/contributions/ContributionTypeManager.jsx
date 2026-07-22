import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTypes, createType, updateType, deleteType, restoreType, toggleType } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const TYPE_OPTIONS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'github', label: 'GitHub' },
  { value: 'figma', label: 'Figma' },
  { value: 'canva', label: 'Canva' },
  { value: 'google_drive', label: 'Google Drive' },
  { value: 'word', label: 'Word' },
  { value: 'powerpoint', label: 'PowerPoint' },
  { value: 'zip', label: 'ZIP' },
];

const ContributionTypeManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-types', search],
    queryFn: async () => {
      const res = await getTypes({ search, limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const types = useMemo(() => {
    let items = data?.types || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t => (t.name || '').toLowerCase().includes(q) || (t.slug || '').toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', slug: '', description: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, slug: item.slug, description: item.description || '', isActive: item.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingItem) {
        await updateType(editingItem._id, form);
        toast.success('Type updated');
      } else {
        await createType(form);
        toast.success('Type created');
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
    if (!window.confirm(`Delete type "${item.name}"?`)) return;
    try {
      await deleteType(item._id);
      toast.success('Type deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleType(item._id, !item.isActive);
      toast.success(item.isActive ? 'Type disabled' : 'Type enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };
  const handleRestore = async (item) => {
    try {
      await restoreType(item._id);
      toast.success('Type restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };


  const columns = [
    { key: 'name', label: 'Name', render: (val, row) => <><strong>{val}</strong><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>{row.slug}</div></> },
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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search types..." style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Create Type
        </button>
      </div>

      <ConfigTable columns={columns} data={types} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} onRestore={handleRestore} emptyTitle="No contribution types" emptyDescription="Add types like PDF, Image, Video to enable submissions." />

      <ConfigModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Type' : 'Create Type'} loading={loading} footer={
        <>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.name || !form.slug} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.name || !form.slug ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.name || !form.slug ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
          </button>
        </>
      }>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Type Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. PDF" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Slug <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. pdf" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Description</label>
          <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this type..." rows={3} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }} />
        </div>
      </ConfigModal>
    </div>
  );
};

export default ContributionTypeManager;
