/**
 * TeacherProfile – Teacher profile page with real teaching statistics.
 */
import { useState, useEffect, useRef } from 'react';
import {
    Mail, Calendar, Award, BookOpen, TrendingUp, Edit2,
    User as UserIcon, Users, FileText, CheckCircle2, Clock,
    GraduationCap, BarChart3,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useAppData } from '../contexts/AppDataContext';
import { classesApi, ClassItem, User } from '../../api/client';

/* ─── 3D Stat Card ────────────────────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: { label: string; value: string | number; icon: any; gradient: string; glow: string }; index: number }) {
    const Icon = stat.icon;
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
            className="p-6 rounded-2xl relative bg-white dark:bg-[#1a1d24] shadow-xl shadow-slate-200/50 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-slate-800 group cursor-default"
        >
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${stat.glow}, transparent 70%)`, transform: 'translateZ(1px)' }}
            />
            <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 flex flex-col items-center text-center pt-2">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    style={{ background: stat.gradient, boxShadow: `0 8px 20px -4px ${stat.glow}` }}
                >
                    <Icon className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div className="text-3xl tracking-tight mb-1 font-extrabold text-slate-800 dark:text-white">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
        </motion.div>
    );
}

/* ─── Course Stat Row ─────────────────────────────────────────────────────── */
function CourseStatRow({ name, students, graded, pending, avgScore }: {
    name: string;
    students: number;
    graded: number;
    pending: number;
    avgScore: number | null;
}) {
    const pct = avgScore !== null ? Math.round(avgScore) : null;
    const barColor = pct !== null
        ? pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
        : 'bg-slate-300 dark:bg-slate-600';

    return (
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{name}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {students}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {graded}</span>
                    {pending > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> {pending}</span>}
                </div>
            </div>
            <div className="w-28 shrink-0">
                {pct !== null ? (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 w-8 text-right">{pct}%</span>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">—</span>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export function TeacherProfile({ currentUser }: { currentUser: User | null }) {
    const [courses, setCourses] = useState<ClassItem[]>([]);
    const { getCourseData } = useAppData();

    useEffect(() => {
        if (!currentUser?.id) return;
        let cancelled = false;
        classesApi.byTeacher(currentUser.id)
            .then((res) => { if (!cancelled) setCourses(Array.isArray(res) ? res : []); })
            .catch(() => { if (!cancelled) setCourses([]); });
        return () => { cancelled = true; };
    }, [currentUser?.id]);

    // Compute real stats
    let totalStudentSubmissions = 0;
    let totalGraded = 0;
    let totalPending = 0;
    let totalScoreSum = 0;
    let totalScoreCount = 0;
    let totalEnrolledStudents = 0;

    const courseStats = courses.map((course) => {
        const courseId = String(course.id);
        const data = getCourseData(courseId);
        const subs = Array.isArray(data?.submissions) ? data.submissions : [];
        let graded = 0;
        let pending = 0;
        let scoreSum = 0;
        let scoreCount = 0;
        // Count enrolled students from the course enrollments
        const enrolledCount = Array.isArray(course.enrollments) ? course.enrollments.length : 0;
        totalEnrolledStudents += enrolledCount;
        const courseStudents = new Set<string>();

        subs.forEach((sub) => {
            totalStudentSubmissions++;
            courseStudents.add(sub.studentId);
            if (sub.status === 'graded') {
                graded++;
                totalGraded++;
                if (sub.score !== null && sub.maxScore > 0) {
                    const pct = (sub.score / sub.maxScore) * 100;
                    scoreSum += pct;
                    scoreCount++;
                    totalScoreSum += pct;
                    totalScoreCount++;
                }
            } else {
                pending++;
                totalPending++;
            }
        });

        return {
            name: course.name || 'Курс',
            students: enrolledCount > 0 ? enrolledCount : courseStudents.size,
            graded,
            pending,
            avgScore: scoreCount > 0 ? scoreSum / scoreCount : null,
        };
    });

    const overallAvg = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : null;

    const fullName = currentUser?.name
        ?? (currentUser?.firstName && currentUser?.lastName
            ? `${currentUser.lastName} ${currentUser.firstName}`
            : currentUser?.email ?? 'Преподаватель');

    const initials = currentUser?.firstName && currentUser?.lastName
        ? `${currentUser.lastName[0]}${currentUser.firstName[0]}`
        : currentUser?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
        ?? 'ПР';

    const joinDate = currentUser?.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
        : '—';

    const stats = [
        { label: 'Курсов', value: courses.length, icon: BookOpen, gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', glow: 'rgba(79,70,229,0.3)' },
        { label: 'Студентов', value: totalEnrolledStudents, icon: Users, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', glow: 'rgba(139,92,246,0.3)' },
        { label: 'Проверено работ', value: totalGraded, icon: CheckCircle2, gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', glow: 'rgba(16,185,129,0.3)' },
        { label: 'Средний балл', value: overallAvg !== null ? `${overallAvg}%` : '—', icon: Award, gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.3)' },
    ];

    const contactItems = [
        { icon: Mail, label: 'Email', text: currentUser?.email ?? '—' },
        { icon: GraduationCap, label: 'Роль', text: 'Преподаватель' },
        { icon: Calendar, label: 'В системе с', text: joinDate },
    ];

    return (
        <div className="legacy-theme-screen p-8 min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0f1115] transition-colors duration-200">
            <ThemeSquaresBackground />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-6xl mx-auto" style={{ perspective: '1200px' }}>
                {/* ── Left: Profile Card ── */}
                <div className="lg:col-span-1 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl p-8 bg-gradient-to-b from-[#15284a] via-[#1a1f2b] to-[#181d28] shadow-2xl shadow-indigo-500/15 ring-1 ring-[#2a3348] flex flex-col items-center text-center relative overflow-hidden flex-1"
                    >
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#27467a] to-[#15284a]" />

                        <div
                            className="w-32 h-32 rounded-3xl mx-auto mb-5 flex items-center justify-center relative z-10 shadow-2xl shadow-indigo-500/30 border-4 border-white"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                        >
                            <span className="text-3xl text-white font-extrabold tracking-tight">{initials}</span>
                        </div>

                        <div className="relative z-10 w-full">
                            <h3 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">{fullName}</h3>
                            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">Преподаватель</p>
                            {currentUser?.specialtyCode && (
                                <p className="text-xs font-semibold text-slate-400 mb-4">{currentUser.specialtyCode}</p>
                            )}
                            {!currentUser?.specialtyCode && <div className="mb-4" />}

                            <div className="space-y-3.5 text-left mb-6 bg-[#101827]/75 p-5 rounded-2xl border border-[#2a3348]">
                                {contactItems.map(({ icon: Icon, label, text }) => (
                                    <div key={label} className="flex items-center gap-4 text-sm font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-4 h-4 text-indigo-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
                                            <p className="text-slate-300 truncate text-sm">{text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick badges */}
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    <BookOpen className="w-3.5 h-3.5" /> {courses.length} курсов
                                </span>
                                {totalPending > 0 && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        <Clock className="w-3.5 h-3.5" /> {totalPending} на проверке
                                    </span>
                                )}
                            </div>

                            <button
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 group"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 8px 20px -6px rgba(139,92,246,0.4)' }}
                            >
                                <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span>Редактировать профиль</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* ── Right: Stats & Courses ── */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <StatCard key={stat.label} stat={stat} index={index} />
                        ))}
                    </div>

                    {/* User Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-3xl p-7 bg-white dark:bg-[#1a1d24] shadow-xl shadow-slate-200/50 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-slate-800"
                    >
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight mb-5 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-indigo-500" /> Информация
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Имя', value: currentUser?.firstName ?? currentUser?.name ?? '—' },
                                { label: 'Фамилия', value: currentUser?.lastName ?? '—' },
                                { label: 'Email', value: currentUser?.email ?? '—' },
                                { label: 'Роль', value: 'Преподаватель' },
                                { label: 'ID', value: currentUser?.id ? `TCH-${String(currentUser.id).padStart(4, '0')}` : '—' },
                                { label: 'В системе с', value: joinDate },
                            ].map(({ label, value }) => (
                                <div key={label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Courses Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-3xl p-7 bg-white dark:bg-[#1a1d24] shadow-xl shadow-slate-200/50 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-slate-800"
                    >
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight mb-5 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-500" /> Статистика по курсам
                        </h3>
                        {courseStats.length === 0 ? (
                            <div className="h-32 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Курсы пока не добавлены
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {courseStats.map((cs) => (
                                    <CourseStatRow key={cs.name} {...cs} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
