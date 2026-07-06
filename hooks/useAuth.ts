"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/services/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time authentication status changes stream
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    }, (error) => {
      console.error("Authentication observer stream error:", error);
      setIsLoading(false);
    });

    // Clean up the active network websocket subscription stream on component unmount
    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}