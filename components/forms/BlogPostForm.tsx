"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { blogPostFormSchema, BlogPostInput, generateSlug, BlogPost } from '@/types/content';
import { blogService } from '@/services/firebase/store';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface BlogPostFormProps {
  post?: BlogPost & { id: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BlogPostForm({ post, onSuccess, onCancel }: BlogPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing] = useState(!!post);
  const [isPublished, setIsPublished] = useState(post?.published || false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostInput>({
    // @ts-ignore - Bypassing strict generic loop between Zod and React Hook Form
    resolver: zodResolver(blogPostFormSchema) as any,
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      coverImage: post?.coverImage || '',
      published: post?.published || false,
      tags: post?.tags || [],
      author: post?.author || 'Admin',
    },
  });

  const titleValue = watch('title');
  const tagsValue = watch('tags');
  const coverImageValue = watch('coverImage');

  const handleGenerateSlug = () => {
    if (titleValue) {
      setValue('slug', generateSlug(titleValue), { shouldValidate: true });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const newTag = input.value.trim().toLowerCase();
      
      if (newTag && !tagsValue.includes(newTag) && tagsValue.length < 10) {
        setValue('tags', [...tagsValue, newTag]);
        input.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tagsValue.filter((tag) => tag !== tagToRemove));
  };

  // @ts-ignore - Bypassing strict generic loop
  const onSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      const dataToSave = {
        ...formData,
        published: isPublished,
      } as BlogPostInput;

      if (isEditing && post) {
        await blogService.update(post.id, dataToSave);
        toast.success('Blog post updated successfully');
      } else {
        await blogService.create(dataToSave);
        toast.success('Blog post created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
        <input
          type="text"
          {...register('title')}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
          placeholder="Enter post title..."
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug</label>
        <div className="flex gap-2">
          <input
            type="text"
            {...register('slug')}
            className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent font-mono"
            placeholder="post-url-slug"
          />
          <button
            type="button"
            onClick={handleGenerateSlug}
            className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Generate
          </button>
        </div>
        {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
      </div>

      {/* Cover Image URL */}
      <ImageUpload
        value={coverImageValue || ''}
        onChange={(url) => setValue('coverImage', url, { shouldValidate: true })}
        label="Cover Image"
      />

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Excerpt</label>
        <textarea
          {...register('excerpt')}
          rows={2}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent resize-none"
          placeholder="Brief description for previews..."
        />
        {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt.message}</p>}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Content <span className="text-zinc-400 font-normal">(Markdown supported)</span>
        </label>
        <textarea
          {...register('content')}
          rows={16}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent resize-y font-mono leading-relaxed"
          placeholder="Write your post content here..."
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tags <span className="text-zinc-400">({tagsValue.length}/10)</span>
        </label>
        <input
          type="text"
          onKeyDown={handleAddTag}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
          placeholder="Type a tag and press Enter..."
        />
        {tagsValue.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tagsValue.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Published Toggle */}
      <div className="flex items-center justify-between p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Publish Status</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isPublished ? 'Visible to public' : 'Draft - only visible to admins'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublished(!isPublished)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isPublished ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isPublished ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
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
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Post' : 'Create Post'
          )}
        </button>
      </div>
    </form>
  );
}