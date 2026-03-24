import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass-panel" style={{ margin: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.25rem' }}>
        <Leaf size={24} />
        Seva Kendra
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="#about" style={{ fontWeight: 500 }}>About Us</a>
        <a href="#contact" style={{ fontWeight: 500 }}>Contact Us</a>
      </div>
    </nav>
  );
};

export default Navbar;
