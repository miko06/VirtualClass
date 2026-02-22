import { useState, useRef } from 'react';
import { usersApi } from '../../api/client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, Bot } from 'lucide-react';

type AuthView = 'login' | 'register';
type UserRole = 'teacher' | 'student';

interface AuthScreenProps {
  onAuth: (role: UserRole) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginEmail) e.loginEmail = 'Введите email';
    if (!loginPassword) e.loginPassword = 'Введите пароль';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!regName.trim()) e.regName = 'Введите имя';
    if (!regEmail) e.regEmail = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) e.regEmail = 'Некорректный email';
    if (!regPassword) e.regPassword = 'Введите пароль';
    else if (regPassword.length < 6) e.regPassword = 'Минимум 6 символов';
    if (regPassword !== regConfirm) e.regConfirm = 'Пароли не совпадают';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      const users = await usersApi.list();
      const found = users.find(
        (u: { email: string; role: string }) => u.email === loginEmail
      );
      if (!found) {
        setErrors({ loginEmail: 'Пользователь не найден' });
        return;
      }
      onAuth(found.role as 'teacher' | 'student');
    } catch (err: unknown) {
      setErrors({ loginEmail: err instanceof Error ? err.message : 'Ошибка сервера' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setIsLoading(true);
    try {
      await usersApi.create({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: selectedRole,
      });
      onAuth(selectedRole);
    } catch (err: unknown) {
      setErrors({ regEmail: err instanceof Error ? err.message : 'Ошибка регистрации' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (err?: string) =>
    `w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all text-sm shadow-sm ${err
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
    }`;

  // 3D Tilt Effect logic
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-slate-50 text-slate-900 font-sans" style={{ perspective: '1200px' }}>

      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Soft gradient backgrounds for light mode */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-indigo-100/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] rounded-full bg-teal-100/60 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="relative inline-flex mb-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden bg-white shadow-xl shadow-indigo-500/10 border border-slate-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-10" />
              <Bot className="w-10 h-10 text-indigo-600 relative z-10" />
            </div>
          </div>
          <h1
            className="text-4xl mb-2 tracking-tight"
            style={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            EduClass
          </h1>
          <p className="text-slate-500 text-sm font-medium">Профессиональная цифровая среда</p>
        </motion.div>

        {/* Auth Card with 3D Tilt */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-8 relative bg-white shadow-2xl shadow-indigo-500/5 ring-1 ring-slate-900/5 group"
        >
          {/* Subtle reflection effect on the card */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8), transparent 60%)',
              transform: 'translateZ(1px)' // Prevents Z-fighting
            }}
          />

          <div style={{ transform: 'translateZ(30px)' }}>
            {/* Tab Switcher */}
            <div
              className="flex p-1 rounded-xl mb-7 bg-slate-100/80 border border-slate-200"
            >
              {(['login', 'register'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => { setView(v); setErrors({}); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${view === v
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  {v === 'login' ? 'Вход' : 'Регистрация'}
                </button>
              ))}
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3">Роль</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedRole('student')}
                  className={`p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 border-2 ${selectedRole === 'student'
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-sm shadow-indigo-500/20'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedRole === 'student'
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold ${selectedRole === 'student' ? 'text-indigo-700' : 'text-slate-600'
                      }`}
                  >
                    Студент
                  </span>
                </button>

                <button
                  onClick={() => setSelectedRole('teacher')}
                  className={`p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 border-2 ${selectedRole === 'teacher'
                      ? 'bg-teal-50/50 border-teal-500 shadow-sm shadow-teal-500/20'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedRole === 'teacher'
                        ? 'bg-teal-100 text-teal-600'
                        : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold ${selectedRole === 'teacher' ? 'text-teal-700' : 'text-slate-600'
                      }`}
                  >
                    Преподаватель
                  </span>
                </button>
              </div>
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {view === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div>
                    <label className="text-slate-600 text-xs font-bold mb-2 block tracking-wide">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className={inputClass(errors.loginEmail)}
                      />
                    </div>
                    {errors.loginEmail && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.loginEmail}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-slate-600 text-xs font-bold mb-2 block tracking-wide">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass(errors.loginPassword)} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.loginPassword && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.loginPassword}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                      Забыли пароль?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white text-sm relative overflow-hidden transition-all shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:transform-none"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Входим...
                      </span>
                    ) : (
                      'Войти в систему'
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="text-slate-600 text-xs font-bold mb-2 block tracking-wide">
                      Полное имя
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="Иванов Иван Иванович"
                        className={inputClass(errors.regName)}
                      />
                    </div>
                    {errors.regName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.regName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-slate-600 text-xs font-bold mb-2 block tracking-wide">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="user@university.edu"
                        className={inputClass(errors.regEmail)}
                      />
                    </div>
                    {errors.regEmail && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.regEmail}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-slate-600 text-xs font-bold mb-2 block tracking-wide">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Минимум 6 символов"
                        className={`${inputClass(errors.regPassword)} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.regPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.regPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-slate-600 text-xs font-bold mb-2 block tracking-wide">
                      Подтвердите пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={regConfirm}
                        onChange={e => setRegConfirm(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputClass(errors.regConfirm)} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.regConfirm && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.regConfirm}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:transform-none"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Создаём аккаунт...
                      </span>
                    ) : (
                      'Создать аккаунт'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 text-sm mt-8 font-medium"
        >
          Для входа используйте данные, с которыми регистрировались
        </motion.p>
      </div>
    </div>
  );
}
