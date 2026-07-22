import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory, deleteCategory, restoreCategory, toggleCategory } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const CATEGORY_FORM_FIELDS = [
  { key: 'name', label: 'Category Name', type: 'text', required: true, placeholder: 'e.g. Graphic Design' },
  { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'e.g. graphic_design' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe this category...' },
  { key: 'sortOrder', label: 'Display Order', type: 'number', placeholder: '0' },
  { key: 'icon', label: 'Icon (Lucide name)', type: 'text', placeholder: 'e.g. Palette' },
];

const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('sortOrder');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-categories', search, sortBy],
    queryFn: async () => {
      const res = await getCategories({ search, sort: sortBy === 'sortOrder' ? 'sortOrder' : '-createdAt', limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const categories = useMemo(() => {
    let items = data?.categories || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c => (c.name || '').toLowerCase().includes(q) || (c.slug || '').toLowerCase().includes(q));
    }
    if (sortBy === 'sortOrder') {
      items = [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } else if (sortBy === 'name') {
      items = [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return items;
  }, [data, search, sortBy]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', slug: '', description: '', sortOrder: 0, icon: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingItem(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', sortOrder: cat.sortOrder || 0, icon: cat.icon || '', isActive: cat.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = { ...form, sortOrder: Number(form.sortOrder) || 0 };
      if (editingItem) {
        await updateCategory(editingItem._id, payload);
        toast.success('Category updated');
      } else {
        await createCategory(payload);
        toast.success('Category created');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      setDeletingId(cat._id);
      await deleteCategory(cat._id);
      toast.success('Category deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (cat) => {
    try {
      await toggleCategory(cat._id, !cat.isActive);
      toast.success(cat.isActive ? 'Category disabled' : 'Category enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };

  const handleRestore = async (cat) => {
    try {
      await restoreCategory(cat._id);
      toast.success('Category restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (val, row) => <><strong>{val}</strong><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>{row.slug}</div></> },
    { key: 'description', label: 'Description', render: (val) => val ? <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>{val.length > 60 ? val.slice(0, 60) + '...' : val}</span> : '-' },
    { key: 'sortOrder', label: 'Order', align: 'center' },
    { key: 'isActive', label: 'Status', render: (val) => (
      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 700, background: val ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: val ? 'var(--color-success)' : 'var(--color-error)' }}>
        {val ? 'Active' : 'Disabled'}
      </span>
    )},
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '240px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }}
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', cursor: 'pointer' }}>
            <option value="sortOrder">Sort by Order</option>
            <option value="name">Sort by Name</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Create Category
        </button>
      </div>

      <ConfigTable
        columns={columns}
        data={categories}
        loading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onRestore={handleRestore}
        emptyTitle="No categories found"
        emptyDescription="Create your first contribution category to get started."
      />

      <ConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Category' : 'Create Category'}
        loading={loading}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading || !form.name || !form.slug} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.name || !form.slug ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.name || !form.slug ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        {CATEGORY_FORM_FIELDS.map((field) => (
          <div key={field.key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>{field.label} {field.required && <span style={{ color: 'var(--color-error)' }}>*</span>}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={form[field.key] || ''}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={3}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }}
              />
            ) : (
              <input
                type={field.type}
                value={form[field.key] || ''}
                onChange={(e) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                placeholder={field.placeholder}
                required={field.required}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }}
              />
            )}
          </div>
        ))}
      </ConfigModal>
    </div>
  );
};

export default CategoryManager;
