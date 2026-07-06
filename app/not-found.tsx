import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-2">404</p>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Page Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The dashboard page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}