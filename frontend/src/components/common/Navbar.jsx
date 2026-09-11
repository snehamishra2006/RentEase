import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { fetchNotifications, markNotificationsRead } from '../../redux/slices/notificationSlice';
import {
  Building2,
  Bell,
  User as UserIcon,
  LogOut,
  Heart,
  FileText,
  Home,
  ShieldCheck,
  Wrench,
  ChevronDown,
  LayoutDashboard,
  Sun,
  Moon,
} from 'lucide-react';
import Badge from './Badge';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { list: notifications, unreadCount } = useSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dark Mode State with LocalStorage Persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('rentease_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rentease_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rentease_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated, location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleNotificationClick = () => {
    if (!showNotifications && unreadCount > 0) {
      dispatch(markNotificationsRead());
    }
    setShowNotifications(!showNotifications);
  };

  const navLinks = () => {
    if (!user) {
      return [{ label: 'Browse Properties', path: '/properties', icon: Home }];
    }

    if (user.role === 'tenant') {
      return [
        { label: 'Properties Registry', path: '/properties', icon: Home },
        { label: 'Saved Favorites', path: '/tenant/favorites', icon: Heart },
        { label: 'Applications', path: '/tenant/applications', icon: FileText },
        { label: 'Active Lease', path: '/tenant/rental', icon: Building2 },
        { label: 'Maintenance', path: '/tenant/maintenance', icon: Wrench },
      ];
    }

    if (user.role === 'owner') {
      return [
        { label: 'Landlord Ledger', path: '/owner/dashboard', icon: LayoutDashboard },
        { label: 'My Listings', path: '/owner/my-properties', icon: Building2 },
        { label: 'Applications', path: '/owner/applications', icon: FileText },
        { label: 'Lease Agreements', path: '/owner/rentals', icon: Home },
        { label: 'Maintenance', path: '/owner/maintenance', icon: Wrench },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Admin Registry', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Verification Queue', path: '/admin/verification', icon: ShieldCheck },
        { label: 'Users Directory', path: '/admin/users', icon: UserIcon },
        { label: 'All Properties', path: '/properties', icon: Building2 },
      ];
    }

    return [];
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2] dark:bg-stone-900 border-b border-[#E2DACD] dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-md bg-[#1B3B2B] flex items-center justify-center text-[#FAF7F2] shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-[#1B3B2B] dark:text-emerald-400 tracking-tight">RentEase</span>
              <span className="block text-[9px] uppercase tracking-[0.18em] font-bold text-[#605A52] dark:text-stone-400">
                Property Ledger
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks().map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1B3B2B] text-white shadow-sm'
                      : 'text-[#605A52] dark:text-stone-300 hover:text-[#1C1917] dark:hover:text-stone-100 hover:bg-[#F4F0E8] dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Menu & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-[#605A52] dark:text-stone-300 hover:text-[#1C1917] dark:hover:text-stone-100 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1B3B2B]" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 rounded-lg bg-white dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-[#605A52] dark:text-stone-300 hover:text-[#1C1917] dark:hover:text-stone-100 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B8860B] text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-xl border border-[#E2DACD] dark:border-stone-800 shadow-xl p-4 z-50">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2DACD] dark:border-stone-800">
                        <h4 className="font-serif font-bold text-[#1C1917] dark:text-stone-100 text-sm flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> Ledger Alerts
                        </h4>
                        <span className="text-xs text-[#605A52] dark:text-stone-400">{notifications.length} total</span>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-[#605A52] dark:text-stone-400 text-xs">No ledger alerts</div>
                        ) : (
                          notifications.map((item) => (
                            <Link
                              key={item._id}
                              to={item.link || '#'}
                              onClick={() => setShowNotifications(false)}
                              className={`block p-3 rounded-lg border text-xs transition-colors ${
                                !item.isRead
                                  ? 'bg-[#FAF7F2] dark:bg-stone-800 border-[#1B3B2B]/30 dark:border-emerald-500/30 text-[#1C1917] dark:text-stone-100'
                                  : 'bg-white dark:bg-stone-900 border-[#E2DACD] dark:border-stone-800 text-[#605A52] dark:text-stone-400'
                              }`}
                            >
                              <div className="font-bold text-[#1C1917] dark:text-stone-100 mb-0.5">{item.title}</div>
                              <p className="line-clamp-2 text-xs">{item.message}</p>
                              <span className="text-[10px] text-[#605A52] dark:text-stone-400 mt-1 block">
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2.5 p-1 pr-2.5 rounded-lg bg-white dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 hover:border-[#1B3B2B]/40 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-md object-cover border border-[#E2DACD] dark:border-stone-700"
                    />
                    <div className="hidden sm:block text-left">
                      <span className="block text-xs font-bold text-[#1C1917] dark:text-stone-100 leading-tight">{user.name}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-[#B8860B] dark:text-amber-400 font-bold">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#605A52] dark:text-stone-400" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-xl border border-[#E2DACD] dark:border-stone-800 shadow-xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-[#E2DACD] dark:border-stone-800 mb-1">
                        <p className="text-xs font-bold text-[#1C1917] dark:text-stone-100">{user.name}</p>
                        <p className="text-[11px] text-[#605A52] dark:text-stone-400 truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <Badge status={user.role} text={user.role} />
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#1C1917] dark:text-stone-200 hover:bg-[#F4F0E8] dark:hover:bg-stone-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> Profile Settings
                      </Link>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#991B1B] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#1C1917] dark:text-stone-200 hover:bg-[#F4F0E8] dark:hover:bg-stone-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
