import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ReviewsSection = ({ product, onReviewAdded }) => {
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = product?.reviews || [];
  const averageRating = product?.rating || 5;

  // Rating score breakdown
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      addToast('Please provide your name and review', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.addReview(product.id, { author, rating, title, comment });
      if (res.success) {
        addToast('🌸 Thank you for reviewing this handmade creation!', 'success');
        setShowModal(false);
        setAuthor('');
        setTitle('');
        setComment('');
        if (onReviewAdded) onReviewAdded(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Could not submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Average Score */}
          <div className="md:col-span-4 text-center md:border-r border-warmgray-200 dark:border-warmgray-800 pr-0 md:pr-8">
            <span className="text-5xl sm:text-6xl font-serif font-bold text-warmgray-900 dark:text-white">
              {averageRating}
            </span>
            <div className="flex justify-center items-center gap-1 my-2 text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-warmgray-300 dark:text-warmgray-700'}`}
                />
              ))}
            </div>
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
              Based on {reviews.length} handcrafted reviews
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transition-all inline-flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {ratingDistribution.map(dist => (
              <div key={dist.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-warmgray-600 dark:text-warmgray-400 flex items-center gap-1">
                  <span>{dist.stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-warmgray-100 dark:bg-warmgray-800 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-warmgray-400 font-medium">{dist.count}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-warmgray-500 text-sm">
            Be the first to review this artisan creation!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-warmgray-900 rounded-2xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.author)}`}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-warmgray-200 dark:border-warmgray-700"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-warmgray-900 dark:text-white flex items-center gap-1.5">
                      {rev.author}
                      {rev.verifiedPurchase && (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified Buyer
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-warmgray-400">{rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-warmgray-200 dark:text-warmgray-700'}`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && (
                <h6 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white">
                  "{rev.title}"
                </h6>
              )}

              <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
                {rev.comment}
              </p>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-warmgray-400">
                <button className="flex items-center gap-1 hover:text-bloom-600 transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-warmgray-100 dark:border-warmgray-800">
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                Review "{product.name}"
              </h3>
              <button onClick={() => setShowModal(false)} className="text-warmgray-400 hover:text-warmgray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-warmgray-300 dark:text-warmgray-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-warmgray-500 ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 focus:ring-1 focus:ring-bloom-400 text-warmgray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Softest plushie ever!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 focus:ring-1 focus:ring-bloom-400 text-warmgray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Your Experience with the Handmade Piece
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the pipe cleaners quality, creations, gift packaging..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 focus:ring-1 focus:ring-bloom-400 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-warmgray-600 hover:text-warmgray-900 dark:text-warmgray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting Review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
