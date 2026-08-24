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

    const handleUpdate = () => fetchFeedbacks();
    window.addEventListener('aanublooms_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aanublooms_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <section className="py-6 sm:py-8 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rosewood-500 text-rosewood-500" />
            Loved By Craft Enthusiasts
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
      {feedbacks.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 text-center space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-bloom-100 dark:bg-warmgray-800 text-bloom-600 dark:text-bloom-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
            Be the First to Leave Feedback!
          </h3>
          <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 max-w-md mx-auto leading-relaxed">
            All reviews on AanuBlooms are 100% written by real customers. Have you received a bouquet or plushie? Share your experience with founder Aanu!
          </p>
          <button
            onClick={() => onNavigate('feedback')}
            className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transition-all inline-flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write Customer Feedback</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {feedbacks.slice(0, 6).map((item) => (
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
                    {item.productCategory || 'Handcrafted Blooms'}
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
                <div className="w-10 h-10 rounded-full bg-bloom-100 dark:bg-warmgray-800 text-bloom-700 dark:text-bloom-300 font-serif font-bold text-base flex items-center justify-center border-2 border-bloom-200 dark:border-warmgray-700 shrink-0">
                  {item.author?.[0]?.toUpperCase() || 'C'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-warmgray-900 dark:text-white truncate flex items-center gap-1">
                    <span>{item.author}</span>
                    {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />}
                  </p>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
                    {item.city ? `${item.city}, India` : 'Verified Customer'} · {item.date || 'Recent'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
