// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEnfermeria from '../components/SidebarEnfermeria'; // tu menú lateral real

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar fijo */}
      <SidebarEnfermeria />

      {/* Área donde se pintan las páginas hijas */}
      <main className="ml-64 flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}