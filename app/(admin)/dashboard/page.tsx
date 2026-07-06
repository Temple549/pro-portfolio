"use client";

import Link from 'next/link';
import { useBlogPosts, useExperiences, useContactEntries } from '@/hooks/useFirestore';

const stats = [
  {
    name: 'Blog Posts',
    href: '/dashboard/blog',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
  },
  {
    name: 'Experiences',
    href: '/dashboard/experience',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    name: 'Messages',
    href: '/dashboard/contact',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { data: posts } = useBlogPosts();
  const { data: experiences } = useExperiences();
  const { data: contacts } = useContactEntries();

  const unreadMessages = contacts.filter((c) => !c.read && !c.archived).length;
  const publishedPosts = posts.filter((p) => p.published).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of your portfolio content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Blog Posts</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{posts.length}</span>
            <span className="text-sm text-zinc-500">({publishedPosts} published)</span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Experiences</p>
          <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{experiences.length}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Unread Messages</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{unreadMessages}</span>
            <span className="text-sm text-zinc-500">of {contacts.length} total</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="group flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors"
            >
              <div className="text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                Manage {stat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}