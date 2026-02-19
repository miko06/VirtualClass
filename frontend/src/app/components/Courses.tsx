import { BookOpen, Users, Video, FileText, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

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
      gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
      glow: 'rgba(124,58,237,0.3)',
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
      glow: 'rgba(236,72,153,0.3)',
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
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      glow: 'rgba(16,185,129,0.3)',
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
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
      schedule: 'Чт 12:00-14:00',
      studentsCount: 41,
      materialsCount: 22,
      nextSession: 'Четверг в 12:00',
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Мои курсы</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Все ваши активные курсы и расписание занятий
        </p>
      </div>

      <div className="space-y-5">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl overflow-hidden"
            style={cardStyle}
          >
            <div className="h-1 w-full" style={{ background: course.gradient }} />

            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: course.gradient, boxShadow: `0 0 20px ${course.glow}` }}
                    >
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                        {course.title}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {course.professor}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Прогресс курса</span>
                      <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{course.progress}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${course.progress}%`,
                          background: course.gradient,
                          boxShadow: `0 0 8px ${course.glow}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: Calendar, text: course.schedule },
                      { icon: Users, text: `${course.studentsCount} студентов` },
                      { icon: FileText, text: `${course.materialsCount} материалов` },
                      { icon: Video, text: course.nextSession },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3">
                  <button
                    className="px-5 py-2.5 rounded-xl text-white text-sm transition-all whitespace-nowrap"
                    style={{
                      background: course.gradient,
                      boxShadow: `0 0 15px ${course.glow}`,
                    }}
                  >
                    Войти в класс
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
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
