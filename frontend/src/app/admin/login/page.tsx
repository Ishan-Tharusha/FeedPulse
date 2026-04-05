'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: 'admin@feedpulse.com',
    password: 'admin123',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-600 transition-colors text-xs font-black uppercase tracking-widest mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Public
        </Link>

        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">Admin Portal</h2>
          <p className="text-zinc-500 font-medium mt-2">Sign in to manage product insights.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
              placeholder="Admin Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Log In Now'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">
           Secured via JWT Authentication
        </div>
      </motion.div>
    </div>
  );
}
