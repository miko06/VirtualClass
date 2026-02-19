import { BookOpen, Users, FileText, TrendingUp, Clock, Plus, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

const headingStyle = { color: '#e2e8f0' };
const subStyle = { color: 'rgba(255,255,255,0.45)' };

export function TeacherDashboard() {
  const stats = [
    {
      label: 'Активных курсов',
      value: '4',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
      glow: 'rgba(124,58,237,0.3)',
      change: '+1 в этом месяце',
    },
    {
      label: 'Всего студентов',
      value: '176',
      icon: Users,
      gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
      glow: 'rgba(6,182,212,0.3)',
      change: '+12 на этой неделе',
    },
    {
      label: 'Проверить работ',
      value: '23',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
      change: '5 просрочено',
    },
    {
      label: 'Средняя оценка',
      value: '4.6',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      glow: 'rgba(16,185,129,0.3)',
      change: '+0.2 к прошлой неделе',
    },
  ];

  const recentActivity = [
    { student: 'Иванов И.', action: 'сдал задание', course: 'Машинное обучение', time: '5 мин', avatar: 'ИИ' },
    { student: 'Петрова А.', action: 'прошла тест', course: 'Веб-разработка', time: '15 мин', avatar: 'ПА' },
    { student: 'Сидоров П.', action: 'задал вопрос', course: 'Базы данных', time: '1 ч', avatar: 'СП' },
    { student: 'Козлова М.', action: 'сдала задание', course: 'Алгоритмы', time: '2 ч', avatar: 'КМ' },
  ];

  const upcomingClasses = [
    { course: 'Машинное обучение', time: 'Завтра 10:00', students: 45, gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)' },
    { course: 'Веб-разработка', time: 'Сегодня 14:00', students: 38, gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
    { course: 'Базы данных', time: 'Среда 16:00', students: 52, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  ];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={headingStyle}
            className="text-3xl mb-1"
          >
            Панель преподавателя
          </motion.h2>
          <p style={subStyle} className="text-sm">Обзор ваших курсов и активности студентов</p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
          }}
        >
          <Plus className="w-4 h-4" />
          Создать курс
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5 rounded-2xl relative overflow-hidden group cursor-pointer"
              style={cardStyle}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at top left, ${stat.glow}, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: stat.gradient, boxShadow: `0 0 20px ${stat.glow}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl mb-1" style={{ color: '#f1f5f9', fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div className="text-sm mb-2" style={subStyle}>{stat.label}</div>
                <div className="text-xs" style={{ color: 'rgba(139,92,246,0.8)' }}>{stat.change}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base" style={{ ...headingStyle, fontWeight: 600 }}>Последняя активность</h3>
            <button
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'rgba(139,92,246,0.8)' }}
            >
              Все <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.3))',
                    color: '#c4b5fd',
                    fontWeight: 700,
                  }}
                >
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: '#e2e8f0' }}>
                    <span style={{ fontWeight: 600 }}>{activity.student}</span>{' '}
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{activity.action}</span>
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{activity.course}</p>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <Clock className="w-3 h-3" />
                  <span className="whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-6"
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base" style={{ ...headingStyle, fontWeight: 600 }}>Предстоящие занятия</h3>
            <Sparkles className="w-4 h-4" style={{ color: 'rgba(139,92,246,0.6)' }} />
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((cls, index) => (
              <div
                key={index}
                className="p-4 rounded-xl relative overflow-hidden group cursor-pointer transition-all"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Left gradient accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  style={{ background: cls.gradient }}
                />
                <div className="pl-3">
                  <h4 className="text-sm mb-2" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                    {cls.course}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{cls.time}</span>
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        color: '#c4b5fd',
                      }}
                    >
                      <Users className="w-3 h-3" />
                      <span>{cls.students}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
