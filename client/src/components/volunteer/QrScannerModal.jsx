import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, Keyboard, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScannerModal = ({ isOpen, onClose, onScanSuccess, title = 'Scan Attendance QR Code' }) => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'manual'
  const [manualToken, setManualToken] = useState('');
  const [error, setError] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  // Initialize camera scanner when modal opens on 'camera' tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    let isMounted = true;
    setCameraLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const qrId = 'qr-reader-container';
        const element = document.getElementById(qrId);
        if (!element) return;

        const html5Qrcode = new Html5Qrcode(qrId);
        html5QrcodeRef.current = html5Qrcode;

        const config = { fps: 10, qrbox: { width: 220, height: 220 } };

        await html5Qrcode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (isMounted) {
              handleSuccess(decodedText);
            }
          },
          () => {
            // Ignore scan failures (frame not decoded)
          }
        );

        if (isMounted) {
          setCameraLoading(false);
        }
      } catch (err) {
        console.error('[QrScannerModal] Camera error:', err);
        if (isMounted) {
          setCameraLoading(false);
          setError('Could not access camera. Please check permissions or use manual entry.');
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const stopCamera = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch (_e) {
        // Ignore stop error
      } finally {
        html5QrcodeRef.current = null;
      }
    }
  };

  const handleSuccess = (token) => {
    if (!token) return;
    setIsScanned(true);
    stopCamera();

    // Parse JSON if QR is encoded as JSON string
    let parsedToken = token;
    try {
      const obj = JSON.parse(token);
      if (obj?.token) parsedToken = obj.token;
    } catch (_e) {
      // Raw string token
    }

    setTimeout(() => {
      onScanSuccess(parsedToken);
      onClose();
      setIsScanned(false);
    }, 400);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setError('Please enter a valid QR token code.');
      return;
    }
    handleSuccess(manualToken.trim());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 20,
            width: '100%',
            maxWidth: 460,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode className="text-primary" size={22} />
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-heading)', margin: 0 }}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-body)',
                opacity: 0.7,
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div style={{ padding: '1.25rem 1.5rem 0 1.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'var(--color-bg)',
                padding: '0.25rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                style={{
                  padding: '0.6rem',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: activeTab === 'camera' ? 'var(--color-card)' : 'transparent',
                  color: activeTab === 'camera' ? 'var(--color-primary)' : 'var(--color-body)',
                  boxShadow: activeTab === 'camera' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Camera size={16} /> Scan Camera
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                style={{
                  padding: '0.6rem',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: activeTab === 'manual' ? 'var(--color-card)' : 'transparent',
                  color: activeTab === 'manual' ? 'var(--color-primary)' : 'var(--color-body)',
                  boxShadow: activeTab === 'manual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Keyboard size={16} /> Enter Code
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem' }}>
            {error && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-error)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {isScanned ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  color: 'var(--color-success)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle2 size={48} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>QR Code Verified!</h4>
              </div>
            ) : activeTab === 'camera' ? (
              <div>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: 260,
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: '#000',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div id="qr-reader-container" ref={scannerRef} style={{ width: '100%' }} />

                  {cameraLoading && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#fff',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      Opening camera feed...
                    </div>
                  )}
                </div>
                <p style={{ textAlign: 'center', color: 'var(--color-body)', fontSize: '0.8rem', marginTop: '1rem' }}>
                  Point your camera at the session QR code displayed on the organizer screen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">QR Token Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 64aef1290a... or scan code"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    style={{ padding: '0.85rem 1rem' }}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Submit QR Code Token
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QrScannerModal;
