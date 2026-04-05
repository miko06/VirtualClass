import React, { useState, useRef } from 'react';
import { Moon, Sun, Facebook, Instagram, Send, Youtube } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export type SignInValues = {
  email: string;
  password: string;
};

type Props = {
  onSignIn?: (values: SignInValues) => void | Promise<void>;
};

const universitySocials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/enugumilyov_official/?igshid=YmMyMTA2M2Y%3D',
    Icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Еуразия-Ұлттық-Университеті/100010619352572/?mibextid=LQQJ4d',
    Icon: Facebook,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UClR-FVuL-Vxi_izxanKk44g',
    Icon: Youtube,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/enuofficial',
    Icon: Send,
  },
];

export default function AuthCard({ onSignIn }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState(false);
  const [signIn, setSignIn] = useState<SignInValues>({ email: '', password: '' });
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  async function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);
    try {
      await onSignIn?.(signIn);
    } catch (err: any) {
      setSignInError(err?.message ?? 'Неверный email или пароль');
    } finally {
      setSignInLoading(false);
    }
  }

  function handleStart() {
    setActive(false);
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#e2e8ff] to-[#ced7ff] dark:from-[#0f1115] dark:to-[#171e2f] transition-colors duration-300 flex items-center justify-center p-6 relative">
      <button onClick={toggleTheme} className="absolute top-6 right-8 z-50 p-2.5 rounded-full bg-white/90 dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all" aria-label="Переключить тему">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <div className={['relative overflow-hidden bg-white dark:bg-[#151923] shadow-[0_10px_35px_rgba(0,0,0,0.30)]', 'rounded-[30px] w-full max-w-[980px] min-h-[620px]'].join(' ')}>
        <div className={['absolute inset-y-0 left-0 w-1/2 z-20', 'transition-transform duration-700 ease-in-out', active ? 'translate-x-full' : 'translate-x-0'].join(' ')}>
          <form onSubmit={handleSignInSubmit} className="h-full bg-white dark:bg-[#151923] flex flex-col items-center justify-center px-10 md:px-14">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Вход в VirtualClass</h1>
            <span className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">Войдите, чтобы продолжить обучение,<br />открыть курсы и ИИ-помощника</span>
            <input ref={emailInputRef} className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500" type="email" placeholder="Email" value={signIn.email} onChange={(e) => setSignIn((s) => ({ ...s, email: e.target.value }))} required />
            <input className="mt-3 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500" type="password" placeholder="Пароль" value={signIn.password} onChange={(e) => setSignIn((s) => ({ ...s, password: e.target.value }))} required />
            {signInError && <p className="mt-3 w-full text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-center">{signInError}</p>}
            <a href="#" className="mt-4 text-sm text-gray-700 dark:text-gray-300 hover:underline">Забыли пароль?</a>
            <button type="submit" disabled={signInLoading} className="mt-6 rounded-lg bg-violet-700 px-12 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-violet-800 transition disabled:opacity-60 disabled:cursor-not-allowed">{signInLoading ? 'Вход...' : 'Войти'}</button>
          </form>
        </div>
        <div className={['absolute inset-y-0 left-0 w-1/2', 'transition-all duration-700 ease-in-out', active ? 'translate-x-full opacity-100 z-30' : 'translate-x-0 opacity-0 z-10'].join(' ')}>
          <div className="h-full bg-white dark:bg-[#151923] flex flex-col justify-center px-8 md:px-12 py-12">
            <h2 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-white">Добро пожаловать в VirtualClass</h2>
            <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-300">Платформа для учебного процесса и цифрового сопровождения обучения. Следите за новостями университета в официальных соцсетях.</p>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">Соцсети университета</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {universitySocials.map(({ label, href, Icon }) => (<a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#222938] px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2a3244] transition"><Icon size={17} /><span>{label}</span></a>))}
              </div>
            </div>
            <button type="button" onClick={handleStart} className="mt-8 self-center rounded-lg bg-violet-700 px-8 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-violet-800 transition">Начать</button>
          </div>
        </div>
        <div className={['absolute top-0 left-1/2 h-full w-1/2 overflow-hidden z-40', 'transition-all duration-700 ease-in-out', active ? '-translate-x-full rounded-r-[30px] rounded-l-[0px]' : 'translate-x-0'].join(' ')} style={{ borderTopLeftRadius: active ? 0 : 150, borderBottomLeftRadius: active ? 0 : 100, borderTopRightRadius: active ? 150 : 0, borderBottomRightRadius: active ? 100 : 0 }}>
          <div className={['relative -left-full h-full w-[200%] text-white', 'bg-gradient-to-r from-[#5c6bc0] to-[#512da8]', 'transition-transform duration-700 ease-in-out', active ? 'translate-x-1/2' : 'translate-x-0'].join(' ')}>
            <div className={['absolute top-0 left-0 h-full w-1/2', 'flex flex-col items-center justify-center text-center px-8', 'transition-transform duration-700 ease-in-out', active ? 'translate-x-0' : '-translate-x-[200%]'].join(' ')}>
              <h1 className="text-3xl font-semibold">Уже с нами?</h1>
              <p className="mt-5 text-sm leading-5 tracking-wide opacity-95">Войдите в аккаунт, чтобы продолжить занятия, отслеживать прогресс и пользоваться ИИ-помощником.</p>
              <button type="button" onClick={() => setActive(false)} className="mt-4 rounded-lg border border-white/90 bg-transparent px-10 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/10 transition">Войти</button>
            </div>
            <div className={['absolute top-0 right-0 h-full w-1/2', 'flex flex-col items-center justify-center text-center px-8', 'transition-transform duration-700 ease-in-out', active ? 'translate-x-[200%]' : 'translate-x-0'].join(' ')}>
              <h1 className="text-3xl font-semibold">Добро пожаловать!</h1>
              <p className="mt-5 text-sm leading-5 tracking-wide opacity-95">Платформа для учебного процесса и цифрового сопровождения обучения. Следите за новостями университета.</p>
              <button type="button" onClick={() => setActive(true)} className="mt-4 rounded-lg border border-white/90 bg-transparent px-10 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/10 transition">Узнать больше</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
