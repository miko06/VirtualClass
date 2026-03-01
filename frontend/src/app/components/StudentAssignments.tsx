import { useState } from 'react';
import { Clock, AlertCircle, CheckCircle, ArrowRight, Upload, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export function StudentAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignments = [
    {
      id: 1,
      title: 'Тест: Основы машинного обучения',
      course: 'Машинное обучение',
      type: 'test',
      dueDate: '20 фев 2026',
      status: 'pending',
      points: 100,
      timeLimit: 60,
      questions: [
        { id: 1, type: 'multiple-choice', question: 'Что такое нейронная сеть?', options: ['Математическая модель, имитирующая работу нейронов мозга', 'Тип компьютерной сети', 'Алгоритм сортировки данных', 'База данных для хранения информации'], points: 25 },
        { id: 2, type: 'multiple-choice', question: 'Какой метод обучения использует размеченные данные?', options: ['Обучение без учителя', 'Обучение с учителем', 'Обучение с подкреплением', 'Полуобучение'], points: 25 },
        { id: 3, type: 'short-answer', question: 'Объясните разницу между переобучением и недообучением модели.', points: 30 },
        { id: 4, type: 'multiple-choice', question: 'Что такое функция активации?', options: ['Функция для активации компьютера', 'Функция, определяющая выход нейрона', 'Функция для сохранения модели', 'Функция для загрузки данных'], points: 20 },
      ],
    },
    {
      id: 2,
      title: 'Практическое задание: REST API',
      course: 'Веб-разработка',
      type: 'practical',
      dueDate: '18 фев 2026',
      status: 'pending',
      points: 80,
      description: 'Создать RESTful API с использованием Node.js и Express. API должно включать CRUD операции для управления пользователями.',
    },
    {
      id: 3,
      title: 'Тест: SQL запросы',
      course: 'Базы данных',
      type: 'test',
      dueDate: '25 фев 2026',
      status: 'completed',
      points: 90,
      score: 82,
    },
  ];

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Работа успешно отправлена!');
      setSelectedAssignment(null);
      setAnswers({});
      setIsSubmitting(false);
    }, 1500);
  };

  const statusConfig: Record<string, { icon: React.ReactNode; label: string; bg: string; border: string; color: string }> = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      label: 'К выполнению',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      color: 'text-amber-600',
    },
    completed: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Выполнено',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      color: 'text-emerald-600',
    },
    overdue: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Просрочено',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      color: 'text-rose-600',
    },
  };

  if (selectedAssignment) {
    return (
      <div className="p-8 min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Background patterns */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <button
            onClick={() => { setSelectedAssignment(null); setAnswers({}); }}
            className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
          >
            ← Вернуться к заданиям
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="rounded-3xl shadow-2xl shadow-slate-200/50 bg-white ring-1 ring-slate-100 overflow-hidden"
          >
            <div
              className="p-8 text-white relative"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at right top, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-sm">
                  {selectedAssignment.course}
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight mb-4">{selectedAssignment.title}</h2>
                <div className="flex items-center gap-6 text-sm font-semibold opacity-90">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Макс: {selectedAssignment.points} баллов</span>
                  </div>
                  {selectedAssignment.timeLimit && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Лимит: {selectedAssignment.timeLimit} мин</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-10">
              {selectedAssignment.questions ? selectedAssignment.questions.map((question: any, index: number) => (
                <div
                  key={question.id}
                  className="pb-8 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <span className="px-4 py-1.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Вопрос {index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      {question.points} баллов
                    </span>
                  </div>
                  <p className="text-lg text-slate-800 font-bold mb-6">
                    {question.question}
                  </p>

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      {question.options.map((option: string, optIndex: number) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${answers[question.id] === optIndex
                            ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optIndex}
                            checked={answers[question.id] === optIndex}
                            onChange={() => handleAnswerChange(question.id, optIndex)}
                            className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                          />
                          <span className={`text-base font-medium ${answers[question.id] === optIndex ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'short-answer' && (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Введите ваш развернутый ответ здесь..."
                      className="w-full h-40 p-5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-base outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow resize-none"
                    />
                  )}
                </div>
              )) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">{selectedAssignment.description}</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (selectedAssignment.questions && Object.keys(answers).length < selectedAssignment.questions.length)}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-white text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-lg active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 20px -6px rgba(16,185,129,0.4)',
                }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить работу'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Задания</h2>
        <p className="text-slate-500 font-medium text-sm">Ваши текущие и выполненные задания</p>
      </motion.div>

      <div className="space-y-5 relative z-10 max-w-5xl">
        {assignments.map((assignment, index) => {
          const sc = statusConfig[assignment.status] ?? statusConfig.pending;
          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:ring-indigo-100 transition-all duration-300 group overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold border ${sc.bg} ${sc.border} ${sc.color}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600">
                        {assignment.course}
                      </span>
                      {assignment.type === 'test' ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 border border-purple-200 text-purple-600">
                          Тест / Квиз
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 border border-blue-200 text-blue-600">
                          Практика
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-3 group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </h3>

                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 max-w-2xl">
                      {(assignment as any).description || 'Ответьте на все вопросы теста. У вас ограничено время на выполнение. Убедитесь в стабильном интернет-соединении перед началом.'}
                    </p>

                    <div className="flex items-center gap-5 text-sm font-bold text-slate-400 bg-slate-50/50 p-4 rounded-xl border border-slate-100 w-fit">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Срок: {assignment.dueDate}
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <div className="text-slate-600">Баллы: {assignment.points}</div>

                      {assignment.status === 'completed' && (assignment as any).score !== undefined && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <div className="text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            Оценка: {(assignment as any).score}/{assignment.points}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 min-w-[200px]">
                    {assignment.status === 'pending' && (
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="flex-1 flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg active:scale-95 hover:shadow-xl hover:-translate-y-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                          boxShadow: '0 8px 20px -6px rgba(79,70,229,0.4)',
                        }}
                      >
                        Приступить
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {assignment.status === 'completed' && (
                      <button
                        className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold transition-all bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm"
                      >
                        Просмотреть результат
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
