import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ user }) => {
  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content">
        <Navbar />
        <div className="page-container">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
