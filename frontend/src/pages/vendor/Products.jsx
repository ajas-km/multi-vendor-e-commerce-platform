import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VendorProducts = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === 'true') {
      setShowForm(true);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5003/api/products?limit=100', { withCredentials: true });
      const vendorProducts = data.products.filter(p => p.vendorId?.userId === user._id);
      setProducts(vendorProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('price', formData.price);
      fd.append('stock', formData.stock);
      fd.append('category', formData.category);
      imageFiles.forEach(file => fd.append('images', file));

      await axios.post('http://localhost:5003/api/products', fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowForm(false);
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
      setImageFiles([]);
      setImagePreviews([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SidebarLink = ({ to, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${active ? 'bg-black text-white' : 'text-gray-500 hover:text-[#ff4e00] hover:bg-orange-50'}`}>
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/products" className="text-xl font-bold text-gray-900 tracking-tight">NovaTrend <span className="text-[#ff4e00]">Vendor</span></Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-2">
          <SidebarLink to="/vendor/dashboard" label="Dashboard" />
          <SidebarLink to="/vendor/products" label="Products" active />
          <SidebarLink to="/vendor/orders" label="Orders" />
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-900 text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-gray-900 truncate uppercase tracking-wider">{user?.name}</p></div>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Products</h1>
              <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{products.length} products listed</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 ${showForm ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-[#ff4e00] text-white hover:bg-[#e64600] shadow-lg shadow-orange-500/20'}`}>
              {showForm ? (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Cancel</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Product</>
              )}
            </button>
          </header>

          {/* Create Product Form */}
          {showForm && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mb-8 animate-slide-up">
              <h2 className="text-lg font-extrabold text-gray-900 mb-1">Add New Product</h2>
              <p className="text-sm text-gray-500 mb-6 font-medium">Fill in the product details and upload images.</p>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Product Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Wireless Bluetooth Speaker" className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#ff4e00] focus:bg-white outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Category *</label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#ff4e00] focus:bg-white outline-none text-sm transition-all">
                      <option value="" disabled>Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Books">Books</option>
                      <option value="Beauty">Beauty</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Describe your product..." className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#ff4e00] focus:bg-white outline-none text-sm resize-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Price (₹) *</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="999" className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#ff4e00] focus:bg-white outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Stock Quantity *</label>
                    <input required type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="50" className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#ff4e00] focus:bg-white outline-none text-sm transition-all" />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Product Images (max 5)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#ff4e00] bg-gray-50 hover:bg-orange-50/50 transition-colors cursor-pointer relative">
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {imagePreviews.length === 0 ? (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-sm font-bold text-gray-900">Click or drag & drop images here</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                      </div>
                    ) : (
                      <div className="flex gap-4 flex-wrap justify-center">
                        {imagePreviews.map((src, idx) => (
                          <img key={idx} src={src} alt={`Preview ${idx}`} className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-sm" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-[#ff4e00] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#e64600] transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {submitting ? (
                    <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>
                  ) : 'Publish Product'}
                </button>
              </form>
            </div>
          )}

          {/* Products Grid/Table */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(n => <div key={n} className="h-56 bg-white rounded-3xl animate-pulse border border-gray-200"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 text-center py-24">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <svg className="w-8 h-8 text-[#ff4e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">No products yet</h3>
              <p className="text-sm font-medium text-gray-500 mb-6">Click "New Product" above to start selling!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p._id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-48 bg-[#f8f8f8] flex items-center justify-center overflow-hidden p-6 border-b border-gray-100">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{p.category}</p>
                    <h4 className="font-extrabold text-gray-900 text-base line-clamp-2 mb-4 leading-tight">{p.name}</h4>
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xl font-black text-[#ff4e00]">₹{p.price.toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${p.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorProducts;
