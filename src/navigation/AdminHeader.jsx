import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import AxiosInstance from "../axiosInstance/axios";

const AdminHeader = () => {
  const [userData, setUserData] = useState({
    name: "Admin",
    id: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(new Date());
  const [unreadCustomers, setUnreadCustomers] = useState([]); // Track customers with unread messages
  const [notifications, setNotifications] = useState([]); // Store actual notification details

  // Create audio instance for notification sound
  const notificationAudio = new Audio("/sounds/notification.mp3");

  useEffect(() => {
    // Function to fetch admin profile data
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        
        const adminResponse = await AxiosInstance.get('/api/admin/profile', {
          timeout: 5000
        });
        
        if (adminResponse.data && adminResponse.data.profile) {
          const userId = adminResponse.data.profile.user_id;
          const userResponse = await AxiosInstance.get(`/api/admin/users/${userId}`, {
            timeout: 5000
          });
          
          if (userResponse.data && userResponse.data.user) {
            setUserData({
              name: userResponse.data.user.name,
              id: userId
            });
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        
        if (err.code === "ERR_NETWORK") {
          setError("Connection to server failed. Make sure backend server is running.");
        } else {
          setError(err.message || "Failed to load admin data");
        }
        
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  // Function to check for new messages from all customers
  useEffect(() => {
    const checkNewMessages = async () => {
      try {
        // Get all customers
        const response = await AxiosInstance.get('/api/admin/users');
        const customersArray = Array.isArray(response.data) ? response.data :
          (response.data.customers || response.data.users || []);
        
        // Filter out admin users
        const customers = customersArray.filter(user => user.role_id !== 1);
        
        let totalUnread = 0;
        const newUnreadCustomers = [];
        const newNotifications = [];
        
        // Check messages from each customer
        for (const customer of customers) {
          try {
            const chatResponse = await AxiosInstance.get(`/api/admin/chats/${customer.id}`);
            const messages = chatResponse.data;
            
            // Filter for unread messages (not from admin and after last read timestamp)
            const adminId = 1; // Admin ID
            const unreadFromCustomer = messages.filter(msg => {
              const msgDate = new Date(msg.created_at);
              return parseInt(msg.sender_id) !== adminId && msgDate > lastReadTimestamp;
            });
            
            if (unreadFromCustomer.length > 0) {
              totalUnread += unreadFromCustomer.length;
              newUnreadCustomers.push(customer.id);
              
              // Add notification for this customer
              newNotifications.push({
                id: customer.id,
                name: customer.name || `Customer ${customer.id}`,
                count: unreadFromCustomer.length,
                lastMessage: unreadFromCustomer[unreadFromCustomer.length - 1].message,
                timestamp: unreadFromCustomer[unreadFromCustomer.length - 1].created_at
              });
              
              // Play sound for new messages
              if (newNotifications.length === 1) {
                notificationAudio.play();
              }
            }
          } catch (chatErr) {
            console.error(`Error checking messages for customer ${customer.id}:`, chatErr);
          }
        }
        
        setUnreadMessages(totalUnread);
        setUnreadCustomers(newUnreadCustomers);
        
        // Merge with existing notifications, avoiding duplicates
        setNotifications(prev => {
          const existingIds = prev.map(n => n.id);
          const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
          return [...prev, ...uniqueNew];
        });
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
    setNotifications([]);
  };

  // Navigate to customer chat
  const navigateToCustomerChat = (customerId) => {
    window.location.href = '/admin/ticket';
    setNotificationsOpen(false);
    setLastReadTimestamp(new Date());
  };

  // Navigate to all chats dashboard
  const navigateToAllChats = () => {
    window.location.href = '/admin/chats';
    setNotificationsOpen(false);
    setLastReadTimestamp(new Date());
  };

  // Format timestamp for notification display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Send a test message (for demo/testing)
  const sendTestMessage = async (customerId = 2) => {
    try {
      await AxiosInstance.post('/api/admin/chats/send', {
        receiver_id: customerId,
        message: "This is a test message from admin"
      });
      alert("Test message sent successfully");
    } catch (err) {
      console.error("Error sending test message:", err);
      alert("Failed to send test message");
    }
  };

  return (
    <header className="w-full bg-white shadow-md text-slate-900 border-b flex justify-between items-center px-10 py-4 mb-5">
      {/* Left Section - Logo and Brand */}
      <div className="flex items-center">
        <img src="/images/sunny.jpg" alt="Admin Dashboard" className="h-8 w-auto mr-3" />
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 mx-10 relative max-w-lg">
        <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Users or Tickets"
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right Section (Icons & User Info) */}
      <div className="flex items-center gap-6">
        {/* Notification Bell with Badge */}
        <div className="relative">
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
                <span className="font-medium">Customer Messages</span>
                <button 
                  onClick={handleCloseNotifications}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Mark all as read
                </button>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-start"
                      onClick={() => navigateToCustomerChat(notification.id)}
                    >
                      <div className="text-red-500 mr-3 mt-1">
                        <FaEnvelope />
                      </div>
                      <div>
                        <div className="font-medium">
                          {notification.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 truncate">
                          {notification.lastMessage}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.timestamp)} • {notification.count} unread
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 text-center">
                    No new messages from customers
                  </div>
                )}
              </div>
              
              <div 
                className="p-3 bg-gray-50 text-blue-500 text-center text-sm font-medium cursor-pointer hover:bg-gray-100"
                onClick={navigateToAllChats}
              >
                View All Conversations
              </div>
            </div>
          )}
        </div>
        
        {/* Admin Profile */}
        <div className="flex items-center">
          <FaUserCircle className="text-2xl text-gray-600 mr-2" />
          <div>
            <span className="font-semibold">
              {loading ? "Loading..." : error ? "Admin" : userData.name}
            </span>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;