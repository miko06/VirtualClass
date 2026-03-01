import { BookOpen, Users, FileText, TrendingUp, Clock, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function TeacherDashboard() {
  const stats = [
    { label: 'Активных курсов', value: '4', icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50', change: '+1 в этом месяце', changeColor: 'text-teal-600 bg-teal-50' },
    { label: 'Всего студентов', value: '176', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50', change: '+12 на этой неделе', changeColor: 'text-sky-600 bg-sky-50' },
    { label: 'Проверить работ', value: '23', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', change: '5 просрочено', changeColor: 'text-red-600 bg-red-50' },
    { label: 'Средняя оценка', value: '4.6', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '+0.2 к прошлой неделе', changeColor: 'text-indigo-600 bg-indigo-50' },
  ];

  const recentActivity = [
    { student: 'Иванов И.', action: 'сдал задание', course: 'Машинное обучение', time: '5 мин', initials: 'ИИ', color: 'bg-indigo-100 text-indigo-700' },
    { student: 'Петрова А.', action: 'прошла тест', course: 'Веб-разработка', time: '15 мин', initials: 'ПА', color: 'bg-pink-100 text-pink-700' },
    { student: 'Сидоров П.', action: 'задал вопрос', course: 'Базы данных', time: '1 ч', initials: 'СП', color: 'bg-teal-100 text-teal-700' },
    { student: 'Козлова М.', action: 'сдала задание', course: 'Алгоритмы', time: '2 ч', initials: 'КМ', color: 'bg-orange-100 text-orange-700' },
  ];

  const upcomingClasses = [
    { course: 'Машинное обучение', time: 'Завтра 10:00', students: 45, color: '#4f46e5' },
    { course: 'Веб-разработка', time: 'Сегодня 14:00', students: 38, color: '#db2777' },
    { course: 'Базы данных', time: 'Среда 16:00', students: 52, color: '#059669' },
  ];

  return (
    <div className="p-8 pb-32 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Панель преподавателя
          </motion.h1>
          <p className="text-gray-500 text-sm font-medium mt-1.5">Обзор курсов и активности студентов</p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 transition-all"
          style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}
        >
          <Plus className="w-4 h-4" /> Создать курс
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-1.5">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500 mb-3">{stat.label}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.changeColor}`}>{stat.change}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Two-column panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">Последняя активность</h2>
            <button className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              Все <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${a.color}`}>
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    <span>{a.student}</span>{' '}
                    <span className="font-medium text-gray-500">{a.action}</span>
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{a.course}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-300 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Classes */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">Предстоящие занятия</h2>
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((cls, i) => (
              <motion.div key={i} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{cls.course}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{cls.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg text-teal-700 bg-teal-50">
                  <Users className="w-3.5 h-3.5" />
                  <span>{cls.students}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
