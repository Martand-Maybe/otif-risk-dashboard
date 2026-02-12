import React from 'react';
import { LayoutDashboard, FileText, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-icon">
          <span>O</span>
        </div>
        {!isCollapsed && <span className="logo-text">OTIF Risk</span>}
      </div>
      
      <nav className="sidebar-nav">
        <a href="#" className="nav-item active" title="Dashboard">
          <LayoutDashboard size={20} />
          {!isCollapsed && 'Dashboard'}
        </a>
        <a href="#" className="nav-item" title="Reports">
          <FileText size={20} />
          {!isCollapsed && 'Reports'}
        </a>
        <a href="#" className="nav-item" title="Settings">
          <Settings size={20} />
          {!isCollapsed && 'Settings'}
        </a>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item" title="Profile">
          <User size={20} />
          {!isCollapsed && 'Profile'}
        </a>
        <button className="sidebar-toggle" onClick={onToggle} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );
};
