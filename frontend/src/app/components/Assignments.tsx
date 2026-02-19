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

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

const statusConfig = {
  pending: { label: 'К выполнению', icon: Clock, bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', color: '#818cf8' },
  submitted: { label: 'Сдано', icon: CheckCircle, bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', color: '#34d399' },
  overdue: { label: 'Просрочено', icon: AlertCircle, bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', color: '#f87171' },
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
    { label: 'К выполнению', count: pendingCount, icon: Clock, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', glow: 'rgba(99,102,241,0.3)' },
    { label: 'Сдано', count: submittedCount, icon: CheckCircle, gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Просрочено', count: overdueCount, icon: AlertCircle, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239,68,68,0.3)' },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Задания</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Ваши текущие и выполненные задания</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-5 rounded-2xl flex items-center gap-4"
              style={cardStyle}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.gradient, boxShadow: `0 0 15px ${card.glow}` }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl" style={{ color: '#f1f5f9', fontWeight: 700 }}>{card.count}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment, index) => {
          const sc = statusConfig[assignment.status];
          const StatusIcon = sc.icon;

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
                        <StatusIcon className="w-3.5 h-3.5" />
                        {sc.label}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        {assignment.course}
                      </span>
                    </div>

                    <h3 className="text-base mb-2" style={{ color: '#e2e8f0', fontWeight: 600 }}>{assignment.title}</h3>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{assignment.description}</p>

                    <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      <span>Срок: {assignment.dueDate}</span>
                      <span>•</span>
                      <span>Баллы: {assignment.points}</span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    {assignment.status === 'pending' && (
                      <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' }}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Сдать работу
                      </button>
                    )}
                    <button
                      className="px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
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
