/**
 * AppDataContext – shared persistent state between teacher and student panels.
 * All data is synced to localStorage so it survives page refreshes.
 */
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LectureFile {
    id: string;
    name: string;
    size: string;
    uploadedAt: string;
    title: string;
    description: string;
}

export interface YouTubeLink {
    id: string;
    title: string;
    url: string;
}

export interface PracticeBook {
    id: string;
    name: string;
    size: string;
    uploadedAt: string;
}

export interface PracticeTask {
    id: string;
    title: string;
    description: string;
    addedAt: string;
}

export interface SROTask {
    id: string;
    title: string;
    description: string;
    deadline: string;
    maxScore: number;
}

export interface ChatMessage {
    id: string;
    author: string;
    authorRole: 'teacher' | 'student';
    text: string;
    time: string;
    attachmentName?: string;
}

export interface StudentSubmission {
    id: string;
    studentId: string;
    studentName: string;
    type: 'practice' | 'sro'; // Whether it's a practice task or SRO task
    taskId: string;           // ID of the task
    taskTitle: string;
    submittedAt: string;
    status: 'pending' | 'graded';
    score: number | null;
    maxScore: number;
    aiSuggestion?: string | null;
}

export interface CourseData {
    lectureFiles: LectureFile[];
    practiceBooks: PracticeBook[];
    youtubeLinks: YouTubeLink[];
    practiceTasks: PracticeTask[];
    sroTasks: SROTask[];
    chatMessages: ChatMessage[];
    submissions: StudentSubmission[];
}

type AppData = Record<string, CourseData>; // keyed by courseId (string)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LS_KEY = 'vc_app_data_v1';

function loadFromLS(): AppData {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveToLS(data: AppData) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
        // storage quota exceeded — ignore
    }
}

function emptyCourse(): CourseData {
    return {
        lectureFiles: [],
        practiceBooks: [],
        youtubeLinks: [],
        practiceTasks: [],
        sroTasks: [],
        chatMessages: [],
        submissions: [],
    };
}

