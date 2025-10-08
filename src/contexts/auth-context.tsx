'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS, type User } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('credit-assist-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('credit-assist-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    const foundUser = MOCK_USERS.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('credit-assist-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('credit-assist-user');
    router.push('/login');
  };
  
  const switchUser = (userId: string) => {
    const foundUser = MOCK_USERS.find((u) => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('credit-assist-user', JSON.stringify(foundUser));
      router.refresh();
    }
  };


  const value = { user, loading, login, logout, users: MOCK_USERS, switchUser };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="w-full h-screen flex items-center justify-center"><Skeleton className="h-full w-full" /></div> : children}
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
