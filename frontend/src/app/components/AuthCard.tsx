import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export type SignUpValues = {
  name: string;
  email: string;
  password: string;
};

export type SignInValues = {
  email: string;
  password: string;
};

type Props = {
  onSignUp?: (values: SignUpValues) => void | Promise<void>;
  onSignIn?: (values: SignInValues) => void | Promise<void>;
};

export default function AuthCard({ onSignUp, onSignIn }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState(false); // false = Sign In, true = Sign Up
  const [signUp, setSignUp] = useState<SignUpValues>({
    name: '',
    email: '',
    password: '',
  });
  const [signIn, setSignIn] = useState<SignInValues>({
    email: '',
    password: '',
  });

  async function handleSignUpSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSignUp?.(signUp);
  }

  async function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSignIn?.(signIn);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#e2e8ff] to-[#ced7ff] dark:from-[#0f1115] dark:to-[#171e2f] transition-colors duration-300 flex items-center justify-center p-6 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-8 z-50 p-2.5 rounded-full bg-white/90 dark:bg-[#1c1e24] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
        aria-label="Переключить тему"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <div
        className={[
          'relative overflow-hidden bg-white dark:bg-[#151923] shadow-[0_10px_35px_rgba(0,0,0,0.30)]',
          'rounded-[30px] w-full max-w-[980px] min-h-[620px]',
        ].join(' ')}
      >
        {/* Левая половина: Sign In */}
        <div
          className={[
            'absolute inset-y-0 left-0 w-1/2 z-20',
            'transition-transform duration-700 ease-in-out',
            active ? 'translate-x-full' : 'translate-x-0',
          ].join(' ')}
        >
          <form
            onSubmit={handleSignInSubmit}
            className="h-full bg-white dark:bg-[#151923] flex flex-col items-center justify-center px-10 md:px-14"
          >
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Вход в VirtualClass</h1>
            <span className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
              Войдите, чтобы продолжить обучение,
              <br />
              открыть курсы и ИИ-помощника
            </span>

            <input
              className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              type="email"
              placeholder="Email"
              value={signIn.email}
              onChange={(e) => setSignIn((s) => ({ ...s, email: e.target.value }))}
              required
            />

            <input
              className="mt-3 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              type="password"
              placeholder="Пароль"
              value={signIn.password}
              onChange={(e) =>
                setSignIn((s) => ({ ...s, password: e.target.value }))
              }
              required
            />

            <a
              href="#"
              className="mt-4 text-sm text-gray-700 dark:text-gray-300 hover:underline"
            >
              Забыли пароль?
            </a>

            <button
              type="submit"
              className="mt-6 rounded-lg bg-violet-700 px-12 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-violet-800 transition"
            >
              Войти
            </button>
          </form>
        </div>

        {/* Правая половина: Sign Up */}
        <div
          className={[
            'absolute inset-y-0 left-0 w-1/2',
            'transition-all duration-700 ease-in-out',
            active
              ? 'translate-x-full opacity-100 z-30'
              : 'translate-x-0 opacity-0 z-10',
          ].join(' ')}
        >
          <form
            onSubmit={handleSignUpSubmit}
            className="h-full bg-white dark:bg-[#151923] flex flex-col items-center justify-center px-10 md:px-14"
          >
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Регистрация</h1>
            <span className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
              Создайте аккаунт и начните обучение
              <br />
              в VirtualClass с умными инструментами
            </span>

            <input
              className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              type="text"
              placeholder="Имя и фамилия"
              value={signUp.name}
              onChange={(e) => setSignUp((s) => ({ ...s, name: e.target.value }))}
              required
            />

            <input
              className="mt-3 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              type="email"
              placeholder="Email"
              value={signUp.email}
              onChange={(e) =>
                setSignUp((s) => ({ ...s, email: e.target.value }))
              }
              required
            />

            <input
              className="mt-3 w-full rounded-lg bg-gray-100 dark:bg-[#222938] dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              type="password"
              placeholder="Пароль"
              value={signUp.password}
              onChange={(e) =>
                setSignUp((s) => ({ ...s, password: e.target.value }))
              }
              required
            />

            <button
              type="submit"
              className="mt-6 rounded-lg bg-violet-700 px-12 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-violet-800 transition"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>

        {/* Toggle контейнер (правая часть) */}
        <div
          className={[
            'absolute top-0 left-1/2 h-full w-1/2 overflow-hidden z-40',
            'transition-all duration-700 ease-in-out',
            active ? '-translate-x-full rounded-r-[30px] rounded-l-[0px]' : 'translate-x-0',
          ].join(' ')}
          style={{
            borderTopLeftRadius: active ? 0 : 150,
            borderBottomLeftRadius: active ? 0 : 100,
            borderTopRightRadius: active ? 150 : 0,
            borderBottomRightRadius: active ? 100 : 0,
          }}
        >
          <div
            className={[
              'relative -left-full h-full w-[200%] text-white',
              'bg-gradient-to-r from-[#5c6bc0] to-[#512da8]',
              'transition-transform duration-700 ease-in-out',
              active ? 'translate-x-1/2' : 'translate-x-0',
            ].join(' ')}
          >
            {/* Panel Left */}
            <div
              className={[
                'absolute top-0 left-0 h-full w-1/2',
                'flex flex-col items-center justify-center text-center px-8',
                'transition-transform duration-700 ease-in-out',
                active ? 'translate-x-0' : '-translate-x-[200%]',
              ].join(' ')}
            >
              <h1 className="text-3xl font-semibold">С возвращением!</h1>
              <p className="mt-5 text-sm leading-5 tracking-wide opacity-95">
                Войдите в аккаунт, чтобы продолжить занятия, отслеживать прогресс
                и пользоваться ИИ-помощником.
              </p>
              <button
                type="button"
                onClick={() => setActive(false)}
                className="mt-4 rounded-lg border border-white/90 bg-transparent px-10 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/10 transition"
              >
                Вход
              </button>
            </div>

            {/* Panel Right */}
            <div
              className={[
                'absolute top-0 right-0 h-full w-1/2',
                'flex flex-col items-center justify-center text-center px-8',
                'transition-transform duration-700 ease-in-out',
                active ? 'translate-x-[200%]' : 'translate-x-0',
              ].join(' ')}
            >
              <h1 className="text-3xl font-semibold">Новый в VirtualClass?</h1>
              <p className="mt-5 text-sm leading-5 tracking-wide opacity-95">
                Создайте аккаунт, чтобы получить доступ к материалам, заданиям,
                виртуальным курсам и интеллектуальной аналитике.
              </p>
              <button
                type="button"
                onClick={() => setActive(true)}
                className="mt-4 rounded-lg border border-white/90 bg-transparent px-10 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/10 transition"
              >
                Регистрация
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
