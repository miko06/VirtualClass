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
import { TeacherAnalytics } from './components/TeacherAnalytics';
import { StudentAssignments } from './components/StudentAssignments';
import Dock, { DockItemData } from './components/Dock';
import { Home, BookOpen, Bot, FileText, CheckSquare, User, LogOut, Upload, BarChart3, Users } from 'lucide-react';

type UserRole = 'teacher' | 'student' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAuth = (role: 'teacher' | 'student') => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('dashboard');
  };

  // Teacher content rendering
  const renderTeacherContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard />;
      case 'courses':
        return <TeacherCourses />;
      case 'materials':
        return <TeacherMaterials />;
      case 'ai-generator':
        return <AIAssignmentGenerator />;
      case 'submissions':
        return <StudentSubmissions />;
      case 'analytics':
        return <TeacherAnalytics />;
      case 'students':
        return (
          <div className="p-8">
            <h2 className="text-3xl text-slate-800">Управление студентами</h2>
          </div>
        );
      default:
        return <TeacherDashboard />;
    }
  };

  // Student content rendering
  const renderStudentContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'materials':
        return <Materials />;
      case 'assignments':
        return <StudentAssignments />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
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
    { label: 'Аналитика', icon: <BarChart3 size={20} />, onClick: () => setActiveTab('analytics'), isActive: activeTab === 'analytics' },
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
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
