import { Mail, Phone, MapPin, Calendar, Award, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

export function Profile() {
  const studentInfo = {
    name: 'Иван Студентов',
    email: 'ivan.studentov@university.edu',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    enrollmentDate: 'Сентябрь 2024',
    studentId: 'STU-2024-12345',
  };

  const stats = [
    { label: 'Завершено курсов', value: '12', icon: BookOpen, gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)', glow: 'rgba(124,58,237,0.3)' },
    { label: 'Средний балл', value: '4.8', icon: Award, gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
    { label: 'Рейтинг', value: 'Top 5%', icon: TrendingUp, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.3)' },
  ];

  const recentAchievements = [
    { title: 'Отличник семестра', date: 'Январь 2026', icon: '🏆' },
    { title: 'Лучший проект по ML', date: 'Декабрь 2025', icon: '🥇' },
    { title: 'Активный участник', date: 'Ноябрь 2025', icon: '⭐' },
  ];

  const courseHistory = [
    { name: 'Машинное обучение', grade: 5.0, semester: 'Весна 2026' },
    { name: 'Веб-разработка', grade: 4.9, semester: 'Весна 2026' },
    { name: 'Базы данных', grade: 4.7, semester: 'Осень 2025' },
    { name: 'Алгоритмы', grade: 4.8, semester: 'Осень 2025' },
  ];

  const contactItems = [
    { icon: Mail, text: studentInfo.email },
    { icon: Phone, text: studentInfo.phone },
    { icon: MapPin, text: studentInfo.location },
    { icon: Calendar, text: `Зачислен: ${studentInfo.enrollmentDate}` },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Профиль</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Ваша информация и академические достижения</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={cardStyle}
          >
            <div className="text-center mb-6">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                }}
              >
                <span className="text-3xl text-white" style={{ fontWeight: 700 }}>ИС</span>
              </div>
              <h3 className="text-lg mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                {studentInfo.name}
              </h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                ID: {studentInfo.studentId}
              </p>
            </div>

            <div className="space-y-3">
              {contactItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(139,92,246,0.7)' }} />
                  <span className="truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
                </div>
              ))}
            </div>

            <button
              className="w-full mt-5 px-4 py-2.5 rounded-xl text-white text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                boxShadow: '0 0 15px rgba(124,58,237,0.3)',
              }}
            >
              Редактировать профиль
            </button>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6"
            style={cardStyle}
          >
            <h3 className="text-base mb-4" style={{ color: '#e2e8f0', fontWeight: 600 }}>Достижения</h3>
            <div className="space-y-2">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: '#e2e8f0', fontWeight: 500 }}>{achievement.title}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="p-5 rounded-2xl relative overflow-hidden group"
                  style={cardStyle}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at top left, ${stat.glow}, transparent 70%)` }}
                  />
                  <div className="relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: stat.gradient, boxShadow: `0 0 15px ${stat.glow}` }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl mb-1" style={{ color: '#f1f5f9', fontWeight: 700 }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Course History */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-6"
            style={cardStyle}
          >
            <h3 className="text-base mb-5" style={{ color: '#e2e8f0', fontWeight: 600 }}>История курсов</h3>
            <div className="space-y-3">
              {courseHistory.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex-1">
                    <p className="text-sm mb-0.5" style={{ color: '#e2e8f0', fontWeight: 500 }}>{course.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{course.semester}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div
                        className="text-lg"
                        style={{
                          color: course.grade >= 4.8 ? '#34d399' : course.grade >= 4.5 ? '#67e8f9' : '#e2e8f0',
                          fontWeight: 700,
                        }}
                      >
                        {course.grade}
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Оценка</div>
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: course.grade >= 4.8
                          ? 'rgba(16,185,129,0.15)'
                          : course.grade >= 4.5
                          ? 'rgba(6,182,212,0.15)'
                          : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${course.grade >= 4.8 ? 'rgba(16,185,129,0.25)' : course.grade >= 4.5 ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <Award
                        className="w-5 h-5"
                        style={{
                          color: course.grade >= 4.8 ? '#34d399' : course.grade >= 4.5 ? '#67e8f9' : 'rgba(255,255,255,0.4)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl p-6"
            style={cardStyle}
          >
            <h3 className="text-base mb-5" style={{ color: '#e2e8f0', fontWeight: 600 }}>Активность</h3>
            <div
              className="h-40 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))', border: '1px dashed rgba(139,92,246,0.2)' }}
            >
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>График активности</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
