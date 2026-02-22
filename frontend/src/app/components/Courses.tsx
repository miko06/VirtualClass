import { BookOpen, Users, Video, FileText, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Course {
  id: string;
  title: string;
  professor: string;
  description: string;
  progress: number;
  gradient: string;
  glow: string;
  schedule: string;
  studentsCount: number;
  materialsCount: number;
  nextSession: string;
}

export function Courses() {
  const courses: Course[] = [
    {
      id: '1',
      title: 'Машинное обучение',
      professor: 'Проф. Иванов А.С.',
      description: 'Изучение основных алгоритмов ML, нейронных сетей и практическое применение на реальных данных.',
      progress: 65,
      gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
      glow: 'rgba(79,70,229,0.4)',
      schedule: 'Пн, Ср 10:00-12:00',
      studentsCount: 45,
      materialsCount: 24,
      nextSession: 'Завтра в 10:00',
    },
    {
      id: '2',
      title: 'Веб-разработка',
      professor: 'Проф. Петрова М.В.',
      description: 'Современные технологии веб-разработки: React, TypeScript, REST API, базы данных.',
      progress: 82,
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      glow: 'rgba(236,72,153,0.4)',
      schedule: 'Вт, Чт 14:00-16:00',
      studentsCount: 38,
      materialsCount: 31,
      nextSession: 'Сегодня в 14:00',
    },
    {
      id: '3',
      title: 'Базы данных',
      professor: 'Проф. Сидоров В.П.',
      description: 'SQL и NoSQL базы данных, проектирование схем, оптимизация запросов, транзакции.',
      progress: 45,
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
      glow: 'rgba(16,185,129,0.4)',
      schedule: 'Ср 16:00-18:00',
      studentsCount: 52,
      materialsCount: 18,
      nextSession: 'Среда в 16:00',
    },
    {
      id: '4',
      title: 'Алгоритмы и структуры данных',
      professor: 'Проф. Козлова Е.А.',
      description: 'Основные алгоритмы сортировки, поиска, графовые алгоритмы, динамическое программирование.',
      progress: 55,
      gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
      glow: 'rgba(245,158,11,0.4)',
      schedule: 'Чт 12:00-14:00',
      studentsCount: 41,
      materialsCount: 22,
      nextSession: 'Четверг в 12:00',
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

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Мои курсы</h2>
        <p className="text-slate-500 font-medium text-sm">
          Все ваши активные курсы и расписание занятий
        </p>
      </motion.div>

      <div className="space-y-6 relative z-10">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="rounded-2xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:ring-indigo-100 transition-all duration-300 relative group"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 w-full transition-transform origin-left" style={{ background: course.gradient }} />

            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-5 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ background: course.gradient, boxShadow: `0 8px 24px -4px ${course.glow}` }}
                    >
                      <BookOpen className="w-8 h-8 text-white drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1.5 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 mb-3">
                        {course.professor}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600 font-medium max-w-2xl">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="font-bold text-slate-600">Прогресс курса</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{course.progress}%</span>
                    </div>
                    <div className="w-full rounded-full h-2.5 bg-slate-200/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full relative"
                        style={{
                          background: course.gradient,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-50">
                    {[
                      { icon: Calendar, text: course.schedule, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { icon: Users, text: `${course.studentsCount} студентов`, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                      { icon: FileText, text: `${course.materialsCount} материалов`, color: 'text-pink-500', bg: 'bg-pink-50' },
                      { icon: Video, text: course.nextSession, color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map(({ icon: Icon, text, color, bg }) => (
                      <div key={text} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} ${bg}`}>
                          <Icon className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3 lg:min-w-[160px]">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group/btn"
                    style={{
                      background: course.gradient,
                      boxShadow: `0 8px 20px -6px ${course.glow}`,
                    }}
                  >
                    <span>Войти в класс</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  <button
                    className="flex-1 px-6 py-3 rounded-xl text-sm font-bold transition-all bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm"
                  >
                    Материалы
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
