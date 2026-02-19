import { useState } from 'react';
import { Clock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  width: '100%',
  padding: '12px 16px',
  outline: 'none',
  fontSize: '14px',
  resize: 'none' as const,
};

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
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'К выполнению',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.25)',
      color: '#fbbf24',
    },
    completed: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: 'Выполнено',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.25)',
      color: '#34d399',
    },
    overdue: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Просрочено',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.25)',
      color: '#f87171',
    },
  };

  if (selectedAssignment) {
    return (
      <div className="p-8 min-h-screen">
        <button
          onClick={() => { setSelectedAssignment(null); setAnswers({}); }}
          className="mb-6 px-4 py-2 rounded-xl text-sm transition-all"
          style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          ← Вернуться к заданиям
        </button>

        <div className="max-w-3xl mx-auto">
          <div
            className="p-6 rounded-t-2xl text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)' }}
          >
            <h2 className="text-2xl mb-2" style={{ fontWeight: 700 }}>{selectedAssignment.title}</h2>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <span>{selectedAssignment.course}</span>
              <span>•</span>
              <span>Макс: {selectedAssignment.points} баллов</span>
              {selectedAssignment.timeLimit && (
                <>
                  <span>•</span>
                  <span>{selectedAssignment.timeLimit} мин</span>
                </>
              )}
            </div>
          </div>

          <div
            className="rounded-b-2xl p-6"
            style={{ ...cardStyle, borderTop: 'none', borderRadius: '0 0 16px 16px' }}
          >
            <div className="space-y-8">
              {selectedAssignment.questions.map((question: any, index: number) => (
                <div
                  key={question.id}
                  className="pb-7"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-lg text-xs"
                      style={{
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        color: '#c4b5fd',
                      }}
                    >
                      Вопрос {index + 1}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {question.points} баллов
                    </span>
                  </div>
                  <p className="text-base mb-4" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                    {question.question}
                  </p>

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                          style={
                            answers[question.id] === optIndex
                              ? {
                                  background: 'rgba(139,92,246,0.15)',
                                  border: '1px solid rgba(139,92,246,0.4)',
                                }
                              : {
                                  background: 'rgba(255,255,255,0.03)',
                                  border: '1px solid rgba(255,255,255,0.07)',
                                }
                          }
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optIndex}
                            checked={answers[question.id] === optIndex}
                            onChange={() => handleAnswerChange(question.id, optIndex)}
                            className="w-4 h-4"
                            style={{ accentColor: '#7c3aed' }}
                          />
                          <span className="text-sm" style={{ color: answers[question.id] === optIndex ? '#c4b5fd' : 'rgba(255,255,255,0.65)' }}>
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
                      placeholder="Введите ваш ответ..."
                      style={{ ...inputStyle, height: '120px' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length < selectedAssignment.questions.length}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 0 20px rgba(16,185,129,0.35)',
                }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить работу'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Задания</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Ваши текущие и выполненные задания</p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment, index) => {
          const sc = statusConfig[assignment.status] ?? statusConfig.pending;
          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl"
              style={cardStyle}
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs"
                        style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
                      >
                        {sc.icon}
                        {sc.label}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {assignment.course}
                      </span>
                    </div>

                    <h3 className="text-base mb-2" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                      {assignment.title}
                    </h3>

                    {(assignment as any).description && (
                      <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {(assignment as any).description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      <span>Срок: {assignment.dueDate}</span>
                      <span>•</span>
                      <span>Баллы: {assignment.points}</span>
                      {assignment.status === 'completed' && (assignment as any).score !== undefined && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#34d399', fontWeight: 600 }}>
                            Оценка: {(assignment as any).score}/{assignment.points}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    {assignment.status === 'pending' && (
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all whitespace-nowrap"
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                          boxShadow: '0 0 15px rgba(124,58,237,0.3)',
                        }}
                      >
                        Начать
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {assignment.status === 'completed' && (
                      <button
                        className="px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.6)',
                        }}
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
