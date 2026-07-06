import Link from 'next/link';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {currentYear} Portfolio. All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Contact
            </Link>
            <Link 
              href="/login" 
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              title="Admin Login"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}