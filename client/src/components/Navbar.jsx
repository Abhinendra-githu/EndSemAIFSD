import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiPlusCircle, FiList, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl text-primary-600 font-bold tracking-tight">AI SmartGrievance</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium flex items-center space-x-1 transition-colors">
                  <FiHome /> <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/complaints" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium flex items-center space-x-1 transition-colors">
                  <FiList /> <span className="hidden sm:inline">Complaints</span>
                </Link>
                <Link to="/register-complaint" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium flex items-center space-x-1 transition-colors">
                  <FiPlusCircle /> <span className="hidden sm:inline">New Complaint</span>
                </Link>
                <div className="border-l border-gray-300 h-6 mx-2 hidden sm:block"></div>
                <span className="text-gray-800 font-medium hidden md:block">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium px-3 py-2 transition-colors"
                  title="Logout"
                >
                  <FiLogOut /> <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2 transition-colors">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
