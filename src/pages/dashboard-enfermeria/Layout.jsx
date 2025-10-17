// src/pages/dashboard-enfermeria/Layout.jsx
import React from 'react';
import SidebarEnfermeria from '../../components/SidebarEnfermeria';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <SidebarEnfermeria />
      <main className="ml-64 w-full min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default Layout;