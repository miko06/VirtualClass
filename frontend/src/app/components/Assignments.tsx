import { CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
  points: number;
  description: string;
}

const statusConfig = {
  pending: { label: 'К выполнению', icon: Clock, bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-600' },
  submitted: { label: 'Сдано', icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', color: 'text-emerald-600' },
  overdue: { label: 'Просрочено', icon: AlertCircle, bg: 'bg-rose-50', border: 'border-rose-200', color: 'text-rose-600' },
};

export function Assignments() {
  const assignments: Assignment[] = [
    { id: '1', title: 'Реализация нейронной сети', course: 'Машинное обучение', dueDate: '20 фев 2026', status: 'pending', points: 100, description: 'Создать и обучить простую нейронную сеть для классификации изображений' },
    { id: '2', title: 'Разработка REST API', course: 'Веб-разработка', dueDate: '18 фев 2026', status: 'pending', points: 80, description: 'Создать RESTful API с использованием Node.js и Express' },
    { id: '3', title: 'Оптимизация SQL запросов', course: 'Базы данных', dueDate: '25 фев 2026', status: 'pending', points: 90, description: 'Оптимизировать набор SQL запросов для улучшения производительности' },
    { id: '4', title: 'Алгоритм поиска в графе', course: 'Алгоритмы', dueDate: '10 фев 2026', status: 'overdue', points: 75, description: 'Реализовать алгоритм поиска кратчайшего пути в взвешенном графе' },
    { id: '5', title: 'Анализ данных с Pandas', course: 'Машинное обучение', dueDate: '05 фев 2026', status: 'submitted', points: 85, description: 'Выполнить анализ датасета с использованием библиотеки Pandas' },
    { id: '6', title: 'React компоненты', course: 'Веб-разработка', dueDate: '08 фев 2026', status: 'submitted', points: 70, description: 'Создать набор переиспользуемых React компонентов' },
  ];

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const overdueCount = assignments.filter(a => a.status === 'overdue').length;

  const statCards = [
    { label: 'К выполнению', count: pendingCount, icon: Clock, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', glow: 'rgba(245,158,11,0.3)' },
    { label: 'Сдано', count: submittedCount, icon: CheckCircle, gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Просрочено', count: overdueCount, icon: AlertCircle, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239,68,68,0.3)' },
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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Старые Задания</h2>
        <p className="text-slate-500 font-medium text-sm">Ваши текущие и выполненные задания (Альтернативный вид)</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-6 rounded-2xl flex items-center gap-5 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform"
                style={{ background: card.gradient, boxShadow: `0 8px 20px -4px ${card.glow}` }}
              >
                <Icon className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <div>
                <div className="text-3xl tracking-tight mb-1 font-extrabold text-slate-800">{card.count}</div>
                <div className="text-sm font-medium text-slate-500">{card.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Assignments List */}
      <div className="space-y-5 relative z-10 max-w-5xl">
        {assignments.map((assignment, index) => {
          const sc = statusConfig[assignment.status];
          const StatusIcon = sc.icon;

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className="rounded-2xl bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 hover:shadow-xl hover:ring-indigo-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold border ${sc.bg} ${sc.border} ${sc.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {sc.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600">
                        {assignment.course}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">{assignment.title}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">{assignment.description}</p>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Срок: {assignment.dueDate}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-slate-600">Баллы: {assignment.points}</span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 min-w-[180px]">
                    {assignment.status === 'pending' && (
                      <button
                        className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-md active:scale-95 hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}
                      >
                        <Upload className="w-4 h-4" />
                        Сдать работу
                      </button>
                    )}
                    <button
                      className="flex-1 px-6 py-3 rounded-xl text-sm font-bold transition-all bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                    >
                      Подробнее
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
