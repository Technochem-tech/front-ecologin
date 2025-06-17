
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbar = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-eco-green-50 to-eco-blue-50">
      {showNavbar && <Navbar />}
      <div className="min-h-screen max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
