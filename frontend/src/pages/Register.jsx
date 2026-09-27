import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // default role
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await register(name, email, password, role);
      if (userData.role === 'vendor' || userData.role === 'admin') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] relative overflow-hidden py-12 font-sans">
      <div className="relative w-full max-w-lg p-8 bg-white border border-gray-100 rounded-3xl shadow-xl z-10">
        <div className="text-center mb-8">
          <Link to="/products" className="inline-block text-2xl font-bold text-gray-900 tracking-tight mb-6">NovaTrend</Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Join Us</h1>
          <p className="text-gray-500 mt-2">Create your account to start shopping or selling</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ff4e00] focus:border-transparent transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">I want to:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer border rounded-xl p-4 text-center transition-all ${role === 'customer' ? 'bg-orange-50 border-[#ff4e00] text-[#ff4e00]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  className="hidden"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="font-bold block">Shop</span>
                <span className="text-xs mt-1 block font-medium">Customer Account</span>
              </label>

              <label className={`cursor-pointer border rounded-xl p-4 text-center transition-all ${role === 'vendor' ? 'bg-orange-50 border-[#ff4e00] text-[#ff4e00]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  className="hidden"
                  value="vendor"
                  checked={role === 'vendor'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="font-bold block">Sell</span>
                <span className="text-xs mt-1 block font-medium">Vendor Account</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold text-white bg-[#ff4e00] hover:bg-[#e64600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4e00] transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#ff4e00] hover:text-[#e64600] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
