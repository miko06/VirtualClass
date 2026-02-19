import { FileText, Video, Download, ExternalLink, Book, FileCode } from 'lucide-react';
import { motion } from 'motion/react';

interface Material {
  id: string;
  title: string;
  type: 'video' | 'document' | 'slides' | 'code';
  course: string;
  date: string;
  size?: string;
  duration?: string;
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

const typeConfig = {
  video: { icon: Video, gradient: 'linear-gradient(135deg, #ef4444, #ec4899)', glow: 'rgba(239,68,68,0.3)', label: 'Видео' },
  document: { icon: FileText, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', glow: 'rgba(6,182,212,0.3)', label: 'Документ' },
  slides: { icon: Book, gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', glow: 'rgba(139,92,246,0.3)', label: 'Презентация' },
  code: { icon: FileCode, gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)', label: 'Код' },
};

export function Materials() {
  const materials: Material[] = [
    { id: '1', title: 'Введение в нейронные сети', type: 'video', course: 'Машинное обучение', date: '10 фев 2026', duration: '45 мин' },
    { id: '2', title: 'Лекция 5: React Hooks', type: 'slides', course: 'Веб-разработка', date: '12 фев 2026', size: '2.4 МБ' },
    { id: '3', title: 'Практика: SQL запросы', type: 'document', course: 'Базы данных', date: '08 фев 2026', size: '1.8 МБ' },
    { id: '4', title: 'Код примера: Быстрая сортировка', type: 'code', course: 'Алгоритмы', date: '14 фев 2026', size: '156 КБ' },
    { id: '5', title: 'Обучение с учителем', type: 'video', course: 'Машинное обучение', date: '13 фев 2026', duration: '52 мин' },
    { id: '6', title: 'TypeScript: Типы и интерфейсы', type: 'document', course: 'Веб-разработка', date: '09 фев 2026', size: '3.1 МБ' },
    { id: '7', title: 'Нормализация баз данных', type: 'slides', course: 'Базы данных', date: '11 фев 2026', size: '4.2 МБ' },
    { id: '8', title: 'Графовые алгоритмы', type: 'video', course: 'Алгоритмы', date: '15 фев 2026', duration: '38 мин' },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>Учебные материалы</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Все лекции, презентации и дополнительные материалы
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {materials.map((material, index) => {
          const cfg = typeConfig[material.type];
          const Icon = cfg.icon;

          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={cardStyle}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.gradient, boxShadow: `0 0 15px ${cfg.glow}` }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base mb-1 truncate" style={{ color: '#e2e8f0', fontWeight: 600 }}>
                      {material.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {material.course}
                    </p>

                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs"
                        style={{
                          background: `${cfg.glow.replace('0.3', '0.12')}`,
                          border: `1px solid ${cfg.glow.replace('0.3', '0.25')}`,
                          color: '#e2e8f0',
                        }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{material.date}</span>
                      {material.size && (
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{material.size}</span>
                      )}
                      {material.duration && (
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{material.duration}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs transition-all"
                        style={{
                          background: cfg.gradient,
                          boxShadow: `0 0 12px ${cfg.glow}`,
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Открыть
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Скачать
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
