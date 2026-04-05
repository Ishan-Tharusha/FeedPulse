'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import FeedbackCard from './FeedbackCard';
import { Filter, Search, BarChart3, TrendingUp, Inbox, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    avgPriority: 0,
    commonTag: 'N/A',
  });
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  const [aiSummary, setAiSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        limit: 10,
      };
      const response = await api.get('/feedback', { params });
      if (response.data.success) {
        setFeedbacks(response.data.data);
        setPagination({
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });

        // Calculate stats (in a real app, this should come from a dedicated stats endpoint)
        const total = response.data.pagination.total;
        const open = response.data.data.filter((f: any) => f.status !== 'Resolved').length;
        const priorities = response.data.data.filter((f: any) => f.ai_priority).map((f: any) => f.ai_priority);
        const avgPriority = priorities.length ? (priorities.reduce((a: number, b: number) => a + b, 0) / priorities.length).toFixed(1) : 0;
        
        // Simplified common tag logic
        const tags = response.data.data.flatMap((f: any) => f.ai_tags || []);
        const tagMap = tags.reduce((acc: any, tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});
        const commonTag = Object.keys(tagMap).sort((a, b) => tagMap[b] - tagMap[a])[0] || 'N/A';

        setStats({ total, open, avgPriority: Number(avgPriority), commonTag });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const generateTrendSummary = async () => {
    setGeneratingSummary(true);
    try {
      const response = await api.get('/feedback/summary');
      if (response.data.success) {
        setAiSummary(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to generate AI summary.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Feedback', value: stats.total, icon: Inbox, color: 'text-indigo-600' },
          { label: 'Open Items', value: stats.open, icon: Filter, color: 'text-amber-600' },
          { label: 'Avg Priority', value: stats.avgPriority, icon: BarChart3, color: 'text-rose-600' },
          { label: 'Common Tag', value: stats.commonTag, icon: TrendingUp, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">REAL-TIME</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</div>
            <div className="text-sm font-medium text-zinc-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* AI Summary Section */}
      <div className="mb-12 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 p-8 rounded-3xl border border-indigo-200 dark:border-indigo-900 items-center justify-between flex flex-col md:flex-row gap-6">
        <div>
          <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <Sparkles className="text-indigo-500" />
            AI Trend Analysis
          </h2>
          <p className="text-indigo-700/60 dark:text-indigo-300/60 mt-1 font-medium max-w-xl">
             Get an automated overview of the top 3 themes from the last 7 days of user feedback.
          </p>
          {aiSummary && (
            <div className="mt-6 bg-white dark:bg-zinc-950/50 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900 whitespace-pre-wrap text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed shadow-inner animate-in fade-in slide-in-from-top-4">
              {aiSummary}
            </div>
          )}
        </div>
        <button
          onClick={generateTrendSummary}
          disabled={generatingSummary}
          className="shrink-0 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 flex items-center gap-2 transition-all group active:scale-95"
        >
          {generatingSummary ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} className="group-hover:rotate-12 transition-transform" />}
          {aiSummary ? 'Refresh Analysis' : 'Analyze Trends'}
        </button>
      </div>

      {/* Filters & Content */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <select
             value={filters.category}
             onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
             className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer shadow-lg shadow-zinc-200/50 dark:shadow-none"
          >
            <option value="">All Categories</option>
            <option value="Bug">Bugs</option>
            <option value="Feature Request">Feature Requests</option>
            <option value="Improvement">Improvements</option>
            <option value="Other">Other</option>
          </select>

          <select
             value={filters.status}
             onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
             className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer shadow-lg shadow-zinc-200/50 dark:shadow-none"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        
        <div className="text-zinc-400 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Showing {feedbacks.length} of {pagination.total} entries
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50 pointer-events-none grayscale">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((f: any) => (
            <FeedbackCard key={f._id} feedback={f} onUpdate={fetchDashboardData} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
           <Inbox className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
           <p className="text-zinc-500 font-bold text-xl uppercase tracking-widest">No matching feedback found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters({ ...filters, page: i + 1 })}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all",
                filters.page === i + 1
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25"
                  : "bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
