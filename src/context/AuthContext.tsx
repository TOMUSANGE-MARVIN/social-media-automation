import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type User } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('auth_token');
    if (!t) { setLoading(false); return; }
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem('auth_token', token);
    setUser(user);
  }

  async function signUp(name: string, email: string, password: string) {
    const { token, user } = await authApi.register(name, email, password);
    localStorage.setItem('auth_token', token);
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('auth_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
