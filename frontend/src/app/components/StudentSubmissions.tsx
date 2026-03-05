import { useState, useEffect, Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  ClipboardList,
  CheckCircle2,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Star,
  FileText,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import type { StudentSubmission } from '../contexts/AppDataContext';

/* ─── Error Boundary ──────────────────────────────────────────────────────── */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Произошла ошибка</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{this.state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface AggregatedSubmission extends StudentSubmission {
  courseId: string;
  courseName: string;
}

interface CourseInfo {
  id: number;
  name: string;
}

/* ─── Stat Badge ──────────────────────────────────────────────────────────── */
function StatBadge({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className={`flex flex-col items-center px-4 py-2.5 rounded-2xl border ${color}`}>
      <span className="text-xl font-black">{value}</span>
      <span className="text-[10px] font-bold opacity-70 mt-0.5">{label}</span>
    </div>
  );
}

/* ─── Submission Card ─────────────────────────────────────────────────────── */
function SubmissionCard({
  sub,
  onGrade,
}: {
  sub: AggregatedSubmission;
  onGrade: (sub: AggregatedSubmission) => void;
}) {
  const isGraded = sub.status === 'graded';
  const pct = isGraded && sub.score !== null ? Math.round((sub.score / sub.maxScore) * 100) : null;
  const initials = (sub.studentName || 'С')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => (n[0] || '').toUpperCase())
    .join('') || 'СТ';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
        <span className="text-sm font-black text-white">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{sub.studentName || 'Студент'}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sub.taskTitle || 'Задание'}</p>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-[11px] text-slate-400">{sub.submittedAt || '—'}</span>
        </div>
      </div>
      {isGraded && pct !== null ? (
        <div className="shrink-0 text-center">
          <div className={`text-lg font-black ${pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
            {sub.score}/{sub.maxScore}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">балл</span>
        </div>
      ) : (
        <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1 rounded-full">
          <Clock className="w-3 h-3" /> На проверке
        </span>
      )}
      {!isGraded ? (
        <button
          onClick={() => onGrade(sub)}
          className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
        >
          Оценить
        </button>
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      )}
    </motion.div>
  );
}

/* ─── Grade Modal ─────────────────────────────────────────────────────────── */
function GradeModal({
  sub,
  onClose,
  onSave,
}: {
  sub: AggregatedSubmission;
  onClose: () => void;
  onSave: (score: number, comment: string) => void;
}) {
  const [score, setScore] = useState(String(sub.maxScore));
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#1a1d24] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white">Выставить оценку</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{sub.studentName} · {sub.taskTitle}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Балл (макс. {sub.maxScore})</label>
            <input
              type="number"
              min={0}
              max={sub.maxScore}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-center text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Комментарий</label>
            <textarea
              rows={3}
              placeholder="Отличная работа! Обратите внимание на..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Отмена
          </button>
          <button
            onClick={() => {
              const n = parseInt(score, 10);
              if (!isNaN(n)) onSave(Math.min(Math.max(n, 0), sub.maxScore), comment.trim());
            }}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" /> Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Course Group ────────────────────────────────────────────────────────── */
function CourseGroup({
  courseName,
  submissions,
  onGrade,
}: {
  courseName: string;
  submissions: AggregatedSubmission[];
  onGrade: (sub: AggregatedSubmission) => void;
}) {
  const [open, setOpen] = useState(true);
  const pending = submissions.filter((s) => s.status === 'pending').length;
  const graded = submissions.filter((s) => s.status === 'graded').length;

  return (
    <div className="bg-slate-50 dark:bg-[#13151b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
      >
        <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
        <span className="flex-1 text-left font-extrabold text-slate-700 dark:text-slate-200">{courseName}</span>
        {pending > 0 && (
          <span className="text-xs font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full">
            {pending} ожидает
          </span>
        )}
        <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
          {graded} проверено
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {submissions.map((sub) => (
                <SubmissionCard key={sub.id} sub={sub} onGrade={onGrade} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section (ПРАКТИКА / СРО) ────────────────────────────────────────────── */
function Section({
  title,
  icon,
  color,
  grouped,
  onGrade,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  grouped: Record<string, AggregatedSubmission[]>;
  onGrade: (sub: AggregatedSubmission) => void;
}) {
  const entries = Object.entries(grouped);
  const allSubs = entries.flatMap(([, subs]) => subs);
  const total = allSubs.length;
  const pending = allSubs.filter((s) => s.status === 'pending').length;
  const graded = allSubs.filter((s) => s.status === 'graded').length;

  return (
    <section className="space-y-6">
      <div className={`flex items-center gap-4 p-5 rounded-2xl border ${color}`}>
        <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black tracking-tight">{title}</h2>
          <p className="text-sm opacity-70 font-medium mt-0.5">Всего заданий: {total}</p>
        </div>
        <div className="flex gap-3">
          <StatBadge label="Всего" value={total} color="bg-white/50 dark:bg-black/20 border-transparent text-slate-700 dark:text-slate-200" />
          <StatBadge label="Ожидает" value={pending} color="bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300" />
          <StatBadge label="Проверено" value={graded} color="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300" />
        </div>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-600">
          <User className="w-10 h-10 mb-3 opacity-40" />
          <p className="font-bold text-sm">Студенты ещё не сдали задания</p>
          <p className="text-xs mt-1 opacity-70">Задания появятся здесь после того, как студент нажмёт «Сдать»</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(([courseName, subs]) => (
            <CourseGroup key={courseName} courseName={courseName} submissions={subs} onGrade={onGrade} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Inner content (wrapped by ErrorBoundary) ────────────────────────────── */
function StudentSubmissionsInner({ currentUser }: { currentUser: { id: number; name?: string | null } | null }) {
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradingSub, setGradingSub] = useState<AggregatedSubmission | null>(null);

  const { getCourseData, gradeSubmission } = useAppData();

  // Load teacher courses — wrapped in a robust try-catch
  useEffect(() => {
    const teacherId = currentUser?.id;
    if (!teacherId) {
      setCourses([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Dynamic import to avoid crashing if client.ts itself has issues
        const { classesApi } = await import('../../api/client');
        const res = await classesApi.byTeacher(teacherId);
        if (!cancelled) {
          setCourses(Array.isArray(res) ? res.map((c) => ({ id: c.id, name: c.name })) : []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Не удалось загрузить курсы';
          console.warn('[StudentSubmissions] API error:', msg);
          setError(msg);
          setCourses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [currentUser?.id]);

  // Safely aggregate submissions
  let allSubmissions: AggregatedSubmission[] = [];
  try {
    allSubmissions = courses.flatMap((course) => {
      const courseId = String(course.id);
      const data = getCourseData(courseId);
      const subs = Array.isArray(data?.submissions) ? data.submissions : [];
      return subs.map((sub, i) => ({
        ...sub,
        id: sub.id || `${courseId}-${i}`,
        type: (sub.type === 'sro' ? 'sro' : 'practice') as 'practice' | 'sro',
        status: (sub.status === 'graded' ? 'graded' : 'pending') as 'pending' | 'graded',
        studentName: sub.studentName || 'Студент',
        taskTitle: sub.taskTitle || 'Задание',
        submittedAt: sub.submittedAt || '—',
        maxScore: sub.maxScore > 0 ? sub.maxScore : 100,
        score: typeof sub.score === 'number' ? sub.score : null,
        courseId,
        courseName: course.name || 'Без названия',
      }));
    });
  } catch (e) {
    console.error('[StudentSubmissions] Error aggregating submissions:', e);
  }

  const groupByType = (type: 'practice' | 'sro') => {
    const grouped: Record<string, AggregatedSubmission[]> = {};
    allSubmissions.filter((s) => s.type === type).forEach((s) => {
      const key = s.courseName;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    });
    return grouped;
  };

  const groupedPractice = groupByType('practice');
  const groupedSro = groupByType('sro');

  const handleGrade = (score: number, comment: string) => {
    if (!gradingSub) return;
    try {
      gradeSubmission(gradingSub.courseId, gradingSub.id, score, comment || undefined);
    } catch (e) {
      console.error('[StudentSubmissions] Error grading:', e);
    }
    setGradingSub(null);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Загрузка заданий...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <p className="text-slate-700 dark:text-slate-300 font-bold mb-1">Ошибка загрузки</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  // ── Not logged in ──
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center p-6">
        <div className="text-center">
          <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Необходимо войти в систему</p>
        </div>
      </div>
    );
  }

  // ── Main UI ──
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-5">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Задания студентов</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Проверяйте и оценивайте ПРАК и СРО по каждой дисциплине
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">
        {/* ── ПРАКТИКА ── */}
        <Section
          title="ПРАКТИКА"
          icon={<Wrench className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30 text-indigo-800 dark:text-indigo-200"
          grouped={groupedPractice}
          onGrade={setGradingSub}
        />

        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* ── СРО ── */}
        <Section
          title="СРО"
          icon={<ClipboardList className="w-6 h-6 text-violet-600 dark:text-violet-400" />}
          color="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-500/30 text-violet-800 dark:text-violet-200"
          grouped={groupedSro}
          onGrade={setGradingSub}
        />
      </div>

      {/* Grade Modal */}
      <AnimatePresence>
        {gradingSub && (
          <GradeModal sub={gradingSub} onClose={() => setGradingSub(null)} onSave={handleGrade} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Exported component (wrapped in ErrorBoundary) ───────────────────────── */
export function StudentSubmissions({ currentUser }: { currentUser: { id: number; name?: string | null } | null }) {
  return (
    <ErrorBoundary>
      <StudentSubmissionsInner currentUser={currentUser} />
    </ErrorBoundary>
  );
}
