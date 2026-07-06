"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { experienceSchema, ExperienceInput } from '@/types/content';
import { experienceService } from '@/services/firebase/store';
import { Experience } from '@/types/content';

interface ExperienceFormProps {
  experience?: Experience & { id: string };
  maxOrder?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExperienceForm({ experience, maxOrder = 0, onSuccess, onCancel }: ExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!experience;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceInput>({
    // @ts-ignore - Bypassing strict generic loop between Zod and React Hook Form
    resolver: zodResolver(experienceSchema) as any,
    defaultValues: {
      company: experience?.company || '',
      role: experience?.role || '',
      description: experience?.description || '',
      startDate: experience?.startDate || '',
      endDate: experience?.endDate || '',
      current: experience?.current || false,
      order: experience?.order ?? maxOrder,
      technologies: experience?.technologies || [],
    },
  });

  const currentValue = watch('current');
  const techValue = watch('technologies');

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const newTech = input.value.trim().toLowerCase();
      
      if (newTech && !techValue.includes(newTech) && techValue.length < 20) {
        setValue('technologies', [...techValue, newTech]);
        input.value = '';
      }
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setValue('technologies', techValue.filter((t) => t !== techToRemove));
  };

  const handleCurrentToggle = (checked: boolean) => {
    setValue('current', checked);
    if (checked) {
      setValue('endDate', '');
    }
  };

  // @ts-ignore - Bypassing strict generic loop
  const onSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      const dataToSave = formData as ExperienceInput;

      if (isEditing && experience) {
        await experienceService.update(experience.id, dataToSave);
        toast.success('Experience updated successfully');
      } else {
        await experienceService.create(dataToSave);
        toast.success('Experience added successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company & Role Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Company</label>
          <input
            type="text"
            {...register('company')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
            placeholder="Company name"
          />
          {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Role / Title</label>
          <input
            type="text"
            {...register('role')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
            placeholder="Your position"
          />
          {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent resize-y"
          placeholder="Describe your responsibilities and achievements..."
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      {/* Date Range & Current Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Date</label>
          <input
            type="month"
            {...register('startDate')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
          />
          {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">End Date</label>
          <input
            type="month"
            {...register('endDate')}
            disabled={currentValue}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Position</label>
          <div className="flex items-center h-[42px]">
            <button
              type="button"
              onClick={() => handleCurrentToggle(!currentValue)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentValue ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                currentValue ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className="ml-3 text-sm text-zinc-500">
              {currentValue ? 'Present' : 'Ended'}
            </span>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Technologies <span className="text-zinc-400">({techValue.length}/20)</span>
        </label>
        <input
          type="text"
          onKeyDown={handleAddTech}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
          placeholder="Type a technology and press Enter..."
        />
        {techValue.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {techValue.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Order */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Display Order</label>
        <input
          type="number"
          {...register('order', { valueAsNumber: true })}
          min={0}
          className="w-full max-w-[200px] rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
        />
        <p className="text-xs text-zinc-500">Lower numbers appear first</p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            isEditing ? 'Update Experience' : 'Add Experience'
          )}
        </button>
      </div>
    </form>
  );
}