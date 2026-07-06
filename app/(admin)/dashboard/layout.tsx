"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400 animate-pulse">Verifying Token Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="flex min-h-screen">
        <DashboardSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}