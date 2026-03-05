import { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    BookOpen,
    Wrench,
    ClipboardList,
    Upload,
    Plus,
    Trash2,
    Youtube,
    FileText,
    Calendar,
    Clock,
    CheckCircle2,
    X,
    Link,
    MessageSquare,
    Send,
    Paperclip,
    Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassItem } from '../../api/client';
import { useAppData } from '../contexts/AppDataContext';


interface TeacherCourseDetailsProps {
    course: ClassItem;
    onBack: () => void;
}

type Tab = 'lecture' | 'practice' | 'sro';

interface UploadedFile {
    id: string;
    name: string;
    size: string;
    uploadedAt: string;
    title?: string;
    description?: string;
}

interface YouTubeLink {
    id: string;
    title: string;
    url: string;
}

interface PracticeTask {
    id: string;
    title: string;
    description: string;
    addedAt: string;
}

interface SROTask {
    id: string;
    title: string;
    description: string;
    deadline: string;
    maxScore: number;
}

interface ChatMessage {
    id: string;
    author: string;
    authorRole: 'teacher' | 'student';
    text: string;
    time: string;
}

const TABS: { id: Tab; label: string; shortLabel: string; icon: typeof BookOpen }[] = [
    { id: 'lecture', label: 'Лекция', shortLabel: 'ЛЕК', icon: BookOpen },
    { id: 'practice', label: 'Практика', shortLabel: 'ПРАК', icon: Wrench },
    { id: 'sro', label: 'СРО', shortLabel: 'СРО', icon: ClipboardList },
];

