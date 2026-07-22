import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Tag, Settings, Image as ImageIcon, Sparkles, CheckCircle, X } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import { getCategoryFallbackImage } from '../../utils/rewardFallbacks';
import SimpleLoader from '../../components/common/SimpleLoader';

const AdminMarketplace = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
    coinCost: '',
    stock: '',
    autoGenerateImage: true,
    image_url: '',
  });

  const categories = [
    'Technology', 'Education', 'Merchandise', 'Digital Rewards', 'Partner Benefits', 'Scholarships', 'Certificates'
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const res = await marketplaceService.getMarketplaceCatalog({ limit: 100 });
      setRewards(res?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.coinCost || !formData.stock) return;

    try {
      setCreating(true);
      await marketplaceService.adminCreateReward({
        ...formData,
        coinCost: Number(formData.coinCost),
        stock: Number(formData.stock),
      });
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'Technology',
        coinCost: '',
        stock: '',
        autoGenerateImage: true,
        image_url: '',
      });
      fetchRewards();
    } catch (error) {
      console.error('Error creating reward:', error);
      alert('Failed to create reward');
    } finally {
      setCreating(false);
    }
  };

  const previewImage = formData.autoGenerateImage
    ? getCategoryFallbackImage(formData.category)
    : (formData.image_url || getCategoryFallbackImage('default'));

  const [headerActionsEl, setHeaderActionsEl] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('dashboard-header-actions');
      if (el) setHeaderActionsEl(el);
    }, 0);
  }, []);

  return (
    <div style={{ padding: '0.5rem 0 2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      {headerActionsEl && createPortal(
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <Plus size={18} />
          Create Reward
        </button>,
        headerActionsEl
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <SimpleLoader />
        ) : (
          rewards.map((reward) => (
            <div key={reward._id} style={{
              backgroundColor: 'var(--color-card)', borderRadius: '12px', border: '1px solid var(--color-border)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ height: '180px', position: 'relative', backgroundColor: '#f8fafc' }}>
                <img src={reward.image_url || getCategoryFallbackImage(reward.category)} alt={reward.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />

                {reward.image_generated && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#10b981', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Auto
                  </span>
                )}
              </div>
              <div style={{ padding: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-heading)' }}>{reward.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: 'var(--text-xs)', backgroundColor: 'rgba(21, 128, 61, 0.1)', color: 'var(--color-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{reward.category}</span>
                  <span style={{ fontSize: 'var(--text-xs)', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>🪙 {reward.coinCost}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '800px', backgroundColor: 'var(--color-card)',
                borderRadius: '16px', display: 'flex', overflow: 'hidden', boxShadow: 'var(--shadow-xl)',
                maxHeight: '90vh'
              }}
            >
              <div style={{ flex: '1 1 50%', padding: '2rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-heading)' }}>New Reward</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)' }}>Reward Title</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--background)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--background)', resize: 'vertical' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)' }}>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--background)' }}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)' }}>Cost (Coins)</label>
                      <input type="number" name="coinCost" value={formData.coinCost} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--background)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)' }}>Stock</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--background)' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <ImageIcon size={18} style={{ color: '#10b981' }} />
                      <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-heading)' }}>Image Assignment</h4>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        <input type="radio" name="autoGenerateImage" checked={formData.autoGenerateImage} onChange={() => setFormData(prev => ({ ...prev, autoGenerateImage: true }))} style={{ accentColor: '#10b981' }} />
                        <Sparkles size={14} style={{ color: '#10b981' }} /> Auto generate (Smart Match)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        <input type="radio" name="autoGenerateImage" checked={!formData.autoGenerateImage} onChange={() => setFormData(prev => ({ ...prev, autoGenerateImage: false }))} style={{ accentColor: '#10b981' }} />
                        Upload manually
                      </label>
                    </div>

                    {!formData.autoGenerateImage && (
                      <div>
                        <input type="url" name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--background)', fontSize: 'var(--text-sm)' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={creating} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {creating ? 'Saving...' : 'Save Reward'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Image Preview Sidebar */}
              <div style={{ flex: '0 0 320px', backgroundColor: '#f8fafc', borderLeft: '1px solid var(--color-border)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image Preview</h4>

                <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '220px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <ImageIcon size={48} style={{ color: '#cbd5e1' }} />
                    )}
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#64748b', lineHeight: 1.5 }}>
                      {formData.autoGenerateImage ?
                        "An AI-matched product image will be assigned based on the reward's title and category when saved." :
                        "Previewing your manually provided image URL."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMarketplace;
