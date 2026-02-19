import { UserCircle, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onRoleSelect: (role: 'teacher' | 'student') => void;
}

export function LoginScreen({ onRoleSelect }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">EduClass AI</h1>
          <p className="text-lg text-gray-600">Виртуальный класс с помощником ИИ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => onRoleSelect('teacher')}
            className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Преподаватель</h2>
            <p className="text-gray-600 mb-6">
              Создавайте курсы, генерируйте задания с помощью ИИ и управляйте обучением студентов
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Загрузка материалов</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Генерация тестов с ИИ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Аналитика и оценка</span>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onRoleSelect('student')}
            className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Студент</h2>
            <p className="text-gray-600 mb-6">
              Изучайте материалы, выполняйте задания и получайте помощь от ИИ-ассистента
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Доступ к материалам</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Выполнение заданий</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>ИИ-помощник 24/7</span>
              </div>
            </div>
          </motion.button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Демонстрационная версия • Все данные являются примерами
        </p>
      </motion.div>
    </div>
  );
}
