import { BookOpen, Users, FileText, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';

interface Course {
  id: string;
  title: string;
  professor: string;
  description: string;
  progress: number;
  color: string;
  textColor: string;
  bgColor: string;
  schedule: string;
  studentsCount: number;
  materialsCount: number;
  nextSession: string;
}

export function Courses() {
  const courses: Course[] = [
    {
      id: '1', title: 'Машинное обучение', professor: 'Проф. Иванов А.С.',
      description: 'Алгоритмы ML, нейронные сети и практическое применение на реальных данных.',
      progress: 65, color: '#4f46e5', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50',
      schedule: 'Пн, Ср 10:00–12:00', studentsCount: 45, materialsCount: 24, nextSession: 'Завтра в 10:00',
    },
    {
      id: '2', title: 'Веб-разработка', professor: 'Проф. Петрова М.В.',
      description: 'React, TypeScript, REST API и современные паттерны веб-разработки.',
      progress: 82, color: '#db2777', textColor: 'text-pink-600', bgColor: 'bg-pink-50',
      schedule: 'Вт, Чт 14:00–16:00', studentsCount: 38, materialsCount: 31, nextSession: 'Сегодня в 14:00',
    },
    {
      id: '3', title: 'Базы данных', professor: 'Проф. Сидоров В.П.',
      description: 'SQL и NoSQL, проектирование схем, оптимизация запросов, транзакции.',
      progress: 45, color: '#059669', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50',
      schedule: 'Ср 16:00–18:00', studentsCount: 52, materialsCount: 18, nextSession: 'Среда в 16:00',
    },
    {
      id: '4', title: 'Алгоритмы и структуры данных', professor: 'Проф. Козлова Е.А.',
      description: 'Алгоритмы сортировки, поиска, графовые задачи, динамическое программирование.',
      progress: 55, color: '#d97706', textColor: 'text-amber-600', bgColor: 'bg-amber-50',
      schedule: 'Чт 12:00–14:00', studentsCount: 41, materialsCount: 22, nextSession: 'Четверг в 12:00',
    },
  ];

  return (
    <div className="legacy-theme-screen p-8 pb-32 min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-[#1c1e24] rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
            >
            {/* Top accent */}
            <div className="h-1 w-full" style={{ backgroundColor: course.color }} />

            <div className="p-5 flex flex-col flex-1 gap-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug">{course.title}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mt-0.5">{course.professor}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${course.bgColor} dark:bg-opacity-10`}>
                  <BookOpen className={`w-5 h-5 ${course.textColor} dark:text-opacity-90`} />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">{course.description}</p>

              {/* Progress */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-gray-400 dark:text-gray-500">Прогресс</span>
                  <span className={`${course.textColor} dark:text-opacity-90`}>{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.9, delay: 0.4 + i * 0.07, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Calendar, text: course.schedule },
                  { icon: Users, text: `${course.studentsCount} студентов` },
                  { icon: FileText, text: `${course.materialsCount} материалов` },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-800">
                    <Icon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Footer actions */}
              <div className="flex gap-2.5 mt-auto pt-1">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                  style={{ backgroundColor: course.color }}
                >
                  Войти в класс <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2d36] hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#343843] transition-all">
                  Материалы
                </button>
              </div>
            </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
