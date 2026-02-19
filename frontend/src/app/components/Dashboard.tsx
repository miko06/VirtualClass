import { BookOpen, Clock, TrendingUp, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Course {
  id: string;
  title: string;
  professor: string;
  progress: number;
  nextClass: string;
  gradient: string;
  glow: string;
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

export function Dashboard() {
  const courses: Course[] = [
    {
      id: '1',
      title: 'Машинное обучение',
      professor: 'Проф. Иванов А.С.',
      progress: 65,
      nextClass: 'Завтра в 10:00',
      gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
      glow: 'rgba(124,58,237,0.3)',
    },
    {
      id: '2',
      title: 'Веб-разработка',
      professor: 'Проф. Петрова М.В.',
      progress: 82,
      nextClass: 'Сегодня в 14:00',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      glow: 'rgba(236,72,153,0.3)',
    },
    {
      id: '3',
      title: 'Базы данных',
      professor: 'Проф. Сидоров В.П.',
      progress: 45,
      nextClass: 'Среда в 16:00',
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      glow: 'rgba(16,185,129,0.3)',
    },
    {
      id: '4',
      title: 'Алгоритмы',
      professor: 'Проф. Козлова Е.А.',
      progress: 55,
      nextClass: 'Четверг в 12:00',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
    },
  ];

  const stats = [
    {
      label: 'Активных курсов',
      value: '4',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
      glow: 'rgba(124,58,237,0.3)',
    },
    {
      label: 'Часов обучения',
      value: '127',
      icon: Clock,
      gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
      glow: 'rgba(6,182,212,0.3)',
    },
    {
      label: 'Средний прогресс',
      value: '62%',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      glow: 'rgba(16,185,129,0.3)',
    },
    {
      label: 'Заданий сдано',
      value: '18',
      icon: Award,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl" style={{ color: '#e2e8f0' }}>
            Добро пожаловать!
          </h2>
          <Sparkles className="w-6 h-6" style={{ color: '#a78bfa' }} />
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Вот обзор вашего прогресса и предстоящих занятий
        </p>
      </motion.div>

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
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Courses Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg" style={{ color: '#e2e8f0', fontWeight: 600 }}>Мои курсы</h3>
        <button
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: 'rgba(139,92,246,0.8)' }}
        >
          Все курсы <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.3 }}
            className="rounded-2xl overflow-hidden relative group cursor-pointer transition-all"
            style={{
              ...cardStyle,
              boxShadow: '0 0 0 rgba(139,92,246,0)',
            }}
          >
            {/* Top gradient bar */}
            <div className="h-1 w-full" style={{ background: course.gradient }} />

            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                    {course.title}
                  </h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {course.professor}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                  style={{ background: course.gradient, boxShadow: `0 0 15px ${course.glow}` }}
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Прогресс</span>
                  <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{course.progress}%</span>
                </div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progress}%`,
                      background: course.gradient,
                      boxShadow: `0 0 8px ${course.glow}`,
                    }}
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{course.nextClass}</span>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    color: '#c4b5fd',
                  }}
                >
                  Открыть
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
