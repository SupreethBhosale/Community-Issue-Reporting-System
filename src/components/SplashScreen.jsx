import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const SplashScreen = () => {
  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
          style={{
            width: '120px',
            height: '120px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-color)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <Leaf size={64} />
        </motion.div>
        
        <motion.div style={{ textAlign: 'center' }}>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ fontSize: '3.5rem', margin: 0, color: 'var(--primary-color)', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Seva Kendra
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: '8px', letterSpacing: '2px', textTransform: 'uppercase' }}
          >
            Smart Civic Platform
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
