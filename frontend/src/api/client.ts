const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });

  const contentType = response.headers.get('content-type');
  const payload = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null
        ? Array.isArray(payload.message)
          ? payload.message.join(', ')
          : payload.message || payload.error
        : payload;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export const usersApi = {
  list(): Promise<User[]> {
    return request('/users');
  },
  create(data: { name: string; email: string; password: string; role: string }): Promise<User> {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
