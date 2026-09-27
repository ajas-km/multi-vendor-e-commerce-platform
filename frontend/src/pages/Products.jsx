import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('search')) setSearch(params.get('search'));
    if (params.has('category')) setCategory(params.get('category'));
    if (params.has('sort')) setSort(params.get('sort'));
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const sortParam = sort === 'price-low' ? 'price-low-high' : sort === 'price-high' ? 'price-high-low' : '';
        const { data } = await axios.get(`http://localhost:5003/api/products?search=${search}&category=${category}&sort=${sortParam}`);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'];

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-[#fcfcfc] border-b border-gray-100 relative overflow-hidden">
        {/* Full-width Hero Decorative Elements */}
        <div className="absolute right-0 top-0 hidden lg:block w-1/2 h-full pointer-events-none opacity-[0.07] bg-gradient-to-l from-[#ff4e00] to-transparent"></div>
        <div className="absolute right-0 top-0 hidden lg:block w-1/3 h-full pointer-events-none opacity-[0.05] bg-gradient-to-bl from-[#ff4e00] via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ff4e00] text-xs font-bold uppercase tracking-widest mb-4 block">Trending Now</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Discover Products<br/>You'll Love
            </h1>
            <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">Shop the latest trending products curated for modern lifestyles.</p>
            
            <div className="flex items-center gap-4">
              <button className="bg-[#ff4e00] text-white px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-[#e64600] transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20">
                Shop Now <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <button className="bg-white text-gray-900 border border-gray-200 px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                Explore Collection
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Loved by 50,000+ customers worldwide</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Strip */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              <div><h4 className="text-sm font-bold text-gray-900">Free Shipping</h4><p className="text-xs text-gray-500">On orders over $50</p></div>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <div><h4 className="text-sm font-bold text-gray-900">Secure Payments</h4><p className="text-xs text-gray-500">100% secure checkout</p></div>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <div><h4 className="text-sm font-bold text-gray-900">Easy Returns</h4><p className="text-xs text-gray-500">30-day return policy</p></div>
            </div>
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <div><h4 className="text-sm font-bold text-gray-900">24/7 Support</h4><p className="text-xs text-gray-500">Always here to help</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="sticky top-24">
              {/* Search override for minimal style */}
              <div className="mb-8">
                <div className="relative border border-gray-200 rounded-lg overflow-hidden flex items-center bg-white">
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full px-4 py-2.5 text-sm outline-none" />
                  <svg className="w-4 h-4 text-gray-400 absolute right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === '' ? 'bg-black text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setCategory('')}
                  >All Categories</button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-black text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                      onClick={() => setCategory(cat)}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Sort By</h3>
                <select value={sort} onChange={e => setSort(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none cursor-pointer hover:border-gray-300 transition-colors">
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">{loading ? '...' : `${products.length} products found`}</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1,2,3,4,5,6,7,8].map(n => (
                  <div key={n} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 animate-pulse">
                    <div className="bg-gray-200 h-44 rounded-xl mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-[#ff4e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500 text-sm">Try adjusting your search or filters.</p>
                <button onClick={() => {setSearch(''); setCategory('');}} className="mt-4 px-5 py-2 text-sm font-bold text-white bg-[#ff4e00] rounded-full hover:bg-[#e64600] shadow-md shadow-orange-500/20 transition-colors">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col relative">
                    {/* Discount Badge */}
                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-[#ff4e00] text-white text-[10px] font-bold z-10 shadow-sm">-15%</span>
                    {/* Heart Icon */}
                    <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-gray-400 hover:text-red-500 z-10 shadow-sm transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>

                    <Link to={`/products/${product._id}`} className="relative h-56 bg-[#f8f8f8] flex items-center justify-center overflow-hidden p-4">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                      ) : (
                        <div className="text-gray-300 flex flex-col items-center">
                          <svg className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </Link>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#ff4e00] transition-colors line-clamp-1 mb-1">{product.name}</h3>
                      </Link>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">(128)</span>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-gray-900">₹{product.price.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 line-through">₹{(product.price * 1.15).toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                          className="h-9 w-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-[#ff4e00] transition-colors shadow-md"
                          title="Quick Add"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
