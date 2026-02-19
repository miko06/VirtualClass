import { Users, TrendingUp, Award, BarChart3, Target } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

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
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Аналитика</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Статистика по курсам и успеваемости студентов
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {overallStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-5 rounded-2xl relative overflow-hidden group"
              style={cardStyle}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at top left, ${stat.glow}, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: stat.gradient, boxShadow: `0 0 20px ${stat.glow}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl mb-1" style={{ color: '#f1f5f9', fontWeight: 700 }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Course Statistics */}
      <div className="mb-8">
        <h3 className="text-base mb-4" style={{ color: '#e2e8f0', fontWeight: 600 }}>
          Статистика по курсам
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {courseStats.map((stat, index) => (
            <motion.div
              key={stat.course}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl overflow-hidden"
              style={cardStyle}
            >
              <div className="h-1" style={{ background: stat.gradient }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-base mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                      {stat.course}
                    </h4>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <Users className="w-3.5 h-3.5" />
                      <span>{stat.students} студентов</span>
                    </div>
                  </div>
                  <div
                    className="px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                    style={{
                      background: stat.trend === 'up' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      border: stat.trend === 'up' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)',
                    }}
                  >
                    <TrendingUp
                      className="w-3.5 h-3.5"
                      style={{
                        color: stat.trend === 'up' ? '#34d399' : '#f87171',
                        transform: stat.trend === 'down' ? 'rotate(180deg)' : undefined,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="text-xl mb-0.5" style={{ color: '#e2e8f0', fontWeight: 700 }}>{stat.avgScore}%</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Средний балл</div>
                  </div>
                  <div
                    className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="text-xl mb-0.5" style={{ color: '#e2e8f0', fontWeight: 700 }}>{stat.completion}%</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Завершено</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <span>Прогресс</span>
                    <span>{stat.completion}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${stat.completion}%`, background: stat.gradient, boxShadow: `0 0 8px ${stat.glow}` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficult Topics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={cardStyle}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(245,158,11,0.3))' }}
            >
              <Target className="w-5 h-5" style={{ color: '#f87171' }} />
            </div>
            <div>
              <h3 className="text-base" style={{ color: '#e2e8f0', fontWeight: 600 }}>Сложные темы</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Требуют дополнительного внимания</p>
            </div>
          </div>

          <div className="space-y-3">
            {difficultTopics.map((topic, index) => (
              <div
                key={index}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 pr-3">
                    <p className="text-sm mb-0.5" style={{ color: '#e2e8f0', fontWeight: 500 }}>{topic.topic}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{topic.course}</p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: topic.errorRate > 50
                        ? 'rgba(239,68,68,0.12)'
                        : topic.errorRate > 40
                        ? 'rgba(245,158,11,0.12)'
                        : 'rgba(234,179,8,0.12)',
                      border: `1px solid ${topic.errorRate > 50 ? 'rgba(239,68,68,0.25)' : topic.errorRate > 40 ? 'rgba(245,158,11,0.25)' : 'rgba(234,179,8,0.25)'}`,
                      color: topic.errorRate > 50 ? '#f87171' : topic.errorRate > 40 ? '#fbbf24' : '#facc15',
                    }}
                  >
                    {topic.errorRate}% ошибок
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${topic.errorRate}%`,
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
          className="rounded-2xl p-6"
          style={cardStyle}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.3))' }}
            >
              <Award className="w-5 h-5" style={{ color: '#34d399' }} />
            </div>
            <div>
              <h3 className="text-base" style={{ color: '#e2e8f0', fontWeight: 600 }}>Лучшие студенты</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Топ-5 по среднему баллу</p>
            </div>
          </div>

          <div className="space-y-2">
            {topStudents.map((student, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-xl">{student.badge}</span>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: '#e2e8f0', fontWeight: 500 }}>{student.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{student.courses} курса</p>
                </div>
                <div className="text-right">
                  <div className="text-base" style={{ color: '#34d399', fontWeight: 700 }}>{student.avgScore}%</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>средний балл</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
