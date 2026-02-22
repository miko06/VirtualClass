import { BookOpen, Users, FileText, TrendingUp, Clock, Plus, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

function StatCard({ stat, index }: { stat: any; index: number }) {
  const Icon = stat.icon;
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="p-6 rounded-2xl relative bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 group cursor-default"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${stat.glow}, transparent 70%)`,
          transform: 'translateZ(1px)',
        }}
      />
      <div style={{ transform: 'translateZ(30px)' }} className="relative z-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
          style={{ background: stat.gradient, boxShadow: `0 8px 20px -4px ${stat.glow}` }}
        >
          <Icon className="w-6 h-6 text-white drop-shadow-sm" />
        </div>
        <div className="text-4xl tracking-tight mb-1 font-extrabold text-slate-800">
          {stat.value}
        </div>
        <div className="text-sm font-medium text-slate-500 mb-3">{stat.label}</div>
        <div className="text-xs font-bold text-teal-600 bg-teal-50 inline-block px-2.5 py-1 rounded-md">
          {stat.change}
        </div>
      </div>
    </motion.div>
  );
}

export function TeacherDashboard() {
  const stats = [
    {
      label: 'Активных курсов',
      value: '4',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
      glow: 'rgba(13,148,136,0.3)',
      change: '+1 в этом месяце',
    },
    {
      label: 'Всего студентов',
      value: '176',
      icon: Users,
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      glow: 'rgba(2,132,199,0.3)',
      change: '+12 на этой неделе',
    },
    {
      label: 'Проверить работ',
      value: '23',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
      change: '5 просрочено',
    },
    {
      label: 'Средняя оценка',
      value: '4.6',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
      glow: 'rgba(79,70,229,0.3)',
      change: '+0.2 к прошлой неделе',
    },
  ];

  const recentActivity = [
    { student: 'Иванов И.', action: 'сдал задание', course: 'Машинное обучение', time: '5 мин', avatar: 'ИИ', color: 'bg-indigo-100 text-indigo-700' },
    { student: 'Петрова А.', action: 'прошла тест', course: 'Веб-разработка', time: '15 мин', avatar: 'ПА', color: 'bg-pink-100 text-pink-700' },
    { student: 'Сидоров П.', action: 'задал вопрос', course: 'Базы данных', time: '1 ч', avatar: 'СП', color: 'bg-teal-100 text-teal-700' },
    { student: 'Козлова М.', action: 'сдала задание', course: 'Алгоритмы', time: '2 ч', avatar: 'КМ', color: 'bg-orange-100 text-orange-700' },
  ];

  const upcomingClasses = [
    { course: 'Машинное обучение', time: 'Завтра 10:00', students: 45, gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' },
    { course: 'Веб-разработка', time: 'Сегодня 14:00', students: 38, gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
    { course: 'Базы данных', time: 'Среда 16:00', students: 52, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  ];

  return (
    <div className="p-8 min-h-screen relative overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            Панель преподавателя
          </motion.h2>
          <p className="text-slate-500 font-medium text-sm">Обзор курсов и активности ваших студентов</p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-shadow shadow-lg shadow-teal-500/30"
          style={{
            background: 'linear-gradient(135deg, #0d9488, #0ea5e9)',
          }}
        >
          <Plus className="w-5 h-5" />
          Создать курс
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Последняя активность</h3>
            <button
              className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Все <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-200 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${activity.color}`}
                >
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{activity.student}</span> {activity.action}
                  </p>
                  <p className="text-xs font-semibold mt-1 text-slate-500">{activity.course}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Предстоящие занятия</h3>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((cls, index) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={index}
                className="p-5 rounded-xl relative overflow-hidden group cursor-pointer bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                {/* Left gradient accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                  style={{ background: cls.gradient }}
                />
                <div className="pl-4">
                  <h4 className="text-base mb-3 font-bold text-slate-800 tracking-tight">
                    {cls.course}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span>{cls.time}</span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-100"
                    >
                      <Users className="w-4 h-4" />
                      <span>{cls.students} {cls.students === 52 ? 'студента' : 'студентов'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
