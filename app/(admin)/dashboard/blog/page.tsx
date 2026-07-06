"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useBlogPosts } from '@/hooks/useFirestore';
import { blogService } from '@/services/firebase/store';
import { BlogPostForm } from '@/components/forms/BlogPostForm';
import { BlogPost } from '@/types/content';

export default function BlogPostsPage() {
  const { data: posts, isLoading, error, refetch } = useBlogPosts();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<(BlogPost & { id: string }) | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post: BlogPost & { id: string }) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      await blogService.delete(id);
      toast.success('Post deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPost(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (showForm) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {editingPost ? 'Update the blog post details' : 'Fill in the details to create a new blog post'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <BlogPostForm
            post={editingPost || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Blog Posts</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your blog content</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          New Post
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
          <p className="text-sm text-zinc-500">No blog posts yet</p>
          <button
            onClick={handleCreate}
            className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
          >
            Create your first post
          </button>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.id} className="bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[300px]">
                        {post.title}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono mt-0.5">
                        /{post.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-zinc-500">
                      {post.createdAt ? formatDate(post.createdAt) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === post.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}