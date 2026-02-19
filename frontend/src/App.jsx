import { useMemo, useState } from "react";
import { UsersPanel } from "./components/UsersPanel";

const tabsByRole = {
  teacher: [
    { id: "dashboard", label: "Главная" },
    { id: "courses", label: "Курсы" },
    { id: "materials", label: "Материалы" },
    { id: "ai", label: "ИИ генератор" },
    { id: "analytics", label: "Аналитика" },
    { id: "users", label: "Пользователи" },
  ],
  student: [
    { id: "dashboard", label: "Главная" },
    { id: "courses", label: "Курсы" },
    { id: "materials", label: "Материалы" },
    { id: "assistant", label: "ИИ помощник" },
    { id: "assignments", label: "Задания" },
    { id: "users", label: "Пользователи" },
  ],
};

const tabMeta = {
  dashboard: {
    title: "Обзор класса",
    subtitle: "Ключевые метрики и быстрые действия по учебному процессу.",
  },
  courses: {
    title: "Мои курсы",
    subtitle: "Управление программой, модулями и прогрессом.",
  },
  materials: {
    title: "Материалы",
    subtitle: "Лекции, конспекты и полезные источники для занятий.",
  },
  ai: {
    title: "ИИ генератор",
    subtitle: "Создание тестов и заданий по загруженному контенту.",
  },
  analytics: {
    title: "Аналитика",
    subtitle: "Успеваемость, активность и динамика результатов.",
  },
  assistant: {
    title: "ИИ помощник",
    subtitle: "Подсказки по темам и помощь в выполнении заданий.",
  },
  assignments: {
    title: "Задания",
    subtitle: "Список активных и завершенных домашних работ.",
  },
};

function PlaceholderContent({ role, tab }) {
  const meta = tabMeta[tab] ?? tabMeta.dashboard;
  const statCards =
    role === "teacher"
      ? [
          { value: "142", label: "Студентов в системе" },
          { value: "18", label: "Активных курсов" },
          { value: "96%", label: "Сдано вовремя" },
        ]
      : [
          { value: "6", label: "Курсов в семестре" },
          { value: "14", label: "Заданий на неделе" },
          { value: "88%", label: "Средний прогресс" },
        ];

  const tasks =
    role === "teacher"
      ? [
          "Проверить ответы по теме «Сети и протоколы».",
          "Опубликовать новый материал в модуле 3.",
          "Сформировать тест через ИИ генератор.",
        ]
      : [
          "Завершить практику по React до 21:00.",
          "Пройти мини-тест по теме API.",
          "Повторить лекцию по серверной архитектуре.",
        ];

  return (
    <section className="page-content">
      <article className="glass-card hero-card">
        <p className="eyebrow">Виртуальный класс с ИИ</p>
        <h2>{meta.title}</h2>
        <p>{meta.subtitle}</p>
      </article>

      <div className="stats-grid">
        {statCards.map((item) => (
          <article className="glass-card stat-card" key={item.label}>
            <p className="stat-value">{item.value}</p>
            <p className="stat-label">{item.label}</p>
          </article>
        ))}
      </div>

      <article className="glass-card">
        <h3>Ближайшие действия</h3>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabs = useMemo(() => (role ? tabsByRole[role] : []), [role]);

  function pickRole(nextRole) {
    setRole(nextRole);
    setActiveTab("dashboard");
  }

  function logout() {
    setRole(null);
    setActiveTab("dashboard");
  }

  if (!role) {
    return (
      <div className="app-stage">
        <div className="background-orb orb-1" />
        <div className="background-orb orb-2" />
        <div className="background-orb orb-3" />

        <section className="auth-wrap">
          <article className="glass-card auth-card">
            <p className="eyebrow">Virtual Class With AI</p>
            <h1>Выберите роль для входа</h1>
            <p className="muted">
              Интерфейс в стиле макета: тёмная панель, неоновые акценты и
              дашборд структура.
            </p>
            <div className="role-grid">
              <button className="role-btn" onClick={() => pickRole("teacher")}>
                <span>Преподаватель</span>
                <small>Курсы, материалы, аналитика, генерация заданий</small>
              </button>
              <button className="role-btn" onClick={() => pickRole("student")}>
                <span>Студент</span>
                <small>Курсы, задания, ИИ-помощник, личный прогресс</small>
              </button>
            </div>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="app-stage">
      <div className="background-orb orb-1" />
      <div className="background-orb orb-2" />
      <div className="background-orb orb-3" />

      <div className="dashboard-shell">
        <aside className="glass-card sidebar">
          <div className="brand">
            <p className="eyebrow">EduClass AI</p>
            <h2>{role === "teacher" ? "Панель преподавателя" : "Панель студента"}</h2>
          </div>

          <nav className="nav-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={tab.id === activeTab ? "nav-btn is-active" : "nav-btn"}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button className="logout-btn" onClick={logout}>
            Выйти
          </button>
        </aside>

        <main className="main-pane">
          {activeTab === "users" ? (
            <UsersPanel />
          ) : (
            <PlaceholderContent role={role} tab={activeTab} />
          )}
        </main>
      </div>
    </div>
  );
}
