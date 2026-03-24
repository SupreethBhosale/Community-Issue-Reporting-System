const Footer = () => {
  return (
    <footer className="glass-panel" style={{ margin: '0 16px 16px', padding: '24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
        <a href="#" style={{ color: 'var(--text-muted)' }}>Twitter</a>
        <a href="#" style={{ color: 'var(--text-muted)' }}>Facebook</a>
        <a href="#" style={{ color: 'var(--text-muted)' }}>Instagram</a>
        <a href="#" style={{ color: 'var(--text-muted)' }}>LinkedIn</a>
      </div>
      <p style={{ fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} Seva Kendra. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
