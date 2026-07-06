import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SplashScreen } from "@/components/SplashScreen";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "A premium digital showcase built with Next.js 15.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Portfolio',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <SplashScreen>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: "dark:bg-zinc-900 dark:text-zinc-50 border dark:border-zinc-800 text-sm",
              duration: 4000,
            }} 
          />
          {children}
        </SplashScreen>
      </body>
    </html>
  );
};