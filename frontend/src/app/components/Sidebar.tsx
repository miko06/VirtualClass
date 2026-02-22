import { Home, BookOpen, Bot, FileText, CheckSquare, User, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Главная', icon: Home },
    { id: 'courses', label: 'Мои курсы', icon: BookOpen },
    { id: 'ai-assistant', label: 'ИИ Помощник', icon: Bot },
    { id: 'materials', label: 'Материалы', icon: FileText },
    { id: 'assignments', label: 'Задания', icon: CheckSquare },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <aside
      className="w-72 flex flex-col relative z-20 flex-shrink-0 bg-white"
      style={{
        borderRight: '1px solid #e2e8f0',
        boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
      }}
    >
      {/* Sidebar gradient accent */}
      <div
        className="absolute top-0 right-0 w-1 h-full opacity-50"
        style={{
          background: 'linear-gradient(180deg, transparent, #818cf8, #2dd4bf, transparent)',
        }}
      />

      {/* Logo */}
      <div
        className="p-6 relative bg-white/50 backdrop-blur-sm z-10"
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-lg shadow-indigo-500/20 border border-indigo-100"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
            }}
          >
            <Bot className="w-6 h-6 text-white relative z-10 drop-shadow-sm" />
          </div>
          <div>
            <h1
              className="text-lg tracking-tight"
              style={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EduClass
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Студент</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-bold uppercase tracking-wider px-4 mb-4 text-slate-400">
          Меню
        </p>
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onTabChange(item.id)}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden outline-none"
                  style={
                    isActive
                      ? {
                        background: 'linear-gradient(90deg, #eef2ff 0%, #ffffff 100%)',
                        boxShadow: '0 2px 10px rgba(79,70,229,0.05)',
                      }
                      : {
                        background: 'transparent',
                      }
                  }
                >
                  {/* Hover Background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}

                  {/* Active Indicator Strip */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #4f46e5, #0891b2)' }}
                    />
                  )}

                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-transparent text-slate-400 group-hover:bg-white group-hover:text-indigo-500 group-hover:shadow-sm'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className={`relative z-10 text-sm transition-colors ${isActive ? 'text-indigo-900 font-bold' : 'text-slate-600 font-medium group-hover:text-slate-900'
                      }`}
                  >
                    {item.label}
                  </span>

                  {item.id === 'ai-assistant' && (
                    <div className="ml-auto relative z-10 flex items-center justify-center">
                      <Sparkles
                        className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-300 group-hover:text-indigo-400'}`}
                      />
                    </div>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Logout */}
      <div className="p-4 bg-slate-50/50" style={{ borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-semibold text-sm outline-none bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
