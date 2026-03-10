import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Link as LinkIcon, Video, File, Check, Trash2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { useMaterials, SharedMaterialType } from '../contexts/MaterialsContext';
import { classesApi, materialsApi } from '../../api/client';
import type { User as AppUser } from '../../api/client';

interface TeacherMaterialsProps {
  currentUser?: AppUser | null;
}

const EXT_TO_TYPE: Record<string, SharedMaterialType> = {
  pdf: 'pdf',
  doc: 'document', docx: 'document', txt: 'document',
  ppt: 'document', pptx: 'document',
  mp4: 'video', mov: 'video', avi: 'video', mkv: 'video',
  zip: 'archive', rar: 'archive', '7z': 'archive',
  xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
};

function getTypeFromFileName(name: string): SharedMaterialType {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_TYPE[ext] ?? 'document';
}

function formatSize(bytes: number): string {
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} МБ`;
  return `${(bytes / 1_000).toFixed(0)} КБ`;
}

export function TeacherMaterials({ currentUser }: TeacherMaterialsProps) {
  const { materials, addMaterial, removeMaterial } = useMaterials();

  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | 'text'>('file');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load teacher's classes for the dropdown
  useEffect(() => {
    if (!currentUser?.id) return;
    classesApi.byTeacher(currentUser.id).then((cls) => {
      setCourses(cls.map((c) => c.name));
    }).catch(console.error);
  }, [currentUser?.id]);

  // Only show teacher's own materials in the sidebar
  const myMaterials = materials.filter((m) => m.teacherId === currentUser?.id);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPickedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ''));
  };

  const canSubmit = selectedCourse && title.trim() && (
    (uploadMethod === 'file' && pickedFile) ||
    (uploadMethod === 'url' && urlValue.trim()) ||
    (uploadMethod === 'text' && textValue.trim())
  );

  const handleUpload = async () => {
    if (!canSubmit || !currentUser?.id) return;
    setIsUploading(true);
    try {
      let fileUrl = '#';
      let size = '';
      let type: SharedMaterialType = 'document';

      if (uploadMethod === 'file' && pickedFile) {
        // Upload the actual file to backend, get the stored URL
        const uploaded = await materialsApi.uploadFile(pickedFile);
        fileUrl = uploaded.url;
        size = formatSize(uploaded.size);
        type = getTypeFromFileName(pickedFile.name);
      } else if (uploadMethod === 'url') {
        fileUrl = urlValue.trim();
        size = 'Внешняя ссылка';
        type = 'url';
      } else if (uploadMethod === 'text') {
        fileUrl = '#';
        size = `${textValue.trim().length} симв.`;
        type = 'text';
      }

      await addMaterial({
        title: title.trim(),
        description: description.trim(),
        type,
        courseName: selectedCourse,
        size,
        url: fileUrl,
        teacherId: currentUser.id,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setUrlValue('');
      setTextValue('');
      setPickedFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMethods = [
    { id: 'file' as const, icon: Upload, label: 'Файл' },
    { id: 'url' as const, icon: LinkIcon, label: 'Ссылка' },
    { id: 'text' as const, icon: FileText, label: 'Текст' },
  ];

  const getTypeIcon = (type: SharedMaterialType) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-white" />;
      case 'pdf': return <FileText className="w-5 h-5 text-white" />;
      case 'archive': return <File className="w-5 h-5 text-white" />;
      default: return <File className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="legacy-theme-screen p-8 min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Управление материалами</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Загружайте лекции, документы и другие учебные материалы — они сразу появятся у студентов
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-8 bg-white dark:bg-[#151821] shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800"
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-6">Загрузить новый материал</h3>

            {/* Course */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Выберите курс *</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
              >
                <option value="">Выберите курс...</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Upload Method */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Способ загрузки</label>
              <div className="grid grid-cols-3 gap-4">
                {uploadMethods.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setUploadMethod(id)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all border-2 ${uploadMethod === id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                      : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-indigo-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Файл</label>
                {pickedFile ? (
                  <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-200 dark:border-indigo-500/30">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{pickedFile.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(pickedFile.size)}</p>
                    </div>
                    <button onClick={() => setPickedFile(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-2xl p-10 text-center transition-all cursor-pointer border-2 border-dashed border-indigo-200 bg-indigo-50/50 dark:bg-indigo-500/5 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-400 group"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white dark:bg-slate-800 shadow-md group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-base font-bold text-indigo-900 dark:text-indigo-300 mb-1">Перетащите файл или нажмите для выбора</p>
                    <p className="text-sm font-medium text-indigo-500/70">PDF, DOCX, PPT, MP4, ZIP (макс. 500 МБ)</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFilePick} />
              </div>
            )}

            {/* URL */}
            {uploadMethod === 'url' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL материала *</label>
                <input
                  type="url"
                  placeholder="https://example.com/video-lecture"
                  value={urlValue}
                  onChange={e => setUrlValue(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            )}

            {/* Text */}
            {uploadMethod === 'text' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Текст материала *</label>
                <textarea
                  placeholder="Введите или вставьте текст лекции..."
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  className="w-full h-40 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                />
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Название материала *</label>
              <input
                type="text"
                placeholder="Например: Лекция 1: Введение"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Описание (опционально)</label>
              <textarea
                placeholder="Краткое описание материала..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-24 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={!canSubmit || isUploading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95"
              style={{
                background: uploadSuccess
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                boxShadow: uploadSuccess
                  ? '0 8px 20px -6px rgba(16,185,129,0.4)'
                  : '0 8px 20px -6px rgba(79,70,229,0.4)',
              }}
            >
              {isUploading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Загрузка...</>
              ) : uploadSuccess ? (
                <><Check className="w-5 h-5" />Успешно опубликовано!</>
              ) : (
                <><Upload className="w-5 h-5" />Опубликовать материал</>
              )}
            </button>
          </motion.div>
        </div>

        {/* Recent uploads sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl p-6 bg-white dark:bg-[#151821] shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight mb-6">
              Мои материалы
              {myMaterials.length > 0 && (
                <span className="ml-2 text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">{myMaterials.length}</span>
              )}
            </h3>

            <AnimatePresence>
              {myMaterials.length === 0 ? (
                <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-3">
                  <BookOpen className="w-8 h-8 opacity-30" />
                  <p className="text-sm font-medium">Нет загруженных материалов.<br />Загрузите первый!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myMaterials.map((m, index) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.04 }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group flex items-start gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
                      >
                        {getTypeIcon(m.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{m.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{m.courseName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.size} · {m.uploadDate}</p>
                      </div>
                      <button
                        onClick={async () => { await removeMaterial(m.id); }}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
