import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const VendorLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!user || user.role !== 'vendor') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default VendorLayout;
