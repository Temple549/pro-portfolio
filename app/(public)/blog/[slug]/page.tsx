"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { blogService } from '@/services/firebase/store';
import { BlogPost } from '@/types/content';
import { parseMarkdown, getReadingTime } from '@/lib/markdown';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<(BlogPost & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const found = await blogService.getBySlug(slug);
        if (!found || !found.published) {
          setNotFound(true);
        } else {
          setPost(found);
          document.title = `${found.title} | Portfolio Blog`;
        }
      } catch (error) {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Post Not Found
        </h1>
        <p className="text-zinc-500 mb-6">
          The blog post you&apos;re looking for doesn&apos;t exist or is no longer published.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const htmlContent = parseMarkdown(post.content);
  const readingTime = getReadingTime(post.content);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 mt-4 text-sm text-zinc-500">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.createdAt?.toISOString()}>
            {post.createdAt ? formatDate(post.createdAt) : ''}
          </time>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-[16/9] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4">
          {post.excerpt}
        </p>
      )}

      {/* Content */}
      <div
        className="prose prose-zinc dark:prose-invert max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-a:text-zinc-900 dark:prose-a:text-zinc-100 prose-a:underline
          prose-code:text-sm prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800
          prose-blockquote:border-l-zinc-400 dark:prose-blockquote:border-l-zinc-600
          prose-img:rounded-lg prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800
          prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← All Posts
        </Link>
      </footer>
    </article>
  );
}