import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, UserPlus, Check, X } from 'lucide-react';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [phone, setPhone] = useState('');
  const [clientError, setClientError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
    setClientError('');
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/properties');
    }
  }, [isAuthenticated, user, navigate]);

  // Password requirement checks (mix of uppercase, lowercase, at least 1 symbol, min 6 chars)
  const passHasMinLen = password.length >= 6;
  const passHasUpper = /[A-Z]/.test(password);
  const passHasLower = /[a-z]/.test(password);
  const passHasSpecial = /[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passMatches = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!name.trim()) {
      setClientError('Please enter your full name.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setClientError('Please enter a valid email address.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || !PHONE_REGEX.test(cleanPhone)) {
      setClientError('Phone number must contain exactly 10 digits and start with 6, 7, 8, or 9.');
      return;
    }

    if (!passHasMinLen || !passHasUpper || !passHasLower || !passHasSpecial) {
      setClientError(
        'Password must contain a mix of uppercase and lowercase letters and at least 1 special character (e.g. @, #, !).'
      );
      return;
    }

    if (password !== confirmPassword) {
      setClientError('Passwords do not match.');
      return;
    }

    dispatch(
      registerUser({
        name: name.trim(),
        email: cleanEmail,
        password,
        confirmPassword,
        role,
        phone: cleanPhone,
      })
    );
  };

  const displayError = clientError || error;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-xl border border-[#E2DACD] dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-lg bg-[#1B3B2B] items-center justify-center text-white shadow-sm mb-1">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917] dark:text-stone-100">Create Ledger Account</h1>
          <p className="text-xs text-[#605A52] dark:text-stone-400">#PukkaDeedsOnly • Tenant & Landlord Account Setup</p>
        </div>

        {displayError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[#991B1B] dark:text-rose-300 text-xs font-semibold text-center">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Rohit Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              >
                <option value="tenant">Tenant</option>
                <option value="owner">Property Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Mobile Number (10 Digits)</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Mix of Upper (A-Z), lower (a-z) and symbol (@,#,!...)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          {/* Simplified Password Requirements Checklist */}
          <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-stone-800/80 border border-[#E2DACD] dark:border-stone-700 space-y-1 text-[11px]">
            <span className="font-bold text-[#1C1917] dark:text-stone-200 block mb-1">Password Requirements:</span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span className={`flex items-center gap-1 font-semibold ${passHasMinLen ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                {passHasMinLen ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 6+ Characters
              </span>
              <span className={`flex items-center gap-1 font-semibold ${passHasUpper ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                {passHasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Uppercase (A-Z)
              </span>
              <span className={`flex items-center gap-1 font-semibold ${passHasLower ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                {passHasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Lowercase (a-z)
              </span>
              <span className={`flex items-center gap-1 font-semibold ${passHasSpecial ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                {passHasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Symbol (@, #, !, ...)
              </span>
              <span className={`flex items-center gap-1 font-semibold ${passMatches ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                {passMatches ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Passwords Match
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> {loading ? 'Creating Account...' : 'Register Ledger Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#605A52] dark:text-stone-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#1B3B2B] dark:text-emerald-400 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
