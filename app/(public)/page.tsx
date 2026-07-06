"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { blogService, experienceService, aboutService } from '@/services/firebase/store';
import { BlogPost, Experience, AboutData } from '@/types/content';
import { getExcerpt, getReadingTime } from '@/lib/markdown';
import { FadeIn } from '@/components/ui/FadeIn';

export default function HomePage() {
  const [posts, setPosts] = useState<(BlogPost & { id: string })[]>([]);
  const [experiences, setExperiences] = useState<(Experience & { id: string })[]>([]);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [publishedPosts, allExperiences, about] = await Promise.all([
          blogService.getPublished(),
          experienceService.getAll(),
          aboutService.get(),
        ]);
        setPosts(publishedPosts.slice(0, 3));
        setExperiences(allExperiences);
        if (about) setAboutData(about);
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div>
      {/* Hero / About Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Profile Image */}
            {aboutData?.profileImage && (
              <FadeIn>
                <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                  <img src={aboutData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </FadeIn>
            )}
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <FadeIn>
                {aboutData?.headline ? (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                    {aboutData.headline}
                  </h1>
                ) : (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                    Building digital experiences that matter
                  </h1>
                )}
              </FadeIn>
              <FadeIn delay={100}>
                <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  {aboutData?.bio || "Full-stack developer specializing in modern web technologies. I create performant, accessible, and beautiful applications."}
                </p>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="mt-8 flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                  >
                    Get in Touch
                  </Link>
                  {aboutData?.resumeUrl && (
                    <a
                      href={aboutData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                    >
                      View Resume
                    </a>
                  )}
                  <Link
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                  >
                    Read Blog
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 border-t border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm bg-white/30 dark:bg-zinc-950/30">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-8">Experience</h2>
          </FadeIn>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-4" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                </div>
              ))}
            </div>
          ) : experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <FadeIn key={exp.id} delay={index * 100}>
                  <div className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{exp.role}</h3>
                      <span className="text-sm text-zinc-500">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{exp.company}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{exp.description}</p>
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded transition-colors group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No experience entries yet.</p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <FadeIn>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Recent Posts</h2>
            </FadeIn>
            {posts.length > 0 && (
              <FadeIn delay={100}>
                <Link href="/blog" className="link-underline text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  View all →
                </Link>
              </FadeIn>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-3" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="card-hover rounded-lg overflow-hidden bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm h-full">
                      {post.coverImage && (
                        <div className="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                          <time dateTime={post.createdAt?.toISOString()}>
                            {post.createdAt ? formatDate(post.createdAt) : ''}
                          </time>
                          <span>·</span>
                          <span>{getReadingTime(post.content)} min read</span>
                        </div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline mb-1">{post.title}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {post.excerpt || getExcerpt(post.content)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No blog posts published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}