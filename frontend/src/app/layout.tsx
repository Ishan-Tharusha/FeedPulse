import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FeedPulse | AI-Powered Product Feedback Platform',
  description: 'Automated intelligence for product teams to categorize, prioritize, and summarize user feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen antialiased`}>
        <Navbar />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            fontWeight: '600',
          },
        }} />
      </body>
    </html>
  );
}
