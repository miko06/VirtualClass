import { CalendarDays, Mail, ShieldCheck, UserRound, Newspaper, CalendarHeart, Award, ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import type { User } from '../../api/client';
import CardSwap, { Card } from './CardSwap';
import ElectricBorder from './ElectricBorder';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';

interface DashboardProps {
  user: User | null;
}

function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return 'SV';
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

// Заглушки для мини-контента (новости и мероприятия будут из админки)
const MOCK_NEWS = [
  { id: 1, title: 'Открыт набор на хакатон "HackENU 2026"', date: '04 Марта', tag: 'Важное', urgent: true },
  { id: 2, title: 'Изменения в расписании сессии', date: '02 Марта', tag: 'Учеба', urgent: false },
  { id: 3, title: 'Гостевая лекция от ведущих IT-компаний', date: '28 Февраля', tag: 'Карьера', urgent: false }
];

const MOCK_EVENTS = [
  { id: 1, title: 'Встреча клуба программистов', date: '06 Марта', time: '15:00', location: 'Аудитория 405' },
  { id: 2, title: 'Мастер-класс по Data Science', date: '10 Марта', time: '11:30', location: 'Онлайн (Zoom)' }
];

const MOCK_GRADES = [
  { id: 1, course: 'Базы данных', task: 'СРО 1', grade: '95', max: '100', date: 'Вчера' },
  { id: 2, course: 'Информационная безопасность', task: 'Практика №3', grade: '100', max: '100', date: '02 Марта' },
  { id: 3, course: 'Web-технологии', task: 'Промежуточный тест', grade: '88', max: '100', date: '26 Февраля' }
];

export function Dashboard({ user }: DashboardProps) {
  const profileName = user?.name?.trim() || 'Студент VirtualClass';
  const profileEmail = user?.email || 'student@virtualclass.edu';
  const profileRole = user?.role === 'teacher' ? 'Преподаватель' : 'Студент';
  const profileId = user?.id ? `STU-${String(user.id).padStart(4, '0')}` : 'STU-0000';
  const createdAt = formatDate(user?.createdAt);
  const initials = getInitials(profileName);

  return (
    <div className="legacy-theme-screen min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />
      <div className="relative z-10 h-screen w-full">
        <div className="absolute top-[calc(50%+38px)] left-0 -translate-x-[5%] -translate-y-1/2 -rotate-[4deg] z-20 max-[1200px]:left-4 max-[1200px]:translate-x-0 max-[1200px]:rotate-0">
          <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.12}
            thickness={2}
            style={{ borderRadius: 20 }}
          >
            <div className="w-[430px] max-w-[42vw] min-h-[520px] rounded-[20px] border border-white/10 bg-[#101827]/90 p-6 text-slate-100 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-300/30 text-2xl font-bold tracking-wide">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold leading-tight truncate">{profileName}</h3>
                  <p className="mt-1 text-sm text-cyan-200/85">ID: {profileId}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Mail className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm text-slate-200 truncate">{profileEmail}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm text-slate-200">Роль: {profileRole}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm text-slate-200">В системе с: {createdAt}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <UserRound className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm text-slate-200">Статус: Онлайн</span>
                </div>
              </div>
            </div>
          </ElectricBorder>
        </div>

        <CardSwap
          width={780}
          height={540}
          cardDistance={80}
          verticalDistance={90}
          delay={6000}
          pauseOnHover={true}
        >
          {/* Card 1: Новости */}
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-indigo-500" />
                Новости факультета
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {MOCK_NEWS.map(news => (
                <div key={news.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex flex-col gap-2 relative overflow-hidden group">
                  {news.urgent && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />}
                  <div className="flex items-start justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${news.urgent ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'}`}>
                      {news.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{news.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {news.title}
                  </h4>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 2: Мероприятия */}
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <CalendarHeart className="w-6 h-6 text-emerald-500" />
                Предстоящие мероприятия
              </h3>
            </div>

            <div className="flex-1 space-y-4">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-emerald-100/50 dark:border-emerald-500/10 flex items-center gap-4 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <span className="text-lg font-bold leading-none">{event.date.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase font-bold">{event.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{event.title}</h4>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {event.time}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {MOCK_EVENTS.length === 0 && (
                <div className="text-center py-10 text-slate-400">Нет запланированных мероприятий</div>
              )}
            </div>
          </Card>

          {/* Card 3: Последние оценки */}
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-500" />
                Последние оценки
              </h3>
            </div>

            <div className="flex-1 space-y-3">
              {MOCK_GRADES.map(grade => (
                <div key={grade.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{grade.course}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
                        {grade.task}
                      </span>
                      <span className="text-[10px] text-slate-400">{grade.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800 dark:text-white">{grade.grade}</span>
                      <span className="text-xs font-bold text-slate-400">/{grade.max}</span>
                    </div>
                    <div className="flex text-amber-500 gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= Math.round(Number(grade.grade) / 20) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
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
