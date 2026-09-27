import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api/admin';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [form, setForm] = useState({
    code: '', description: '', type: 'percentage', value: '', minOrderAmount: '', maxUses: '', isActive: true, expiresAt: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDiscounts = async () => {
    try {
      const { data } = await axios.get(`${API}/discounts`, { withCredentials: true });
      setDiscounts(data);
    } catch (err) {
      console.error('Error fetching discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const resetForm = () => {
    setForm({ code: '', description: '', type: 'percentage', value: '', minOrderAmount: '', maxUses: '', isActive: true, expiresAt: '' });
    setEditingDiscount(null);
    setShowForm(false);
  };

  const handleEdit = (d) => {
    setForm({
      code: d.code,
      description: d.description || '',
      type: d.type,
      value: d.value,
      minOrderAmount: d.minOrderAmount || '',
      maxUses: d.maxUses || '',
      isActive: d.isActive,
      expiresAt: d.expiresAt ? d.expiresAt.split('T')[0] : ''
    });
    setEditingDiscount(d);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: form.code,
        description: form.description,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxUses: form.maxUses ? Number(form.maxUses) : 0,
        isActive: form.isActive,
        expiresAt: form.expiresAt || undefined
      };

      if (editingDiscount) {
        await axios.put(`${API}/discounts/${editingDiscount._id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${API}/discounts`, payload, { withCredentials: true });
      }
      resetForm();
      fetchDiscounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save discount');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`${API}/discounts/${id}`, { withCredentials: true });
      fetchDiscounts();
    } catch (err) {
      alert('Failed to delete discount');
    }
  };

  const toggleActive = async (d) => {
    try {
      await axios.put(`${API}/discounts/${d._id}`, { isActive: !d.isActive }, { withCredentials: true });
      fetchDiscounts();
    } catch (err) {
      alert('Failed to update discount');
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
        <h1 className="text-2xl font-extrabold text-gray-900">Global Discounts</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#ff4e00] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e64600] transition-colors shadow-md shadow-orange-500/20"
        >
          + New Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-6">{editingDiscount ? 'Edit Coupon' : 'Create New Coupon'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Code *</label>
                  <input type="text" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent font-mono uppercase"
                    placeholder="SAVE20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Type *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00]">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent"
                  placeholder="Get 20% off on all electronics" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Value *</label>
                  <input type="number" required min="1" value={form.value} onChange={e => setForm({...form, value: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent"
                    placeholder={form.type === 'percentage' ? '20' : '500'} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Min Order ₹</label>
                  <input type="number" min="0" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent"
                    placeholder="1000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Max Uses</label>
                  <input type="number" min="0" value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent"
                    placeholder="0 = unlimited" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Expires At</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff4e00]" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})}
                      className="w-4 h-4 text-[#ff4e00] rounded focus:ring-[#ff4e00]" />
                    <span className="text-sm font-bold text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#ff4e00] hover:bg-[#e64600] transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50">
                  {submitting ? 'Saving...' : (editingDiscount ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discounts List */}
      {discounts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No coupons created yet. Click "New Coupon" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discounts.map(d => (
            <div key={d._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-lg font-black text-[#ff4e00]">{d.code}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${d.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {d.description && <p className="text-sm text-gray-500">{d.description}</p>}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">
                    {d.type === 'percentage' ? `${d.value}%` : `₹${d.value}`}
                  </span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">off</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {d.minOrderAmount > 0 && <span className="bg-gray-50 px-2 py-1 rounded">Min ₹{d.minOrderAmount}</span>}
                {d.maxUses > 0 && <span className="bg-gray-50 px-2 py-1 rounded">Max {d.maxUses} uses ({d.usedCount} used)</span>}
                {d.expiresAt && <span className="bg-gray-50 px-2 py-1 rounded">Expires {new Date(d.expiresAt).toLocaleDateString()}</span>}
                {!d.expiresAt && <span className="bg-gray-50 px-2 py-1 rounded">No expiry</span>}
              </div>
              <div className="flex gap-2 border-t border-gray-100 pt-3">
                <button onClick={() => toggleActive(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${d.isActive ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {d.isActive ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleEdit(d)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Edit</button>
                <button onClick={() => handleDelete(d._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discounts;
