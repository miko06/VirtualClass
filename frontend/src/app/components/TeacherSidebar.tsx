import { Home, BookOpen, Upload, Bot, FileText, BarChart3, Users, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface TeacherSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function TeacherSidebar({ activeTab, onTabChange, onLogout }: TeacherSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Главная', icon: Home },
    { id: 'courses', label: 'Курсы', icon: BookOpen },
    { id: 'materials', label: 'Материалы', icon: Upload },
    { id: 'ai-generator', label: 'Генератор заданий', icon: Bot },
    { id: 'submissions', label: 'Работы студентов', icon: FileText },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'students', label: 'Студенты', icon: Users },
  ];

  return (
    <aside
      className="w-64 flex flex-col relative z-20 flex-shrink-0"
      style={{
        background: 'rgba(10,10,25,0.95)',
        borderRight: '1px solid rgba(139,92,246,0.15)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Sidebar gradient accent */}
      <div
        className="absolute top-0 right-0 w-px h-full"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.3), transparent)',
        }}
      />

      {/* Logo */}
      <div
        className="p-5 relative"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)',
              boxShadow: '0 0 20px rgba(124,58,237,0.5)',
            }}
          >
            <Bot className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h1
              className="text-sm"
              style={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #c4b5fd, #67e8f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EduClass AI
            </h1>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 4px #06b6d4' }} />
              <p className="text-xs text-cyan-400">Преподаватель</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <p className="text-xs uppercase tracking-wider px-3 mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Навигация
        </p>
        <ul className="space-y-1">
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
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                  style={
                    isActive
                      ? {
                          background: 'rgba(139,92,246,0.18)',
                          border: '1px solid rgba(139,92,246,0.35)',
                          boxShadow: '0 0 15px rgba(139,92,246,0.15)',
                        }
                      : {
                          background: 'transparent',
                          border: '1px solid transparent',
                        }
                  }
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ background: 'linear-gradient(180deg, #7c3aed, #06b6d4)' }}
                    />
                  )}
                  <Icon
                    className="w-4 h-4 flex-shrink-0 transition-colors"
                    style={{ color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }}
                  />
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.55)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                  {item.id === 'ai-generator' && (
                    <Sparkles
                      className="w-3 h-3 ml-auto"
                      style={{ color: isActive ? '#a78bfa' : 'rgba(139,92,246,0.4)' }}
                    />
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.12)',
            color: 'rgba(248,113,113,0.7)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgb(248,113,113)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,113,113,0.7)';
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Выйти</span>
        </button>
      </div>
    </aside>
  );
}
