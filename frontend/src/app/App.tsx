import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { Courses } from './components/Courses';
import { AIAssistant } from './components/AIAssistant';
import { Materials } from './components/Materials';
import { Assignments } from './components/Assignments';
import { Profile } from './components/Profile';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherCourses } from './components/TeacherCourses';
import { TeacherMaterials } from './components/TeacherMaterials';
import { AIAssignmentGenerator } from './components/AIAssignmentGenerator';
import { StudentSubmissions } from './components/StudentSubmissions';
import { StudentAssignments } from './components/StudentAssignments';
import { ThemeSquaresBackground } from './components/ThemeSquaresBackground';
import Dock, { DockItemData } from './components/Dock';
import { Home, BookOpen, Bot, FileText, CheckSquare, User, LogOut, Upload, BarChart3, Users, Sun, Moon } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import type { User as AppUser } from '../api/client';

type UserRole = 'teacher' | 'student' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme, toggleTheme } = useTheme();

  const handleAuth = (role: 'teacher' | 'student', user?: AppUser) => {
    setUserRole(role);
    setCurrentUser(user ?? null);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Teacher content rendering
  const renderTeacherContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard currentUser={currentUser} />;
      case 'courses':
        return <TeacherCourses currentUser={currentUser} />;
      case 'materials':
        return <TeacherMaterials />;
      case 'ai-generator':
        return <AIAssignmentGenerator />;
      case 'submissions':
        return <StudentSubmissions />;
      case 'students':
        return (
          <div className="legacy-theme-screen p-8 min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
            <ThemeSquaresBackground />
            <div className="relative z-10">
              <h2 className="text-3xl text-slate-800 dark:text-white">Управление студентами</h2>
            </div>
          </div>
        );
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
        return <StudentAssignments />;
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

  const teacherDockItems: DockItemData[] = [
    { label: 'Главная', icon: <Home size={20} />, onClick: () => setActiveTab('dashboard'), isActive: activeTab === 'dashboard' },
    { label: 'Курсы', icon: <BookOpen size={20} />, onClick: () => setActiveTab('courses'), isActive: activeTab === 'courses' },
    { label: 'Материалы', icon: <Upload size={20} />, onClick: () => setActiveTab('materials'), isActive: activeTab === 'materials' },
    { label: 'Генератор', icon: <Bot size={20} />, onClick: () => setActiveTab('ai-generator'), isActive: activeTab === 'ai-generator' },
    { label: 'Работы', icon: <FileText size={20} />, onClick: () => setActiveTab('submissions'), isActive: activeTab === 'submissions' },
    { label: 'Студенты', icon: <Users size={20} />, onClick: () => setActiveTab('students'), isActive: activeTab === 'students' },
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-[#0f1115] dark:text-gray-100 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Theme Toggle Button positioned at top right */}
      {userRole && (
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-8 z-50 p-2.5 rounded-full bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      )}
      <main className="flex-1 overflow-y-auto relative z-10">
        {userRole === 'teacher' ? renderTeacherContent() : renderStudentContent()}
      </main>

      <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock
            items={userRole === 'teacher' ? teacherDockItems : studentDockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>
    </div>
  );
}
