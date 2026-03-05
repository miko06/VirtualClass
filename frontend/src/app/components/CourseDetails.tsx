import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft, BookOpen, FileText, CheckSquare, MessageSquare,
    Video, Download, Upload, Clock, UserIcon, FileCheck, Send,
    Youtube, Paperclip, Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ClassItem, User } from '../../api/client';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useAppData } from '../contexts/AppDataContext';

interface CourseDetailsProps {
    course: ClassItem;
    onBack: () => void;
    currentUser?: User | null;
}

type TabType = 'lectures' | 'practice' | 'sro';

export function CourseDetails({ course, onBack, currentUser }: CourseDetailsProps) {
    const courseId = course.id?.toString() ?? course.name;
    const { getCourseData, sendChatMessage, addSubmission } = useAppData();
    const courseData = getCourseData(courseId);
    const lectureFiles = courseData?.lectureFiles ?? [];
    const practiceBooks = courseData?.practiceBooks ?? [];
    const youtubeLinks = courseData?.youtubeLinks ?? [];
    const practiceTasks = courseData?.practiceTasks ?? [];
    const sroTasks = courseData?.sroTasks ?? [];
    const chatMessages = courseData?.chatMessages ?? [];

    const [activeTab, setActiveTab] = useState<TabType>('lectures');
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [uploadedIds, setUploadedIds] = useState<Set<string>>(new Set());

    // Chat
    const [chatInput, setChatInput] = useState('');
    const chatBottomRef = useRef<HTMLDivElement>(null);
    const chatFileRef = useRef<HTMLInputElement>(null);
    const chatImageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        sendChatMessage(courseId, {
            author: 'Студент',
            authorRole: 'student',
            text: chatInput.trim(),
        });
        setChatInput('');
    };

    const getYtId = (url: string) => {
        const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
        return m?.[1] ?? null;
    };


    const handleUploadPractice = (task: typeof practiceTasks[0]) => {
        const taskKey = `prac_${task.id}`;
        setUploadingId(taskKey);
        setTimeout(() => {
            try {
                setUploadingId(null);
                setUploadedIds(prev => new Set(prev).add(taskKey));
                addSubmission(courseId, {
                    studentId: currentUser?.id?.toString() || localStorage.getItem('currentUserId') || 'student_1',
                    studentName: currentUser?.name || 'Студент',
                    type: 'practice',
                    taskId: task.id,
                    taskTitle: task.title,
                    maxScore: 100
                });
            } catch (e) {
                console.error('[CourseDetails] Error submitting practice:', e);
            }
        }, 1500);
    };

    const handleUploadSRO = (task: typeof sroTasks[0]) => {
        const sroKey = `sro_${task.id}`;
        setUploadingId(sroKey);
        setTimeout(() => {
            try {
                setUploadingId(null);
                setUploadedIds(prev => new Set(prev).add(sroKey));
                addSubmission(courseId, {
                    studentId: currentUser?.id?.toString() || localStorage.getItem('currentUserId') || 'student_1',
                    studentName: currentUser?.name || 'Студент',
                    type: 'sro',
                    taskId: task.id,
                    taskTitle: task.title,
                    maxScore: task.maxScore || 100
                });
            } catch (e) {
                console.error('[CourseDetails] Error submitting SRO:', e);
            }
        }, 1500);
    };

    const tabs = [
        { id: 'lectures', label: 'ЛЕКЦИИ', icon: BookOpen },
        { id: 'practice', label: 'ПРАКТИКА', icon: FileText },
        { id: 'sro', label: 'СРО', icon: CheckSquare },
    ] as const;

    return (
        <div className="legacy-theme-screen min-h-screen relative bg-gray-50 dark:bg-[#0f1115] transition-colors duration-200">
            <ThemeSquaresBackground />

            <div className="relative z-10 flex flex-col h-screen">
                {/* Header Ribbon (MS Teams style) */}
                <div className="bg-indigo-700 dark:bg-[#1a1c23] text-white shadow-md relative z-20 shrink-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/30 dark:bg-indigo-500/20 flex items-center justify-center font-bold text-lg border border-indigo-400/30">
                                    {course.name[0]}
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold leading-tight line-clamp-1">{course.name}</h1>
                                    <p className="text-xs text-indigo-200 font-medium">
                                        Преподаватель: {course.teacher?.name || 'Не указан'} • {course.semester ?? 'Текущий семестр'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="hidden md:flex items-end h-full pt-2">
                            <div className="flex space-x-1 border-b-2 border-transparent">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative
                        ${isActive
                                                    ? 'text-white'
                                                    : 'text-indigo-200 hover:text-white hover:bg-white/5'}
                      `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {tab.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabIndicator"
                                                    className="absolute bottom-0 left-0 right-0 h-1 bg-white dark:bg-indigo-400 rounded-t-full"
                                                    initial={false}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden bg-indigo-800 dark:bg-[#1a1c23] flex border-t border-indigo-600/50 dark:border-gray-800 shrink-0">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-semibold gap-1 transition-colors relative
                  ${isActive ? 'text-white' : 'text-indigo-300 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                                {tab.label}
                                {isActive && (
                                    <motion.div layoutId="mobileIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 overflow-y-auto w-full pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                        <AnimatePresence mode="popLayout">

                            {/* === ЛЕКЦИИ === */}
                            {activeTab === 'lectures' && (
                                <motion.div
                                    key="lectures"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Конспекты и материалы лекций</h2>
                                    {lectureFiles.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#1c1e24]/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-center">
                                            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                                                <BookOpen className="w-8 h-8 text-indigo-300 dark:text-indigo-500/50" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Нет лекций</h3>
                                            <p className="text-sm text-gray-500">Преподаватель пока не загрузил материалы для этого курса.</p>
                                        </div>
                                    ) : (
                                        lectureFiles.map((lf, idx) => (
                                            <div key={lf.id} className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded">
                                                                Лекция {idx + 1}
                                                            </span>
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lf.title || lf.name}</h3>
                                                        </div>
                                                        {lf.description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{lf.description}</p>}
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {lf.uploadedAt} · {lf.size}
                                                            </span>
                                                            <a href="#" className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-400 px-3 py-1.5 rounded-lg transition-colors">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                {lf.name}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}

                            {/* === ПРАКТИКА === */}
                            {activeTab === 'practice' && (
                                <motion.div
                                    key="practice"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col lg:flex-row gap-6 h-full"
                                >
                                    {/* Left Column: Practice resources and tasks */}
                                    <div className="flex-1 space-y-8">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Практические задания и ресурсы</h2>

                                        {/* Books */}
                                        {practiceBooks.length > 0 && (
                                            <section className="space-y-3">
                                                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-amber-500" /> Книги и учебники
                                                </h3>
                                                {practiceBooks.map(b => (
                                                    <div key={b.id} className="flex items-center gap-4 p-3 bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl">
                                                        <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                                                            <FileText className="w-4 h-4 text-amber-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{b.name}</p>
                                                            <p className="text-xs text-gray-500">{b.size} · {b.uploadedAt}</p>
                                                        </div>
                                                        <a href="#" className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 px-3 py-1.5 rounded-lg transition-colors">
                                                            <Download className="w-3.5 h-3.5" /> Скачать
                                                        </a>
                                                    </div>
                                                ))}
                                            </section>
                                        )}

                                        {/* YouTube */}
                                        {youtubeLinks.length > 0 && (
                                            <section className="space-y-3">
                                                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <Youtube className="w-4 h-4 text-rose-500" /> Видеоуроки
                                                </h3>
                                                {youtubeLinks.map(link => {
                                                    const ytId = getYtId(link.url);
                                                    return (
                                                        <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                                                            className="flex items-center gap-4 p-3 bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-rose-300 dark:hover:border-rose-500/50 group transition-colors">
                                                            {ytId ? (
                                                                <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" className="w-20 h-12 rounded-lg object-cover shrink-0" />
                                                            ) : (
                                                                <div className="w-20 h-12 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                                                                    <Youtube className="w-6 h-6 text-rose-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate transition-colors">{link.title}</p>
                                                                <p className="text-xs text-gray-400 truncate">{link.url}</p>
                                                            </div>
                                                            <Video className="w-4 h-4 text-rose-400 shrink-0" />
                                                        </a>
                                                    );
                                                })}
                                            </section>
                                        )}

                                        {/* Practice tasks */}
                                        {practiceTasks.length > 0 && (
                                            <section className="space-y-3">
                                                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <CheckSquare className="w-4 h-4 text-indigo-500" /> Задания на занятие
                                                </h3>
                                                {practiceTasks.map((t, idx) => {
                                                    const taskKey = `prac_${t.id}`;
                                                    const isDone = uploadedIds.has(taskKey);
                                                    return (
                                                        <div key={t.id} className="flex items-start gap-4 p-4 bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                                                                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{idx + 1}</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{t.title}</p>
                                                                {t.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{t.description}</p>}
                                                                <p className="text-xs text-gray-400 mt-1.5">{t.addedAt}</p>
                                                            </div>
                                                            <div className="shrink-0">
                                                                {isDone ? (
                                                                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                                        <FileCheck className="w-4 h-4" /> Сдано
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUploadPractice(t)}
                                                                        disabled={uploadingId === taskKey}
                                                                        className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                                                    >
                                                                        {uploadingId === taskKey ? <span className="animate-pulse">Отправка...</span> : <><Upload className="w-4 h-4" /> Сдать</>}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </section>
                                        )}

                                        {/* Empty practise state */}
                                        {practiceBooks.length === 0 && youtubeLinks.length === 0 && practiceTasks.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#1c1e24]/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-center">
                                                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                                                    <FileText className="w-8 h-8 text-indigo-300 dark:text-indigo-500/50" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Нет практики</h3>
                                                <p className="text-sm text-gray-500">Практических заданий пока нет.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Shared Chat */}
                                    <div className="w-full lg:w-[350px] shrink-0">
                                        <div className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
                                            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
                                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                                <h3 className="font-bold text-gray-900 dark:text-white">Общий чат курса</h3>
                                                <span className="ml-auto text-xs font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">{chatMessages.length}</span>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col min-h-0">
                                                {chatMessages.length === 0 ? (
                                                    <div className="text-center text-sm text-gray-400 py-10 flex-1 flex flex-col items-center justify-center">
                                                        <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                                        Сообщений пока нет. Напишите первым!
                                                    </div>
                                                ) : (
                                                    chatMessages.map(msg => {
                                                        const isMe = msg.authorRole === 'student';
                                                        return (
                                                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold text-white ${msg.authorRole === 'teacher' ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                                                                    {msg.author.charAt(0)}
                                                                </div>
                                                                <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                        {msg.author} <span className="text-[10px] ml-1 opacity-70">{msg.time}</span>
                                                                    </p>
                                                                    <div className={`p-3 rounded-2xl text-sm inline-block text-left ${isMe ? 'bg-teal-500 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                                                                        {msg.text}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                                <div ref={chatBottomRef} />
                                            </div>

                                            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1e24]">
                                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
                                                    <button onClick={() => chatFileRef.current?.click()} title="Прикрепить файл" className="text-gray-400 hover:text-indigo-500 transition-colors p-1">
                                                        <Paperclip className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => chatImageRef.current?.click()} title="Прикрепить фото" className="text-gray-400 hover:text-indigo-500 transition-colors p-1">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </button>
                                                    <input ref={chatFileRef} type="file" className="hidden" />
                                                    <input ref={chatImageRef} type="file" accept="image/*" className="hidden" />
                                                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={chatInput}
                                                        onChange={e => setChatInput(e.target.value)}
                                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                                        placeholder="Новое сообщение..."
                                                        className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder-gray-500"
                                                    />
                                                    <button onClick={sendMessage} className="text-white bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded-full transition-colors shrink-0">
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === СРО === */}
                            {activeTab === 'sro' && (
                                <motion.div
                                    key="sro"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Самостоятельная работа (СРО)</h2>

                                    {sroTasks.length === 0 ? (
                                        <div className="grid grid-cols-1">
                                            <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#1c1e24]/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-center w-full">
                                                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                                                    <CheckSquare className="w-8 h-8 text-indigo-300 dark:text-indigo-500/50" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Заданий нет</h3>
                                                <p className="text-sm text-gray-500">Задания для самостоятельной работы пока не добавлены.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {sroTasks.map(sro => {
                                                const sroKey = `sro_${sro.id}`;
                                                const isDone = uploadedIds.has(sroKey);
                                                const deadlineDate = sro.deadline ? new Date(sro.deadline) : null;
                                                return (
                                                    <div key={sro.id} className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors flex flex-col">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className={`text-xs font-bold px-2 py-1 rounded border
                                                                ${isDone
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                                                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'}`}>
                                                                {isDone ? 'Завершено' : 'Ожидает выполнения'}
                                                            </span>
                                                            {deadlineDate && (
                                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {deadlineDate.toLocaleString('ru-RU', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{sro.title}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">{sro.description}</p>
                                                        {sro.maxScore && <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4">Макс. балл: {sro.maxScore}</p>}
                                                        {isDone ? (
                                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    <FileCheck className="w-5 h-5 text-emerald-500" />
                                                                    Работа отправлена на проверку
                                                                </div>
                                                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Изменить</button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center bg-gray-50/50 dark:bg-gray-800/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer"
                                                                onClick={() => handleUploadSRO(sro)}
                                                            >
                                                                {uploadingId === sroKey ? (
                                                                    <div className="text-sm font-bold text-indigo-600 animate-pulse flex items-center justify-center gap-2">
                                                                        <Upload className="w-5 h-5" /> Отправка работы...
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Загрузить работу</h4>
                                                                        <p className="text-xs text-gray-500">PDF, DOCX, ZIP (Макс 50MB)</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
