import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const CustomerFeedbackSection = ({ onNavigate }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.getFeedbacks();
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rosewood-500 text-rosewood-500" />
            Loved By 1,200+ Craft Enthusiasts
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Customer Love & Honest Feedback
          </h2>
        </div>

        <button
          onClick={() => onNavigate('feedback')}
          className="self-start md:self-auto px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-sm shadow-cozy flex items-center gap-1.5 transition-all transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Write Customer Feedback</span>
        </button>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {feedbacks.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft flex flex-col justify-between space-y-4 hover:shadow-soft-lg transition-all"
          >
            <div className="space-y-2.5">
              {/* Stars & Category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-300">
                  {item.productCategory}
                </span>
              </div>

              {/* Highlight Pill */}
              {item.highlight && (
                <span className="inline-block text-xs sm:text-sm font-bold text-bloom-600 dark:text-bloom-400">
                  ✨ “{item.highlight}”
                </span>
              )}

              {/* Comment */}
              <p className="text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed italic">
                "{item.comment}"
              </p>
            </div>

            {/* Author details */}
            <div className="flex items-center gap-3 pt-3 border-t border-warmgray-100 dark:border-warmgray-800">
              <img
                src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={item.author}
                className="w-10 h-10 rounded-full object-cover border-2 border-bloom-200 dark:border-bloom-600"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-warmgray-900 dark:text-white truncate flex items-center gap-1">
                  <span>{item.author}</span>
                  {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />}
                </p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
                  {item.city ? `${item.city}, India` : 'Verified Buyer'} · {item.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="mt-5 text-center">
        <button
          onClick={() => onNavigate('feedback')}
          className="text-sm font-bold text-bloom-600 dark:text-bloom-400 hover:underline inline-flex items-center gap-1.5"
        >
          <span>View all community feedback & submit yours</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
