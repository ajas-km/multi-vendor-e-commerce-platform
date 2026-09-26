import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const { addToCart } = useContext(CartContext);

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
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-indigo-200 text-xs font-semibold mb-4 border border-white/10">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Multi-Vendor Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Amazing Products</span>
            </h1>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl">Shop from hundreds of independent sellers. Best prices, authentic products, delivered to your doorstep.</p>
            <div className="flex items-center bg-white rounded-full shadow-2xl p-1.5 max-w-lg">
              <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What are you looking for?" 
                className="flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Filters
              </h3>
              
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <div className="space-y-1">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${category === '' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setCategory('')}
                  >All Categories</button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${category === cat ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setCategory(cat)}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
                <select value={sort} onChange={e => setSort(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option value="newest">Newest First</option>
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
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500 text-sm">Try adjusting your search or filters.</p>
                <button onClick={() => {setSearch(''); setCategory('');}} className="mt-4 px-5 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                    <Link to={`/products/${product._id}`} className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="text-gray-300 flex flex-col items-center">
                          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="text-xs mt-1">No image</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-gray-700 backdrop-blur-sm shadow-sm">{product.category}</span>
                    </Link>
                    
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{product.vendorId?.storeName || 'Seller'}</p>
                      <Link to={`/products/${product._id}`}>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">{product.name}</h3>
                      </Link>
                      
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                        <div>
                          <span className="text-lg font-extrabold text-gray-900">₹{product.price.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                          className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="Add to cart"
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
