import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCoinRules, createCoinRule, updateCoinRule, deleteCoinRule, restoreCoinRule, toggleCoinRule, getCategories } from '../../../services/contributionConfigService';
import ConfigTable from './ConfigTable';
import ConfigModal from './ConfigModal';
import ConfigEmptyState from './ConfigEmptyState';

const CoinRuleManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-config-coin-rules', search],
    queryFn: async () => {
      const res = await getCoinRules({ search, limit: 50 });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    getCategories({ limit: 100 }).then(res => {
      setCategoryOptions(res.categories || []);
    });
  }, []);

  const rules = useMemo(() => {
    let items = data?.rules || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => (r.name || '').toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ name: '', coins: 0, description: '', contributionCategory: '', contributionType: '', priority: 0, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ name: item.name, coins: item.coins, description: item.description || '', contributionCategory: item.contributionCategory || '', contributionType: item.contributionType || '', priority: item.priority || 0, isActive: item.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = { ...form, coins: Number(form.coins) || 0, priority: Number(form.priority) || 0 };
      if (editingItem) {
        await updateCoinRule(editingItem._id, payload);
        toast.success('Coin rule updated');
      } else {
        await createCoinRule(payload);
        toast.success('Coin rule created');
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
    if (!window.confirm(`Delete coin rule "${item.name}"?`)) return;
    try {
      await deleteCoinRule(item._id);
      toast.success('Coin rule deleted');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleCoinRule(item._id, !item.isActive);
      toast.success(item.isActive ? 'Rule disabled' : 'Rule enabled');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Toggle failed');
    }
  };
  const handleRestore = async (item) => {
    try {
      await restoreCoinRule(item._id);
      toast.success('Coin rule restored');
      refetch();
    } catch (err) {
      toast.error(err?.message || 'Restore failed');
    }
  };


  const columns = [
    { key: 'name', label: 'Rule Name', render: (val) => <strong>{val}</strong> },
    { key: 'coins', label: 'Coins', align: 'center', render: (val) => <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{val}</span> },
    { key: 'description', label: 'Description', render: (val) => val ? <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>{val.length > 40 ? val.slice(0, 40) + '...' : val}</span> : '-' },
    { key: 'priority', label: 'Priority', align: 'center' },
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
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coin rules..." style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={18} /> Create Rule
        </button>
      </div>

      <ConfigTable columns={columns} data={rules} loading={isLoading} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} onRestore={handleRestore} emptyTitle="No coin rules" emptyDescription="Set up coin rules to reward volunteers automatically." />

      <ConfigModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Coin Rule' : 'Create Coin Rule'} loading={loading} footer={
        <>
          <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !form.name || form.coins === ''} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !form.name ? '#D1D5DB' : 'var(--color-primary)', color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading || !form.name ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
          </button>
        </>
      }>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Rule Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Default Contribution" style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Coins <span style={{ color: 'var(--color-error)' }}>*</span></label>
          <input type="number" value={form.coins ?? ''} onChange={(e) => setForm({ ...form, coins: Number(e.target.value) })} placeholder="0" min={0} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Description</label>
          <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this rule..." rows={2} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Category</label>
          <select value={form.contributionCategory || ''} onChange={(e) => setForm({ ...form, contributionCategory: e.target.value })} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }}>
            <option value="">None</option>
            {categoryOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem' }}>Priority</label>
          <input type="number" value={form.priority ?? 0} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} placeholder="0" min={0} style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', outline: 'none' }} />
        </div>
      </ConfigModal>
    </div>
  );
};

export default CoinRuleManager;
