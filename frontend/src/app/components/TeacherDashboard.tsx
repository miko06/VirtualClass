import { useEffect, useState } from 'react';
import { BookOpen, Users, FileText, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { classesApi, ClassItem } from '../../api/client';
import type { User } from '../../api/client';

interface TeacherDashboardProps {
  currentUser?: User | null;
}

export function TeacherDashboard({ currentUser }: TeacherDashboardProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;
    classesApi.byTeacher(currentUser.id).then(setClasses).catch(console.error);
  }, [currentUser?.id]);

  const totalStudents = classes.reduce((sum, c) => sum + (c.enrollments?.length ?? 0), 0);

  const stats = [
    { label: 'Активных курсов', value: String(classes.length), icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50', change: `${classes.length} курсов`, changeColor: 'text-teal-600 bg-teal-50' },
    { label: 'Всего студентов', value: String(totalStudents), icon: Users, color: 'text-sky-600', bg: 'bg-sky-50', change: 'Зачисленных', changeColor: 'text-sky-600 bg-sky-50' },
    { label: 'Заданий', value: '0', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', change: 'Нет заданий', changeColor: 'text-amber-600 bg-amber-50' },
    { label: 'Средняя оценка', value: '—', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', change: 'Нет данных', changeColor: 'text-indigo-600 bg-indigo-50' },
  ];

  const teacherName = currentUser?.name
    ?? (currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : 'Преподаватель');

  return (
    <div className="legacy-theme-screen p-8 pb-32 min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Панель преподавателя
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1.5">
              Добро пожаловать, {teacherName}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-[#1c1e24] rounded-2xl p-5 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} dark:bg-opacity-10`}>
                  <Icon className={`w-5 h-5 ${stat.color} dark:text-opacity-90`} />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none mb-1.5">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{stat.label}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.changeColor} dark:bg-opacity-10`}>{stat.change}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Courses list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#1c1e24] rounded-2xl p-6 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Мои курсы</h2>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{classes.length} курсов</span>
            </div>
            {classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-indigo-300" />
                </div>
                <p className="text-gray-500 font-medium text-sm">Курсов пока нет. Создайте первый в разделе «Курсы».</p>
              </div>
            ) : (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-2 h-10 rounded-full flex-shrink-0 bg-indigo-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{cls.name}</p>
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">{cls.semester ?? '—'}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg text-teal-700 dark:text-teal-400 bg-teal-50">
                      <Users className="w-3.5 h-3.5" />
                      <span>{cls.enrollments?.length ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
