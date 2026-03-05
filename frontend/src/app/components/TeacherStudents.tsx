/**
 * TeacherStudents – Teacher panel: students grouped by their group/class,
 * with real performance statistics derived from AppDataContext submissions.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Users,
    ChevronDown,
    ChevronUp,
    User as UserIcon,
    Award,
    Clock,
    CheckCircle2,
    FileText,
    TrendingUp,
    Search,
    AlertCircle,
    BookOpen,
} from 'lucide-react';
import { usersApi, classesApi, User, ClassItem } from '../../api/client';
import { useAppData, StudentSubmission } from '../contexts/AppDataContext';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface StudentStats {
    user: User;
    totalSubmissions: number;
    gradedCount: number;
    pendingCount: number;
    avgScore: number | null; // null = no graded submissions
    bestScore: number | null;
    coursesEnrolled: number;
    courseBreakdown: {
        courseName: string;
        submitted: number;
        graded: number;
        avgScore: number | null;
    }[];
}

/* ─── Stat Pill ───────────────────────────────────────────────────────────── */
function StatPill({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${color}`}>
            <span>{value}</span>
            <span className="opacity-60">{label}</span>
        </div>
    );
}

/* ─── Score Bar ───────────────────────────────────────────────────────────── */
function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
    const pct = Math.min(Math.round((score / max) * 100), 100);
    const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 w-10 text-right">{pct}%</span>
        </div>
    );
}

/* ─── Student Row ─────────────────────────────────────────────────────────── */
function StudentRow({ stats }: { stats: StudentStats }) {
    const [expanded, setExpanded] = useState(false);
    const { user } = stats;
    const initials = (user.name || user.email)
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => (w[0] || '').toUpperCase())
        .join('') || '?';

    return (
        <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden bg-white dark:bg-[#1a1d24] hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
            <button
                onClick={() => setExpanded((p) => !p)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-white">{initials}</span>
                </div>

                {/* Name & email */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{user.name || 'Без имени'}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>

                {/* Quick stats */}
                <div className="hidden md:flex items-center gap-2">
                    {stats.avgScore !== null && (
                        <StatPill
                            label="средний"
                            value={`${Math.round(stats.avgScore)}%`}
                            color={stats.avgScore >= 80
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                : stats.avgScore >= 50
                                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                    : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'}
                        />
                    )}
                    <StatPill
                        label="сдано"
                        value={stats.totalSubmissions}
                        color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                    />
                    {stats.pendingCount > 0 && (
                        <StatPill
                            label="ожидает"
                            value={stats.pendingCount}
                            color="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        />
                    )}
                </div>

                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800">
                            {/* Overview stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                                    <FileText className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                                    <p className="text-lg font-black text-slate-800 dark:text-white">{stats.totalSubmissions}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Всего работ</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                                    <p className="text-lg font-black text-slate-800 dark:text-white">{stats.gradedCount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Проверено</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                                    <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                                    <p className="text-lg font-black text-slate-800 dark:text-white">{stats.pendingCount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ожидает</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                                    <TrendingUp className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                                    <p className="text-lg font-black text-slate-800 dark:text-white">
                                        {stats.avgScore !== null ? `${Math.round(stats.avgScore)}%` : '—'}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Средний балл</p>
                                </div>
                            </div>

                            {/* Course breakdown */}
                            {stats.courseBreakdown.length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        По дисциплинам
                                    </h4>
                                    {stats.courseBreakdown.map((cb) => (
                                        <div key={cb.courseName} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl px-4 py-3">
                                            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{cb.courseName}</p>
                                                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                                                    <span>Сдано: {cb.submitted}</span>
                                                    <span>Проверено: {cb.graded}</span>
                                                </div>
                                            </div>
                                            <div className="w-32 shrink-0">
                                                {cb.avgScore !== null ? (
                                                    <ScoreBar score={cb.avgScore} />
                                                ) : (
                                                    <span className="text-xs text-slate-400">Нет оценок</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 text-sm">
                                    Студент пока не сдал ни одной работы
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Group Block ─────────────────────────────────────────────────────────── */
function GroupBlock({ groupName, students }: { groupName: string; students: StudentStats[] }) {
    const [open, setOpen] = useState(true);
    const totalAvg = (() => {
        const scores = students.filter((s) => s.avgScore !== null).map((s) => s.avgScore!);
        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    })();

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
        >
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl hover:shadow-md transition-all"
            >
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 text-left">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{groupName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {students.length} {students.length === 1 ? 'студент' : students.length < 5 ? 'студента' : 'студентов'}
                        {totalAvg !== null && ` · Средний балл: ${totalAvg}%`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
                        {students.length}
                    </span>
                    {open ? (
                        <ChevronUp className="w-5 h-5 text-indigo-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-indigo-400" />
                    )}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 pl-4">
                            {students.map((s) => (
                                <StudentRow key={s.user.id} stats={s} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export function TeacherStudents({ currentUser }: { currentUser: User | null }) {
    const [students, setStudents] = useState<User[]>([]);
    const [courses, setCourses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { getCourseData } = useAppData();

    // Fetch students and courses
    useEffect(() => {
        const teacherId = currentUser?.id;
        let cancelled = false;
        setLoading(true);
        setError(null);

        Promise.allSettled([
            usersApi.list().catch(() => [] as User[]),
            teacherId ? classesApi.byTeacher(teacherId).catch(() => [] as ClassItem[]) : Promise.resolve([] as ClassItem[]),
        ]).then(([usersResult, coursesResult]) => {
            if (cancelled) return;
            const allUsers = usersResult.status === 'fulfilled' ? usersResult.value : [];
            const teacherCourses = coursesResult.status === 'fulfilled' ? coursesResult.value : [];

            setStudents(Array.isArray(allUsers) ? allUsers.filter((u) => u.role === 'student') : []);
            setCourses(Array.isArray(teacherCourses) ? teacherCourses : []);
            setLoading(false);
        }).catch((err) => {
            if (!cancelled) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки');
                setLoading(false);
            }
        });

        return () => { cancelled = true; };
    }, [currentUser?.id]);

    // Build stats for each student
    const buildStudentStats = (student: User): StudentStats => {
        const studentId = String(student.id);
        let totalSubmissions = 0;
        let gradedCount = 0;
        let pendingCount = 0;
        let totalScore = 0;
        let gradedWithScore = 0;
        let bestScore: number | null = null;
        const courseBreakdown: StudentStats['courseBreakdown'] = [];

        courses.forEach((course) => {
            const courseId = String(course.id);
            const data = getCourseData(courseId);
            const subs = Array.isArray(data?.submissions) ? data.submissions : [];

            const studentSubs = subs.filter(
                (s: StudentSubmission) => s.studentId === studentId
            );

            if (studentSubs.length === 0) return;

            let courseSubmitted = 0;
            let courseGraded = 0;
            let courseScoreSum = 0;
            let courseScoreCount = 0;

            studentSubs.forEach((sub: StudentSubmission) => {
                courseSubmitted++;
                totalSubmissions++;
                if (sub.status === 'graded') {
                    courseGraded++;
                    gradedCount++;
                    if (sub.score !== null && sub.maxScore > 0) {
                        const pct = (sub.score / sub.maxScore) * 100;
                        totalScore += pct;
                        gradedWithScore++;
                        courseScoreSum += pct;
                        courseScoreCount++;
                        if (bestScore === null || pct > bestScore) bestScore = pct;
                    }
                } else {
                    pendingCount++;
                }
            });

            courseBreakdown.push({
                courseName: course.name || 'Курс',
                submitted: courseSubmitted,
                graded: courseGraded,
                avgScore: courseScoreCount > 0 ? courseScoreSum / courseScoreCount : null,
            });
        });

        return {
            user: student,
            totalSubmissions,
            gradedCount,
            pendingCount,
            avgScore: gradedWithScore > 0 ? totalScore / gradedWithScore : null,
            bestScore,
            coursesEnrolled: courseBreakdown.length,
            courseBreakdown,
        };
    };

    // Filter & group
    const filteredStudents = students.filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (s.name || '').toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            (s.group || '').toLowerCase().includes(q)
        );
    });

    const allStats = filteredStudents.map(buildStudentStats);

    const groupedByGroup: Record<string, StudentStats[]> = {};
    allStats.forEach((stats) => {
        const groupName = stats.user.group || 'Без группы';
        if (!groupedByGroup[groupName]) groupedByGroup[groupName] = [];
        groupedByGroup[groupName].push(stats);
    });

    // Sort groups alphabetically, "Без группы" last
    const sortedGroups = Object.keys(groupedByGroup).sort((a, b) => {
        if (a === 'Без группы') return 1;
        if (b === 'Без группы') return -1;
        return a.localeCompare(b, 'ru');
    });

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium">Загрузка студентов...</p>
                </div>
            </div>
        );
    }

    // Error
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] relative overflow-hidden transition-colors duration-300">
            <ThemeSquaresBackground />
            <div className="relative z-10">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-5">
                    <div className="flex items-center justify-between max-w-5xl mx-auto">
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Студенты</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                {students.length} {students.length === 1 ? 'студент' : students.length < 5 ? 'студента' : 'студентов'} · {sortedGroups.length} {sortedGroups.length === 1 ? 'группа' : sortedGroups.length < 5 ? 'группы' : 'групп'}
                            </p>
                        </div>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск по имени, email, группе..."
                                className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition w-72"
                            />
                        </div>
                    </div>
                </div>

                {/* Groups */}
                <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                    {sortedGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Студенты не найдены</h3>
                            <p className="text-sm text-slate-400 dark:text-slate-500">
                                {searchQuery ? 'Попробуйте изменить запрос поиска' : 'В системе ещё нет зарегистрированных студентов'}
                            </p>
                        </div>
                    ) : (
                        sortedGroups.map((groupName) => (
                            <GroupBlock key={groupName} groupName={groupName} students={groupedByGroup[groupName]} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
