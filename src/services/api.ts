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
  isAdmin: boolean;
  plan: string;
  paidAccountSlots: number;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  paidUsers: number;
  freeUsers: number;
  totalAccounts: number;
  platformCounts: Record<string, number>;
  growth: { date: string; count: number }[];
  planDistribution: Record<string, number>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  zernio_profile_id: string | null;
  created_at: string;
  plan: string;
  paid_account_slots: number;
  paid_storage_gb?: number;
  is_admin: number;
  accountCount: number;
  platforms: string[];
  storageUsed?: number;
  storageTotal?: number;
}

export interface AdminUserDetail {
  user: AdminUser;
  accounts: ZernioAccount[];
  postStats: { total: number; published: number; scheduled: number; failed: number; draft: number };
  recentPosts: ZernioPost[];
}

function adminToken() {
  return localStorage.getItem('admin_token') ?? '';
}

async function adminRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken()}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data: any;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export interface AdminAuthUser {
  id: string;
  name: string;
  email: string;
}

export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; admin: AdminAuthUser }>('POST', '/admin/auth/login', { email, password }),
    me: () => adminRequest<{ admin: AdminAuthUser }>('GET', '/admin/auth/me'),
  },
  stats: () => adminRequest<AdminStats>('GET', '/admin/stats'),
  users: (params?: { page?: number; limit?: number; search?: string }) => {
    const q = params ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))) : '';
    return adminRequest<{ users: AdminUser[]; total: number; page: number; pages: number }>('GET', `/admin/users${q}`);
  },
  userDetail: (id: string) => adminRequest<AdminUserDetail>('GET', `/admin/users/${id}`),
  updateUser: (id: string, data: Partial<Pick<AdminUser, 'plan' | 'paid_account_slots' | 'is_admin' | 'paid_storage_gb'>>) =>
    adminRequest<{ ok: boolean }>('PATCH', `/admin/users/${id}`, data),
};

export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>('POST', '/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('POST', '/auth/login', { email, password }),
  me: () => request<{ user: User }>('GET', '/auth/me'),
  googleLogin: (access_token: string) =>
    request<{ token: string; user: User }>('POST', '/auth/google', { access_token }),
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
    presign: (filename: string, contentType: string, size: number) =>
      request<{ uploadUrl: string; publicUrl: string; key: string; type: string }>(
        'POST', '/zernio/media/presign', { filename, contentType, size }
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

// ─── Storage API ─────────────────────────────────────────────────────────────

export interface StorageInfo {
  used: number;
  total: number;
  paidGb: number;
  freeGb: number;
}

export const storageApi = {
  get: () => request<StorageInfo>('GET', '/storage'),
};

// ─── Scheduled Delete API ─────────────────────────────────────────────────────

export const scheduleDeleteApi = {
  set:    (postId: string, deleteAt: string) =>
    request<{ ok: boolean }>('POST', '/schedule-delete', { postId, deleteAt }),
  cancel: (postId: string) =>
    request<{ ok: boolean }>('DELETE', `/schedule-delete/${postId}`),
};

// ─── AI API ───────────────────────────────────────────────────────────────────

export const aiApi = {
  content: (topic: string, platform: string, tone: string, includeHashtags: boolean) =>
    request<{ content: string }>('POST', '/ai/content', { topic, platform, tone, includeHashtags }),
  image: (prompt: string, style: 'vivid' | 'natural') =>
    request<{ publicUrl: string }>('POST', '/ai/image', { prompt, style }),
};
