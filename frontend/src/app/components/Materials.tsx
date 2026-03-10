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
  ExternalLink,
} from 'lucide-react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useMaterials, SharedMaterialType } from '../contexts/MaterialsContext';
import { materialsApi } from '../../api/client';

export function Materials() {
  const { materials, loading, error } = useMaterials();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const toggleCourse = (courseName: string) => {
    setExpandedCourse(prev => prev === courseName ? null : courseName);
  };

  const getFileIcon = (type: SharedMaterialType) => {
    switch (type) {
      case 'pdf': return <FileBadge className="w-8 h-8 text-rose-500" />;
      case 'video':
      case 'url': return <PlayCircle className="w-8 h-8 text-purple-500" />;
      case 'archive': return <FileArchive className="w-8 h-8 text-amber-500" />;
      case 'document':
      case 'text': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'spreadsheet': return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    }
  };

  const getFileLabel = (type: SharedMaterialType) => {
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

  // Group materials by courseName
  const byCourse = materials.reduce<Record<string, typeof materials>>((acc, m) => {
    if (!acc[m.courseName]) acc[m.courseName] = [];
    acc[m.courseName].push(m);
    return acc;
  }, {});

  const courseKeys = Object.keys(byCourse);

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
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Учебные материалы</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Библиотека материалов от ваших преподавателей</p>
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

        {/* Materials grouped by course */}
        {!loading && !error && (
          <>
            {courseKeys.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-slate-400"
              >
                <BookOpen className="w-16 h-16 opacity-20 mb-4" />
                <p className="text-lg font-bold text-slate-500 dark:text-slate-400">Материалы ещё не загружены</p>
                <p className="text-sm text-slate-400 mt-1">Ваши преподаватели ещё не добавили учебные материалы</p>
              </motion.div>
            ) : (
              <>
                {/* Banner */}
                <div className="flex items-center gap-3 px-5 py-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30 mb-6">
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <p className="font-bold text-sm">Материалы от ваших преподавателей</p>
                  <span className="ml-auto text-xs font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">{materials.length}</span>
                </div>

                <div className="space-y-4">
                  {courseKeys.map((courseName, index) => {
                    const isExpanded = expandedCourse === courseName;
                    const courseItems = byCourse[courseName];

                    return (
                      <motion.div
                        key={courseName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="bg-white dark:bg-[#151821] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                      >
                        {/* Course Header Toggle */}
                        <button
                          onClick={() => toggleCourse(courseName)}
                          className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/20 dark:hover:bg-slate-800/40 transition-colors text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                              ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}
                            `}>
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{courseName}</h2>
                              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {courseItems.length} {courseItems.length === 1 ? 'материал' : courseItems.length >= 2 && courseItems.length <= 4 ? 'материала' : 'материалов'}
                              </p>
                            </div>
                          </div>
                          <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Materials List */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800/50 mt-2">
                                {courseItems.map((material) => {
                                  const downloadUrl = materialsApi.fileUrl(material.url);
                                  const isExternal = material.type === 'video' || material.type === 'url';
                                  const isText = material.type === 'text';

                                  return (
                                    <div
                                      key={material.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 bg-white dark:bg-[#1a1f2b] transition-all group"
                                    >
                                      <div className="flex items-start gap-4">
                                        <div className="shrink-0 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                          {getFileIcon(material.type)}
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {material.title}
                                          </h3>
                                          {material.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{material.description}</p>
                                          )}
                                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
                                            <span>{getFileLabel(material.type)}</span>
                                            {material.size && (
                                              <>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                <span>{material.size}</span>
                                              </>
                                            )}
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <span>{material.uploadDate}</span>
                                            {material.teacher?.name && (
                                              <>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                <span>{material.teacher.name}</span>
                                              </>
                                            )}
                                          </div>
                                          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Одобрено преподавателем
                                          </div>
                                        </div>
                                      </div>

                                      <div className="shrink-0 pl-14 sm:pl-0">
                                        {isText ? (
                                          <span className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg font-bold text-sm">
                                            Текст
                                          </span>
                                        ) : (
                                          <a
                                            href={downloadUrl}
                                            target={isExternal ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            download={!isExternal}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/10 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg font-bold text-sm transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
                                          >
                                            {isExternal ? 'Открыть' : 'Скачать'}
                                            {isExternal ? <ExternalLink className="w-4 h-4" /> : <DownloadCloud className="w-4 h-4" />}
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
