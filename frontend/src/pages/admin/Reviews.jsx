import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api/admin';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, high, low

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/reviews`, { withCredentials: true });
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (productId, reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`${API}/reviews/${productId}/${reviewId}`, { withCredentials: true });
      fetchReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'high') return r.rating >= 4;
    if (filter === 'low') return r.rating <= 2;
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Review Moderation</h1>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-gray-900">{reviews.length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Reviews</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-amber-500">{avgRating} ★</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Rating</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-red-500">{reviews.filter(r => r.rating <= 2).length}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Ratings (≤2)</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All Reviews' },
          { key: 'high', label: '★ 4-5 Stars' },
          { key: 'low', label: '★ 1-2 Stars' }
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === tab.key ? 'bg-[#ff4e00] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {review.productImage ? (
                    <img src={review.productImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-[10px]">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{review.userName}</span>
                      <span className="text-[10px] text-gray-400">on</span>
                      <span className="font-bold text-gray-700 text-sm truncate">{review.productName}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs font-bold text-gray-500 ml-1">{review.rating}/5</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>

                  {review.photo && (
                    <img src={review.photo} alt="Review photo" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <button onClick={() => handleDelete(review.productId, review._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
