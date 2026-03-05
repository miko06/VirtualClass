import { useEffect, useState } from 'react';
import { Mail, ShieldCheck, UserRound, CalendarDays, BookOpen, Users, FileText, TrendingUp, CalendarHeart, ClipboardCheck, Clock, MapPin, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { classesApi, ClassItem } from '../../api/client';
import type { User } from '../../api/client';
import CardSwap, { Card } from './CardSwap';
import ElectricBorder from './ElectricBorder';

interface TeacherDashboardProps {
  currentUser?: User | null;
}

function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return 'TR';
  return parts.map((part) => part[0]?.toUpperCase()).join('');
}

function formatDate(createdAt?: string): string {
  if (!createdAt) return 'Не указана';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Не указана';
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Заглушки для мини-контента преподавателя
const MOCK_ACTIVITY = [
  { id: 1, text: 'Студент Азатұлы Е. загрузил решение', time: '10 минут назад', type: 'upload' },
  { id: 2, text: 'Новое сообщение в чате курса "Базы данных"', time: '1 час назад', type: 'message' },
  { id: 3, text: 'Опубликована лекция: "Основы криптографии"', time: 'Вчера', type: 'publish' }
];

const MOCK_REVIEWS = [
  { id: 1, course: 'Информационная безопасность', task: 'СРО 1', student: 'Азатұлы Е.', timeLimit: 'Осталось 2 дня' },
  { id: 2, course: 'Программирование', task: 'Практика №4', student: 'Иванов И.', timeLimit: 'Просрочено' },
  { id: 3, course: 'Базы данных', task: 'Домашнее задание 2', student: 'Смирнова А.', timeLimit: 'Сегодня' }
];

const MOCK_SCHEDULE = [
  { id: 1, title: 'Лекция: Проектирование БД', date: '05 Марта', time: '10:00 - 11:30', location: 'Ауд. 402', group: 'ИС-37' },
  { id: 2, title: 'Практика: SQL-запросы', date: '05 Марта', time: '12:00 - 13:30', location: 'Лаборатория 2', group: 'ИС-37' }
];

export function TeacherDashboard({ currentUser }: TeacherDashboardProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;
    classesApi.byTeacher(currentUser.id).then(setClasses).catch(console.error);
  }, [currentUser?.id]);

  const totalStudents = classes.reduce((sum, c) => sum + (c.enrollments?.length ?? 0), 0);

  const profileName = currentUser?.name
    ?? (currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : 'Преподаватель VirtualClass');

  const profileEmail = currentUser?.email || 'teacher@virtualclass.edu';
  const profileRole = 'Преподаватель';
  const profileId = currentUser?.id ? `TR-${String(currentUser.id).padStart(4, '0')}` : 'TR-0000';
  const createdAt = formatDate(currentUser?.createdAt);
  const initials = getInitials(profileName);

  return (
    <div className="legacy-theme-screen min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />
      <div className="relative z-10 h-screen w-full">
        {/* Left Profile Block (ElectricBorder) */}
        <div className="absolute top-[calc(50%+38px)] left-0 -translate-x-[5%] -translate-y-1/2 -rotate-[4deg] z-20 max-[1200px]:left-4 max-[1200px]:translate-x-0 max-[1200px]:rotate-0">
          <ElectricBorder
            color="#a855f7" // Purple theme for teacher
            speed={1}
            chaos={0.12}
            thickness={2}
            style={{ borderRadius: 20 }}
          >
            <div className="w-[430px] max-w-[42vw] min-h-[520px] rounded-[20px] border border-white/10 bg-[#101827]/90 p-6 text-slate-100 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400/30 to-fuchsia-500/30 border border-purple-300/30 text-2xl font-bold tracking-wide text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold leading-tight truncate">{profileName}</h3>
                  <p className="mt-1 text-sm text-purple-200/85">ID: {profileId}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Mail className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-slate-200 truncate">{profileEmail}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-slate-200">Роль: {profileRole}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-slate-200">В системе с: {createdAt}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <UserRound className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-slate-200">Статус: Онлайн</span>
                </div>
              </div>

              {/* Quick Stats in Profile */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-400 mb-2" />
                  <span className="font-bold text-xl">{classes.length}</span>
                  <span className="text-xs text-slate-400 text-center">Активных курсов</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 text-fuchsia-400 mb-2" />
                  <span className="font-bold text-xl">{totalStudents}</span>
                  <span className="text-xs text-slate-400 text-center">Всего студентов</span>
                </div>
              </div>
            </div>
          </ElectricBorder>
        </div>

        {/* Right Animated Cards (CardSwap) */}
        <CardSwap
          width={780}
          height={540}
          cardDistance={80}
          verticalDistance={90}
          delay={6000}
          pauseOnHover={true}
        >
          {/* Card 1: Требуют проверки */}
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <ClipboardCheck className="w-6 h-6 text-rose-500" />
                Требуют проверки
              </h3>
              <span className="text-sm font-bold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 px-3 py-1 rounded-full">
                {MOCK_REVIEWS.length} работ
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between group cursor-pointer hover:border-rose-300 dark:hover:border-rose-500/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{review.course}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                        {review.task}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1"><UserRound className="w-3 h-3" /> {review.student}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 ${review.timeLimit === 'Просрочено' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {review.timeLimit}
                    </span>
                    <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Оценить <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 2: Расписание */}
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <CalendarHeart className="w-6 h-6 text-emerald-500" />
                Расписание занятий
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {MOCK_SCHEDULE.map(event => (
                <div key={event.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-emerald-100/50 dark:border-emerald-500/10 flex items-center gap-4 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <span className="text-xl font-bold leading-none">{event.date.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase font-bold">{event.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{event.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {event.time}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> {event.group}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {MOCK_SCHEDULE.length === 0 && (
                <div className="text-center py-10 text-slate-400">Нет запланированных занятий</div>
              )}
            </div>
          </Card>

          {/* Card 3: Активность */}
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Activity className="w-6 h-6 text-purple-500" />
                Недавняя активность
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {MOCK_ACTIVITY.map(act => (
                <div key={act.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white dark:border-[#1a1f2b] z-10 
                        ${act.type === 'upload' ? 'bg-indigo-100 text-indigo-500 dark:bg-indigo-500/20' :
                        act.type === 'message' ? 'bg-sky-100 text-sky-500 dark:bg-sky-500/20' :
                          'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20'
                      }`}
                    >
                      {act.type === 'upload' && <FileText className="w-4 h-4" />}
                      {act.type === 'message' && <UserRound className="w-4 h-4" />}
                      {act.type === 'publish' && <BookOpen className="w-4 h-4" />}
                    </div>
                    {act.id !== MOCK_ACTIVITY.length && <div className="w-px h-full bg-slate-200 dark:bg-slate-700 -my-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{act.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </CardSwap>
      </div>
    </div>
  );
}
