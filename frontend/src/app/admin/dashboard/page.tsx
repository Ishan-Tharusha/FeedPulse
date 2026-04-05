'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950 min-h-screen"
    >
      <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div>
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest mb-4 border border-rose-100 dark:border-rose-900"
             >
               <ShieldAlert size={14} />
               INTERNAL ADMIN ONLY
             </motion.div>
             <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
               Insight <span className="text-indigo-600">Command</span>
             </h1>
             <p className="text-zinc-500 font-medium text-lg mt-2">Manage, categorize, and prioritize your product roadmap.</p>
           </div>
        </div>
        
        <Dashboard />
      </div>
    </motion.div>
  );
}
