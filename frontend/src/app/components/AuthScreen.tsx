import { useState, useRef } from 'react';
import { usersApi } from '../../api/client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, BookOpen, Users, Brain, ArrowRight } from 'lucide-react';

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

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
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
      const found = users.find((u: { email: string; role: string }) => u.email === loginEmail);
      if (!found) { setErrors({ loginEmail: 'Пользователь не найден' }); return; }
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
      await usersApi.create({ name: regName, email: regEmail, password: regPassword, role: selectedRole });
      onAuth(selectedRole);
    } catch (err: unknown) {
      setErrors({ regEmail: err instanceof Error ? err.message : 'Ошибка регистрации' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all text-sm font-medium';
  const inputClass = (err?: string) =>
    `${inputBase} ${err ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'}`;

  const features = [
    { icon: BookOpen, text: 'Доступ ко всем курсам и материалам' },
    { icon: Brain, text: 'ИИ-помощник для обучения' },
    { icon: Users, text: 'Совместная работа преподавателей и студентов' },
  ];

  // Card tilt ref (for form card only)
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x, { stiffness: 80, damping: 25 });
  const ys = useSpring(y, { stiffness: 80, damping: 25 });
  const rotateX = useTransform(ys, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(xs, [-0.5, 0.5], ['-3deg', '3deg']);

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #1d4ed8 100%)' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow orb */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">EduClass</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Учитесь.{' '}
            <span style={{ color: '#a5b4fc' }}>Развивайтесь.</span>
            {' '}Достигайте.
          </h1>
          <p className="text-indigo-200 text-base font-medium leading-relaxed max-w-sm mb-12">
            Профессиональная образовательная платформа с ИИ-ассистентом, интерактивными материалами и детальной аналитикой прогресса.
          </p>

          <div className="flex flex-col gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Icon className="w-4 h-4 text-indigo-200" />
                </div>
                <span className="text-sm font-medium text-indigo-100">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-indigo-200 text-sm font-medium italic">
            "Образование — это самое мощное оружие, которым можно изменить мир."
          </p>
          <p className="text-indigo-300/60 text-xs font-medium mt-2">— Нельсон Мандела</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50" style={{ perspective: '1200px' }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">EduClass</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {view === 'login' ? 'С возвращением' : 'Создать аккаунт'}
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1.5">
              {view === 'login' ? 'Войдите в свою учётную запись' : 'Зарегистрируйтесь для начала обучения'}
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm shadow-gray-200 ring-1 ring-gray-900/5"
          >
            <div style={{ transform: 'translateZ(20px)' }}>
              {/* Tab switcher */}
              <div className="flex p-1 rounded-xl mb-7 bg-gray-100 gap-1">
                {(['login', 'register'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => { setView(v); setErrors({}); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${view === v
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {v === 'login' ? 'Вход' : 'Регистрация'}
                  </button>
                ))}
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Роль</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {([['student', GraduationCap, 'Студент'], ['teacher', Users, 'Преподаватель']] as const).map(([role, Icon, label]) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3.5 rounded-xl transition-all duration-200 flex items-center gap-3 border ${selectedRole === role
                          ? role === 'student'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-teal-50 border-teal-300 text-teal-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedRole === role
                          ? role === 'student' ? 'bg-indigo-100' : 'bg-teal-100'
                          : 'bg-gray-100'
                        }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {view === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block tracking-wide uppercase">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                          placeholder="student@university.edu" className={inputClass(errors.loginEmail)} />
                      </div>
                      {errors.loginEmail && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.loginEmail}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block tracking-wide uppercase">Пароль</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                          placeholder="••••••••" className={`${inputClass(errors.loginPassword)} pr-12`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.loginPassword && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.loginPassword}</p>}
                    </div>

                    <div className="flex justify-end">
                      <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                        Забыли пароль?
                      </button>
                    </div>

                    <button type="submit" disabled={isLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                      {isLoading ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>Войти в систему <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    {[
                      { label: 'Полное имя', icon: User, type: 'text', value: regName, onChange: (v: string) => setRegName(v), placeholder: 'Иванов Иван Иванович', error: errors.regName, field: 'regName' },
                      { label: 'Email', icon: Mail, type: 'email', value: regEmail, onChange: (v: string) => setRegEmail(v), placeholder: 'user@university.edu', error: errors.regEmail, field: 'regEmail' },
                    ].map(({ label, icon: Icon, type, value, onChange, placeholder, error }) => (
                      <div key={label}>
                        <label className="text-xs font-bold text-gray-500 mb-2 block tracking-wide uppercase">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type={type} value={value} onChange={e => onChange(e.target.value)}
                            placeholder={placeholder} className={inputClass(error)} />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
                      </div>
                    ))}

                    {[
                      { label: 'Пароль', show: showPassword, setShow: setShowPassword, value: regPassword, onChange: setRegPassword, placeholder: 'Минимум 6 символов', error: errors.regPassword },
                      { label: 'Подтвердите пароль', show: showConfirm, setShow: setShowConfirm, value: regConfirm, onChange: setRegConfirm, placeholder: '••••••••', error: errors.regConfirm },
                    ].map(({ label, show, setShow, value, onChange, placeholder, error }) => (
                      <div key={label}>
                        <label className="text-xs font-bold text-gray-500 mb-2 block tracking-wide uppercase">{label}</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
                            placeholder={placeholder} className={`${inputClass(error)} pr-12`} />
                          <button type="button" onClick={() => setShow(!show)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
                      </div>
                    ))}

                    <button type="submit" disabled={isLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                      {isLoading ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>Создать аккаунт <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <p className="text-center text-gray-400 text-xs font-medium mt-6">
            Для входа используйте данные, с которыми регистрировались
          </p>
        </div>
      </div>
    </div>
  );
}
