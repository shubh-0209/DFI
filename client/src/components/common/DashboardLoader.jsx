import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const messages = [
  'Preparing Dashboard...',
  'Fetching latest updates...',
  'Loading health insights...',
  'Almost ready...'
];

export const DashboardLoader = ({ onReveal, onComplete }) => {
  const [loadingText] = useState(() => messages[Math.floor(Math.random() * messages.length)]);
  const logoControls = useAnimation();

  useEffect(() => {
    const runAnimations = async () => {
      await logoControls.start({
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: 'easeOut' }
      });

      await logoControls.start({
        scale: [1, 1.04, 1],
        boxShadow: [
          '0 0 0px rgba(11, 76, 163, 0)',
          '0 0 25px rgba(11, 76, 163, 0.2)',
          '0 0 0px rgba(11, 76, 163, 0)'
        ],
        transition: { duration: 0.8, ease: 'easeInOut' }
      });
    };

    runAnimations();
  }, [logoControls]);

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      if (onReveal) onReveal();
      if (onComplete) onComplete();
    }, 1300);

    return () => clearTimeout(revealTimer);
  }, [onReveal, onComplete]);

  const dotTransition = (delay) => ({
    duration: 0.9,
    repeat: Infinity,
    delay,
    ease: 'easeInOut'
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '420px',
          maxWidth: '90vw',
          padding: '32px',
          borderRadius: '24px',
          backgroundColor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
            filter: 'blur(6px)'
          }}
          animate={logoControls}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor:'#fff',
            marginBottom:'20px'
          }}
        >
          <img
            src="/logo-nobg.png"
            alt="Disha For India Logo"
            style={{
              width:'100%',
              height:'100%',
              objectFit:'cover'
            }}
          />
        </motion.div>

        <div
          style={{
            color:'#1F2937',
            marginBottom:'16px'
          }}
        >
          {loadingText}
        </div>

        <div style={{
          display:'flex',
          gap:'12px'
        }}>
          {[0,0.15,0.3].map((delay,index)=>(
            <motion.div
              key={index}
              style={{
                width:'8px',
                height:'8px',
                borderRadius:'50%',
                backgroundColor:'#0B4CA3'
              }}
              animate={{
                scale:[1,1.5,1]
              }}
              transition={dotTransition(delay)}
            />
          ))}
        </div>

      </motion.div>
    </div>
  );
};

export default DashboardLoader;
