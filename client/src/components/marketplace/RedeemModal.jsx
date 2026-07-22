import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Coins, Minus, Plus, MapPin, ChevronLeft } from 'lucide-react';

// Categories that don't need a shipping address
const DIGITAL_CATEGORIES = [
  'TalentGrow Coupons',
  'Digital Rewards',
  'Certificates',
  'Scholarships',
];

const isDigital = (reward) =>
  reward?.rewardType === 'digital' || DIGITAL_CATEGORIES.includes(reward?.category);

// ── Shared field style ────────────────────────────────────────────────────────
const fieldStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-card)',
  color: 'var(--color-heading)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  color: 'var(--color-heading)',
  marginBottom: '0.375rem',
};

// ── Step 1: quantity + cost review ───────────────────────────────────────────
const ReviewStep = ({ reward, userCoins, quantity, onQuantityChange, onNext, onClose, loading }) => {
  const totalCost = reward.coinCost * quantity;
  const canAfford = userCoins >= totalCost;
  const overStock = quantity > reward.stock;
  const digital = isDigital(reward);

  return (
    <>
      <div style={{ padding: '1.5rem' }}>
        {/* Reward summary */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 80, height: 80, borderRadius: 'var(--radius-md)', flexShrink: 0,
              background: reward.image
                ? `url(${reward.image}) center/cover no-repeat`
                : 'linear-gradient(135deg,#F8F7F4,#EDE9FE)'
            }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.25rem' }}>
              {reward.name}
            </h4>
            <span style={{ color: 'var(--color-body)' }}>{reward.category}</span>
            <div style={{ color: 'var(--color-primary)', marginTop: '0.25rem' }}>
              {reward.coinCost.toLocaleString()} <span >coins each</span>
            </div>
          </div>
        </div>

        {/* Quantity picker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--color-heading)' }}>Quantity</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onQuantityChange(-1)} disabled={quantity <= 1 || loading}
              aria-label="Decrease quantity"
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-heading)', cursor: quantity <= 1 || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-fast)' }}
            ><Minus size={16} /></button>
            <span style={{ minWidth: 32, textAlign: 'center' }}>{quantity}</span>
            <button
              onClick={() => onQuantityChange(1)} disabled={quantity >= reward.stock || loading}
              aria-label="Increase quantity"
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-heading)', cursor: quantity >= reward.stock || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-fast)' }}
            ><Plus size={16} /></button>
          </div>
        </div>

        {/* Cost breakdown */}
        <div style={{ background: '#FDFBF7', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #F0EDE8', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-body)' }}>Your Balance</span>
            <span style={{ color: 'var(--color-heading)' }}>{userCoins.toLocaleString()} coins</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-body)' }}>Total Cost</span>
            <span style={{ color: 'var(--color-heading)' }}>{totalCost.toLocaleString()} coins</span>
          </div>
          <div style={{ height: 1, background: '#F0EDE8', margin: '0.5rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-heading)' }}>Remaining</span>
            <span style={{ color: canAfford ? 'var(--color-success)' : 'var(--color-error)' }}>
              {(userCoins - totalCost).toLocaleString()} coins
            </span>
          </div>
        </div>

        {/* Warnings */}
        {!canAfford && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-error)' }}>
              Insufficient coins. You need {(totalCost - userCoins).toLocaleString()} more coins.
            </span>
          </div>
        )}
        {overStock && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1rem' }}>
            <AlertTriangle size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
            <span style={{ color: '#F59E0B' }}>Only {reward.stock} item(s) available.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: '0.75rem', padding: '0 1.5rem 1.5rem' }}>
        <button onClick={onClose} disabled={loading} style={{ flex: 1, padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'var(--transition-fast)' }}>
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={loading || !canAfford || overStock}
          style={{ flex: 1, padding: '0.875rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !canAfford || overStock ? '#D1D5DB' : 'var(--color-primary)', color: 'white', cursor: loading || !canAfford || overStock ? 'not-allowed' : 'pointer', transition: 'var(--transition-fast)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Coins size={18} />
          {digital ? 'Confirm Redemption' : 'Next: Delivery Address'}
        </button>
      </div>
    </>
  );
};

