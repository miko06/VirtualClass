import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderOpen,
  FileText,
  FileBadge,
  DownloadCloud,
  CheckCircle2,
  PlayCircle,
  FileArchive,
  FileSpreadsheet,
  ChevronDown,
  BookOpen,
  Sparkles,
  Upload,
} from 'lucide-react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useMaterials, SharedMaterialType } from '../contexts/MaterialsContext';


type MaterialType = 'pdf' | 'video' | 'archive' | 'document' | 'spreadsheet';

interface MockMaterial {
  id: string;
  title: string;
  type: MaterialType;
  size: string;
  uploadDate: string;
  isVerified: boolean;
  url: string;
}

interface CourseMaterials {
  courseId: string;
  courseName: string;
  materials: MockMaterial[];
}

const MOCK_COURSE_MATERIALS: CourseMaterials[] = [
  {
    courseId: 'c1',
    courseName: 'Информационная безопасность',
    materials: [
      {
        id: 'm1',
        title: 'Лекция 1-3: Основы криптографии и симметричное шифрование',
        type: 'pdf',
        size: '4.2 MB',
        uploadDate: '12 Февраля 2026',
        isVerified: true,
        url: '#'
      },
      {
        id: 'm2',
        title: 'Стандарт ГОСТ 34.10-2018 (Официальный документ)',
        type: 'document',
        size: '1.8 MB',
        uploadDate: '15 Февраля 2026',
        isVerified: true,
        url: '#'
      },
      {
        id: 'm3',
        title: 'Установочный пакет: Утилиты для хэширования',
        type: 'archive',
        size: '15.5 MB',
        uploadDate: '20 Февраля 2026',
        isVerified: false,
        url: '#'
      }
    ]
  },
  {
    courseId: 'c2',
    courseName: 'Программирование мобильных устройств',
    materials: [
      {
        id: 'm4',
        title: 'Видеоурок: Настройка окружения Flutter & Dart',
        type: 'video',
        size: '240 MB',
        uploadDate: '10 Января 2026',
        isVerified: true,
        url: '#'
      },
      {
        id: 'm5',
        title: 'Шпаргалка: Жизненный цикл виджетов',
        type: 'pdf',
        size: '800 KB',
        uploadDate: '14 Января 2026',
        isVerified: true,
        url: '#'
      }
    ]
  },
  {
    courseId: 'c3',
    courseName: 'Базы данных',
    materials: [
      {
        id: 'm6',
        title: 'ER-диаграмма предметной области "Университет"',
        type: 'pdf',
        size: '2.1 MB',
        uploadDate: '05 Марта 2026',
        isVerified: true,
        url: '#'
      },
      {
        id: 'm7',
        title: 'Дамп тестовой базы данных PostgreSQL',
        type: 'document',
        size: '12.4 MB',
        uploadDate: '06 Марта 2026',
        isVerified: true,
        url: '#'
      },
      {
        id: 'm8',
        title: 'Таблица сравнения СУБД (NoSQL vs SQL)',
        type: 'spreadsheet',
        size: '400 KB',
        uploadDate: '08 Марта 2026',
        isVerified: false,
        url: '#'
      }
    ]
  }
];

