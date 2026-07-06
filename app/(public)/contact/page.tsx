"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { contactEntrySchema, ContactEntryInput } from '@/types/content';
import { contactService } from '@/services/firebase/store';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactEntryInput>({
    resolver: zodResolver(contactEntrySchema),
  });

  const onSubmit = async (data: ContactEntryInput) => {
    try {
      setIsSubmitting(true);
      await contactService.create(data);
      setIsSubmitted(true);
      reset();
      toast.success('Message sent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Contact</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Have a question or want to work together? Send me a message.
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-12 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 mb-4">
            <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Message Sent!
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Thank you for reaching out. I&apos;ll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subject
            </label>
            <input
              type="text"
              {...register('subject')}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
              placeholder="What's this about?"
            />
            {errors.subject && (
              <p className="text-xs text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Message
            </label>
            <textarea
              {...register('message')}
              rows={6}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent resize-y"
              placeholder="Your message..."
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      )}
    </div>
  );
}