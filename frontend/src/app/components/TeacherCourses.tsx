import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, Edit, Trash2, Settings, X, Loader2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';
import { classesApi, ClassItem } from '../../api/client';
import type { User } from '../../api/client';
import { TeacherCourseDetails } from './TeacherCourseDetails';

const GRADIENTS = [
  { gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)', glow: 'rgba(124,58,237,0.3)' },
  { gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
  { gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.3)' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', glow: 'rgba(245,158,11,0.3)' },
  { gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)', glow: 'rgba(14,165,233,0.3)' },
];

interface TeacherCoursesProps {
  currentUser?: User | null;
}

export function TeacherCourses({ currentUser }: TeacherCoursesProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState<ClassItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', semester: '2025-2026 / 2-й семестр' });
  const [selectedCourse, setSelectedCourse] = useState<ClassItem | null>(null);

  const load = () => {
    if (!currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    classesApi.byTeacher(currentUser.id)
      .then(setClasses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [currentUser?.id]);

  if (selectedCourse) {
    return <TeacherCourseDetails course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  const openCreate = () => {
    setEditClass(null);
    setForm({ name: '', description: '', semester: '2025-2026 / 2-й семестр' });
    setShowModal(true);
  };

  const openEdit = (cls: ClassItem) => {
    setEditClass(cls);
    setForm({ name: cls.name, description: cls.description ?? '', semester: cls.semester ?? '' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот класс? Все записи студентов будут удалены.')) return;
    await classesApi.remove(id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !currentUser?.id) return;
    setSubmitting(true);
    try {
      if (editClass) {
        const updated = await classesApi.update(editClass.id, { name: form.name, description: form.description, semester: form.semester });
        setClasses((prev) => prev.map((c) => c.id === editClass.id ? { ...c, ...updated } : c));
      } else {
        const created = await classesApi.create({
          name: form.name,
          description: form.description,
          teacherId: currentUser.id,
          semester: form.semester,
        });
        setClasses((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="legacy-theme-screen p-8 min-h-screen relative overflow-hidden bg-slate-50">
      <ThemeSquaresBackground />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Управление курсами</h2>
          <p className="text-slate-500 font-medium text-sm">Создавайте и редактируйте ваши курсы</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 8px 20px -6px rgba(14,165,233,0.4)' }}
        >
          <Plus className="w-5 h-5" /> Создать курс
        </motion.button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="ml-3 text-slate-500 font-medium">Загрузка курсов...</span>
        </div>
      )}

      {!loading && classes.length === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
            <GraduationCap className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Курсов пока нет</h3>
          <p className="text-slate-400 font-medium max-w-xs mb-6">Нажмите «Создать курс» чтобы добавить первый класс</p>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
            <Plus className="w-5 h-5" /> Создать первый курс
          </button>
        </motion.div>
      )}

      {!loading && classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 relative z-10">
          {classes.map((cls, index) => {
            const palette = GRADIENTS[index % GRADIENTS.length];
            const studentCount = cls.enrollments?.length ?? 0;
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col hover:shadow-2xl hover:ring-indigo-100 transition-all duration-300 group"
              >
                <div className="h-2 w-full" style={{ background: palette.gradient }} />
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {cls.name}
                      </h3>
                      <span className="text-xs font-bold px-3 py-1.5 rounded-lg ml-3 flex-shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Активный
                      </span>
                    </div>
                    {cls.description && (
                      <p className="text-sm font-medium leading-relaxed text-slate-500 line-clamp-2">{cls.description}</p>
                    )}
                    {cls.semester && (
                      <p className="text-xs text-slate-400 font-medium mt-2">{cls.semester}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { icon: Users, value: studentCount, label: 'Студентов' },
                      { icon: BookOpen, value: 0, label: 'Материалов' },
                    ].map(({ icon: Icon, value, label }) => (
                      <div key={label} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <Icon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                        <div className="text-xl font-extrabold text-slate-800">{value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg active:scale-95"
                      style={{ background: palette.gradient, boxShadow: `0 8px 20px -6px ${palette.glow}` }}
                      onClick={() => setSelectedCourse(cls)}
                    >
                      <Settings className="w-4 h-4" /> Управление
                    </button>
                    <button onClick={() => openEdit(cls)}
                      className="px-4 py-3 rounded-xl transition-all border-2 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 active:scale-95" title="Редактировать">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(cls.id)}
                      className="px-4 py-3 rounded-xl transition-all border-2 border-rose-100 text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 active:scale-95 shadow-sm" title="Удалить">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl ring-1 ring-slate-100 w-full max-w-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {editClass ? 'Редактировать курс' : 'Создать новый курс'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Название дисциплины / курса *</label>
                  <input
                    type="text"
                    placeholder="Например: Базы данных"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Описание</label>
                  <textarea
                    placeholder="Краткое описание курса..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full h-28 px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Семестр</label>
                  <input
                    type="text"
                    placeholder="2025-2026 / 2-й семестр"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                  />
                </div>

                {!editClass && (
                  <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-700 font-medium">
                    💡 После создания курса все студенты группы ИС-37 будут автоматически зачислены.
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 px-5 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                  Отмена
                </button>
                <button onClick={handleSubmit} disabled={!form.name.trim() || submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editClass ? 'Сохранить' : 'Создать курс'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
