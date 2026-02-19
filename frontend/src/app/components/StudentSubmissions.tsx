import { CheckCircle, Clock, Star, User, TrendingUp, TrendingDown, Bot } from 'lucide-react';
import { motion } from 'motion/react';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

export function StudentSubmissions() {
  const submissions = [
    {
      id: 1,
      student: 'Иванов Иван',
      assignment: 'Реализация нейронной сети',
      course: 'Машинное обучение',
      submittedAt: '15 фев 2026, 14:30',
      status: 'graded',
      score: 85,
      maxScore: 100,
      aiSuggestion: 'Отличная работа! Код чистый, но можно улучшить обработку ошибок.',
    },
    {
      id: 2,
      student: 'Петрова Анна',
      assignment: 'Тест: Основы ML',
      course: 'Машинное обучение',
      submittedAt: '15 фев 2026, 12:15',
      status: 'pending',
      score: null,
      maxScore: 100,
      aiSuggestion: null,
    },
    {
      id: 3,
      student: 'Сидоров Петр',
      assignment: 'REST API разработка',
      course: 'Веб-разработка',
      submittedAt: '14 фев 2026, 18:45',
      status: 'graded',
      score: 92,
      maxScore: 100,
      aiSuggestion: 'Превосходная реализация! Хорошая структура кода и обработка ошибок.',
    },
    {
      id: 4,
      student: 'Козлова Мария',
      assignment: 'SQL оптимизация',
      course: 'Базы данных',
      submittedAt: '15 фев 2026, 09:20',
      status: 'pending',
      score: null,
      maxScore: 90,
      aiSuggestion: null,
    },
    {
      id: 5,
      student: 'Смирнов Алексей',
      assignment: 'Алгоритм поиска в графе',
      course: 'Алгоритмы',
      submittedAt: '13 фев 2026, 16:30',
      status: 'graded',
      score: 68,
      maxScore: 75,
      aiSuggestion: 'Базовая реализация выполнена. Рекомендуется улучшить сложность алгоритма.',
    },
  ];

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    avgScore:
      submissions.filter(s => s.score !== null).reduce((acc, s) => acc + (s.score! / s.maxScore) * 100, 0) /
      submissions.filter(s => s.score !== null).length,
  };

  const handleGrade = (id: number) => alert(`Открыть работу студента #${id} для оценки`);
  const handleViewDetails = (id: number) => alert(`Просмотр деталей работы #${id}`);

  const statCards = [
    { label: 'Всего работ', value: stats.total, icon: User, gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)', glow: 'rgba(124,58,237,0.3)' },
    { label: 'На проверке', value: stats.pending, icon: Clock, gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.3)' },
    { label: 'Проверено', value: stats.graded, icon: CheckCircle, gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Средний балл', value: `${stats.avgScore.toFixed(1)}%`, icon: Star, gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', glow: 'rgba(6,182,212,0.3)' },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Работы студентов</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Проверка и оценка отправленных заданий</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-5 rounded-2xl"
              style={cardStyle}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: card.gradient, boxShadow: `0 0 12px ${card.glow}` }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl" style={{ color: '#f1f5f9', fontWeight: 700 }}>{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission, index) => {
          const pct = submission.score !== null ? (submission.score / submission.maxScore) * 100 : 0;
          const isGood = pct >= 80;
          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={cardStyle}
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    {/* Student info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.3))',
                          border: '1px solid rgba(139,92,246,0.2)',
                        }}
                      >
                        <span className="text-sm" style={{ color: '#c4b5fd', fontWeight: 700 }}>
                          {submission.student.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                          {submission.student}
                        </h3>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {submission.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm mb-0.5" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                        {submission.assignment}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{submission.course}</p>
                    </div>

                    {/* AI Suggestion */}
                    {submission.status === 'graded' && submission.aiSuggestion && (
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          background: 'rgba(139,92,246,0.08)',
                          border: '1px solid rgba(139,92,246,0.2)',
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <Bot className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#a78bfa' }} />
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#a78bfa', fontWeight: 600 }}>
                              Оценка ИИ
                            </p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                              {submission.aiSuggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col items-center gap-4 lg:items-end">
                    {submission.status === 'graded' ? (
                      <div className="text-center">
                        <div className="mb-1">
                          <span
                            className="text-3xl"
                            style={{
                              color: isGood ? '#34d399' : pct >= 60 ? '#67e8f9' : '#fbbf24',
                              fontWeight: 700,
                            }}
                          >
                            {submission.score}
                          </span>
                          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            /{submission.maxScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {isGood ? (
                            <TrendingUp className="w-3.5 h-3.5" style={{ color: '#34d399' }} />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
                          )}
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span
                        className="px-3 py-1.5 rounded-xl text-xs"
                        style={{
                          background: 'rgba(245,158,11,0.1)',
                          border: '1px solid rgba(245,158,11,0.25)',
                          color: '#fbbf24',
                        }}
                      >
                        На проверке
                      </span>
                    )}

                    <div className="flex flex-col gap-2">
                      {submission.status === 'pending' && (
                        <button
                          onClick={() => handleGrade(submission.id)}
                          className="px-4 py-2 rounded-xl text-white text-xs transition-all whitespace-nowrap"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                            boxShadow: '0 0 12px rgba(124,58,237,0.3)',
                          }}
                        >
                          Оценить
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(submission.id)}
                        className="px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        Подробнее
                      </button>
                    </div>
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
