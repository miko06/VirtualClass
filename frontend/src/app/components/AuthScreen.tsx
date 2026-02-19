import { useState } from 'react';
import { usersApi } from '../../api/client';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, Bot, Sparkles, Shield, Zap } from 'lucide-react';

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
    `w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-all text-sm ${err
      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
      : 'border-white/10 focus:border-violet-500 focus:ring-violet-500/30'
    }`;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{ background: '#060612' }}>
      {/* Animated RGB orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="orb-1 absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
            top: '-200px',
            left: '-200px',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="orb-2 absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
            bottom: '-100px',
            right: '-150px',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="orb-3 absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="orb-4 absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            bottom: '20%',
            left: '10%',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

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
              className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)',
                boxShadow: '0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)',
              }}
            >
              <Bot className="w-10 h-10 text-white relative z-10" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite',
                  backgroundSize: '200% 200%',
                }}
              />
            </div>
            <div
              className="absolute -inset-2 rounded-3xl opacity-20 blur-md"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            />
          </div>
          <h1
            className="text-4xl mb-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              background: 'linear-gradient(135deg, #c4b5fd 0%, #67e8f9 50%, #f9a8d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            EduClass AI
          </h1>
          <p className="text-slate-400 text-sm">Виртуальный класс с ИИ-ассистентом</p>

          {/* Feature pills */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {[
              { icon: Sparkles, label: 'ИИ-генерация', color: 'text-violet-400' },
              { icon: Shield, label: 'Безопасно', color: 'text-cyan-400' },
              { icon: Zap, label: 'Быстро', color: 'text-pink-400' },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${color}`}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl p-8 relative"
          style={{
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Gradient top border */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(6,182,212,0.6), transparent)' }}
          />

          {/* Tab Switcher */}
          <div
            className="flex p-1 rounded-xl mb-7"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {(['login', 'register'] as const).map(v => (
              <button
                key={v}
                onClick={() => { setView(v); setErrors({}); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                style={
                  view === v
                    ? {
                      background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
                    }
                    : { color: '#94a3b8' }
                }
              >
                {v === 'login' ? 'Вход' : 'Регистрация'}
              </button>
            ))}
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">Выберите роль</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedRole('student')}
                className="p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2"
                style={
                  selectedRole === 'student'
                    ? {
                      background: 'rgba(139,92,246,0.15)',
                      border: '1px solid rgba(139,92,246,0.5)',
                      boxShadow: '0 0 20px rgba(139,92,246,0.15)',
                    }
                    : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }
                }
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: selectedRole === 'student'
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(99,102,241,0.4))'
                      : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <GraduationCap
                    className="w-5 h-5"
                    style={{ color: selectedRole === 'student' ? '#c4b5fd' : '#64748b' }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: selectedRole === 'student' ? '#c4b5fd' : '#64748b' }}
                >
                  Студент
                </span>
              </button>

              <button
                onClick={() => setSelectedRole('teacher')}
                className="p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2"
                style={
                  selectedRole === 'teacher'
                    ? {
                      background: 'rgba(6,182,212,0.12)',
                      border: '1px solid rgba(6,182,212,0.5)',
                      boxShadow: '0 0 20px rgba(6,182,212,0.15)',
                    }
                    : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }
                }
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: selectedRole === 'teacher'
                      ? 'linear-gradient(135deg, rgba(6,182,212,0.4), rgba(14,165,233,0.4))'
                      : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: selectedRole === 'teacher' ? '#67e8f9' : '#64748b' }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: selectedRole === 'teacher' ? '#67e8f9' : '#64748b' }}
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
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="text-slate-300 text-xs font-medium mb-2 block uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className={inputClass(errors.loginEmail)}
                    />
                  </div>
                  {errors.loginEmail && (
                    <p className="text-red-400 text-xs mt-1">{errors.loginEmail}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-slate-300 text-xs font-medium mb-2 block uppercase tracking-wider">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.loginPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.loginPassword}</p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    Забыли пароль?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-medium text-white text-sm relative overflow-hidden transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                    boxShadow: '0 0 25px rgba(124,58,237,0.4)',
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

                <p className="text-center text-slate-500 text-xs">
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('register'); setErrors({}); }}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="text-slate-300 text-xs font-medium mb-2 block uppercase tracking-wider">
                    Полное имя
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Иванов Иван Иванович"
                      className={inputClass(errors.regName)}
                    />
                  </div>
                  {errors.regName && <p className="text-red-400 text-xs mt-1">{errors.regName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-slate-300 text-xs font-medium mb-2 block uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="user@university.edu"
                      className={inputClass(errors.regEmail)}
                    />
                  </div>
                  {errors.regEmail && <p className="text-red-400 text-xs mt-1">{errors.regEmail}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="text-slate-300 text-xs font-medium mb-2 block uppercase tracking-wider">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.regPassword && <p className="text-red-400 text-xs mt-1">{errors.regPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-slate-300 text-xs font-medium mb-2 block uppercase tracking-wider">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.regConfirm && <p className="text-red-400 text-xs mt-1">{errors.regConfirm}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-medium text-white text-sm transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    boxShadow: '0 0 25px rgba(124,58,237,0.4)',
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

                <p className="text-center text-slate-500 text-xs">
                  Уже есть аккаунт?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('login'); setErrors({}); }}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Войти
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 text-xs mt-6"
        >
          Для входа используйте данные, с которыми регистрировались
        </motion.p>
      </div>
    </div>
  );
}
