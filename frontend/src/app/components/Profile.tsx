import { Mail, Phone, MapPin, Calendar, Award, BookOpen, TrendingUp, Edit2 } from 'lucide-react';
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
      <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 flex flex-col items-center text-center pt-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          style={{ background: stat.gradient, boxShadow: `0 8px 20px -4px ${stat.glow}` }}
        >
          <Icon className="w-7 h-7 text-white drop-shadow-sm" />
        </div>
        <div className="text-3xl tracking-tight mb-1 font-extrabold text-slate-800">
          {stat.value}
        </div>
        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export function Profile() {
  const studentInfo = {
    name: 'Иван Студентов',
    email: 'ivan.studentov@university.edu',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    enrollmentDate: 'Сентябрь 2024',
    studentId: 'STU-2024-12345',
  };

  const stats = [
    { label: 'Завершено курсов', value: '12', icon: BookOpen, gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', glow: 'rgba(79,70,229,0.3)' },
    { label: 'Средний балл', value: '4.8', icon: Award, gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
    { label: 'Рейтинг', value: 'Top 5%', icon: TrendingUp, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', glow: 'rgba(16,185,129,0.3)' },
  ];

  const recentAchievements = [
    { title: 'Отличник семестра', date: 'Январь 2026', icon: '🏆', color: 'bg-yellow-50', iconColor: 'text-yellow-500' },
    { title: 'Лучший проект по ML', date: 'Декабрь 2025', icon: '🥇', color: 'bg-orange-50', iconColor: 'text-orange-500' },
    { title: 'Активный участник', date: 'Ноябрь 2025', icon: '⭐', color: 'bg-teal-50', iconColor: 'text-teal-500' },
  ];

  const courseHistory = [
    { name: 'Машинное обучение', grade: 5.0, semester: 'Весна 2026', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Веб-разработка', grade: 4.9, semester: 'Весна 2026', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Базы данных', grade: 4.7, semester: 'Осень 2025', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Алгоритмы', grade: 4.8, semester: 'Осень 2025', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const contactItems = [
    { icon: Mail, text: studentInfo.email },
    { icon: Phone, text: studentInfo.phone },
    { icon: MapPin, text: studentInfo.location },
    { icon: Calendar, text: `Зачислен: ${studentInfo.enrollmentDate}` },
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
        className="mb-8 relative z-10 flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Профиль</h2>
          <p className="text-slate-500 font-medium text-sm">Ваша информация и академические достижения</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10" style={{ perspective: '1200px' }}>
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-8 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32" style={{ background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)' }} />

            <div
              className="w-32 h-32 rounded-3xl mx-auto mb-5 flex items-center justify-center relative z-10 shadow-2xl shadow-indigo-500/30 border-4 border-white"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
              }}
            >
              <span className="text-4xl text-white font-extrabold tracking-tight">ИС</span>
            </div>

            <div className="relative z-10 w-full">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                {studentInfo.name}
              </h3>
              <p className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">
                ID: {studentInfo.studentId}
              </p>

              <div className="space-y-4 text-left mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {contactItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-4 text-sm font-medium">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-slate-600 truncate">{text}</span>
                  </div>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 group"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  boxShadow: '0 8px 20px -6px rgba(79,70,229,0.4)',
                }}
              >
                <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Редактировать профиль</span>
              </button>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-5">Достижения</h3>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${achievement.color} ${achievement.iconColor} shadow-sm`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{achievement.title}</p>
                    <p className="text-xs font-semibold mt-1 text-slate-400">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index + 3} />
            ))}
          </div>

          {/* Course History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-6">История курсов</h3>
            <div className="space-y-4">
              {courseHistory.map((course, index) => (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  key={index}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-default group"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-base font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{course.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{course.semester}</p>
                  </div>
                  <div className="flex items-center gap-4 border-l border-slate-100 pl-4">
                    <div className="text-right">
                      <div className={`text-xl font-extrabold ${course.color}`}>
                        {course.grade}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Оценка</div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${course.bg}`}>
                      {course.grade >= 4.8 ? '🏆' : course.grade >= 4.5 ? '⭐' : '👍'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activity Graph Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-5">Активность</h3>
            <div
              className="h-48 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', border: '1px dashed #cbd5e1' }}
            >
              <motion.div
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #4f46e5 10px, #4f46e5 20px)',
                  backgroundSize: '200% 200%'
                }}
              />
              <p className="text-sm font-bold text-slate-400 relative z-10 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> График активности (В разработке)
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
