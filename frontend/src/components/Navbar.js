import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="bg-yellow-400 text-gray-800 py-3 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-lg sm:text-2xl font-extrabold tracking-wide text-gray-900"
        >
          🚗 BookRide
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
          {user ? (
            <>
              <span className="hidden sm:inline font-medium text-gray-700">
                Hi, {user.name}
              </span>

              {user.type === 'passenger' && location.pathname === '/' && (
                <Link
                  to="/book-ride"
                  className="bg-yellow-600 text-white hover:bg-yellow-700 px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow transition"
                >
                  Book Ride
                </Link>
              )}

              <Link
                to="/profile"
                className="bg-yellow-600 text-white hover:bg-yellow-700 px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow transition"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 font-semibold hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-600 text-white hover:bg-yellow-700 px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
