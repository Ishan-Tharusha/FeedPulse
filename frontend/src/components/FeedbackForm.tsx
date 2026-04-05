'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['Bug', 'Feature Request', 'Improvement', 'Other'];

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Feature Request',
    submitterName: '',
    submitterEmail: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.description.length < 20) {
      toast.error('Description must be at least 20 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/feedback', formData);
      if (response.data.success) {
        toast.success('Feedback submitted! AI analysis has started.');
        setFormData({
          title: '',
          description: '',
          category: 'Feature Request',
          submitterName: '',
          submitterEmail: '',
        });
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to submit feedback.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Share Your Feedback
        </h2>
        <p className="text-zinc-500 mt-2">Help us build something amazing together.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={120}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            placeholder="What's on your mind?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  formData.category === cat
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-400"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description <span className="text-red-500">*</span>
            </label>
            <span className={cn(
              "text-xs font-medium",
              formData.description.length < 20 ? "text-red-500" : "text-emerald-500"
            )}>
              {formData.description.length} characters
            </span>
          </div>
          <textarea
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all h-32 resize-none"
            placeholder="Tell us more about it..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Name (optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              value={formData.submitterName}
              onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Email (optional)
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              value={formData.submitterEmail}
              onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || formData.description.length < 20}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send size={20} />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
