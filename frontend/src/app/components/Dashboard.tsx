import { BookOpen, Clock, TrendingUp, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

interface Course {
  id: string;
  title: string;
  professor: string;
  progress: number;
  nextClass: string;
  gradient: string;
  glow: string;
}

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
        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const courses: Course[] = [
    {
      id: '1',
      title: 'Машинное обучение',
      professor: 'Проф. Иванов А.С.',
      progress: 65,
      nextClass: 'Завтра в 10:00',
      gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
      glow: 'rgba(79,70,229,0.4)',
    },
    {
      id: '2',
      title: 'Веб-разработка',
      professor: 'Проф. Петрова М.В.',
      progress: 82,
      nextClass: 'Сегодня в 14:00',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      glow: 'rgba(236,72,153,0.4)',
    },
    {
      id: '3',
      title: 'Базы данных',
      professor: 'Проф. Сидоров В.П.',
      progress: 45,
      nextClass: 'Среда в 16:00',
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
      glow: 'rgba(16,185,129,0.4)',
    },
    {
      id: '4',
      title: 'Алгоритмы',
      professor: 'Проф. Козлова Е.А.',
      progress: 55,
      nextClass: 'Четверг в 12:00',
      gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
      glow: 'rgba(245,158,11,0.4)',
    },
  ];

  const stats = [
    {
      label: 'Активных курсов',
      value: '4',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
      glow: 'rgba(79,70,229,0.3)',
    },
    {
      label: 'Часов обучения',
      value: '127',
      icon: Clock,
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      glow: 'rgba(59,130,246,0.3)',
    },
    {
      label: 'Средний прогресс',
      value: '62%',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      glow: 'rgba(16,185,129,0.3)',
    },
    {
      label: 'Заданий сдано',
      value: '18',
      icon: Award,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      glow: 'rgba(245,158,11,0.3)',
    },
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Добро пожаловать обратно!
          </h2>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </div>
        <p className="text-slate-500 font-medium text-sm">
          Вот обзор вашего прогресса и предстоящих занятий на сегодня.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Courses Section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Мои курсы</h3>
          <button
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
          >
            Все курсы <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.2 }}
              className="rounded-2xl overflow-hidden relative group bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 hover:ring-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Top gradient bar */}
              <div className="h-1.5 w-full" style={{ background: course.gradient }} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-lg mb-1 font-bold text-slate-800 tracking-tight truncate">
                      {course.title}
                    </h4>
                    <p className="text-sm font-medium text-slate-500">
                      {course.professor}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: course.gradient, boxShadow: `0 8px 16px -4px ${course.glow}` }}
                  >
                    <BookOpen className="w-6 h-6 text-white drop-shadow-sm" />
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-semibold text-slate-600">Прогресс</span>
                    <span className="font-bold text-indigo-600">{course.progress}%</span>
                  </div>
                  <div className="w-full rounded-full h-2.5 bg-slate-200/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full relative"
                      style={{ background: course.gradient }}
                    >
                      <div className="absolute inset-0 bg-white/20" />
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>{course.nextClass}</span>
                  </div>
                  <button
                    className="text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 text-white"
                    style={{ background: course.gradient }}
                  >
                    Войти
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
