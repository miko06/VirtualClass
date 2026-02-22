import { Plus, BookOpen, Users, Edit, Trash2, Settings } from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="p-8 min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Управление курсами</h2>
          <p className="text-slate-500 font-medium text-sm">Создавайте и редактируйте ваши курсы</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            boxShadow: '0 8px 20px -6px rgba(14,165,233,0.4)',
          }}
        >
          <Plus className="w-5 h-5" />
          Создать курс
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 relative z-10">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col hover:shadow-2xl hover:ring-indigo-100 transition-all duration-300 group"
          >
            {/* Gradient top bar */}
            <div className="h-2 w-full" style={{ background: course.gradient }} />

            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-lg ml-3 flex-shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200"
                  >
                    Активный
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-500 line-clamp-2">
                  {course.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Users, value: course.students, label: 'Студентов' },
                  { icon: BookOpen, value: course.materials, label: 'Материалов' },
                  { icon: Edit, value: course.assignments, label: 'Заданий' },
                ].map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                  >
                    <Icon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                    <div className="text-xl font-extrabold text-slate-800">{value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg active:scale-95"
                  style={{
                    background: course.gradient,
                    boxShadow: `0 8px 20px -6px ${course.glow}`,
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Управление
                </button>
                <button
                  className="px-4 py-3 rounded-xl transition-all border-2 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 active:scale-95"
                  title="Редактировать"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  className="px-4 py-3 rounded-xl transition-all border-2 border-rose-100 text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 active:scale-95 shadow-sm"
                  title="Удалить"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
