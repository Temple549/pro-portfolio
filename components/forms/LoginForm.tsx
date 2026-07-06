"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginCredentials } from '@/types/auth';
import { loginAdmin } from '@/services/firebase/auth';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize react-hook-form tied to our shared Zod validation configuration schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Submit handler that bridges validated input fields into our Firebase Service Layer
  const onSubmit = async (data: LoginCredentials) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await loginAdmin(data);
      toast.success('Authenticated successfully. Redirecting...');
      
      // Force Next.js router engine to refresh route maps and transition down to dashboard shell
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      // Map standard Firebase validation response anomalies cleanly for users
      if (error.message.includes('auth/invalid-credential')) {
        toast.error('The email address or security key is incorrect.');
      } else {
        toast.error(error.message || 'Authentication sequence failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl transition-all duration-300">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Portal</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter administrative credentials to unlock your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Input Field Group */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Email Address
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="admin@portfolio.com"
            autoComplete="email"
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 transition-all duration-200 disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input Field Group */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Security Key
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 transition-all duration-200 disabled:opacity-50"
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Action Form Submit Trigger */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying Identity...' : 'Access Workspace'}
        </button>
      </form>
    </div>
  );
}