function getOrCreate(data: AppData, courseId: string): CourseData {
    return data[courseId] ?? emptyCourse();
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppDataContextValue {
    // Course content (teacher writes → student reads)
    getCourseData: (courseId: string) => CourseData;

    // Lecture files
    addLectureFile: (courseId: string, file: LectureFile) => void;
    removeLectureFile: (courseId: string, fileId: string) => void;

    // Practice books
    addPracticeBook: (courseId: string, book: PracticeBook) => void;
    removePracticeBook: (courseId: string, bookId: string) => void;

    // YouTube links
    addYouTubeLink: (courseId: string, link: YouTubeLink) => void;
    removeYouTubeLink: (courseId: string, linkId: string) => void;

    // Practice tasks
    addPracticeTask: (courseId: string, task: PracticeTask) => void;
    removePracticeTask: (courseId: string, taskId: string) => void;

    // SRO tasks
    addSROTask: (courseId: string, task: SROTask) => void;
    removeSROTask: (courseId: string, taskId: string) => void;

    // Chat (shared between teacher and student)
    sendChatMessage: (courseId: string, msg: Omit<ChatMessage, 'id' | 'time'>) => void;

    // Submissions
    addSubmission: (courseId: string, submission: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status' | 'score' | 'aiSuggestion'>) => void;
    gradeSubmission: (courseId: string, submissionId: string, score: number, aiSuggestion?: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppDataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppData>(loadFromLS);

    // Persist every change to localStorage
    useEffect(() => {
        saveToLS(data);
    }, [data]);

    // Generic updater for a single course
    const updateCourse = useCallback((courseId: string, updater: (c: CourseData) => CourseData) => {
        setData(prev => {
            const course = getOrCreate(prev, courseId);
            return { ...prev, [courseId]: updater(course) };
        });
    }, []);

    const getCourseData = useCallback((courseId: string): CourseData => {
        return data[courseId] ?? emptyCourse();
    }, [data]);

    // ── Lecture files ──
    const addLectureFile = useCallback((courseId: string, file: LectureFile) => {
        updateCourse(courseId, c => ({ ...c, lectureFiles: [...c.lectureFiles, file] }));
    }, [updateCourse]);

    const removeLectureFile = useCallback((courseId: string, fileId: string) => {
        updateCourse(courseId, c => ({ ...c, lectureFiles: c.lectureFiles.filter(f => f.id !== fileId) }));
    }, [updateCourse]);

    // ── Practice books ──
    const addPracticeBook = useCallback((courseId: string, book: PracticeBook) => {
        updateCourse(courseId, c => ({ ...c, practiceBooks: [...c.practiceBooks, book] }));
    }, [updateCourse]);

    const removePracticeBook = useCallback((courseId: string, bookId: string) => {
        updateCourse(courseId, c => ({ ...c, practiceBooks: c.practiceBooks.filter(b => b.id !== bookId) }));
    }, [updateCourse]);

    // ── YouTube links ──
    const addYouTubeLink = useCallback((courseId: string, link: YouTubeLink) => {
        updateCourse(courseId, c => ({ ...c, youtubeLinks: [...c.youtubeLinks, link] }));
    }, [updateCourse]);

    const removeYouTubeLink = useCallback((courseId: string, linkId: string) => {
        updateCourse(courseId, c => ({ ...c, youtubeLinks: c.youtubeLinks.filter(l => l.id !== linkId) }));
    }, [updateCourse]);

    // ── Practice tasks ──
    const addPracticeTask = useCallback((courseId: string, task: PracticeTask) => {
        updateCourse(courseId, c => ({ ...c, practiceTasks: [...c.practiceTasks, task] }));
    }, [updateCourse]);

    const removePracticeTask = useCallback((courseId: string, taskId: string) => {
        updateCourse(courseId, c => ({ ...c, practiceTasks: c.practiceTasks.filter(t => t.id !== taskId) }));
    }, [updateCourse]);

    // ── SRO tasks ──
    const addSROTask = useCallback((courseId: string, task: SROTask) => {
        updateCourse(courseId, c => ({ ...c, sroTasks: [...c.sroTasks, task] }));
    }, [updateCourse]);

    const removeSROTask = useCallback((courseId: string, taskId: string) => {
        updateCourse(courseId, c => ({ ...c, sroTasks: c.sroTasks.filter(t => t.id !== taskId) }));
    }, [updateCourse]);

    // ── Chat ──
    const sendChatMessage = useCallback((courseId: string, msg: Omit<ChatMessage, 'id' | 'time'>) => {
        updateCourse(courseId, c => ({
            ...c,
            chatMessages: [
                ...c.chatMessages,
                {
                    ...msg,
                    id: crypto.randomUUID(),
                    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                },
            ],
        }));
    }, [updateCourse]);

    // ── Submissions ──
    const addSubmission = useCallback((courseId: string, submission: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status' | 'score' | 'aiSuggestion'>) => {
        updateCourse(courseId, c => {
            const newSubmission: StudentSubmission = {
                ...submission,
                id: crypto.randomUUID(),
                submittedAt: new Date().toLocaleString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                status: 'pending',
                score: null,
            };
            return { ...c, submissions: [...(c.submissions || []), newSubmission] };
        });
    }, [updateCourse]);

    const gradeSubmission = useCallback((courseId: string, submissionId: string, score: number, aiSuggestion?: string) => {
        updateCourse(courseId, c => ({
            ...c,
            submissions: (c.submissions || []).map(sub =>
                sub.id === submissionId
                    ? { ...sub, status: 'graded' as const, score, aiSuggestion: aiSuggestion ?? null }
                    : sub
            ),
        }));
    }, [updateCourse]);

    return (
        <AppDataContext.Provider value={{
            getCourseData,
            addLectureFile, removeLectureFile,
            addPracticeBook, removePracticeBook,
            addYouTubeLink, removeYouTubeLink,
            addPracticeTask, removePracticeTask,
            addSROTask, removeSROTask,
            sendChatMessage,
            addSubmission, gradeSubmission,
        }}>
            {children}
        </AppDataContext.Provider>
    );
}

export function useAppData() {
    const ctx = useContext(AppDataContext);
    if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
    return ctx;
}
