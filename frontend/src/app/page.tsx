'use client';

import FeedbackForm from '@/components/FeedbackForm';
import { Activity, Sparkles, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/10 mb-8"
           >
             <Sparkles size={16} />
             Powered by Gemini AI 1.5
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6 leading-none"
           >
             Build Better. <br />
             <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Listen Smarter.
             </span>
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto font-medium"
           >
             The AI-powered feedback platform that helps product teams turn user insights into actionable roadmaps.
           </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {[
             { title: 'Auto-Categorized', desc: 'Gemini instantly sorts feedback into Bugs, Features, or Improvements.', icon: Zap, color: 'text-amber-500' },
             { title: 'Sentiment Analysis', desc: 'Understand how your users feel with automated sentiment scoring.', icon: Activity, color: 'text-indigo-500' },
             { title: 'Priority Scoring', desc: 'Instantly identify critical issues with AI-driven priority estimation.', icon: Shield, color: 'text-rose-500' },
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 + (i * 0.1) }}
               className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-lg group hover:border-indigo-400 transition-all hover:-translate-y-1"
             >
                <feature.icon className={cn("w-10 h-10 mb-6 group-hover:scale-110 transition-transform", feature.color)} />
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
        >
          <FeedbackForm />
        </motion.div>
      </div>
      
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm font-bold text-zinc-400 tracking-widest uppercase">
         © 2026 FeedPulse. Built with Intelligence.
      </footer>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