export function Materials() {
  const { materials: teacherMaterials, loading, error } = useMaterials();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(MOCK_COURSE_MATERIALS[0].courseId);

  const toggleCourse = (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  const getFileIcon = (type: MaterialType | SharedMaterialType) => {
    switch (type) {
      case 'pdf': return <FileBadge className="w-8 h-8 text-rose-500" />;
      case 'video': return <PlayCircle className="w-8 h-8 text-purple-500" />;
      case 'archive': return <FileArchive className="w-8 h-8 text-amber-500" />;
      case 'document': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'spreadsheet': return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
      case 'url': return <PlayCircle className="w-8 h-8 text-purple-500" />;
      case 'text': return <FileText className="w-8 h-8 text-blue-500" />;
    }
  };

  const getFileLabel = (type: MaterialType | SharedMaterialType) => {
    switch (type) {
      case 'pdf': return 'PDF Документ';
      case 'video': return 'Видео';
      case 'archive': return 'Архив (ZIP/RAR)';
      case 'document': return 'Документ (DOCX/TXT)';
      case 'spreadsheet': return 'Таблица (XLSX)';
      case 'url': return 'Внешняя ссылка';
      case 'text': return 'Текстовый материал';
    }
  };

  // Group teacher materials by courseName
  const teacherByCourse = (teacherMaterials || []).reduce<Record<string, typeof teacherMaterials>>((acc, m) => {
    if (!acc[m.courseName]) acc[m.courseName] = [];
    acc[m.courseName].push(m);
    return acc;
  }, {});

  const teacherCourseKeys = Object.keys(teacherByCourse);


  return (
    <div className="legacy-theme-screen min-h-screen bg-slate-50 dark:bg-[#0f1115] relative overflow-hidden transition-colors duration-200">
      <ThemeSquaresBackground />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Подтвержденные материалы</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Библиотека проверенной литературы и файлов от ваших преподавателей</p>
            </div>
          </div>
        </motion.div>

        {/* Loading / Error states */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-slate-500 dark:text-slate-400 font-medium">Загрузка материалов...</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ── Teacher materials from context ── */}
        <AnimatePresence>
          {teacherCourseKeys.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-10 space-y-4"
            >
              {/* Banner */}
              <div className="flex items-center gap-3 px-5 py-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 shrink-0" />
                <p className="font-bold text-sm">Новые материалы от ваших преподавателей</p>
                <span className="ml-auto text-xs font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">{teacherMaterials.length}</span>
              </div>

              {/* Cards grouped by course */}
              {teacherCourseKeys.map((courseName, ci) => (
                <motion.div
                  key={courseName}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.08 }}
                  className="bg-white dark:bg-[#151821] rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-6 py-4 bg-indigo-50/60 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><BookOpen className="w-4 h-4" /></div>
                    <h2 className="font-bold text-slate-800 dark:text-slate-200">{courseName}</h2>
                    <span className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">{teacherByCourse[courseName].length} материал(ов)</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {teacherByCourse[courseName].map(m => (
                      <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 bg-white dark:bg-[#1a1f2b] transition-all group">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">{getFileIcon(m.type)}</div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{m.title}</h3>
                            {m.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{m.description}</p>}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
                              <span>{getFileLabel(m.type)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <span>{m.size}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <span>{m.uploadDate}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Одобрено преподавателем
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 pl-14 sm:pl-0">
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/10 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg font-bold text-sm transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
                          >
                            {m.type === 'video' || m.type === 'url' ? 'Открыть' : 'Скачать'}
                            <DownloadCloud className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Archive / Mock Courses List ── */}
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Upload className="w-5 h-5 text-slate-400" />
            Архив курсов
          </h2>
          {MOCK_COURSE_MATERIALS.map((course, index) => {
            const isExpanded = expandedCourse === course.courseId;

            return (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#151821] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Course Header Toggle */}
                <button
                  onClick={() => toggleCourse(course.courseId)}
                  className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/20 dark:hover:bg-slate-800/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                             ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}
                          `}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{course.courseName}</h2>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {course.materials.length} {course.materials.length === 1 ? 'материал' : course.materials.length >= 2 && course.materials.length <= 4 ? 'материала' : 'материалов'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Materials List (Accordion Content) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800/50 mt-2">
                        {course.materials.map((material) => (
                          <div
                            key={material.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 bg-white dark:bg-[#1a1f2b] transition-all group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                {getFileIcon(material.type)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {material.title}
                                  </h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                  <span>{getFileLabel(material.type)}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                  <span>{material.size}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                  <span>Загружено: {material.uploadDate}</span>
                                </div>

                                {/* Verification Badge */}
                                {material.isVerified && (
                                  <div className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Одобрено преподавателем
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 sm:self-center pr-2 sm:pr-0 pl-14 sm:pl-0">
                              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/10 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg font-bold text-sm transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30">
                                {material.type === 'video' ? 'Смотреть' : 'Скачать'}
                                <DownloadCloud className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
