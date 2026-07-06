"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { blogService } from '@/services/firebase/store';
import { BlogPost } from '@/types/content';
import { getExcerpt, getReadingTime } from '@/lib/markdown';
import type { Metadata } from 'next';

export default function BlogPage() {
  const [posts, setPosts] = useState<(BlogPost & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const publishedPosts = await blogService.getPublished();
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Blog</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Thoughts on development, design, and technology.
        </p>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              !selectedTag
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                : 'bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                tag === selectedTag
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-4" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-3" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full mb-1" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              {post.coverImage && (
                <div className="aspect-[16/10] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                <time dateTime={post.createdAt?.toISOString()}>
                  {post.createdAt ? formatDate(post.createdAt) : ''}
                </time>
                <span>·</span>
                <span>{getReadingTime(post.content)} min read</span>
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {post.excerpt || getExcerpt(post.content, 200)}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-zinc-500">
            {selectedTag ? `No posts with tag "${selectedTag}"` : 'No blog posts yet.'}
          </p>
        </div>
      )}
    </div>
  );
}