import { Users, TrendingUp, Award, BarChart3, Target } from 'lucide-react';
import { motion } from 'motion/react';

export function TeacherAnalytics() {
  const courseStats = [
    { course: 'Машинное обучение', students: 45, avgScore: 82, completion: 78, trend: 'up', gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)', glow: 'rgba(124,58,237,0.3)' },
    { course: 'Веб-разработка', students: 38, avgScore: 88, completion: 85, trend: 'up', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
    { course: 'Базы данных', students: 52, avgScore: 76, completion: 68, trend: 'down', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.3)' },
    { course: 'Алгоритмы', students: 41, avgScore: 79, completion: 72, trend: 'up', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.3)' },
  ];

  const difficultTopics = [
    { topic: 'Обратное распространение ошибки', errorRate: 45, course: 'Машинное обучение' },
    { topic: 'Асинхронное программирование', errorRate: 38, course: 'Веб-разработка' },
    { topic: 'Нормализация баз данных', errorRate: 52, course: 'Базы данных' },
    { topic: 'Динамическое программирование', errorRate: 48, course: 'Алгоритмы' },
  ];

  const topStudents = [
    { name: 'Сидоров П.', avgScore: 95, courses: 4, badge: '🏆' },
    { name: 'Петрова А.', avgScore: 92, courses: 4, badge: '🥇' },
    { name: 'Иванов И.', avgScore: 89, courses: 4, badge: '🥈' },
    { name: 'Козлова М.', avgScore: 87, courses: 3, badge: '🥉' },
    { name: 'Смирнов А.', avgScore: 85, courses: 4, badge: '⭐' },
  ];

  const overallStats = [
    { icon: BarChart3, value: '176', label: 'Всего студентов', gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)', glow: 'rgba(124,58,237,0.3)' },
    { icon: Users, value: '4', label: 'Активных курса', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
    { icon: Award, value: '81%', label: 'Средний балл', gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)' },
    { icon: Target, value: '76%', label: 'Завершение курсов', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.3)' },
  ];

  return (
    <div className="p-8 min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Аналитика</h2>
        <p className="text-sm font-medium text-slate-500">
          Статистика по курсам и успеваемости студентов
        </p>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        {overallStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-6 rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div
                className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none blur-2xl"
                style={{ background: stat.gradient }}
              />
              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ background: stat.gradient, boxShadow: `0 8px 20px -4px ${stat.glow}` }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-extrabold text-slate-800 tracking-tight mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Course Statistics */}
      <div className="mb-10 relative z-10">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-6">
          Статистика по курсам
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courseStats.map((stat, index) => (
            <motion.div
              key={stat.course}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.2 }}
              className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 hover:ring-indigo-100 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="h-2 w-full transition-transform group-hover:scale-105" style={{ background: stat.gradient, transformOrigin: 'left' }} />
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {stat.course}
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{stat.students} студентов</span>
                    </div>
                  </div>
                  <div
                    className="px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                    style={{
                      background: stat.trend === 'up' ? '#ecfdf5' : '#fef2f2',
                      border: `1px solid ${stat.trend === 'up' ? '#a7f3d0' : '#fecaca'}`,
                    }}
                  >
                    <TrendingUp
                      className="w-4 h-4"
                      style={{
                        color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                        transform: stat.trend === 'down' ? 'rotate(180deg)' : undefined,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div
                    className="p-5 rounded-2xl text-center bg-slate-50 border border-slate-100 group-hover:border-indigo-100 transition-colors"
                  >
                    <div className="text-3xl font-extrabold text-slate-800 mb-1">{stat.avgScore}%</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Средний балл</div>
                  </div>
                  <div
                    className="p-5 rounded-2xl text-center bg-slate-50 border border-slate-100 group-hover:border-indigo-100 transition-colors"
                  >
                    <div className="text-3xl font-extrabold text-slate-800 mb-1">{stat.completion}%</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Завершено</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                    <span>Прогресс курса</span>
                    <span>{stat.completion}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.completion}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: stat.gradient, boxShadow: `0 0 10px ${stat.glow}` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
        {/* Difficult Topics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-8 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ef4444, #f59e0b)', boxShadow: '0 8px 20px -6px rgba(239,68,68,0.4)' }}
            >
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Отстающие темы</h3>
              <p className="text-sm font-medium text-slate-500">Требуют дополнительного внимания</p>
            </div>
          </div>

          <div className="space-y-4">
            {difficultTopics.map((topic, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <p className="text-base font-bold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">{topic.topic}</p>
                    <p className="text-xs font-bold text-slate-400">{topic.course}</p>
                  </div>
                  <span
                    className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 font-bold border"
                    style={{
                      background: topic.errorRate > 50 ? '#fef2f2' : topic.errorRate > 40 ? '#fffbeb' : '#fefce8',
                      borderColor: topic.errorRate > 50 ? '#fecaca' : topic.errorRate > 40 ? '#fde68a' : '#fef08a',
                      color: topic.errorRate > 50 ? '#ef4444' : topic.errorRate > 40 ? '#f59e0b' : '#eab308',
                    }}
                  >
                    {topic.errorRate}% ошибок
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.errorRate}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      background: topic.errorRate > 50
                        ? 'linear-gradient(90deg, #ef4444, #f97316)'
                        : topic.errorRate > 40
                          ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                          : 'linear-gradient(90deg, #eab308, #f59e0b)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Students */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-3xl p-8 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', boxShadow: '0 8px 20px -6px rgba(16,185,129,0.4)' }}
            >
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Гордость курса</h3>
              <p className="text-sm font-medium text-slate-500">Топ-5 студентов по среднему баллу</p>
            </div>
          </div>

          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div
                key={index}
                className="flex items-center gap-5 p-4 rounded-2xl transition-all border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-inner">
                  {student.badge}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-slate-800 mb-0.5">{student.name}</p>
                  <p className="text-xs font-bold text-slate-400">{student.courses} курса</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-emerald-500">{student.avgScore}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">балл</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
