import type { User } from '../../api/client';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { SplineScene } from './ui/splite';
import { ContainerScroll } from './ui/container-scroll-animation';
import { VercelV0Chat } from './ui/v0-ai-chat';

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
    <div className="min-h-screen relative bg-[#0f1115] text-white">
      <ThemeSquaresBackground />

      <div className="relative z-20 pt-16">
        <VercelV0Chat />
      </div>

      <ContainerScroll
        titleComponent={
          <div className="space-y-4">
            {/* Compact profile badge */}
            <div className="inline-flex relative z-50 -translate-y-4 items-center gap-3 px-5 py-3 rounded-2xl border border-cyan-400/20 bg-[#101827] shadow-2xl backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border border-cyan-300/30 text-sm font-bold">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{profileName}</p>
                <p className="text-xs text-cyan-300/70">{profileRole} · {profileId}</p>
              </div>
            </div>
          </div>
        }
      >
        {/* Card content: Spline scene + profile details side by side */}
        <div className="relative w-full h-full flex overflow-hidden rounded-2xl bg-[#0d1420]">
          {/* Left: profile details */}
          <div className="hidden md:flex flex-col justify-center w-[300px] shrink-0 px-7 py-8 border-r border-white/10 bg-[#101827]/80 backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-300/30 text-2xl font-bold mb-5">
              {initials}
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{profileName}</h3>
            <p className="text-xs text-cyan-300/70 mb-6">{profileId}</p>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Email</p>
                <p className="text-sm text-slate-200 truncate">{profileEmail}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Роль</p>
                <p className="text-sm text-slate-200">{profileRole}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">В системе с</p>
                <p className="text-sm text-slate-200">{createdAt}</p>
              </div>
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-cyan-400/70 mb-0.5">Статус</p>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-sm text-emerald-300">Онлайн</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3D Spline robot scene */}
          <div className="flex-1 relative">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
            {/* Subtle gradient overlay at edges */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
              background: 'linear-gradient(to right, #0d1420 0%, transparent 10%, transparent 90%, #0d1420 100%)',
            }} />
          </div>

          {/* Mobile-only profile overlay */}
          <div className="absolute bottom-4 left-4 right-4 md:hidden">
            <div className="rounded-xl border border-cyan-300/20 bg-[#101827]/90 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-300/30 text-sm font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold">{profileName}</p>
                  <p className="text-xs text-cyan-300/70">{profileId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <p><span className="text-slate-500">Email:</span><br />{profileEmail}</p>
                <p><span className="text-slate-500">Роль:</span><br />{profileRole}</p>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
