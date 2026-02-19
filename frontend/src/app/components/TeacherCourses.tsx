import { Plus, BookOpen, Users, Edit, Trash2, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

export function TeacherCourses() {
  const courses = [
    {
      id: 1,
      title: 'Машинное обучение',
      description: 'Изучение основных алгоритмов ML, нейронных сетей и практическое применение на реальных данных.',
      students: 45,
      materials: 24,
      assignments: 12,
      gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
      glow: 'rgba(124,58,237,0.3)',
      status: 'active',
    },
    {
      id: 2,
      title: 'Веб-разработка',
      description: 'Современные технологии веб-разработки: React, TypeScript, REST API, базы данных.',
      students: 38,
      materials: 31,
      assignments: 15,
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      glow: 'rgba(236,72,153,0.3)',
      status: 'active',
    },
    {
      id: 3,
      title: 'Базы данных',
      description: 'SQL и NoSQL базы данных, проектирование схем, оптимизация запросов, транзакции.',
      students: 52,
      materials: 18,
      assignments: 10,
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      glow: 'rgba(16,185,129,0.3)',
      status: 'active',
    },
    {
      id: 4,
      title: 'Алгоритмы и структуры данных',
      description: 'Основные алгоритмы сортировки, поиска, графовые алгоритмы, динамическое программирование.',
      students: 41,
      materials: 22,
      assignments: 14,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
      status: 'active',
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Управление курсами</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Создавайте и редактируйте ваши курсы</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
          }}
        >
          <Plus className="w-4 h-4" />
          Создать курс
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl overflow-hidden relative group"
            style={cardStyle}
          >
            {/* Gradient top bar */}
            <div className="h-1 w-full" style={{ background: course.gradient }} />

            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg" style={{ color: '#e2e8f0', fontWeight: 600 }}>{course.title}</h3>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full ml-2 flex-shrink-0"
                    style={{
                      background: 'rgba(16,185,129,0.12)',
                      border: '1px solid rgba(16,185,129,0.25)',
                      color: '#34d399',
                    }}
                  >
                    Активный
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {course.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: Users, value: course.students, label: 'Студентов' },
                  { icon: BookOpen, value: course.materials, label: 'Материалов' },
                  { icon: Edit, value: course.assignments, label: 'Заданий' },
                ].map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                    <div className="text-base" style={{ color: '#e2e8f0', fontWeight: 700 }}>{value}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all"
                  style={{
                    background: course.gradient,
                    boxShadow: `0 0 15px ${course.glow}`,
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Управление
                </button>
                <button
                  className="px-3.5 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="px-3.5 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: 'rgba(248,113,113,0.8)',
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
