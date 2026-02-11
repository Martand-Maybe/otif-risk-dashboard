import React from 'react';
import { LayoutDashboard, FileText, Settings, User } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <span>O</span>
        </div>
        <span className="logo-text">OTIF Risk</span>
      </div>
      
      <nav className="sidebar-nav">
        <a href="#" className="nav-item active">
          <LayoutDashboard size={20} />
          Dashboard
        </a>
        <a href="#" className="nav-item">
          <FileText size={20} />
          Reports
        </a>
        <a href="#" className="nav-item">
          <Settings size={20} />
          Settings
        </a>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item">
          <User size={20} />
          Profile
        </a>
      </div>
    </div>
  );
};
