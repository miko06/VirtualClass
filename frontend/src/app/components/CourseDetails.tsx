import React, { useState } from 'react';
import {
    ArrowLeft, BookOpen, FileText, CheckSquare, MessageSquare,
    Video, Download, Upload, Clock, UserIcon, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ClassItem } from '../../api/client';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';

interface CourseDetailsProps {
    course: ClassItem;
    onBack: () => void;
}

type TabType = 'lectures' | 'practice' | 'sro';

// Empty Data
const MOCK_LECTURES: any[] = [];
const MOCK_PRACTICES: any[] = [];
const MOCK_SRO: any[] = [];
const MOCK_CHAT: any[] = [];

export function CourseDetails({ course, onBack }: CourseDetailsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('lectures');
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const [uploadedIds, setUploadedIds] = useState<Set<number>>(new Set());

    const handleUpload = (id: number) => {
        setUploadingId(id);
        setTimeout(() => {
            setUploadingId(null);
            setUploadedIds(prev => new Set(prev).add(id));
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
                                    {MOCK_LECTURES.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#1c1e24]/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-center">
                                            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                                                <BookOpen className="w-8 h-8 text-indigo-300 dark:text-indigo-500/50" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Нет лекций</h3>
                                            <p className="text-sm text-gray-500">Преподаватель пока не загрузил материалы для этого курса.</p>
                                        </div>
                                    ) : (
                                        MOCK_LECTURES.map(lecture => (
                                            <div key={lecture.id} className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded">
                                                                Тема {lecture.id}
                                                            </span>
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lecture.title}</h3>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{lecture.content}</p>
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {lecture.date} ({lecture.duration})
                                                            </span>
                                                            {lecture.hasPdf && (
                                                                <button className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-400 px-3 py-1.5 rounded-lg transition-colors">
                                                                    <FileText className="w-3.5 h-3.5" />
                                                                    Презентация.pdf
                                                                </button>
                                                            )}
                                                            {lecture.hasVideo && (
                                                                <button className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 dark:text-indigo-400 px-3 py-1.5 rounded-lg transition-colors">
                                                                    <Video className="w-3.5 h-3.5" />
                                                                    Запись лекции
                                                                </button>
                                                            )}
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
                                    {/* Left Column: Practice tasks */}
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Практические задания и ресурсы</h2>
                                        {MOCK_PRACTICES.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#1c1e24]/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-center h-[500px]">
                                                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                                                    <FileText className="w-8 h-8 text-indigo-300 dark:text-indigo-500/50" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Нет практики</h3>
                                                <p className="text-sm text-gray-500">Практических заданий пока нет.</p>
                                            </div>
                                        ) : (
                                            MOCK_PRACTICES.map(practice => (
                                                <div key={practice.id} className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-4">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                              ${practice.type === 'task' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                                                    practice.type === 'video' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                                                                        'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'}
                            `}>
                                                                {practice.type === 'task' ? <CheckSquare className="w-5 h-5" /> :
                                                                    practice.type === 'video' ? <Video className="w-5 h-5" /> :
                                                                        <BookOpen className="w-5 h-5" />}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-base font-bold text-gray-900 dark:text-white">{practice.title}</h3>
                                                                {practice.info && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{practice.info}</p>}
                                                                {practice.deadline && (
                                                                    <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                                                                        <Clock className="w-3.5 h-3.5" /> До {practice.deadline}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {practice.type === 'task' && (
                                                            <div className="flex flex-col items-end gap-2">
                                                                {practice.status === 'submitted' || uploadedIds.has(`prac_${practice.id}` as any) ? (
                                                                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                                        <FileCheck className="w-4 h-4" /> Сдано
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUpload(`prac_${practice.id}` as any)}
                                                                        disabled={uploadingId === `prac_${practice.id}` as any}
                                                                        className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                                                    >
                                                                        {uploadingId === `prac_${practice.id}` as any ? (
                                                                            <span className="animate-pulse">Отправка...</span>
                                                                        ) : (
                                                                            <><Upload className="w-4 h-4" /> Отправить</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                                {practice.score && (
                                                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                                        Оценка: {practice.score}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {practice.type !== 'task' && (
                                                            <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 px-4 py-2 rounded-lg transition-colors">
                                                                <Download className="w-4 h-4" /> Открыть
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Right Column: Chat (Teams Style) */}
                                    <div className="w-full lg:w-[350px] shrink-0">
                                        <div className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
                                            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
                                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                                <h3 className="font-bold text-gray-900 dark:text-white">Общий чат курса</h3>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end min-h-0">
                                                {MOCK_CHAT.length === 0 ? (
                                                    <div className="text-center text-sm text-gray-400 py-10 flex-1 flex flex-col items-center justify-center">
                                                        <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                                        Сообщений пока нет. Напишите первым!
                                                    </div>
                                                ) : (
                                                    MOCK_CHAT.map(msg => (
                                                        <div key={msg.id} className={`flex gap-3 ${msg.isTeacher ? '' : 'flex-row-reverse'}`}>
                                                            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold text-white
                              ${msg.isTeacher ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                                                                {msg.sender[0]}
                                                            </div>
                                                            <div className={`max-w-[75%] ${msg.isTeacher ? '' : 'text-right'}`}>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                    {msg.sender} <span className="text-[10px] ml-1 opacity-70">{msg.time}</span>
                                                                </p>
                                                                <div className={`p-3 rounded-2xl text-sm inline-block text-left
                                ${msg.isTeacher
                                                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                                                                        : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                                                                    {msg.text}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1e24]">
                                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Новое сообщение..."
                                                        className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder-gray-500"
                                                    />
                                                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-full">
                                                        <ArrowLeft className="w-4 h-4 rotate-180" />
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

                                    {MOCK_SRO.length === 0 ? (
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
                                            {MOCK_SRO.map(sro => {
                                                const isDone = sro.status === 'submitted' || uploadedIds.has(`sro_${sro.id}` as any);
                                                return (
                                                    <div key={sro.id} className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors flex flex-col">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className={`text-xs font-bold px-2 py-1 rounded border
                              ${isDone
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                                                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'}`}>
                                                                {isDone ? 'Завершено' : 'Ожидает выполнения'}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Дедлайн: {sro.deadline}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{sro.title}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">{sro.description}</p>

                                                        {isDone ? (
                                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    <FileCheck className="w-5 h-5 text-emerald-500" />
                                                                    Работа отправлена на проверку
                                                                </div>
                                                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Изменить</button>
                                                            </div>
                                                        ) : (
                                                            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center bg-gray-50/50 dark:bg-gray-800/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer"
                                                                onClick={() => handleUpload(`sro_${sro.id}` as any)}>
                                                                {uploadingId === `sro_${sro.id}` as any ? (
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
