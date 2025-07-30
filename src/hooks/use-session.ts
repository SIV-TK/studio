'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth-service';

interface UserSession {
  userId: string;
  email: string;
  name: string;
  profileExists: boolean;
  healthPreferences?: {
    age: number;
    gender: string;
    healthProfile: string;
    allergies: string[];
    conditions: string[];
    emergencyContact: string;
  };
}

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setSession(currentUser);
    } catch (error) {
      console.error('Session check failed:', error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const userSession = await AuthService.login({ email, password });
    setSession(userSession);
    return userSession;
  };

  const logout = () => {
    AuthService.logout();
    setSession(null);
  };

  const updateHealthPreferences = (preferences: Partial<UserSession['healthPreferences']>) => {
    if (session?.healthPreferences && preferences) {
      AuthService.updateHealthPreferences(preferences);
      setSession({
        ...session,
        healthPreferences: { ...session.healthPreferences, ...preferences }
      });
    }
  };

  return {
    session,
    loading,
    login,
    logout,
    updateHealthPreferences,
    isAuthenticated: !!session,
  };
}