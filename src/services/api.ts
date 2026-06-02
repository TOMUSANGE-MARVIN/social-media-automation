const BASE = '/api';

function token() {
  return localStorage.getItem('auth_token') ?? '';
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: any;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  zernioProfileId: string | null;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>('POST', '/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('POST', '/auth/login', { email, password }),
  me: () => request<{ user: User }>('GET', '/auth/me'),
};

// ─── Zernio types ─────────────────────────────────────────────────────────────

export interface ZernioAccount {
  _id: string;
  platform: string;
  username: string;
  displayName: string;
  isActive: boolean;
  profileId: string;
}

export interface ZernioPostPlatform {
  platform: string;
  accountId: string;
  status: string;
  customContent?: string;
}

export interface ZernioPost {
  _id: string;
  title?: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: string;
  timezone?: string;
  mediaItems: { type: string; url: string }[];
  platforms: ZernioPostPlatform[];
  tags?: string[];
  hashtags?: string[];
  visibility?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CreatePostBody {
  content: string;
  platforms: { platform: string; accountId: string; customContent?: string }[];
  scheduledFor?: string;
  publishNow?: boolean;
  isDraft?: boolean;
  timezone?: string;
  mediaItems?: { type: string; url: string }[];
  title?: string;
  tags?: string[];
  hashtags?: string[];
  visibility?: string;
}

// ─── Zernio API ───────────────────────────────────────────────────────────────

export const zernioApi = {
  accounts: {
    list: () => request<{ accounts: ZernioAccount[] }>('GET', '/zernio/accounts'),
    disconnect: (id: string) => request<unknown>('DELETE', `/zernio/accounts/${id}`),
  },
  connect: {
    start: (platform: string, redirectUrl: string) =>
      request<{ authUrl: string; state: string }>(
        'GET',
        `/zernio/connect/${platform}?redirect_url=${encodeURIComponent(redirectUrl)}`
      ),
  },
  media: {
    presign: (filename: string, contentType: string) =>
      request<{ uploadUrl: string; publicUrl: string; key: string; type: string }>(
        'POST', '/zernio/media/presign', { filename, contentType }
      ),
  },
  posts: {
    list: (params?: Record<string, string | number>) => {
      const q = params
        ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])))
        : '';
      return request<{ posts: ZernioPost[]; pagination: Pagination }>('GET', `/zernio/posts${q}`);
    },
    create: (body: CreatePostBody) => request<{ post: ZernioPost }>('POST', '/zernio/posts', body),
    delete: (id: string) => request<unknown>('DELETE', `/zernio/posts/${id}`),
    retry: (id: string) => request<unknown>('POST', `/zernio/posts/${id}/retry`, {}),
  },
  analytics: {
    get: () => request<any>('GET', '/zernio/analytics'),
  },
};

// ─── AI API ───────────────────────────────────────────────────────────────────

export const aiApi = {
  content: (topic: string, platform: string, tone: string, includeHashtags: boolean) =>
    request<{ content: string }>('POST', '/ai/content', { topic, platform, tone, includeHashtags }),
  image: (prompt: string, style: 'vivid' | 'natural') =>
    request<{ publicUrl: string }>('POST', '/ai/image', { prompt, style }),
};
