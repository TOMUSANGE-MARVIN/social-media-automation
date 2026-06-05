import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { adminApi, type AdminAuthUser } from '../services/api';

type Theme = 'dark' | 'light';

interface AdminAuthContextType {
  admin: AdminAuthUser | null;
  loading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({} as AdminAuthContextType);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin]   = useState<AdminAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme]   = useState<Theme>(() =>
    (localStorage.getItem('admin_theme') as Theme) || 'dark'
  );

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { setLoading(false); return; }
    adminApi.auth.me()
      .then(({ admin }) => setAdmin(admin))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const { token, admin } = await adminApi.auth.login(email, password);
    localStorage.setItem('admin_token', token);
    setAdmin(admin);
  }

  function signOut() {
    localStorage.removeItem('admin_token');
    setAdmin(null);
  }

  function toggleTheme() {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin_theme', next);
      return next;
    });
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, theme, toggleTheme, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
