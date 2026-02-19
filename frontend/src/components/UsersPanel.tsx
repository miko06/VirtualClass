import { useEffect, useState } from 'react';
import { usersApi, User } from '../api/client';
import { Users, RefreshCw, PlusCircle, Mail, User as UserIcon, Shield } from 'lucide-react';

const emptyForm = { email: '', password: '', name: '', role: 'student' };

function getRoleBadge(role: string) {
  const isTeacher = role === 'teacher';
  return (
    <span
      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: isTeacher ? 'rgba(6,182,212,0.15)' : 'rgba(139,92,246,0.15)',
        border: `1px solid ${isTeacher ? 'rgba(6,182,212,0.4)' : 'rgba(139,92,246,0.4)'}`,
        color: isTeacher ? '#67e8f9' : '#c4b5fd',
      }}
    >
      <Shield className="w-3 h-3" />
      {isTeacher ? 'Преподаватель' : 'Студент'}
    </span>
  );
}

export function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await usersApi.list();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await usersApi.create(form);
      setForm(emptyForm);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать пользователя');
    } finally {
      setSaving(false);
    }
  }

  const cardStyle = {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))' }}
        >
          <Users className="w-5 h-5" style={{ color: '#c4b5fd' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#e2e8f0' }}>Пользователи</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>Управление аккаунтами системы</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <div style={cardStyle} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: '#e2e8f0' }}>
              Все пользователи ({users.length})
            </h3>
            <button
              type="button"
              onClick={loadUsers}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#c4b5fd',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Обновление...' : 'Обновить'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-3 p-3 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          {!error && users.length === 0 && !loading && (
            <div className="text-center py-10">
              <UserIcon className="w-10 h-10 mx-auto mb-3" style={{ color: '#334155' }} />
              <p className="text-sm" style={{ color: '#475569' }}>Пока нет пользователей</p>
            </div>
          )}

          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }}
                  >
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                      {user.name || 'Без имени'}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: '#64748b' }}>
                      <Mail className="w-3 h-3" /> {user.email}
                    </p>
                  </div>
                </div>
                {getRoleBadge(user.role)}
              </li>
            ))}
          </ul>
        </div>

        {/* Create User Form */}
        <div style={cardStyle} className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <PlusCircle className="w-4 h-4" style={{ color: '#c4b5fd' }} />
            <h3 className="font-medium" style={{ color: '#e2e8f0' }}>Создать пользователя</h3>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8' }}>Имя</label>
              <input type="text" required placeholder="Иван Иванов" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8' }}>Email</label>
              <input type="email" required placeholder="user@university.edu" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8' }}>Пароль</label>
              <input type="password" required minLength={6} placeholder="Минимум 6 символов" value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8' }}>Роль</label>
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="student">Студент</option>
                <option value="teacher">Преподаватель</option>
              </select>
            </div>
            <button type="submit" disabled={saving} className="w-full py-3 rounded-xl font-medium text-white text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 0 20px rgba(124,58,237,0.3)', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Создание...' : 'Создать пользователя'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
