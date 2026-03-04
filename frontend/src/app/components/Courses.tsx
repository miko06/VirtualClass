import { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, ArrowRight, Loader2, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { classesApi, ClassItem } from '../../api/client';
import type { User } from '../../api/client';

const COLORS = [
  { color: '#4f46e5', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { color: '#db2777', textColor: 'text-pink-600', bgColor: 'bg-pink-50' },
  { color: '#059669', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { color: '#d97706', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  { color: '#7c3aed', textColor: 'text-violet-600', bgColor: 'bg-violet-50' },
];

interface CoursesProps {
  currentUser?: User | null;
}

export function Courses({ currentUser }: CoursesProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    classesApi.byStudent(currentUser.id)
      .then(setClasses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  return (
    <div className="legacy-theme-screen p-8 pb-32 min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Мои курсы</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1.5">
            {currentUser?.group ? `Группа ${currentUser.group}` : 'Ваши дисциплины на текущий семестр'}
          </p>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="ml-3 text-gray-500 font-medium">Загрузка курсов...</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-red-600 font-semibold">Ошибка загрузки: {error}</p>
          </div>
        )}

        {!loading && !error && classes.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
              <GraduationCap className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Курсов пока нет</h3>
            <p className="text-gray-400 dark:text-gray-500 font-medium max-w-xs">
              Вы ещё не зачислены ни на один курс. Обратитесь к куратору группы.
            </p>
          </motion.div>
        )}

        {!loading && !error && classes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {classes.map((cls, i) => {
              const palette = COLORS[i % COLORS.length];
              const studentCount = cls.enrollments?.length ?? 0;
              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white dark:bg-[#1c1e24] rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  <div className="h-1 w-full" style={{ backgroundColor: palette.color }} />

                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
                          {cls.name}
                        </h3>
                        {cls.teacher && (
                          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mt-0.5">{cls.teacher.name}</p>
                        )}
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${palette.bgColor}`}>
                        <BookOpen className={`w-5 h-5 ${palette.textColor}`} />
                      </div>
                    </div>

                    {cls.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
                        {cls.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {cls.semester && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-800">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {cls.semester}
                        </div>
                      )}
                      {studentCount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-800">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {studentCount} студентов
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5 mt-auto pt-1">
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                        style={{ backgroundColor: palette.color }}
                      >
                        Войти в класс <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
