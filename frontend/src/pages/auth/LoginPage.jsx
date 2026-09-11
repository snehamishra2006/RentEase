import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, LogIn, Sparkles, UserCheck } from 'lucide-react';
import Badge from '../../components/common/Badge';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/properties');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(loginUser({ email: demoEmail, password: demoPassword }));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E2DACD] shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-lg bg-[#1B3B2B] items-center justify-center text-white shadow-sm mb-1">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">RentEase Ledger Access</h1>
          <p className="text-xs text-[#605A52]">Sign in to access property deeds and rental records</p>
        </div>

        {/* Demo Quick Logins */}
        <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#B8860B]" /> Instant Demo Sign-In
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('deepanshusingh542005@gmail.com', 'Password123!')}
              className="p-2 rounded-lg bg-white border border-[#E2DACD] hover:border-[#1B3B2B] text-center transition-all shadow-2xs group"
            >
              <Badge status="tenant" text="TENANT" />
              <span className="block text-[10px] text-[#605A52] mt-1 font-semibold group-hover:text-[#1C1917]">
                Demo User
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('satveer.singh92@gmail.com', 'Password123!')}
              className="p-2 rounded-lg bg-white border border-[#E2DACD] hover:border-[#1B3B2B] text-center transition-all shadow-2xs group"
            >
              <Badge status="owner" text="OWNER" />
              <span className="block text-[10px] text-[#605A52] mt-1 font-semibold group-hover:text-[#1C1917]">
                Demo Owner
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin.anjali@gmail.com', 'Password123!')}
              className="p-2 rounded-lg bg-white border border-[#E2DACD] hover:border-[#1B3B2B] text-center transition-all shadow-2xs group"
            >
              <Badge status="admin" text="ADMIN" />
              <span className="block text-[10px] text-[#605A52] mt-1 font-semibold group-hover:text-[#1C1917]">
                Demo Admin
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-[#991B1B] text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#1C1917] font-bold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-[#1C1917] font-bold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> {loading ? 'Signing In...' : 'Sign In to Ledger'}
          </button>
        </form>

        <p className="text-center text-xs text-[#605A52]">
          Don't have a ledger account?{' '}
          <Link to="/register" className="font-bold text-[#1B3B2B] hover:underline">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