const Field = ({ name, label, placeholder, address, onChange, half = false }) => (
  <div style={{ flex: half ? '1 1 45%' : '1 1 100%', minWidth: 0 }}>
    <label style={labelStyle} htmlFor={`addr-${name}`}>
      {label} <span style={{ color: 'var(--color-error)' }}>*</span>
    </label>
    <input
      id={`addr-${name}`}
      type="text"
      value={address[name] || ''}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      style={fieldStyle}
      onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

// ── Step 2: delivery address form ─────────────────────────────────────────────
const AddressStep = ({ address, onChange, onBack, onConfirm, loading }) => {
  const required = ['fullName', 'line1', 'city', 'state', 'pincode', 'phone'];
  const allFilled = required.every((k) => address[k]?.trim());

  return (
    <>
      <div style={{ padding: '0 1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
          <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <span style={{ color: 'var(--color-primary)' }}>
            Enter the address where we should ship your reward.
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
          <Field name="fullName" label="Full Name" placeholder="Rahul Sharma" address={address} onChange={onChange} />
          <Field name="line1" label="Address Line" placeholder="House / Flat, Street, Area" address={address} onChange={onChange} />
          <Field name="city" label="City" placeholder="Mumbai" half address={address} onChange={onChange} />
          <Field name="state" label="State" placeholder="Maharashtra" half address={address} onChange={onChange} />
          <Field name="pincode" label="Pincode" placeholder="400001" half address={address} onChange={onChange} />
          <Field name="phone" label="Phone Number" placeholder="9876543210" half address={address} onChange={onChange} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', padding: '0 1.5rem 1.5rem' }}>
        <button
          onClick={onBack} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-heading)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'var(--transition-fast)' }}
        >
          <ChevronLeft size={17} /> Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading || !allFilled}
          style={{ flex: 1, padding: '0.875rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading || !allFilled ? '#D1D5DB' : 'var(--color-primary)', color: 'white', cursor: loading || !allFilled ? 'not-allowed' : 'pointer', transition: 'var(--transition-fast)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Processing...
            </>
          ) : (
            <><Coins size={18} /> Confirm Redemption</>
          )}
        </button>
      </div>
    </>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
const RedeemModal = ({ open, onClose, reward, userCoins, onConfirm, loading = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1); // 1 = review, 2 = address
  const [address, setAddress] = useState({
    fullName: '', line1: '', city: '', state: '', pincode: '', phone: '',
  });

  if (!reward) return null;

  const digital = isDigital(reward);

  const handleQuantityChange = (delta) => {
    const next = quantity + delta;
    if (next >= 1 && next <= reward.stock) setQuantity(next);
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (digital) {
      // Digital rewards skip address step
      onConfirm(quantity, null, 'digital');
    } else {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity, address, 'physical');
  };

  const handleClose = () => {
    setStep(1);
    setQuantity(1);
    setAddress({ fullName: '', line1: '', city: '', state: '', pincode: '', phone: '' });
    onClose();
  };

  const stepLabel = digital ? 'Confirm Redemption' : step === 1 ? 'Step 1 of 2 — Review' : 'Step 2 of 2 — Delivery Address';

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ position: 'relative', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', maxWidth: 460, width: '100%', maxHeight: '90vh', overflowY: 'auto', zIndex: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h3 style={{ margin: 0 }}>Confirm Redemption</h3>
                <p style={{ color: 'var(--color-body)', margin: '0.2rem 0 0' }}>{stepLabel}</p>
              </div>
              <button onClick={handleClose} aria-label="Close modal" disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--color-body)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <X size={20} />
              </button>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }}>
                  <ReviewStep
                    reward={reward}
                    userCoins={userCoins}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    onNext={handleNext}
                    onClose={handleClose}
                    loading={loading}
                  />
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                  <AddressStep
                    address={address}
                    onChange={handleAddressChange}
                    onBack={() => setStep(1)}
                    onConfirm={handleConfirm}
                    loading={loading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RedeemModal;
