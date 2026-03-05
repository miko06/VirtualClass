/**
 * StudentAssignments – shows all practice/SRO tasks assigned by teachers across enrolled courses.
 * Reads tasks from AppDataContext (shared with teacher panel) and submissions from same context.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardList,
  BookOpen,
  CalendarDays,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  Award,
  Wrench,
} from 'lucide-react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useAppData } from '../contexts/AppDataContext';
import type { PracticeTask, SROTask, StudentSubmission } from '../contexts/AppDataContext';
import { classesApi, ClassItem, User } from '../../api/client';

type TabType = 'practice' | 'sro';
type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'late';

interface DisplayTask {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  deadline: string | null;
  maxScore: number;
  type: 'practice' | 'sro';
  status: AssignmentStatus;
  currentScore: number | null;
  submissionId: string | null;
}

export function StudentAssignments({ currentUser }: { currentUser?: User | null }) {
  const [activeTab, setActiveTab] = useState<TabType>('practice');
  const [courses, setCourses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTaskForUpload, setSelectedTaskForUpload] = useState<DisplayTask | null>(null);

  const { getCourseData, addSubmission } = useAppData();

  // Fetch student courses
  useEffect(() => {
    const studentId = currentUser?.id;
    if (!studentId) {
      setCourses([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    classesApi
      .byStudent(studentId)
      .then((res) => { if (!cancelled) setCourses(Array.isArray(res) ? res : []); })
      .catch(() => { if (!cancelled) setCourses([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [currentUser?.id]);

  // Build tasks from all courses
  const buildTasks = (): DisplayTask[] => {
    const tasks: DisplayTask[] = [];

    courses.forEach((course) => {
      const courseId = String(course.id);
      const data = getCourseData(courseId);
      const submissions = Array.isArray(data?.submissions) ? data.submissions : [];

      // Practice tasks
      const practiceTasks = Array.isArray(data?.practiceTasks) ? data.practiceTasks : [];
      practiceTasks.forEach((task: PracticeTask) => {
        const sub = submissions.find(
          (s: StudentSubmission) => s.taskId === task.id && s.type === 'practice' && s.studentId === (currentUser?.id?.toString() || '')
        );
        let status: AssignmentStatus = 'pending';
        if (sub?.status === 'graded') status = 'graded';
        else if (sub) status = 'submitted';

        tasks.push({
          id: `prac_${courseId}_${task.id}`,
          courseId,
          courseName: course.name || 'Курс',
          title: task.title,
          description: task.description || '',
          deadline: null,
          maxScore: 100,
          type: 'practice',
          status,
          currentScore: sub?.score ?? null,
          submissionId: sub?.id ?? null,
        });
      });

      // SRO tasks
      const sroTasks = Array.isArray(data?.sroTasks) ? data.sroTasks : [];
      sroTasks.forEach((task: SROTask) => {
        const sub = submissions.find(
          (s: StudentSubmission) => s.taskId === task.id && s.type === 'sro' && s.studentId === (currentUser?.id?.toString() || '')
        );
        let status: AssignmentStatus = 'pending';
        const isOverdue = task.deadline && new Date(task.deadline) < new Date();
        if (sub?.status === 'graded') status = 'graded';
        else if (sub) status = 'submitted';
        else if (isOverdue) status = 'late';

        tasks.push({
          id: `sro_${courseId}_${task.id}`,
          courseId,
          courseName: course.name || 'Курс',
          title: task.title,
          description: task.description || '',
          deadline: task.deadline || null,
          maxScore: task.maxScore || 100,
          type: 'sro',
          status,
          currentScore: sub?.score ?? null,
          submissionId: sub?.id ?? null,
        });
      });
    });

    return tasks;
  };

  const allTasks = buildTasks();
  const practiceTasks = allTasks.filter((t) => t.type === 'practice');
  const sroTasks = allTasks.filter((t) => t.type === 'sro');
  const currentTasks = activeTab === 'practice' ? practiceTasks : sroTasks;

  // Status badge helper
  const getStatusBadge = (status: AssignmentStatus, score?: number | null, maxScore?: number) => {
    switch (status) {
      case 'graded':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <Award className="w-3.5 h-3.5" />
            {score !== null && score !== undefined ? `${score}/${maxScore}` : 'Оценено'}
          </span>
        );
      case 'submitted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Сдано
          </span>
        );
      case 'late':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Просрочено
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Ожидает сдачи
          </span>
        );
    }
  };

  // Upload handler
  const handleUploadClick = (task: DisplayTask) => {
    setSelectedTaskForUpload(task);
    fileInputRef.current?.click();
  };

  const handleFileSelected = () => {
    const task = selectedTaskForUpload;
    if (!task || !fileInputRef.current?.files?.length) return;

    const realTaskId = task.id.replace(/^(prac|sro)_\d+_/, '');
    setUploadingId(task.id);

    setTimeout(() => {
      setUploadingId(null);
      addSubmission(task.courseId, {
        studentId: currentUser?.id?.toString() || localStorage.getItem('currentUserId') || 'student_1',
        studentName: currentUser?.name || 'Студент',
        type: task.type,
        taskId: realTaskId,
        taskTitle: task.title,
        maxScore: task.maxScore,
      });
      setSelectedTaskForUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Загрузка заданий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="legacy-theme-screen p-6 md:p-8 min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.zip,.rar,.pptx,.xlsx" className="hidden" onChange={handleFileSelected} />

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Задания</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Центр управления вашими работами и дедлайнами</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'practice' as TabType, label: 'ПРАКТИКА', icon: Wrench, count: practiceTasks.length },
            { id: 'sro' as TabType, label: 'СРО', icon: BookOpen, count: sroTasks.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id
                  ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tasks list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {currentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {activeTab === 'practice' ? 'Нет практических заданий' : 'Нет заданий СРО'}
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Задания появятся здесь, когда преподаватель их создаст
                </p>
              </div>
            ) : (
              currentTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
                >
                  {/* Course name badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {task.courseName}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        {task.deadline && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>Срок: {new Date(task.deadline).toLocaleString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        {task.maxScore > 0 && (
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Макс: {task.maxScore} баллов
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {getStatusBadge(task.status, task.currentScore, task.maxScore)}

                      {/* Upload button (only for pending/late) */}
                      {(task.status === 'pending' || task.status === 'late') && (
                        <button
                          onClick={() => handleUploadClick(task)}
                          disabled={uploadingId === task.id}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors mt-1"
                        >
                          {uploadingId === task.id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Отправка...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              Сдать работу
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
