import { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Sparkles, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

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
    type === 'multiple-choice' ? 'Выбор варианта' : type === 'short-answer' ? 'Краткий ответ' : 'Практика';

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

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Генератор заданий</h2>
          <div
            className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-indigo-100 bg-white"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-700 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5, #0ea5e9)' }}>AI Powered</span>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500">Загрузите учебный материал, и наш ИИ создаст качественный тест автоматически</p>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {!generatedTest ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Form Container */}
            <div className="rounded-3xl p-8 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
              {/* Course Selection */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Выберите курс</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow appearance-none"
                >
                  <option value="">Выберите курс...</option>
                  {courses.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Upload Method */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Исходный материал</label>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {uploadMethods.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setUploadMethod(id)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all border-2 ${uploadMethod === id
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm text-indigo-700'
                          : 'border-slate-100 bg-slate-50 hover:border-indigo-200 text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      <Icon className={`w-6 h-6 ${uploadMethod === id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-sm font-bold">{label}</span>
                    </button>
                  ))}
                </div>

                {uploadMethod === 'text' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <textarea
                      value={materialText}
                      onChange={(e) => setMaterialText(e.target.value)}
                      placeholder="Вставьте фрагмент лекции, статьи или учебника..."
                      className="w-full h-48 px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow resize-none"
                    />
                  </motion.div>
                )}

                {uploadMethod === 'file' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <div
                      className="rounded-2xl p-10 text-center transition-all cursor-pointer border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 group"
                    >
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-indigo-500" />
                      </div>
                      <p className="text-base font-bold text-indigo-900 mb-1">
                        Загрузите PDF или DOCX
                      </p>
                      <p className="text-sm font-medium text-indigo-500/70 mb-6">
                        ИИ распознает текст автоматически
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
                        className="inline-block mt-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', boxShadow: '0 8px 20px -6px rgba(79,70,229,0.4)' }}
                      >
                        Выбрать файл
                      </label>
                      {materialFile && (
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-bold text-sm">
                          <CheckCircle className="w-4 h-4" /> {materialFile}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {uploadMethod === 'url' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <input
                      type="url"
                      value={materialUrl}
                      onChange={(e) => setMaterialUrl(e.target.value)}
                      placeholder="https://ru.wikipedia.org/wiki/..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                    />
                  </motion.div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!selectedCourse || (!materialText && !materialFile && !materialUrl) || isGenerating}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-white text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
                  boxShadow: '0 10px 30px -10px rgba(124,58,237,0.5)',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
                {isGenerating ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Нейросеть работает...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
                    Создать магию
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-3xl overflow-hidden bg-white shadow-2xl shadow-indigo-500/10 ring-1 ring-slate-100">
              {/* Header */}
              <div
                className="p-8 text-white relative"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}
              >
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle at right top, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                />
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-sm">
                    {generatedTest.course}
                  </span>
                  <h3 className="text-3xl font-extrabold mb-4 tracking-tight">{generatedTest.title}</h3>
                  <div className="flex items-center gap-6 text-sm font-semibold opacity-90">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{generatedTest.questions.length} вопросов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{generatedTest.totalPoints} баллов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 opacity-0" /> {/* Just for spacing or placeholder */}
                      <span>Время: {generatedTest.timeLimit} мин</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {generatedTest.questions.map((question: any, index: number) => (
                  <div
                    key={question.id}
                    className="pb-8 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                            Вопрос {index + 1}
                          </span>
                          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {typeLabel(question.type)}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{question.points} баллов</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800 mb-4">{question.question}</p>

                        {question.type === 'multiple-choice' && (
                          <div className="space-y-3">
                            {question.options.map((option: string, optIndex: number) => (
                              <div
                                key={optIndex}
                                className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all ${optIndex === question.correctAnswer
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm'
                                    : 'bg-white border-slate-100 text-slate-600'
                                  }`}
                              >
                                <span className="font-semibold">{option}</span>
                                {optIndex === question.correctAnswer && (
                                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">
                                    <CheckCircle className="w-4 h-4" /> Правильно
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === 'practical' && question.description && (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium text-sm">
                            {question.description}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => alert(`Редактирование вопроса ${question.id}`)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 active:scale-95"
                      >
                        Изменить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white text-base font-bold transition-all hover:shadow-lg active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 20px -6px rgba(16,185,129,0.4)',
                }}
              >
                <CheckCircle className="w-5 h-5" />
                Опубликовать задание
              </button>
              <button
                onClick={() => setGeneratedTest(null)}
                className="px-8 py-4 rounded-xl text-base font-bold transition-all bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
              >
                Отменить
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
