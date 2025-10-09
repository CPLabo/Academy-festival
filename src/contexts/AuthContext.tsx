import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// 管理画面用のパスワード（本番環境では環境変数から取得すべき）
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // セッションストレージから認証状態を復元
    const authState = sessionStorage.getItem('admin_auth');
    if (authState) {
      try {
        const parsed = JSON.parse(authState);
        setIsAuthenticated(parsed.isAuthenticated);
        setIsAdmin(parsed.isAdmin);
      } catch (error) {
        console.error('Failed to parse auth state:', error);
        sessionStorage.removeItem('admin_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // パスワード検証（実際の実装では、バックエンドAPIで検証すべき）
    if (password === ADMIN_PASSWORD) {
      const authState = {
        isAuthenticated: true,
        isAdmin: true,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('admin_auth', JSON.stringify(authState));
      setIsAuthenticated(true);
      setIsAdmin(true);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
