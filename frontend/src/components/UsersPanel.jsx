import { useEffect, useState } from "react";
import { usersApi } from "../api/client";

const emptyForm = {
  email: "",
  password: "",
  name: "",
};

export function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const data = await usersApi.list();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await usersApi.create(form);
      setForm(emptyForm);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="users-layout">
      <article className="users-card">
        <div className="card-header">
          <h2>Users API</h2>
          <button type="button" onClick={loadUsers} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {error && <p className="error-msg">{error}</p>}
        {!error && users.length === 0 && !loading && (
          <p className="empty-msg">No users yet.</p>
        )}
        <ul className="users-list">
          {users.map((user) => (
            <li key={user.id}>
              <div>
                <p className="name">{user.name || "No name"}</p>
                <p className="email">{user.email}</p>
              </div>
              <span>{user.role}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="users-card">
        <h2>Create User</h2>
        <form className="users-form" onSubmit={onSubmit}>
          <label>
            Name
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              placeholder="jane@example.com"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              placeholder="at least 6 characters"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create user"}
          </button>
        </form>
      </article>
    </section>
  );
}
