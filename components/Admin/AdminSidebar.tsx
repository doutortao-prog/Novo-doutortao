import React from 'react';
import { LayoutDashboard, Edit3, Users, LogOut, ExternalLink } from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewPublic: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange, onLogout, onViewPublic }) => {
  const navItems = [
    { id: AdminTab.MODELS, label: 'My Models', icon: LayoutDashboard },
    { id: AdminTab.EDITOR, label: 'Create/Edit', icon: Edit3 },
    { id: AdminTab.LEADS, label: 'Leads Data', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-xl z-10">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          LeadFlow
        </h1>
        <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
         <button
          onClick={onViewPublic}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-400 hover:bg-emerald-900/20 transition-colors"
        >
          <ExternalLink size={20} />
          <span>View Live Page</span>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;