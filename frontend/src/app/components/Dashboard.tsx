import { BookOpen, Clock, TrendingUp, Award, ArrowRight, Calendar, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Course {
  id: string;
  title: string;
  professor: string;
  progress: number;
  nextClass: string;
  color: string;
  textColor: string;
  bgColor: string;
}

export function Dashboard() {
  const courses: Course[] = [
    { id: '1', title: 'Машинное обучение', professor: 'Проф. Иванов А.С.', progress: 65, nextClass: 'Завтра в 10:00', color: '#4f46e5', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: '2', title: 'Веб-разработка', professor: 'Проф. Петрова М.В.', progress: 82, nextClass: 'Сегодня в 14:00', color: '#db2777', textColor: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: '3', title: 'Базы данных', professor: 'Проф. Сидоров В.П.', progress: 45, nextClass: 'Среда в 16:00', color: '#059669', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: '4', title: 'Алгоритмы', professor: 'Проф. Козлова Е.А.', progress: 55, nextClass: 'Четверг в 12:00', color: '#d97706', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  const stats = [
    { label: 'Активных курсов', value: '4', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Часов обучения', value: '127', icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Средний прогресс', value: '62%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Заданий сдано', value: '18', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-8 pb-32 min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Добро пожаловать обратно!</h1>
        <p className="text-gray-500 text-sm font-medium mt-1.5">Обзор прогресса и предстоящих занятий</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-1.5">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Мои курсы</h2>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          Все курсы <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 + 0.2 }}
            className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            {/* Top color strip */}
            <div className="h-1" style={{ backgroundColor: course.color }} />

            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight">{course.title}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">{course.professor}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${course.bgColor}`}>
                  <BookOpen className={`w-5 h-5 ${course.textColor}`} />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-500">Прогресс</span>
                  <span className={course.textColor}>{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{course.nextClass}</span>
                </div>
                <button
                  className="text-xs font-bold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 hover:shadow-md active:scale-95"
                  style={{ backgroundColor: course.color }}
                >
                  Войти
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Schedule Card */}
      <div className="mt-8 bg-white rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-gray-900">Расписание на неделю</h3>
        </div>
        <div className="space-y-3">
          {[
            { day: 'Сегодня', time: '14:00', course: 'Веб-разработка', students: 38, color: '#db2777' },
            { day: 'Завтра', time: '10:00', course: 'Машинное обучение', students: 45, color: '#4f46e5' },
            { day: 'Среда', time: '16:00', course: 'Базы данных', students: 52, color: '#059669' },
          ].map((item) => (
            <div key={item.course} className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.course}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{item.day} в {item.time}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>{item.students}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
