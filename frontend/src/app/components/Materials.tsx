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

const typeConfig = {
  video: { icon: Video, gradient: 'linear-gradient(135deg, #ef4444, #ec4899)', glow: 'rgba(239,68,68,0.3)', label: 'Видео' },
  document: { icon: FileText, gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', glow: 'rgba(14,165,233,0.3)', label: 'Документ' },
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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Учебные материалы</h2>
        <p className="text-slate-500 font-medium text-sm">
          Все лекции, презентации и дополнительные материалы
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        {materials.map((material, index) => {
          const cfg = typeConfig[material.type];
          const Icon = cfg.icon;

          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="rounded-2xl overflow-hidden bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 hover:ring-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow"
                    style={{ background: cfg.gradient, boxShadow: `0 4px 12px ${cfg.glow}` }}
                  >
                    <Icon className="w-7 h-7 text-white drop-shadow-sm" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg mb-1.5 font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 mb-4 truncate">
                      {material.course}
                    </p>

                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{
                          background: `${cfg.glow.replace('0.3', '0.1')}`,
                          border: `1px solid ${cfg.glow.replace('0.3', '0.2')}`,
                          color: cfg.gradient.split(', ')[1], // Use second color of gradient for text
                        }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{material.date}</span>
                      {material.size && (
                        <span className="text-xs font-bold text-slate-400">{material.size}</span>
                      )}
                      {material.duration && (
                        <span className="text-xs font-bold text-slate-400">{material.duration}</span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 hover:shadow-lg"
                        style={{
                          background: cfg.gradient,
                          boxShadow: `0 4px 12px ${cfg.glow}`,
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Открыть
                      </button>
                      <button
                        className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
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
