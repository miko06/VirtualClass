import { useState } from 'react';
import { AuthScreen } from './app/components/AuthScreen';
import { Sidebar } from './app/components/Sidebar';
import { TeacherSidebar } from './app/components/TeacherSidebar';
import { Dashboard } from './app/components/Dashboard';
import { Courses } from './app/components/Courses';
import { AIAssistant } from './app/components/AIAssistant';
import { Materials } from './app/components/Materials';
import { Assignments } from './app/components/Assignments';
import { Profile } from './app/components/Profile';
import { TeacherDashboard } from './app/components/TeacherDashboard';
import { TeacherCourses } from './app/components/TeacherCourses';
import { TeacherMaterials } from './app/components/TeacherMaterials';
import { AIAssignmentGenerator } from './app/components/AIAssignmentGenerator';
import { StudentSubmissions } from './app/components/StudentSubmissions';
import { TeacherAnalytics } from './app/components/TeacherAnalytics';
import { StudentAssignments } from './app/components/StudentAssignments';
import { UsersPanel } from './components/UsersPanel';

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
      case 'users':
        return <UsersPanel />;
      case 'students':
        return (
          <div className="p-8">
            <h2 className="text-3xl" style={{ color: '#e2e8f0' }}>Управление студентами</h2>
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
      case 'users':
        return <UsersPanel />;
      default:
        return <Dashboard />;
    }
  };

  // Auth screen
  if (!userRole) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="flex h-screen" style={{ background: '#060612' }}>
      {/* Background orbs for main app */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="orb-1 absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            top: '-100px',
            left: '200px',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="orb-2 absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
            bottom: '-50px',
            right: '100px',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="orb-3 absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {userRole === 'teacher' ? (
        <TeacherSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
      ) : (
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1 overflow-y-auto relative z-10">
        {userRole === 'teacher' ? renderTeacherContent() : renderStudentContent()}
      </main>
    </div>
  );
}
