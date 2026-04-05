'use client';

import { useState } from 'react';
import { Calendar, Tag, ShieldCheck, RefreshCw, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface FeedbackCardProps {
  feedback: any;
  onUpdate: () => void;
}

const sentimentColors: Record<string, string> = {
  Positive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400',
  Negative: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const categoryColors: Record<string, string> = {
  Bug: 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  'Feature Request': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  Improvement: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Other: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
};

export default function FeedbackCard({ feedback, onUpdate }: FeedbackCardProps) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await api.patch(`/feedback/${feedback._id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  const retriggerAI = async () => {
    setLoading(true);
    try {
      await api.post(`/feedback/${feedback._id}/retrigger`);
      toast.success('AI analysis re-triggered!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to re-trigger AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/feedback/${feedback._id}`);
      toast.success('Feedback deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl transition-all hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-900 group">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border",
            categoryColors[feedback.category] || categoryColors.Other
          )}>
            {feedback.category}
          </span>
          <h3 className="text-xl font-bold mt-2 text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            {feedback.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {feedback.ai_priority && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-zinc-400">AI Priority</span>
              <span className={cn(
                "text-lg font-black",
                feedback.ai_priority >= 8 ? "text-rose-500" : feedback.ai_priority >= 5 ? "text-amber-500" : "text-emerald-500"
              )}>
                {feedback.ai_priority}/10
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl italic border border-zinc-100 dark:border-zinc-800">
        "{feedback.description}"
      </p>

      {feedback.ai_processed && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
             <span className={cn(
               "px-4 py-1.5 rounded-2xl text-xs font-bold shadow-sm",
               sentimentColors[feedback.ai_sentiment]
             )}>
               {feedback.ai_sentiment} Sentiment
             </span>
             <Tag size={16} className="text-zinc-400 ml-2" />
             <div className="flex flex-wrap gap-1">
               {feedback.ai_tags?.map((tag: string) => (
                 <span key={tag} className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                   #{tag}
                 </span>
               ))}
             </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <ShieldCheck size={14} />
              AI SUMMARY
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {feedback.ai_summary}
            </p>
          </div>
        </div>
      )}

      {!feedback.ai_processed && (
        <div className="mb-6 p-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center gap-2 text-zinc-400 text-sm italic">
          <Loader size={16} className="animate-spin" />
          AI is analyzing...
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(feedback.createdAt).toLocaleDateString()}
          </div>
          {feedback.submitterEmail && (
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} />
              {feedback.submitterEmail}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={feedback.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={loading}
            className="text-xs font-bold px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
          
          <button
            onClick={retriggerAI}
            disabled={loading}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-all"
            title="Retrigger AI Analysis"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 rounded-xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-400 hover:text-rose-600 transition-all ml-1"
            title="Delete Feedback"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Loader({ size, className }: { size: number; className?: string }) {
  return <RefreshCw size={size} className={className} />;
}
