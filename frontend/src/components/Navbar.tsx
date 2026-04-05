'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith('/admin');

  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully.');
    router.push('/admin/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
               <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
              Feed<span className="text-indigo-600">Pulse</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {!isAdmin ? (
               <Link 
                 href="/admin/login" 
                 className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors group"
               >
                 Go to Admin
                 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            ) : (
              pathname !== '/admin/login' && (
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                    <LayoutDashboard size={16} className="text-indigo-500" />
                    <span className="text-xs font-black text-zinc-600 dark:text-zinc-400 tracking-widest uppercase">Admin Mode</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
