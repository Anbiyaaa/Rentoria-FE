import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userImage = localStorage.getItem("profileImage");
    const role = localStorage.getItem("userRole");

    setIsLoggedIn(!!token);
    setUserRole(role || "");

    if (userImage) {
      setProfileImage(userImage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("profileImage");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close profile menu when opening main menu
    if (!isMenuOpen && isProfileMenuOpen) {
      setIsProfileMenuOpen(false);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    // Close main menu when opening profile menu on mobile
    if (!isProfileMenuOpen && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <nav className="bg-[#0D0D0D] text-white py-4 shadow-lg sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/sunny.jpg"
              alt="Gamefy"
              className="w-8 h-8 mr-2"
            />
            <h1 className="text-xl font-bold text-[#B6FF00]">Rentoria</h1>
          </div>

          {/* Desktop Menu */}


          {/* Desktop Login Button or User Menu */}
          <div className="hidden md:flex items-center">
            <div className="hidden md:flex pr-10 space-x-8">
              <Link to="/" className="hover:text-[#B6FF00] transition-colors">
                Beranda
              </Link>
              <Link to="/belanja" className="hover:text-[#B6FF00] transition-colors">
                Produk
              </Link>
              <Link to="/contact" className="hover:text-[#B6FF00] transition-colors">
                Kontak
              </Link>
              <Link to="/procedur" className="hover:text-[#B6FF00] transition-colors">
                Prosedur Penyewaan
              </Link>
            </div>
            {isLoggedIn ? (
              <div className="relative group profile-menu-container">
                <img
                  src={profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-[#B6FF00] cursor-pointer"
                  onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] shadow-lg rounded-lg border border-[#B6FF00] z-50">
                    <div className="px-4 py-2 border-b border-gray-700 text-center text-sm text-gray-300">
                      {userRole === "admin" ? "Admin Account" : "User Account"}
                    </div>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/dashboardUser"
                      className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/catalog"
                      className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-[#B6FF00] hover:bg-[#333] transition-colors border-t border-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 border-2 border-[#B6FF00] text-[#B6FF00] rounded-md hover:bg-[#B6FF00] hover:text-black transition-colors font-bold"
              >
                SIGN IN
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center">
            {/* Profile Icon (if logged in) */}
            {isLoggedIn && (
              <div className="relative mr-4 profile-menu-container">
                <img
                  src={profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-[#B6FF00] cursor-pointer"
                  onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] shadow-lg rounded-lg border border-[#B6FF00] z-50">
                    <div className="px-4 py-2 border-b border-gray-700 text-center text-sm text-gray-300">
                      {userRole === "admin" ? "Admin Account" : "User Account"}
                    </div>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/dashboardUser"
                      className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/catalog"
                      className="block px-4 py-2 text-white hover:bg-[#333] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-[#B6FF00] hover:bg-[#333] transition-colors border-t border-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="hover:text-[#B6FF00] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                to="/contact"
                className="hover:text-[#B6FF00] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>
              <Link
                to="/belanja"
                className="hover:text-[#B6FF00] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produk
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="px-5 py-2 border-2 border-[#B6FF00] text-[#B6FF00] rounded-md hover:bg-[#B6FF00] hover:text-black transition-colors font-bold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SIGN IN
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;