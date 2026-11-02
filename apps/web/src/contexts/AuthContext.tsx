import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import api, { setAccessToken } from '../lib/api';

interface User {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student' | 'guardian';
  tenantId: string;
  status?: string;
  isPlatformAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isPlatformAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await api.post('/auth/refresh');
        const response = await api.get('/auth/me');
        setUser(response.data.data.user);
      } catch (error) {
        if ((error as any)?.response?.status !== 401) {
          console.error('Failed to load user:', error);
        }
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;
      setAccessToken(accessToken);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const isPlatformAdmin = user?.isPlatformAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isPlatformAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}