export function TeacherCourseDetails({ course, onBack }: TeacherCourseDetailsProps) {
    const courseId = course.id?.toString() ?? course.name;
    const {
        getCourseData,
        addLectureFile, removeLectureFile,
        addPracticeBook, removePracticeBook,
        addYouTubeLink, removeYouTubeLink,
        addPracticeTask, removePracticeTask,
        addSROTask, removeSROTask,
        sendChatMessage,
    } = useAppData();

    const courseData = getCourseData(courseId);
    const { lectureFiles, practiceBooks, youtubeLinks, practiceTasks, sroTasks, chatMessages } = courseData;

    const [activeTab, setActiveTab] = useState<Tab>('lecture');

    // Lecture upload form
    const lectureInputRef = useRef<HTMLInputElement>(null);
    const [pendingLectureFile, setPendingLectureFile] = useState<File | null>(null);
    const [showLectureForm, setShowLectureForm] = useState(false);
    const [lectureForm, setLectureForm] = useState({ title: '', description: '' });

    // Chat attachments
    const chatFileRef = useRef<HTMLInputElement>(null);
    const chatImageRef = useRef<HTMLInputElement>(null);
    const [chatInput, setChatInput] = useState('');
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // Practice book upload
    const practiceBookRef = useRef<HTMLInputElement>(null);

    // Forms
    const [ytForm, setYtForm] = useState({ title: '', url: '' });
    const [showYtForm, setShowYtForm] = useState(false);
    const [practiceTaskForm, setPracticeTaskForm] = useState({ title: '', description: '' });
    const [showPracticeTaskForm, setShowPracticeTaskForm] = useState(false);
    const [sroForm, setSroForm] = useState({ title: '', description: '', deadline: '', maxScore: '100' });
    const [showSroForm, setShowSroForm] = useState(false);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // --- Helpers ---
    const fmtSize = (file: File) =>
        file.size > 1_000_000 ? `${(file.size / 1_000_000).toFixed(1)} МБ` : `${(file.size / 1_000).toFixed(0)} КБ`;
    const fmtDate = () =>
        new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

    const handleLectureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingLectureFile(file);
        setLectureForm({ title: file.name.replace(/\.[^.]+$/, ''), description: '' });
        setShowLectureForm(true);
        e.target.value = '';
    };

    const confirmLectureUpload = () => {
        if (!pendingLectureFile || !lectureForm.title.trim()) return;
        addLectureFile(courseId, {
            id: crypto.randomUUID(),
            name: pendingLectureFile.name,
            size: fmtSize(pendingLectureFile),
            uploadedAt: fmtDate(),
            title: lectureForm.title.trim(),
            description: lectureForm.description.trim(),
        });
        setPendingLectureFile(null);
        setLectureForm({ title: '', description: '' });
        setShowLectureForm(false);
    };

    const handleBookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        Array.from(e.target.files || []).forEach(file => {
            addPracticeBook(courseId, {
                id: crypto.randomUUID(),
                name: file.name,
                size: fmtSize(file),
                uploadedAt: fmtDate(),
            });
        });
        e.target.value = '';
    };

    const handleAddYouTubeLink = () => {
        if (!ytForm.title.trim() || !ytForm.url.trim()) return;
        const url = ytForm.url.includes('youtu') ? ytForm.url : `https://youtube.com/watch?v=${ytForm.url}`;
        addYouTubeLink(courseId, { id: crypto.randomUUID(), title: ytForm.title, url });
        setYtForm({ title: '', url: '' });
        setShowYtForm(false);
    };

    const handleAddPracticeTask = () => {
        if (!practiceTaskForm.title.trim()) return;
        addPracticeTask(courseId, {
            id: crypto.randomUUID(),
            ...practiceTaskForm,
            addedAt: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' }),
        });
        setPracticeTaskForm({ title: '', description: '' });
        setShowPracticeTaskForm(false);
    };

    const handleAddSROTask = () => {
        if (!sroForm.title.trim() || !sroForm.deadline) return;
        addSROTask(courseId, {
            id: crypto.randomUUID(),
            title: sroForm.title,
            description: sroForm.description,
            deadline: sroForm.deadline,
            maxScore: Number(sroForm.maxScore) || 100,
        });
        setSroForm({ title: '', description: '', deadline: '', maxScore: '100' });
        setShowSroForm(false);
    };

    const sendChat = () => {
        if (!chatInput.trim()) return;
        sendChatMessage(courseId, {
            author: 'Преподаватель',
            authorRole: 'teacher',
            text: chatInput.trim(),
        });
        setChatInput('');
    };

    const getYtId = (url: string) => {
        const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
        return m?.[1] ?? null;
    };


    return (
        <div className="legacy-theme-screen min-h-screen bg-slate-50 dark:bg-[#0f1115] transition-colors duration-200">
            {/* Top bar */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#151821]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Назад к курсам
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                <div>
                    <h1 className="font-extrabold text-slate-800 dark:text-white text-lg leading-tight">{course.name}</h1>
                    {course.semester && (
                        <p className="text-xs text-slate-400 font-medium">{course.semester}</p>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white dark:bg-[#151821] p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-fit">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="teacher-tab-pill"
                                        className="absolute inset-0 rounded-xl bg-indigo-600"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.shortLabel}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {/* ---- LECTURE TAB ---- */}
                    {activeTab === 'lecture' && (
                        <motion.div key="lecture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Конспекты лекций</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Загружайте конспекты, слайды и другие материалы лекций</p>
                                </div>
                                <button
                                    onClick={() => lectureInputRef.current?.click()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
                                >
                                    <Upload className="w-4 h-4" /> Загрузить файл
                                </button>
                                <input ref={lectureInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="hidden" onChange={handleLectureUpload} />
                            </div>

                            {/* Upload form — shown after picking file */}
                            <AnimatePresence>
                                {showLectureForm && pendingLectureFile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="p-6 bg-white dark:bg-[#151821] rounded-2xl border border-indigo-200 dark:border-indigo-500/30 space-y-4"
                                    >
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate">{pendingLectureFile.name}</p>
                                                <p className="text-xs text-slate-400">{pendingLectureFile.size > 1_000_000 ? `${(pendingLectureFile.size / 1_000_000).toFixed(1)} МБ` : `${(pendingLectureFile.size / 1000).toFixed(0)} КБ`}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Название *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Например: Лекция 1 — Введение в SQL"
                                                    value={lectureForm.title}
                                                    onChange={e => setLectureForm(p => ({ ...p, title: e.target.value }))}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Описание</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Краткое описание содержания лекции (необязательно)"
                                                    value={lectureForm.description}
                                                    onChange={e => setLectureForm(p => ({ ...p, description: e.target.value }))}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={() => { setShowLectureForm(false); setPendingLectureFile(null); setLectureForm({ title: '', description: '' }); }}
                                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
                                            >
                                                <X className="w-4 h-4" /> Отмена
                                            </button>
                                            <button
                                                onClick={confirmLectureUpload}
                                                disabled={!lectureForm.title.trim()}
                                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                                            >
                                                <Upload className="w-4 h-4" /> Загрузить
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {lectureFiles.length === 0 && !showLectureForm ? (
                                <div
                                    onClick={() => lectureInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                        <Upload className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Перетащите файлы или нажмите для загрузки</h3>
                                    <p className="text-sm text-slate-400 dark:text-slate-500">PDF, DOCX, PPTX, TXT — до 50 МБ</p>
                                </div>
                            ) : lectureFiles.length > 0 ? (
                                <div className="space-y-3">
                                    {lectureFiles.map(f => (
                                        <div key={f.id} className="flex items-start gap-4 p-4 bg-white dark:bg-[#151821] rounded-xl border border-slate-200 dark:border-slate-700 group">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <FileText className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{f.title || f.name}</p>
                                                {f.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{f.description}</p>}
                                                <p className="text-xs text-slate-400 mt-1">{f.name} · {f.size} · {f.uploadedAt}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                                                    <CheckCircle2 className="w-3 h-3" /> Загружено
                                                </span>
                                                <button onClick={() => removeLectureFile(courseId, f.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => lectureInputRef.current?.click()}
                                        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Добавить еще файл
                                    </button>
                                </div>
                            ) : null}
                        </motion.div>
                    )}

                    {/* ---- PRACTICE TAB ---- */}
                    {activeTab === 'practice' && (
                        <motion.div key="practice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

                                {/* Left: main content */}
                                <div className="space-y-10">

                                    {/* Books */}
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Книги и учебники</h2>
                                            <button onClick={() => practiceBookRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-100 dark:border-indigo-500/20">
                                                <Upload className="w-4 h-4" /> Загрузить
                                            </button>
                                            <input ref={practiceBookRef} type="file" accept=".pdf,.epub,.fb2,.doc,.docx" multiple className="hidden" onChange={handleBookUpload} />
                                        </div>
                                        {practiceBooks.length === 0 ? (
                                            <div onClick={() => practiceBookRef.current?.click()} className="flex items-center gap-4 py-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-6 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors text-slate-400 dark:text-slate-500">
                                                <FileText className="w-8 h-8 shrink-0" />
                                                <p className="text-sm font-medium">Нет загруженных книг. Нажмите, чтобы добавить PDF, EPUB или DOCX.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {practiceBooks.map(f => (
                                                    <div key={f.id} className="flex items-center gap-4 p-3 bg-white dark:bg-[#151821] rounded-xl border border-slate-200 dark:border-slate-700 group">
                                                        <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-amber-500" /></div>
                                                        <div className="flex-1 min-w-0"><p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{f.name}</p><p className="text-xs text-slate-400">{f.size}</p></div>
                                                        <button onClick={() => removePracticeBook(courseId, f.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    {/* YouTube */}
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2"><Youtube className="w-5 h-5 text-rose-500" /> Видеоуроки YouTube</h2>
                                            <button onClick={() => setShowYtForm(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-rose-100 dark:border-rose-500/20">
                                                <Plus className="w-4 h-4" /> Добавить ссылку
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {showYtForm && (
                                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-5 bg-white dark:bg-[#151821] rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                                                    <input type="text" placeholder="Название видео" value={ytForm.title} onChange={e => setYtForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition" />
                                                    <input type="url" placeholder="Ссылка YouTube (https://youtube.com/...)" value={ytForm.url} onChange={e => setYtForm(p => ({ ...p, url: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition" />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setShowYtForm(false); setYtForm({ title: '', url: '' }); }} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"><X className="w-4 h-4" /></button>
                                                        <button onClick={handleAddYouTubeLink} className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"><Link className="w-4 h-4" />Добавить</button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {youtubeLinks.length === 0 && !showYtForm ? (
                                            <div className="flex items-center gap-4 py-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-6 text-slate-400 dark:text-slate-500">
                                                <Youtube className="w-8 h-8 shrink-0" />
                                                <p className="text-sm font-medium">Нет добавленных видеоуроков. Нажмите «Добавить ссылку».</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {youtubeLinks.map(link => {
                                                    const ytId = getYtId(link.url);
                                                    return (
                                                        <div key={link.id} className="flex items-center gap-4 p-3 bg-white dark:bg-[#151821] rounded-xl border border-slate-200 dark:border-slate-700 group">
                                                            {ytId ? (
                                                                <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" className="w-24 h-14 rounded-lg object-cover shrink-0" />
                                                            ) : (
                                                                <div className="w-24 h-14 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0"><Youtube className="w-6 h-6 text-rose-400" /></div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{link.title}</p>
                                                                <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline truncate block">{link.url}</a>
                                                            </div>
                                                            <button onClick={() => removeYouTubeLink(courseId, link.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </section>

                                    {/* Practice Tasks */}
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2"><Wrench className="w-5 h-5 text-indigo-500" /> Задания на занятие</h2>
                                            <button onClick={() => setShowPracticeTaskForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-100 dark:border-indigo-500/20">
                                                <Plus className="w-4 h-4" /> Добавить задание
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {showPracticeTaskForm && (
                                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-5 bg-white dark:bg-[#151821] rounded-2xl border border-indigo-200 dark:border-indigo-500/30 space-y-3">
                                                    <input type="text" placeholder="Название задания" value={practiceTaskForm.title} onChange={e => setPracticeTaskForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition" />
                                                    <textarea rows={3} placeholder="Описание задания (необязательно)" value={practiceTaskForm.description} onChange={e => setPracticeTaskForm(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition resize-none" />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setShowPracticeTaskForm(false); setPracticeTaskForm({ title: '', description: '' }); }} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"><X className="w-4 h-4" /></button>
                                                        <button onClick={handleAddPracticeTask} className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Добавить</button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {practiceTasks.length === 0 && !showPracticeTaskForm ? (
                                            <div className="flex items-center gap-4 py-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl px-6 text-slate-400 dark:text-slate-500">
                                                <ClipboardList className="w-8 h-8 shrink-0" />
                                                <p className="text-sm font-medium">Нет заданий на занятие. Нажмите «Добавить задание».</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {practiceTasks.map((t, idx) => (
                                                    <div key={t.id} className="flex items-start gap-4 p-4 bg-white dark:bg-[#151821] rounded-xl border border-slate-200 dark:border-slate-700 group">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{idx + 1}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{t.title}</p>
                                                            {t.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{t.description}</p>}
                                                            <p className="text-xs text-slate-400 mt-1.5">{t.addedAt}</p>
                                                        </div>
                                                        <button onClick={() => removePracticeTask(courseId, t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </div>

                                {/* Right: Chat Sidebar — same as student view */}
                                <div className="w-full lg:w-[350px] shrink-0 sticky top-20">
                                    <div className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
                                        {/* Header */}
                                        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3 shrink-0">
                                            <MessageSquare className="w-5 h-5 text-indigo-500" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Общий чат курса</h3>
                                            <span className="ml-auto text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">{chatMessages.length}</span>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {chatMessages.length === 0 ? (
                                                <div className="text-center text-sm text-gray-400 py-10 flex flex-col items-center justify-center h-full">
                                                    <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                                    Сообщений пока нет. Напишите первым!
                                                </div>
                                            ) : (
                                                chatMessages.map(msg => {
                                                    const isMe = msg.authorRole === 'teacher';
                                                    return (
                                                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold text-white ${isMe ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                                                                {msg.author.charAt(0)}
                                                            </div>
                                                            <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                    {isMe ? 'Вы' : msg.author} <span className="text-[10px] ml-1 opacity-70">{msg.time}</span>
                                                                </p>
                                                                <div className={`p-3 rounded-2xl text-sm inline-block text-left ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                                                                    {msg.text}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                            <div ref={chatBottomRef} />
                                        </div>

                                        {/* Input */}
                                        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1e24] shrink-0">
                                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
                                                {/* Attach file */}
                                                <button
                                                    onClick={() => chatFileRef.current?.click()}
                                                    title="Прикрепить файл"
                                                    className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors shrink-0 p-1"
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                </button>
                                                {/* Attach image */}
                                                <button
                                                    onClick={() => chatImageRef.current?.click()}
                                                    title="Прикрепить изображение"
                                                    className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors shrink-0 p-1"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </button>
                                                <input ref={chatFileRef} type="file" className="hidden" />
                                                <input ref={chatImageRef} type="file" accept="image/*" className="hidden" />
                                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={chatInput}
                                                    onChange={e => setChatInput(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                                                    placeholder="Напишите сообщение..."
                                                    className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder-gray-500"
                                                />
                                                <button
                                                    onClick={sendChat}
                                                    className="text-white bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded-full transition-colors shrink-0"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ---- SRO TAB ---- */}
                    {activeTab === 'sro' && (
                        <motion.div key="sro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Самостоятельная работа (СРО)</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Выдавайте домашние задания с дедлайном</p>
                                </div>
                                <button onClick={() => setShowSroForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                                    <Plus className="w-4 h-4" /> Выдать задание
                                </button>
                            </div>

                            <AnimatePresence>
                                {showSroForm && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-6 bg-white dark:bg-[#151821] rounded-2xl border border-indigo-200 dark:border-indigo-500/30 space-y-4">
                                        <h3 className="font-extrabold text-slate-800 dark:text-white">Новое задание СРО</h3>
                                        <input type="text" placeholder="Название задания *" value={sroForm.title} onChange={e => setSroForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition" />
                                        <textarea rows={4} placeholder="Описание задания..." value={sroForm.description} onChange={e => setSroForm(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition resize-none" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Дедлайн *</label>
                                                <input type="datetime-local" value={sroForm.deadline} onChange={e => setSroForm(p => ({ ...p, deadline: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Макс. балл</label>
                                                <input type="number" min={1} max={200} value={sroForm.maxScore} onChange={e => setSroForm(p => ({ ...p, maxScore: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => { setShowSroForm(false); setSroForm({ title: '', description: '', deadline: '', maxScore: '100' }); }} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"><X className="w-4 h-4" /> Отмена</button>
                                            <button onClick={handleAddSROTask} disabled={!sroForm.title.trim() || !sroForm.deadline} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Выдать задание</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {sroTasks.length === 0 && !showSroForm ? (
                                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
                                        <ClipboardList className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Нет выданных заданий СРО</h3>
                                    <p className="text-sm text-slate-400 dark:text-slate-500">Нажмите «Выдать задание», чтобы создать первое СРО для студентов</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sroTasks.map((task, idx) => {
                                        const deadlineDate = new Date(task.deadline);
                                        const isOverdue = deadlineDate < new Date();
                                        return (
                                            <div key={task.id} className="p-6 bg-white dark:bg-[#151821] rounded-2xl border border-slate-200 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                            <span className="font-black text-indigo-600 dark:text-indigo-400">{idx + 1}</span>
                                                        </div>
                                                        <h3 className="font-extrabold text-slate-800 dark:text-white">{task.title}</h3>
                                                    </div>
                                                    <button onClick={() => removeSROTask(courseId, task.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed ml-12">{task.description}</p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-3 mt-4 ml-12">
                                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${isOverdue ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'}`}>
                                                        <Calendar className="w-3 h-3" />
                                                        Дедлайн: {deadlineDate.toLocaleString('ru-RU', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20">
                                                        <Clock className="w-3 h-3" />
                                                        Макс. балл: {task.maxScore}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}
