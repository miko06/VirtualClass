import { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Video, File, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function TeacherMaterials() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | 'text'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const courses = [
    'Машинное обучение',
    'Веб-разработка',
    'Базы данных',
    'Алгоритмы и структуры данных',
  ];

  const recentUploads = [
    { id: 1, title: 'Введение в нейронные сети', type: 'video', course: 'Машинное обучение', date: '15 фев 2026', size: '125 МБ' },
    { id: 2, title: 'Лекция 5: React Hooks', type: 'document', course: 'Веб-разработка', date: '14 фев 2026', size: '2.4 МБ' },
    { id: 3, title: 'SQL практика', type: 'document', course: 'Базы данных', date: '13 фев 2026', size: '1.8 МБ' },
  ];

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      default: return File;
    }
  };

  const uploadMethods = [
    { id: 'file' as const, icon: Upload, label: 'Файл' },
    { id: 'url' as const, icon: LinkIcon, label: 'Ссылка' },
    { id: 'text' as const, icon: FileText, label: 'Текст' },
  ];

  return (
    <div className="p-8 min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Управление материалами</h2>
        <p className="text-sm font-medium text-slate-500">
          Загружайте лекции, документы и другие учебные материалы
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-8 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-6">
              Загрузить новый материал
            </h3>

            {/* Course Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Выберите курс</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow appearance-none"
              >
                <option value="">Выберите курс...</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
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
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            {uploadMethod === 'file' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Загрузить файл</label>
                <div
                  className="rounded-2xl p-10 text-center transition-all cursor-pointer border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 group"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-base font-bold text-indigo-900 mb-1">
                    Перетащите файл или нажмите для выбора
                  </p>
                  <p className="text-sm font-medium text-indigo-500/70 mb-6">
                    PDF, DOCX, PPT, MP4 (макс. 500 МБ)
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                      boxShadow: '0 8px 20px -6px rgba(79,70,229,0.4)',
                    }}
                  >
                    Выбрать файл
                  </label>
                  <input type="file" id="file-upload" className="hidden" />
                </div>
              </div>
            )}

            {uploadMethod === 'url' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL материала</label>
                <input
                  type="url"
                  placeholder="https://example.com/video-lecture"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                />
              </div>
            )}

            {uploadMethod === 'text' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Текст материала</label>
                <textarea
                  placeholder="Введите или вставьте текст лекции..."
                  className="w-full h-40 px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow resize-none"
                />
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Название материала</label>
              <input
                type="text"
                placeholder="Например: Лекция 1: Введение"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
              />
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Описание (опционально)</label>
              <textarea
                placeholder="Краткое описание материала..."
                className="w-full h-24 px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow resize-none"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedCourse || isUploading}
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
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Загрузка...
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Успешно загружено!
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Опубликовать материал
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Recent Uploads */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl p-6 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-6">
              Недавние загрузки
            </h3>
            <div className="space-y-4">
              {recentUploads.map((upload, index) => {
                const Icon = getTypeIcon(upload.type);
                return (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl transition-all cursor-pointer bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:bg-white group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110"
                        style={{
                          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {upload.title}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{upload.course}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-400">
                          <span>{upload.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{upload.size}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
