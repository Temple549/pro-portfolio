"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { aboutSchema, AboutInput, AboutData } from '@/types/content';
import { aboutService } from '@/services/firebase/store';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AboutInput>({
    resolver: zodResolver(aboutSchema) as any,
    defaultValues: {
      headline: '',
      bio: '',
      profileImage: '',
      resumeUrl: '',
    },
  });

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await aboutService.get();
        if (data) {
          setValue('headline', data.headline);
          setValue('bio', data.bio);
          setValue('profileImage', data.profileImage || '');
          setValue('resumeUrl', data.resumeUrl || '');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAbout();
  }, [setValue]);

  const onSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      await aboutService.upsert(data as AboutInput);
      toast.success('About me updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">About Me</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage the about section displayed on your homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Headline</label>
          <input
            type="text"
            {...register('headline')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            placeholder="e.g., Full-Stack Developer & Designer"
          />
          {errors.headline && <p className="text-xs text-red-500">{errors.headline.message}</p>}
        </div>

        <ImageUpload
          value={watch('profileImage') || ''}
          onChange={(url) => setValue('profileImage', url)}
          label="Profile Picture"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
          <textarea
            {...register('bio')}
            rows={8}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-y"
            placeholder="Write a compelling summary about yourself..."
          />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Resume URL (Optional)</label>
          <input
            type="url"
            {...register('resumeUrl')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            placeholder="https://drive.google.com/..."
          />
          {errors.resumeUrl && <p className="text-xs text-red-500">{errors.resumeUrl.message}</p>}
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}