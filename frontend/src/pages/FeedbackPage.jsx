import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  Heart,
  CheckCircle2,
  Send,
  Filter,
  ShieldCheck,
  Smile
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

export const FeedbackPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');

  const [form, setForm] = useState({
    author: '',
    email: '',
    city: 'Mumbai',
    rating: 5,
    productCategory: 'Forever Blooms & Pots',
    highlight: '',
    comment: ''
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFeedbacks();
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error('Error loading feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();

    const handleUpdate = () => fetchFeedbacks();
    window.addEventListener('aanublooms_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aanublooms_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author || !form.comment) {
      addToast('Please enter your name and feedback comments', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendFeedback(form);
      if (res.success) {
        setIsSubmitted(true);
        addToast(res.message, 'success');
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        setForm({
          author: '',
          email: '',
          city: 'Mumbai',
          rating: 5,
          productCategory: 'Forever Blooms & Pots',
          highlight: '',
          comment: ''
        });
        fetchFeedbacks();
      }
    } catch (err) {
      addToast(err.message || 'Could not submit feedback', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(item => {
    if (selectedRatingFilter === 'all') return true;
    return item.rating === Number(selectedRatingFilter);
  });

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbacks.length).toFixed(2)
    : '4.98';

  return (
    <div className="py-8 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          AanuBlooms Community Voice
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
          Customer Feedback & Reviews
        </h1>
        <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300">
          We cherish every stitch and love hearing your experience with our handcrafted forever flowers, plushies, and custom creations.
        </p>
      </div>

      {/* Main Grid: Feedback Form + Community Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Submit Feedback */}
        <div className="lg:col-span-5 bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
            <div className="w-10 h-10 rounded-2xl bg-bloom-500 text-white flex items-center justify-center shadow-cozy">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                Share Your Experience
              </h3>
              <p className="text-[11px] text-warmgray-500">
                Help fellow craft lovers with your honest review
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-xl text-warmgray-900 dark:text-white">
                Thank You for Your Love!
              </h4>
              <p className="text-xs text-warmgray-600 dark:text-warmgray-300">
                Your review has been added to our community gallery. Aanu is so grateful for your support! 🌸
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy mt-2 transition-all"
              >
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 text-warmgray-300 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || form.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-warmgray-300 dark:text-warmgray-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {form.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shruti Rao"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Product Category
                  </label>
                  <select
                    value={form.productCategory}
                    onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                  >
                    <option value="Forever Blooms & Pots">Forever Blooms & Pots</option>
                    <option value="Amigurumi Plushies">Amigurumi Plushies</option>
                    <option value="Bags & Accessories">Bags & Accessories</option>
                    <option value="Wearables & Cardigans">Wearables & Cardigans</option>
                    <option value="Cozy Home & Living">Cozy Home & Living</option>
                    <option value="DIY Kits & Patterns">DIY Kits & Patterns</option>
                    <option value="Custom Bespoke Order">Custom Bespoke Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Best Highlight (1-3 words)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Super soft velvet yarn"
                    value={form.highlight}
                    onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Your Detailed Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you loved about your crochet piece, stitch quality, gifting experience, or packaging..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-xl font-bold text-xs shadow-cozy transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>{isSubmitting ? 'Submitting Review...' : 'Post Customer Feedback'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Customer Feedback Wall */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Summary Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-bloom-50 via-rosewood-50/50 to-warmgray-50 dark:from-warmgray-900 dark:to-warmgray-850 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-serif font-bold text-warmgray-900 dark:text-white flex items-center gap-1">
                {avgRating} <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-xs text-warmgray-500 border-l border-warmgray-200 dark:border-warmgray-700 pl-4">
                <span className="font-bold text-warmgray-800 dark:text-white block">{feedbacks.length} Verified Buyer Reviews</span>
                <span>100% Genuine Handcrafted Praise</span>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-1.5">
              {['all', '5', '4'].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRatingFilter(rating)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedRatingFilter === rating
                      ? 'bg-warmgray-900 text-white dark:bg-white dark:text-warmgray-900'
                      : 'bg-white dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400'
                  }`}
                >
                  {rating === 'all' ? 'All Ratings' : `${rating} ★`}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Cards List */}
          <div className="space-y-3.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredFeedbacks.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={item.author}
                      className="w-10 h-10 rounded-full object-cover border-2 border-bloom-200 dark:border-bloom-700"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white flex items-center gap-1.5">
                        <span>{item.author}</span>
                        {item.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-warmgray-400">
                        {item.city ? `${item.city}, India` : 'India'} · {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  {item.highlight && (
                    <span className="text-xs font-bold text-bloom-600 dark:text-bloom-400 block">
                      ✨ “{item.highlight}”
                    </span>
                  )}
                  <p className="text-xs text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-warmgray-400">
                  <span className="bg-warmgray-100 dark:bg-warmgray-800 px-2 py-0.5 rounded-md">
                    {item.productCategory}
                  </span>
                  <span className="flex items-center gap-1 text-rosewood-500 font-medium">
                    <Heart className="w-3 h-3 fill-rosewood-500" />
                    Handcrafted with love
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
