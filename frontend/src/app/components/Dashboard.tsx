import { CalendarDays, Mail, ShieldCheck, UserRound } from 'lucide-react';
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
          delay={5000}
          pauseOnHover={false}
        >
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl">
            <h3 className="text-2xl font-bold">Мои курсы</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              5 активных курсов: Блокчейн технологии, Программирование мобильных устройств, ...
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Студент группы ИС-37.
            </p>
          </Card>
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl">
            <h3 className="text-2xl font-bold">Ближайшие задачи</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              У вас пока нет активных заданий или дедлайнов на ближайшие дни.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Отличный повод повторить пройденный материал!
            </p>
          </Card>
          <Card className="p-8 bg-white/95 dark:bg-[#1a1f2b] border-gray-200 dark:border-[#2a3348] text-slate-900 dark:text-slate-100 shadow-xl">
            <h3 className="text-2xl font-bold">ИИ-помощник VirtualClass</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Быстро объяснит сложные темы, поможет с домашними заданиями
              и предложит персональный план подготовки к экзамену.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Доступен 24/7 для студентов.
            </p>
          </Card>
        </CardSwap>
      </div>
    </div>
  );
}
