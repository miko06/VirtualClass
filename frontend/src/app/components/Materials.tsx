import { FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';

export function Materials() {
  return (
    <div className="legacy-theme-screen p-8 min-h-screen relative overflow-hidden bg-slate-50">
      <ThemeSquaresBackground />

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Материалы</h1>
        <p className="text-slate-500 font-medium text-sm">Учебные материалы по вашим курсам</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center relative z-10"
      >
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
          <FolderOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-3">Материалов пока нет</h3>
        <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
          Когда преподаватель загрузит учебные материалы для вашего курса, они появятся здесь.
        </p>
      </motion.div>
    </div>
  );
}
