import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';

// Components & Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';
import WelcomeIntro from './components/common/WelcomeIntro';
import AIChatDrawer from './components/ai/AIChatDrawer';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PropertySearchPage from './pages/tenant/PropertySearchPage';
import PropertyDetailsPage from './pages/tenant/PropertyDetailsPage';
import FavoritesPage from './pages/tenant/FavoritesPage';
import ApplicationsPage from './pages/tenant/ApplicationsPage';
import ActiveRentalPage from './pages/tenant/ActiveRentalPage';
import TenantMaintenancePage from './pages/tenant/TenantMaintenancePage';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyPropertiesPage from './pages/owner/MyPropertiesPage';
import OwnerApplicationsPage from './pages/owner/OwnerApplicationsPage';
import OwnerRentalsPage from './pages/owner/OwnerRentalsPage';
import OwnerMaintenancePage from './pages/owner/OwnerMaintenancePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyVerificationPage from './pages/admin/PropertyVerificationPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ProfilePage from './pages/ProfilePage';

// Home redirect helper
const HomeRedirect = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader fullScreen text="Initializing RentEase..." />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/properties" replace />;
  }

  if (user.role === 'tenant') return <Navigate to="/properties" replace />;
  if (user.role === 'owner') return <Navigate to="/owner/dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/properties" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <WelcomeIntro>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#121210] text-[#1C1917] dark:text-stone-100 selection:bg-[#1B3B2B] selection:text-white transition-colors duration-300">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<HomeRedirect />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Tenant Public/Discovery Routes */}
              <Route path="/properties" element={<PropertySearchPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />

              {/* Protected Tenant Routes */}
              <Route
                path="/tenant/favorites"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/applications"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <ApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/rental"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <ActiveRentalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/maintenance"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <TenantMaintenancePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/my-properties"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <MyPropertiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/applications"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/rentals"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerRentalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/maintenance"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerMaintenancePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verification"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PropertyVerificationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Profile Settings Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['tenant', 'owner', 'admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <AIChatDrawer />
          <Footer />
        </div>
      </Router>
    </WelcomeIntro>
  );
}

export default App;
