import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5003/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 bg-gray-200 h-96 rounded-3xl"></div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-48 mt-10"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Error</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link to="/products" className="mt-4 inline-block text-[#ff4e00] font-bold hover:underline">Back to products</Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="mb-6">
        <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-[#ff4e00] flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to products
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
        {/* Images */}
        <div className="w-full md:w-1/2">
          <div className="aspect-w-1 aspect-h-1 bg-[#f8f8f8] rounded-2xl overflow-hidden flex items-center justify-center h-[500px] p-8">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="object-contain w-full h-full mix-blend-multiply" />
            ) : (
              <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase bg-black text-white mb-4 w-max">
            {product.category}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-3xl font-black text-[#ff4e00]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                Out of Stock
              </span>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {product.description || 'No description provided by the seller.'}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 flex items-center">
            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 font-bold text-lg mr-4">
              {product.vendorId?.storeName ? product.vendorId.storeName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Sold by</p>
              <p className="font-bold text-gray-900 text-sm">{product.vendorId?.storeName || 'Independent Seller'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex items-center border border-gray-200 rounded-xl bg-white px-2 py-1 h-12 w-fit">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center focus:outline-none transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center focus:outline-none transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <div className="flex flex-1 gap-3">
              <button 
                onClick={() => {
                  addToCart(product._id, quantity);
                }}
                disabled={product.stock === 0}
                className={`flex-1 h-12 rounded-xl font-bold transition-all border-2 ${product.stock === 0 ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-[#ff4e00] text-[#ff4e00] hover:bg-orange-50'}`}
              >
                Add to Cart
              </button>
              <button 
                onClick={() => {
                  addToCart(product._id, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
                className={`flex-1 h-12 rounded-xl font-bold text-white transition-all shadow-lg ${product.stock === 0 ? 'bg-gray-300 shadow-none cursor-not-allowed text-gray-500' : 'bg-[#ff4e00] hover:bg-[#e64600] shadow-orange-500/20 transform hover:-translate-y-0.5'}`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Review Form */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                try {
                  await axios.post(`http://localhost:5003/api/products/${product._id}/reviews`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  window.location.reload();
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to submit review. Are you logged in?');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rating (1-5)</label>
                <select name="rating" required className="w-full border-gray-200 rounded-xl focus:border-[#ff4e00] focus:ring focus:ring-orange-200 focus:ring-opacity-50">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Review</label>
                <textarea name="comment" required rows="4" className="w-full border-gray-200 rounded-xl focus:border-[#ff4e00] focus:ring focus:ring-orange-200 focus:ring-opacity-50" placeholder="What did you like or dislike?"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Photo (optional)</label>
                <input type="file" name="photo" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-[#ff4e00] hover:file:bg-orange-100" />
              </div>
              <button type="submit" className="w-full bg-[#ff4e00] text-white py-3 rounded-xl font-bold hover:bg-[#e64600] transition-colors shadow-md shadow-orange-500/20">
                Submit Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="w-full md:w-2/3">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900">{review.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    {review.photo && (
                      <img src={review.photo} alt="Review" className="mt-3 h-24 w-24 object-cover rounded-lg border border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

