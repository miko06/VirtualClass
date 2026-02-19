import { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Video, File, Check } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  width: '100%',
  padding: '12px 16px',
  outline: 'none',
  fontSize: '14px',
};

const labelStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: '8px',
  display: 'block',
};

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
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Управление материалами</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Загружайте лекции, документы и другие учебные материалы
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
            <h3 className="text-base mb-5" style={{ color: '#e2e8f0', fontWeight: 600 }}>
              Загрузить новый материал
            </h3>

            {/* Course Selection */}
            <div className="mb-5">
              <label style={labelStyle}>Выберите курс</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="" style={{ background: '#0f0f1e' }}>Выберите курс...</option>
                {courses.map((course) => (
                  <option key={course} value={course} style={{ background: '#0f0f1e' }}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Method */}
            <div className="mb-5">
              <label style={labelStyle}>Способ загрузки</label>
              <div className="grid grid-cols-3 gap-3">
                {uploadMethods.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setUploadMethod(id)}
                    className="p-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-2"
                    style={
                      uploadMethod === id
                        ? {
                            background: 'rgba(139,92,246,0.15)',
                            border: '1px solid rgba(139,92,246,0.4)',
                            boxShadow: '0 0 15px rgba(139,92,246,0.12)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                          }
                    }
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: uploadMethod === id ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: uploadMethod === id ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            {uploadMethod === 'file' && (
              <div className="mb-5">
                <label style={labelStyle}>Загрузить файл</label>
                <div
                  className="rounded-xl p-8 text-center transition-all cursor-pointer"
                  style={{
                    border: '2px dashed rgba(139,92,246,0.3)',
                    background: 'rgba(139,92,246,0.04)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.3))',
                    }}
                  >
                    <Upload className="w-7 h-7" style={{ color: '#c4b5fd' }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Перетащите файл или нажмите для выбора
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    PDF, DOCX, PPT, MP4 (макс. 500 МБ)
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-5 py-2 rounded-xl text-sm cursor-pointer transition-all text-white"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                      boxShadow: '0 0 15px rgba(124,58,237,0.35)',
                    }}
                  >
                    Выбрать файл
                  </label>
                  <input type="file" id="file-upload" className="hidden" />
                </div>
              </div>
            )}

            {uploadMethod === 'url' && (
              <div className="mb-5">
                <label style={labelStyle}>URL материала</label>
                <input
                  type="url"
                  placeholder="https://example.com/video-lecture"
                  style={inputStyle}
                />
              </div>
            )}

            {uploadMethod === 'text' && (
              <div className="mb-5">
                <label style={labelStyle}>Текст материала</label>
                <textarea
                  placeholder="Введите или вставьте текст лекции..."
                  style={{ ...inputStyle, height: '160px', resize: 'none' }}
                />
              </div>
            )}

            {/* Title */}
            <div className="mb-4">
              <label style={labelStyle}>Название материала</label>
              <input type="text" placeholder="Введите название..." style={inputStyle} />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label style={labelStyle}>Описание (опционально)</label>
              <textarea
                placeholder="Краткое описание материала..."
                style={{ ...inputStyle, height: '80px', resize: 'none' }}
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedCourse || isUploading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: uploadSuccess
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #7c3aed, #6366f1)',
                boxShadow: uploadSuccess
                  ? '0 0 20px rgba(16,185,129,0.35)'
                  : '0 0 20px rgba(124,58,237,0.35)',
              }}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Загрузка...
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Успешно загружено!
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Загрузить материал
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-6" style={cardStyle}>
            <h3 className="text-base mb-5" style={{ color: '#e2e8f0', fontWeight: 600 }}>
              Недавние загрузки
            </h3>
            <div className="space-y-3">
              {recentUploads.map((upload, index) => {
                const Icon = getTypeIcon(upload.type);
                return (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(99,102,241,0.25))',
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: '#c4b5fd' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                          {upload.title}
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{upload.course}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                          <span>{upload.date}</span>
                          <span>•</span>
                          <span>{upload.size}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
