import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaEnvelope, FaUserCircle, FaShoppingCart, FaBars } from "react-icons/fa";
import AxiosInstance from "../axiosInstance/axios";
import { useNavigate } from "react-router-dom";

const CustomerHeader = () => {
  const [userData, setUserData] = useState({
    name: "Cust",
    id: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(new Date());
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Create audio instance for notification sound
  const notificationAudio = new Audio("/sounds/notification.mp3");

  useEffect(() => {
    // Function to fetch customer profile data
    const fetchCustomerProfile = async () => {
      try {
        setLoading(true);
        
        const customerResponse = await AxiosInstance.get('/api/customer/profile', {
          timeout: 5000
        });
        
        if (customerResponse.data && customerResponse.data.profile) {
          const userId = customerResponse.data.profile.user_id;
          
          const userResponse = await AxiosInstance.get(`/api/customer/users/${userId}`, {
            timeout: 5000
          });
          
          if (userResponse.data && userResponse.data.user) {
            setUserData({
              name: userResponse.data.user.name,
              id: userId
            });
          }
        }
        
        // Fetch cart count
        // try {
        //   const cartResponse = await AxiosInstance.get('/api/customer/cart');
        //   if (cartResponse.data && cartResponse.data.items) {
        //     setCartCount(cartResponse.data.items.length);
        //   }
        // } catch (cartErr) {
        //   console.error("Error fetching cart:", cartErr);
        // }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        
        if (err.code === "ERR_NETWORK") {
          setError("Connection to server failed. Make sure backend server is running.");
        } else {
          setError(err.message || "Failed to load customer data");
        }
        
        setLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  // Function to check for new messages from admin
  useEffect(() => {
    const checkNewMessages = async () => {
      try {
        const response = await AxiosInstance.get('/api/customer/chats/1'); // Admin chat endpoint
        
        if (response.data) {
          // Filter messages from admin (sender_id = 1) that are after our last read timestamp
          const newMessages = response.data.filter(msg => {
            const msgDate = new Date(msg.created_at);
            return msg.sender_id === 1 && msgDate > lastReadTimestamp;
          });
          
          setUnreadMessages(newMessages.length);
          
          // Play notification sound if there are new messages
          if (newMessages.length > 0) {
            notificationAudio.play();
          }
        }
      } catch (err) {
        console.error("Error checking for new messages:", err);
      }
    };
    
    // Check for new messages every 15 seconds
    const interval = setInterval(checkNewMessages, 15000);
    
    // Also check for new messages when component mounts
    checkNewMessages();
    
    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, [lastReadTimestamp]);

  // Handle notification icon click
  const handleNotificationClick = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  // Handle closing notification dropdown
  const handleCloseNotifications = () => {
    setNotificationsOpen(false);
    setLastReadTimestamp(new Date());
    setUnreadMessages(0);
  };

  // Navigate to admin chat
  const navigateToAdminChat = () => {
    navigate('/ticket');
    setNotificationsOpen(false);
    setLastReadTimestamp(new Date());
  };

  // Navigate to shopping cart
  const navigateToCart = () => {
    navigate('/customer/cart');
  };

  // Navigate to account settings
  const navigateToAccount = () => {
    navigate('/profile');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  // Toggle search bar on mobile
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Close all mobile menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen && !event.target.closest('.notification-container')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  return (
    <header className="w-full bg-white shadow-md text-slate-900 border-b">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center px-6 py-4">
        {/* Left Section - Logo and Brand */}
        <div className="flex items-center">
          <img src="/images/sunny.jpg" alt="Store" className="h-8 w-auto mr-3 rounded-full" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 mx-10 relative max-w-lg">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Products or Services"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Right Section (Icons & User Info) */}
        <div className="flex items-center gap-5">
          {/* Notification Bell with Badge */}
          <div className="relative notification-container">
            <FaBell 
              className={`text-2xl cursor-pointer ${unreadMessages > 0 ? 'text-red-500' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={handleNotificationClick}
            />
            
            {/* Badge for unread count */}
            {unreadMessages > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </div>
            )}
            
            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-medium">Notifications</span>
                  <button 
                    onClick={handleCloseNotifications}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Mark all as read
                  </button>
                </div>
                
                {unreadMessages > 0 ? (
                  <div 
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-start"
                    onClick={navigateToAdminChat}
                  >
                    <div className="text-red-500 mr-3 mt-1">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="font-medium">
                        New Message from Support
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        You have {unreadMessages} unread {unreadMessages === 1 ? 'message' : 'messages'} from our support team.
                      </div>
                      <div className="text-xs text-blue-500 mt-1">
                        Click to view conversation
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-gray-500 text-center">
                    No new notifications
                  </div>
                )}
                
                <div 
                  className="p-3 bg-gray-50 text-blue-500 text-center text-sm font-medium cursor-pointer hover:bg-gray-100"
                  onClick={navigateToAdminChat}
                >
                  Contact Support
                </div>
              </div>
            )}
          </div>
          
          {/* Customer Profile */}
          <div className="flex items-center cursor-pointer" onClick={navigateToAccount}>
            <FaUserCircle className="text-2xl text-gray-600 mr-2" />
            <div>
              <span className="font-semibold">
                {loading ? "Loading..." : error ? "Error" : userData.name}
              </span>
              <p className="text-xs text-gray-500">My Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <FaBars className="text-xl" />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <img src="/images/sunny.jpg" alt="Store" className="h-8 w-auto mr-2 rounded-full" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button 
            onClick={toggleSearch}
            className="p-2 text-gray-600 hover:text-blue-500"
          >
            <FaSearch className="text-xl" />
          </button>

          {/* Notification Bell */}
          <div className="relative notification-container">
            <FaBell 
              className={`text-xl cursor-pointer ${unreadMessages > 0 ? 'text-red-500' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={handleNotificationClick}
            />
            
            {/* Badge for unread count */}
            {unreadMessages > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </div>
            )}
            
            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-medium">Notifications</span>
                  <button 
                    onClick={handleCloseNotifications}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Mark all as read
                  </button>
                </div>
                
                {unreadMessages > 0 ? (
                  <div 
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-start"
                    onClick={navigateToAdminChat}
                  >
                    <div className="text-red-500 mr-2 mt-1">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        New Message from Support
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        You have {unreadMessages} unread {unreadMessages === 1 ? 'message' : 'messages'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-gray-500 text-center text-sm">
                    No new notifications
                  </div>
                )}
                
                <div 
                  className="p-2 bg-gray-50 text-blue-500 text-center text-sm font-medium cursor-pointer hover:bg-gray-100"
                  onClick={navigateToAdminChat}
                >
                  Contact Support
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Products or Services"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 flex items-center border-b border-gray-100" onClick={navigateToAccount}>
            <FaUserCircle className="text-2xl text-gray-600 mr-3" />
            <div>
              <div className="font-semibold">
                {loading ? "Loading..." : error ? "Error" : userData.name}
              </div>
              <div className="text-xs text-gray-500">My Account</div>
            </div>
          </div>
          
          <div className="p-2">
            <button 
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center"
              onClick={() => {
                navigate('/profile');
                setMobileMenuOpen(false);
              }}
            >
              <FaEnvelope className="text-gray-600 mr-3" />
              Support Messages
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center"
              onClick={() => {
                navigate('/customer/account');
                setMobileMenuOpen(false);
              }}
            >
              <FaUserCircle className="text-gray-600 mr-3" />
              Account Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;