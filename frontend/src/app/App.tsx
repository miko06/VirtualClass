import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { Courses } from './components/Courses';
import { AIAssistant } from './components/AIAssistant';
import { Materials } from './components/Materials';
import { StudentAssignments } from './components/StudentAssignments';
import { Profile } from './components/Profile';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherCourses } from './components/TeacherCourses';
import { TeacherMaterials } from './components/TeacherMaterials';
import { AIAssignmentGenerator } from './components/AIAssignmentGenerator';
import { StudentSubmissions } from './components/StudentSubmissions';
import { TeacherStudents } from './components/TeacherStudents';
import { TeacherProfile } from './components/TeacherProfile';
import { AdminPanel } from './components/AdminPanel';
import { ThemeSquaresBackground } from './components/ThemeSquaresBackground';
import Dock, { DockItemData } from './components/Dock';
import {
  Home, BookOpen, Bot, FileText, CheckSquare, User, LogOut,
  Upload, Users, Sun, Moon, Shield, LayoutDashboard,
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { MaterialsProvider } from './contexts/MaterialsContext';
import { AppDataProvider } from './contexts/AppDataContext';
import type { User as AppUser } from '../api/client';

type UserRole = 'teacher' | 'student' | 'admin' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme, toggleTheme } = useTheme();

  const handleAuth = (role: 'teacher' | 'student' | 'admin', user?: AppUser) => {
    setUserRole(role);
    setCurrentUser(user ?? null);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
    localStorage.removeItem('currentUserId');
  };

  // Admin content rendering
  const renderAdminContent = () => {
    return <AdminPanel />;
  };

  // Teacher content rendering
  const renderTeacherContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard currentUser={currentUser} />;
      case 'courses':
        return <TeacherCourses currentUser={currentUser} />;
      case 'materials':
        return <TeacherMaterials currentUser={currentUser} />;
      case 'assignments':
        return <StudentSubmissions currentUser={currentUser} />;
      case 'submissions':
        return <StudentSubmissions currentUser={currentUser} />;
      case 'ai-generator':
        return <AIAssignmentGenerator />;
      case 'students':
        return <TeacherStudents currentUser={currentUser} />;
      case 'profile':
        return <TeacherProfile currentUser={currentUser} />;
      default:
        return <TeacherDashboard currentUser={currentUser} />;
    }
  };

  // Student content rendering
  const renderStudentContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'courses':
        return <Courses currentUser={currentUser} />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'materials':
        return <Materials />;
      case 'assignments':
        return <StudentAssignments currentUser={currentUser} />;
      case 'profile':
        return <Profile currentUser={currentUser} />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  // Auth screen
  if (!userRole) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  const adminDockItems: DockItemData[] = [
    { label: 'Панель', icon: <LayoutDashboard size={20} />, onClick: () => setActiveTab('dashboard'), isActive: true },
    { label: 'Выйти', icon: <LogOut size={20} />, onClick: handleLogout, className: '!border-red-500/30 hover:!border-red-500' },
  ];

  const teacherDockItems: DockItemData[] = [
    { label: 'Главная', icon: <Home size={20} />, onClick: () => setActiveTab('dashboard'), isActive: activeTab === 'dashboard' },
    { label: 'Курсы', icon: <BookOpen size={20} />, onClick: () => setActiveTab('courses'), isActive: activeTab === 'courses' },
    { label: 'Материалы', icon: <Upload size={20} />, onClick: () => setActiveTab('materials'), isActive: activeTab === 'materials' },
    { label: 'Задания', icon: <CheckSquare size={20} />, onClick: () => setActiveTab('assignments'), isActive: activeTab === 'assignments' },
    { label: 'Генератор', icon: <Bot size={20} />, onClick: () => setActiveTab('ai-generator'), isActive: activeTab === 'ai-generator' },
    { label: 'Студенты', icon: <Users size={20} />, onClick: () => setActiveTab('students'), isActive: activeTab === 'students' },
    { label: 'Профиль', icon: <User size={20} />, onClick: () => setActiveTab('profile'), isActive: activeTab === 'profile' },
    { label: 'Выйти', icon: <LogOut size={20} />, onClick: handleLogout, className: '!border-red-500/30 hover:!border-red-500' },
  ];

  const studentDockItems: DockItemData[] = [
    { label: 'Главная', icon: <Home size={20} />, onClick: () => setActiveTab('dashboard'), isActive: activeTab === 'dashboard' },
    { label: 'Мои курсы', icon: <BookOpen size={20} />, onClick: () => setActiveTab('courses'), isActive: activeTab === 'courses' },
    { label: 'ИИ Помощник', icon: <Bot size={20} />, onClick: () => setActiveTab('ai-assistant'), isActive: activeTab === 'ai-assistant' },
    { label: 'Материалы', icon: <FileText size={20} />, onClick: () => setActiveTab('materials'), isActive: activeTab === 'materials' },
    { label: 'Задания', icon: <CheckSquare size={20} />, onClick: () => setActiveTab('assignments'), isActive: activeTab === 'assignments' },
    { label: 'Профиль', icon: <User size={20} />, onClick: () => setActiveTab('profile'), isActive: activeTab === 'profile' },
    { label: 'Выйти', icon: <LogOut size={20} />, onClick: handleLogout, className: '!border-red-500/30 hover:!border-red-500' },
  ];

  const dockItems =
    userRole === 'admin' ? adminDockItems :
    userRole === 'teacher' ? teacherDockItems :
    studentDockItems;

  const renderContent = () => {
    if (userRole === 'admin') return renderAdminContent();
    if (userRole === 'teacher') return renderTeacherContent();
    return renderStudentContent();
  };

  return (
    <AppDataProvider>
      <MaterialsProvider>
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-[#0f1115] dark:text-gray-100 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {/* Header bar for admin */}
          {userRole === 'admin' && (
            <div className="absolute top-0 left-0 right-0 z-40 flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
              <Shield className="w-5 h-5 text-violet-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Администратор</span>
              {currentUser?.name && (
                <span className="text-sm text-slate-500 dark:text-slate-400">· {currentUser.name}</span>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="absolute top-6 right-8 z-50 p-2.5 rounded-full bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <main className={`flex-1 overflow-y-auto relative z-10 ${userRole === 'admin' ? 'pt-12' : ''}`}>
            {renderContent()}
          </main>

          <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Dock
                items={dockItems}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>
          </div>
        </div>
      </MaterialsProvider>
    </AppDataProvider>
  );
}
