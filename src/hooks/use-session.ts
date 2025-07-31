'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirestoreService } from '@/lib/firestore-service';

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Try to get user profile from Firestore
          const profile = await FirestoreService.getUserProfile(user.uid);
          
          // Check if profile is complete (has essential fields filled)
          const isProfileComplete = !!(profile && 
            profile.age > 0 && 
            profile.gender && 
            profile.healthProfile && 
            profile.emergencyContact);
          
          setSession({
            userId: user.uid,
            email: user.email || '',
            name: user.displayName || profile?.name || user.email || '',
            profileExists: isProfileComplete, // Only true if profile is complete
            healthPreferences: profile ? {
              age: profile.age,
              gender: profile.gender,
              healthProfile: profile.healthProfile,
              allergies: profile.allergies,
              conditions: profile.conditions,
              emergencyContact: profile.emergencyContact,
            } : undefined,
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
          setSession({
            userId: user.uid,
            email: user.email || '',
            name: user.displayName || user.email || '',
            profileExists: false,
          });
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user has a profile in Firestore
      const profile = await FirestoreService.getUserProfile(user.uid);
      
      const userSession = {
        userId: user.uid,
        email: user.email || '',
        name: user.displayName || profile?.name || user.email || '',
        profileExists: !!profile,
        healthPreferences: profile ? {
          age: profile.age,
          gender: profile.gender,
          healthProfile: profile.healthProfile,
          allergies: profile.allergies,
          conditions: profile.conditions,
          emergencyContact: profile.emergencyContact,
        } : undefined,
      };
      setSession(userSession);
      return userSession;
    } catch (error) {
      setSession(null);
      return null;
    }
  };


  const logout = async () => {
    await signOut(auth);
    setSession(null);
  };

  // TODO: Implement updateHealthPreferences with Firestore if needed
  const updateHealthPreferences = (preferences: Partial<UserSession['healthPreferences']>) => {
    if (session?.healthPreferences && preferences) {
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