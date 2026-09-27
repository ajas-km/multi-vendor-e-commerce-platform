import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api/admin';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [form, setForm] = useState({
    title: '', imageUrl: '', linkUrl: '', placement: 'hero', isActive: true, startDate: '', endDate: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(`${API}/ads`, { withCredentials: true });
      setAds(data);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  const resetForm = () => {
    setForm({ title: '', imageUrl: '', linkUrl: '', placement: 'hero', isActive: true, startDate: '', endDate: '' });
    setImageFile(null);
    setEditingAd(null);
    setShowForm(false);
  };

  const handleEdit = (ad) => {
    setForm({
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl || '',
      placement: ad.placement,
      isActive: ad.isActive,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : ''
    });
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('linkUrl', form.linkUrl);
      formData.append('placement', form.placement);
      formData.append('isActive', form.isActive);
      if (form.startDate) formData.append('startDate', form.startDate);
      if (form.endDate) formData.append('endDate', form.endDate);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.imageUrl) {
        formData.append('imageUrl', form.imageUrl);
      }

      if (editingAd) {
        await axios.put(`${API}/ads/${editingAd._id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${API}/ads`, formData, { withCredentials: true });
      }
      resetForm();
      fetchAds();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save ad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      await axios.delete(`${API}/ads/${id}`, { withCredentials: true });
      fetchAds();
    } catch (err) {
      alert('Failed to delete ad');
    }
  };

  const toggleActive = async (ad) => {
    try {
      await axios.put(`${API}/ads/${ad._id}`, { isActive: !ad.isActive }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
      fetchAds();
    } catch (err) {
      alert('Failed to update ad');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Ad Control</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#ff4e00] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e64600] transition-colors shadow-md shadow-orange-500/20"
        >
          + New Ad
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-6">{editingAd ? 'Edit Ad' : 'Create New Ad'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-[#ff4e00]" />
                {!imageFile && (
                  <input type="text" placeholder="Or paste image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent text-sm" />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Link URL</label>
                <input type="text" value={form.linkUrl} onChange={e => setForm({...form, linkUrl: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Placement</label>
                  <select value={form.placement} onChange={e => setForm({...form, placement: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00]">
                    <option value="hero">Hero Banner</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="banner">Inline Banner</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer bg-orange-50 px-4 py-2 rounded-xl">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})}
                      className="w-4 h-4 text-[#ff4e00] rounded focus:ring-[#ff4e00] border-gray-300" />
                    <span className="text-sm font-bold text-gray-900">Active (Show Ad)</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00]" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#ff4e00] hover:bg-[#e64600] transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50">
                  {submitting ? 'Saving...' : (editingAd ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ads List */}
      {ads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No ads created yet. Click "New Ad" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map(ad => (
            <div key={ad._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-32 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 truncate">{ad.title}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ad.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {ad.isActive ? 'Live' : 'Off'}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                    {ad.placement}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {ad.startDate && `From ${new Date(ad.startDate).toLocaleDateString()}`}
                  {ad.endDate && ` to ${new Date(ad.endDate).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(ad)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${ad.isActive ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {ad.isActive ? 'Pause' : 'Activate'}
                </button>
                <button onClick={() => handleEdit(ad)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                <button onClick={() => handleDelete(ad._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ads;
