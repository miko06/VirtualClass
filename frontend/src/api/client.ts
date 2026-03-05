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
  firstName: string | null;
  lastName: string | null;
  group: string | null;
  specialtyCode: string | null;
  role: string;
  createdAt: string;
}

export interface ClassItem {
  id: number;
  name: string;
  description: string | null;
  teacherId: number;
  disciplineId: number | null;
  semester: string | null;
  teacher?: { id: number; name: string | null; email: string };
  enrollments?: Array<{ id: number }>;
  createdAt: string;
}

export const usersApi = {
  list(): Promise<User[]> {
    return request('/users');
  },
  login(email: string, password: string): Promise<User> {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  create(data: { name: string; email: string; password: string; role: string }): Promise<User> {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const classesApi = {
  byTeacher(teacherId: number): Promise<ClassItem[]> {
    return request(`/classes/teacher/${teacherId}`);
  },
  byStudent(studentId: number): Promise<ClassItem[]> {
    return request(`/classes/student/${studentId}`);
  },
  create(data: {
    name: string;
    description?: string;
    teacherId: number;
    disciplineId?: number;
    semester?: string;
  }): Promise<ClassItem> {
    return request('/classes', { method: 'POST', body: JSON.stringify(data) });
  },
  update(id: number, data: Partial<{ name: string; description: string; semester: string }>): Promise<ClassItem> {
    return request(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  remove(id: number): Promise<void> {
    return request(`/classes/${id}`, { method: 'DELETE' });
  },
};

export type MaterialType = 'pdf' | 'video' | 'archive' | 'document' | 'spreadsheet' | 'url' | 'text';

export interface MaterialItem {
  id: number;
  title: string;
  description: string | null;
  type: MaterialType;
  courseName: string;
  size: string | null;
  url: string | null;
  teacherId: number;
  teacher?: { id: number; name: string | null; email: string } | null;
  isVerified: boolean;
  createdAt: string;
}

export const materialsApi = {
  list(): Promise<MaterialItem[]> {
    return request('/materials');
  },
  byTeacher(teacherId: number): Promise<MaterialItem[]> {
    return request(`/materials/teacher/${teacherId}`);
  },
  create(data: {
    title: string;
    description?: string;
    type: MaterialType;
    courseName: string;
    size?: string;
    url?: string;
    teacherId: number;
  }): Promise<MaterialItem> {
    return request('/materials', { method: 'POST', body: JSON.stringify(data) });
  },
  remove(id: number): Promise<void> {
    return request(`/materials/${id}`, { method: 'DELETE' });
  },
};
