import { Mail, MapPin, Calendar, Award, BookOpen, TrendingUp, Edit2, User as UserIcon } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useRef } from 'react';
import type { User } from '../../api/client';

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
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="p-6 rounded-2xl relative bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 group cursor-default"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${stat.glow}, transparent 70%)`, transform: 'translateZ(1px)' }}
      />
      <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 flex flex-col items-center text-center pt-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          style={{ background: stat.gradient, boxShadow: `0 8px 20px -4px ${stat.glow}` }}>
          <Icon className="w-7 h-7 text-white drop-shadow-sm" />
        </div>
        <div className="text-3xl tracking-tight mb-1 font-extrabold text-slate-800">{stat.value}</div>
        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
      </div>
    </motion.div>
  );
}

interface ProfileProps {
  currentUser?: User | null;
}

export function Profile({ currentUser }: ProfileProps) {
  const fullName = currentUser?.name
    ?? (currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.lastName} ${currentUser.firstName}`
      : currentUser?.email ?? 'Студент');

  const initials = currentUser?.firstName && currentUser?.lastName
    ? `${currentUser.lastName[0]}${currentUser.firstName[0]}`
    : currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    ?? 'СТ';

  const stats = [
    { label: 'Дисциплин', value: '5', icon: BookOpen, gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', glow: 'rgba(79,70,229,0.3)' },
    { label: 'Средний балл', value: '—', icon: Award, gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
    { label: 'Рейтинг', value: '—', icon: TrendingUp, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', glow: 'rgba(16,185,129,0.3)' },
  ];

  const contactItems = [
    { icon: Mail, text: currentUser?.email ?? '—' },
    { icon: MapPin, text: 'Астана, Казахстан' },
    { icon: Calendar, text: 'Зачислен: 2023' },
  ];

  return (
    <div className="legacy-theme-screen p-8 min-h-screen relative overflow-hidden bg-slate-50">
      <ThemeSquaresBackground />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10" style={{ perspective: '1200px' }}>
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-8 bg-gradient-to-b from-[#15284a] via-[#1a1f2b] to-[#181d28] shadow-2xl shadow-indigo-500/15 ring-1 ring-[#2a3348] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#27467a] to-[#15284a]" />

            <div className="w-32 h-32 rounded-3xl mx-auto mb-5 flex items-center justify-center relative z-10 shadow-2xl shadow-indigo-500/30 border-4 border-white"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}>
              <span className="text-3xl text-white font-extrabold tracking-tight">{initials}</span>
            </div>

            <div className="relative z-10 w-full">
              <h3 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">{fullName}</h3>

              {currentUser?.group && (
                <p className="text-sm font-bold text-indigo-300 mb-1">Группа: {currentUser.group}</p>
              )}
              {currentUser?.specialtyCode && (
                <p className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
                  Специальность: {currentUser.specialtyCode}
                </p>
              )}
              {!currentUser?.group && (
                <p className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
                  {currentUser?.role === 'teacher' ? 'Преподаватель' : 'Студент'}
                </p>
              )}

              <div className="space-y-4 text-left mb-8 bg-[#101827]/75 p-5 rounded-2xl border border-[#2a3348]">
                {contactItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-4 text-sm font-medium">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-300" />
                    </div>
                    <span className="text-slate-300 truncate">{text}</span>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 group"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 8px 20px -6px rgba(79,70,229,0.4)' }}>
                <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Редактировать профиль</span>
              </button>
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

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-5 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-500" /> Информация о пользователе
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Имя', value: currentUser?.firstName ?? '—' },
                { label: 'Фамилия', value: currentUser?.lastName ?? '—' },
                { label: 'Email', value: currentUser?.email ?? '—' },
                { label: 'Группа', value: currentUser?.group ?? '—' },
                { label: 'Специальность', value: currentUser?.specialtyCode ?? '—' },
                { label: 'Роль', value: currentUser?.role === 'teacher' ? 'Преподаватель' : 'Студент' },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl p-7 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-5">Активность</h3>
            <div className="h-48 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-slate-50 to-slate-100 border border-dashed border-slate-300">
              <motion.div
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #4f46e5 10px, #4f46e5 20px)', backgroundSize: '200% 200%' }}
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
