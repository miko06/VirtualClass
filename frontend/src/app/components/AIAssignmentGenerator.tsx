import { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Sparkles, Loader, CheckCircle } from 'lucide-react';
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
  color: 'rgba(255,255,255,0.55)',
  fontSize: '12px',
  fontWeight: 500 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: '8px',
  display: 'block',
};

export function AIAssignmentGenerator() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materialText, setMaterialText] = useState('');
  const [materialFile, setMaterialFile] = useState<string | null>(null);
  const [materialUrl, setMaterialUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<any>(null);
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file' | 'url'>('text');

  const courses = ['Машинное обучение', 'Веб-разработка', 'Базы данных', 'Алгоритмы и структуры данных'];

  const handleGenerate = async () => {
    if (!selectedCourse || (!materialText && !materialFile && !materialUrl)) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedTest({
        title: 'Тест по загруженному материалу',
        course: selectedCourse,
        questions: [
          { id: 1, type: 'multiple-choice', question: 'Что такое нейронная сеть?', options: ['Математическая модель, имитирующая работу нейронов мозга', 'Тип компьютерной сети', 'Алгоритм сортировки данных', 'База данных для хранения информации'], correctAnswer: 0, points: 10 },
          { id: 2, type: 'multiple-choice', question: 'Какой метод обучения использует размеченные данные?', options: ['Обучение без учителя', 'Обучение с учителем', 'Обучение с подкреплением', 'Полуобучение'], correctAnswer: 1, points: 10 },
          { id: 3, type: 'short-answer', question: 'Объясните разницу между переобучением и недообучением модели.', points: 20 },
          { id: 4, type: 'multiple-choice', question: 'Что такое функция активации?', options: ['Функция для активации компьютера', 'Функция, определяющая выход нейрона', 'Функция для сохранения модели', 'Функция для загрузки данных'], correctAnswer: 1, points: 10 },
          { id: 5, type: 'practical', question: 'Реализуйте простую нейронную сеть с одним скрытым слоем для классификации данных iris.', description: 'Используйте любой фреймворк (TensorFlow, PyTorch). Прикрепите код и результаты.', points: 50 },
        ],
        totalPoints: 100,
        timeLimit: 60,
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleApprove = () => {
    alert('Тест утвержден и отправлен студентам!');
    setGeneratedTest(null);
    setMaterialText(''); setMaterialFile(null); setMaterialUrl(''); setSelectedCourse('');
  };

  const uploadMethods = [
    { id: 'text' as const, icon: FileText, label: 'Текст' },
    { id: 'file' as const, icon: Upload, label: 'Файл' },
    { id: 'url' as const, icon: LinkIcon, label: 'Ссылка' },
  ];

  const typeLabel = (type: string) =>
    type === 'multiple-choice' ? 'Выбор варианта' : type === 'short-answer' ? 'Краткий ответ' : 'Практическое';

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl" style={{ color: '#e2e8f0' }}>Генератор заданий с ИИ</h2>
          <div
            className="px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: '#c4b5fd' }} />
            <span className="text-xs" style={{ color: '#c4b5fd' }}>AI</span>
          </div>
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Загрузите материал и ИИ создаст тест автоматически</p>
      </div>

      {!generatedTest ? (
        <div className="max-w-3xl">
          {/* Course Selection */}
          <div className="rounded-2xl p-6 mb-5" style={cardStyle}>
            <label style={labelStyle}>Выберите курс</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="" style={{ background: '#0f0f1e' }}>Выберите курс...</option>
              {courses.map(c => (
                <option key={c} value={c} style={{ background: '#0f0f1e' }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Upload Method */}
          <div className="rounded-2xl p-6 mb-5" style={cardStyle}>
            <label style={labelStyle}>Способ загрузки материала</label>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {uploadMethods.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setUploadMethod(id)}
                  className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                  style={
                    uploadMethod === id
                      ? { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 15px rgba(139,92,246,0.12)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  <Icon className="w-5 h-5" style={{ color: uploadMethod === id ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }} />
                  <span className="text-xs" style={{ color: uploadMethod === id ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }}>{label}</span>
                </button>
              ))}
            </div>

            {uploadMethod === 'text' && (
              <div>
                <label style={labelStyle}>Вставьте текст материала</label>
                <textarea
                  value={materialText}
                  onChange={(e) => setMaterialText(e.target.value)}
                  placeholder="Вставьте текст лекции или материала для генерации теста..."
                  style={{ ...inputStyle, height: '180px', resize: 'none' }}
                />
              </div>
            )}

            {uploadMethod === 'file' && (
              <div>
                <label style={labelStyle}>Загрузите файл (PDF, DOCX)</label>
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ border: '2px dashed rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.04)' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.3))' }}
                  >
                    <Upload className="w-7 h-7" style={{ color: '#c4b5fd' }} />
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Перетащите файл или нажмите для выбора
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setMaterialFile(f.name); }}
                    className="hidden"
                    id="ai-file-upload"
                  />
                  <label
                    htmlFor="ai-file-upload"
                    className="inline-block mt-3 px-5 py-2 rounded-xl text-sm cursor-pointer text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 0 15px rgba(124,58,237,0.35)' }}
                  >
                    Выбрать файл
                  </label>
                  {materialFile && (
                    <p className="mt-3 text-sm" style={{ color: '#34d399' }}>✓ Загружен: {materialFile}</p>
                  )}
                </div>
              </div>
            )}

            {uploadMethod === 'url' && (
              <div>
                <label style={labelStyle}>URL материала</label>
                <input
                  type="url"
                  value={materialUrl}
                  onChange={(e) => setMaterialUrl(e.target.value)}
                  placeholder="https://example.com/lecture-material"
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedCourse || (!materialText && !materialFile && !materialUrl) || isGenerating}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)',
              boxShadow: '0 0 25px rgba(124,58,237,0.4)',
            }}
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Генерация теста...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Сгенерировать тест с ИИ
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden mb-5"
            style={cardStyle}
          >
            {/* Header */}
            <div
              className="p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)' }}
            >
              <h3 className="text-2xl mb-2" style={{ fontWeight: 700 }}>{generatedTest.title}</h3>
              <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <span>Курс: {generatedTest.course}</span>
                <span>•</span>
                <span>{generatedTest.questions.length} вопросов</span>
                <span>•</span>
                <span>Макс: {generatedTest.totalPoints} баллов</span>
                <span>•</span>
                <span>Время: {generatedTest.timeLimit} мин</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {generatedTest.questions.map((question: any, index: number) => (
                <div
                  key={question.id}
                  className="pb-5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs"
                          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}
                        >
                          Вопрос {index + 1}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                        >
                          {typeLabel(question.type)}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{question.points} баллов</span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: '#e2e8f0', fontWeight: 500 }}>{question.question}</p>

                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          {question.options.map((option: string, optIndex: number) => (
                            <div
                              key={optIndex}
                              className="p-3 rounded-xl flex items-center justify-between"
                              style={
                                optIndex === question.correctAnswer
                                  ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }
                                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                              }
                            >
                              <span className="text-sm" style={{ color: optIndex === question.correctAnswer ? '#34d399' : 'rgba(255,255,255,0.55)' }}>
                                {option}
                              </span>
                              {optIndex === question.correctAnswer && (
                                <span className="flex items-center gap-1 text-xs" style={{ color: '#34d399' }}>
                                  <CheckCircle className="w-3.5 h-3.5" /> Правильный
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'practical' && question.description && (
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{question.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => alert(`Редактирование вопроса ${question.id}`)}
                      className="ml-4 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              className="flex-1 px-6 py-4 rounded-xl text-white text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 20px rgba(16,185,129,0.3)',
              }}
            >
              Утвердить и распространить
            </button>
            <button
              onClick={() => setGeneratedTest(null)}
              className="px-6 py-4 rounded-xl text-sm transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Создать новый
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
