import { CheckCircle, Clock, Star, User, TrendingUp, TrendingDown, Bot } from 'lucide-react';
import { motion } from 'motion/react';

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
    { label: 'Средний балл', value: `${stats.avgScore.toFixed(1)}%`, icon: Star, gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', glow: 'rgba(14,165,233,0.3)' },
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

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Работы студентов</h2>
        <p className="text-sm font-medium text-slate-500">Проверка и оценка отправленных заданий</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-6 rounded-3xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col hover:shadow-2xl transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">{card.label}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                  style={{ background: card.gradient, boxShadow: `0 4px 12px ${card.glow}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 tracking-tight">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Submissions List */}
      <div className="space-y-5 relative z-10 max-w-5xl">
        {submissions.map((submission, index) => {
          const pct = submission.score !== null ? (submission.score / submission.maxScore) * 100 : 0;
          const isGood = pct >= 80;
          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 hover:shadow-2xl hover:ring-indigo-100 transition-all duration-300"
            >
              <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  {/* Student info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                        border: '1px solid #a5b4fc',
                      }}
                    >
                      <span className="text-base font-extrabold text-indigo-700 tracking-wider">
                        {submission.student.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                        {submission.student}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {submission.submittedAt}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 pl-16">
                    <p className="text-base font-bold text-slate-700 mb-1 border-l-2 border-indigo-200 pl-3">
                      {submission.assignment}
                    </p>
                    <p className="text-xs font-bold text-slate-400 pl-3">{submission.course}</p>
                  </div>

                  {/* AI Suggestion */}
                  {submission.status === 'graded' && submission.aiSuggestion && (
                    <div
                      className="ml-16 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                          <Bot className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1">
                            Подсказка ИИ
                          </p>
                          <p className="text-sm font-medium text-slate-600">
                            {submission.aiSuggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col items-center gap-4 lg:items-end lg:w-48 pl-16 lg:pl-0">
                  {submission.status === 'graded' ? (
                    <div className="text-center w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="mb-2">
                        <span
                          className="text-4xl font-extrabold"
                          style={{ color: isGood ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444' }}
                        >
                          {submission.score}
                        </span>
                        <span className="text-sm font-bold text-slate-400 ml-1">
                          /{submission.maxScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 font-bold">
                        {isGood ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-sm" style={{ color: isGood ? '#10b981' : '#f59e0b' }}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-center py-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <span className="text-sm font-bold text-amber-600 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        На проверке
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 w-full mt-2">
                    {submission.status === 'pending' && (
                      <button
                        onClick={() => handleGrade(submission.id)}
                        className="w-full px-5 py-3 rounded-xl text-white text-sm font-bold transition-all whitespace-nowrap shadow-lg hover:shadow-xl active:scale-95"
                        style={{
                          background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                          boxShadow: '0 8px 16px -4px rgba(79,70,229,0.3)',
                        }}
                      >
                        Оценить работу
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(submission.id)}
                      className="w-full px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 active:scale-95"
                    >
                      Детали
                    </button>
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
