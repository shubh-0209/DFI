import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFileTypeConfigs, createFileTypeConfig, updateFileTypeConfig, deleteFileTypeConfig, restoreFileTypeConfig, toggleFileTypeConfig } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const FILE_CATEGORIES = [
  { value: 'image', label: 'Image' },
  { value: 'document', label: 'Document' },
  { value: 'video', label: 'Video' },
  { value: 'archive', label: 'Archive' },
  { value: 'other', label: 'Other' },
];

const UploadSettingsManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-file-types', search],
    queryFn: async () => {
      const res = await getFileTypeConfigs({ search, limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const configs = useMemo(() => {
    let items = data?.configs || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c => (c.name || '').toLowerCase().includes(q) || (c.extension || '').toLowerCase().includes(q) || (c.mimeType || '').toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', mimeType: '', extension: '', category: 'document', maxSize: 10, maxFiles: 5, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, mimeType: item.mimeType, extension: item.extension, category: item.category || 'document', maxSize: item.maxSize || 10, maxFiles: item.maxFiles || 5, isActive: item.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = { ...form, maxSize: Number(form.maxSize) || 10, maxFiles: Number(form.maxFiles) || 5 };
      if (editingItem) {
        await updateFileTypeConfig(editingItem._id, payload);
        toast.success('Config updated');
      } else {
        await createFileTypeConfig(payload);
        toast.success('Config created');
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
    if (!window.confirm(`Delete config "${item.name}"?`)) return;
    try {
      await deleteFileTypeConfig(item._id);
      toast.success('Config deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleFileTypeConfig(item._id, !item.isActive);
      toast.success(item.isActive ? 'Config disabled' : 'Config enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };
  const handleRestore = async (item) => {
    try {
      await restoreFileTypeConfig(item._id);
      toast.success('File type restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };


  const columns = [
    { key: 'name', label: 'Name', render: (val, row) => <><strong>{val}</strong><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>.{row.extension} · {row.mimeType}</div></> },
    { key: 'category', label: 'Category', render: (val) => <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)', textTransform: 'capitalize' }}>{val}</span> },
    { key: 'maxSize', label: 'Max Size (MB)', align: 'center' },
    { key: 'maxFiles', label: 'Max Files', align: 'center' },
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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search file types..." style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Add File Type
        </button>
      </div>

      <ConfigTable columns={columns} data={configs} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} onRestore={handleRestore} emptyTitle="No file types configured" emptyDescription="Add file types to allow in contribution uploads." />

      <ConfigModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit File Type' : 'Add File Type'} loading={loading} footer={
        <>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.name || !form.mimeType || !form.extension} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.name || !form.mimeType ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.name || !form.mimeType ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
          </button>
        </>
      }>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. JPEG Image" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>MIME Type <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="text" value={form.mimeType || ''} onChange={(e) => setForm({ ...form, mimeType: e.target.value })} placeholder="e.g. image/jpeg" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Extension <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input type="text" value={form.extension || ''} onChange={(e) => setForm({ ...form, extension: e.target.value })} placeholder="e.g. jpg" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Category</label>
            <select value={form.category || 'document'} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }}>
              {FILE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Max Size (MB)</label>
            <input type="number" value={form.maxSize ?? 10} onChange={(e) => setForm({ ...form, maxSize: Number(e.target.value) })} min={1} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
          </div>
        </div>
      </ConfigModal>
    </div>
  );
};

export default UploadSettingsManager;
