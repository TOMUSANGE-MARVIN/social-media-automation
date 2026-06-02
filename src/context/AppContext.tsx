import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { zernioApi, type ZernioAccount } from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  accounts: ZernioAccount[];
  loadingAccounts: boolean;
  refreshAccounts: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ZernioAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const refreshAccounts = useCallback(async () => {
    if (!user?.zernioProfileId) return;
    setLoadingAccounts(true);
    try {
      const data = await zernioApi.accounts.list();
      setAccounts(data.accounts ?? []);
    } catch (err) {
      console.error('[AppContext] Failed to load accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  }, [user?.zernioProfileId]);

  useEffect(() => {
    if (user?.zernioProfileId) refreshAccounts();
    else setAccounts([]);
  }, [user?.zernioProfileId, refreshAccounts]);

  return (
    <AppContext.Provider value={{ accounts, loadingAccounts, refreshAccounts }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
