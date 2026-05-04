import React from 'react';
import { Terminal, CheckSquare, HelpCircle, BookOpen, BarChart3, Award, Settings, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export type Section = 'terminal' | 'checklist' | 'quiz' | 'reference' | 'progress' | 'certificate';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  user: any;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, user, onLogout }) => {
  const menuItems = [
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'reference', label: 'Reference', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'certificate', label: 'Certificate', icon: Award },
  ];

  return (
    <div id="sidebar" className="w-64 bg-[#141414] text-white flex flex-col border-r border-[#333] h-full overflow-hidden">
      <div className="p-6 border-bottom border-[#333]">
        <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded font-mono font-black">LFS</div>
          MASTERY LAB
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => setActiveSection(item.id as Section)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              activeSection === item.id 
                ? "bg-white text-black" 
                : "text-gray-400 hover:text-white hover:bg-[#222]"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#333]">
        {user ? (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#222]">
            <img src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`} alt="avatar" className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.displayName}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
            <button onClick={onLogout} id="logout-btn" className="p-2 text-gray-400 hover:text-red-500 hover:bg-black rounded">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center">Not signed in</div>
        )}
      </div>
    </div>
  );
};
