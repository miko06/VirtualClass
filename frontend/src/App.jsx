import { UsersPanel } from "./components/UsersPanel";

export default function App() {
  return (
    <div className="app-root">
      <div className="background-orb orb-1" />
      <div className="background-orb orb-2" />
      <div className="background-orb orb-3" />

      <header className="hero">
        <p className="hero-tag">Virtual Class With AI</p>
        <h1>Frontend connected to backend API</h1>
        <p className="hero-subtitle">
          UI style is based on the archive design, and users are loaded from{" "}
          <code>GET /users</code> with creation via <code>POST /users</code>.
        </p>
      </header>

      <UsersPanel />
    </div>
  );
}
