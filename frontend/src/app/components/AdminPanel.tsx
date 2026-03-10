import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Users,
  BookOpen,
  ChevronDown,
  UserCheck,
  UserX,
  RefreshCw,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { adminApi, AdminClassItem, GroupItem } from '../../api/client';

type Tab = 'classes' | 'groups';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('classes');
  const [classes, setClasses] = useState<AdminClassItem[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cls, grps] = await Promise.all([adminApi.getClasses(), adminApi.getGroups()]);
      setClasses(cls);
      setGroups(grps);
    } catch (e) {
      console.error(e);
      showNotification('error', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnrollGroup = async (classId: number, group: string) => {
    const key = `enroll-${classId}-${group}`;
    setActionLoading(key);
    try {
      const result = await adminApi.enrollGroup(classId, group);
      showNotification('success', `Группа ${group} зачислена: ${result.enrolled} студентов`);
      await loadData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка зачисления';
      showNotification('error', msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnenrollGroup = async (classId: number, group: string) => {
    const key = `unenroll-${classId}-${group}`;
    setActionLoading(key);
    try {
      const result = await adminApi.unenrollGroup(classId, group);
      showNotification('success', `Группа ${group} отчислена: ${result.removed} студентов`);
      await loadData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка отчисления';
      showNotification('error', msg);
    } finally {
      setActionLoading(null);
    }
  };

  const isGroupEnrolled = (cls: AdminClassItem, group: string) =>
    cls.enrolledGroups.some((eg) => eg.group === group);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] relative overflow-hidden transition-colors duration-200">
      <ThemeSquaresBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Панель администратора</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Управление зачислением студентов по группам</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="ml-auto p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Обновить"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className={`mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl font-medium text-sm shadow-lg ${notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                }`}
            >
              {notification.type === 'success'
                ? <CheckCircle2 className="w-5 h-5 shrink-0" />
                : <AlertCircle className="w-5 h-5 shrink-0" />}
              {notification.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#151821] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{classes.length}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Дисциплин</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-[#151821] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{groups.length}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Групп</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#151821] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{groups.reduce((s, g) => s + g.count, 0)}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Студентов</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['classes', 'groups'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
            >
              {tab === 'classes' ? (
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Дисциплины / Классы</span>
              ) : (
                <span className="flex items-center gap-2"><Users className="w-4 h-4" />Группы</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Classes Tab */}
        {!loading && activeTab === 'classes' && (
          <div className="space-y-4">
            {classes.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <BookOpen className="w-12 h-12 opacity-20 mx-auto mb-3" />
                <p className="font-medium">Нет созданных классов</p>
                <p className="text-sm">Преподаватели ещё не создали ни одного класса</p>
              </div>
            ) : (
              classes.map((cls) => {
                const isExpanded = expandedClass === cls.id;
                return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#151821] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    {/* Class Header */}
                    <button
                      onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{cls.name}</p>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cls.teacher?.name ?? '—'}</span>
                          {cls.semester && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">{cls.semester}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                          <GraduationCap className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{cls.totalStudents} ст.</span>
                        </div>
                        <div className="flex gap-1">
                          {cls.enrolledGroups.slice(0, 3).map((eg) => (
                            <span
                              key={eg.group}
                              className="text-xs font-bold px-2 py-1 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded-md"
                            >
                              {eg.group}
                            </span>
                          ))}
                          {cls.enrolledGroups.length > 3 && (
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">
                              +{cls.enrolledGroups.length - 3}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded: Group Management */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                        >
                          <div className="p-5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                              Управление группами
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {groups.map((g) => {
                                const enrolled = isGroupEnrolled(cls, g.group);
                                const enrollKey = `enroll-${cls.id}-${g.group}`;
                                const unenrollKey = `unenroll-${cls.id}-${g.group}`;
                                const isActing = actionLoading === enrollKey || actionLoading === unenrollKey;
                                const enrolledCount = cls.enrolledGroups.find((eg) => eg.group === g.group)?.count ?? 0;

                                return (
                                  <div
                                    key={g.group}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${enrolled
                                      ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                                      }`}
                                  >
                                    <div>
                                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{g.group}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {enrolled ? `${enrolledCount} / ${g.count}` : `${g.count} студентов`}
                                      </p>
                                    </div>
                                    <button
                                      disabled={isActing}
                                      onClick={() =>
                                        enrolled
                                          ? handleUnenrollGroup(cls.id, g.group)
                                          : handleEnrollGroup(cls.id, g.group)
                                      }
                                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-60 ${enrolled
                                        ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/30'
                                        }`}
                                    >
                                      {isActing ? (
                                        <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                                      ) : enrolled ? (
                                        <UserX className="w-3.5 h-3.5" />
                                      ) : (
                                        <UserCheck className="w-3.5 h-3.5" />
                                      )}
                                      {enrolled ? 'Отчислить' : 'Зачислить'}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Groups Tab */}
        {!loading && activeTab === 'groups' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g, index) => (
              <motion.div
                key={g.group}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#151821] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-lg">{g.group}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Специальность 6B06103</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Студентов</span>
                  </div>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{g.count}</span>
                </div>

                {/* Which classes this group is enrolled in */}
                {(() => {
                  const enrolledIn = classes.filter((cls) =>
                    cls.enrolledGroups.some((eg) => eg.group === g.group)
                  );
                  return enrolledIn.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Зачислена в дисциплины</p>
                      <div className="space-y-1.5">
                        {enrolledIn.map((cls) => (
                          <div key={cls.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{cls.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400 italic">Не зачислена ни в одну дисциплину</p>
                  );
                })()}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
