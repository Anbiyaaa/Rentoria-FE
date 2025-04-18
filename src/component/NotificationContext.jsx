import React, { createContext, useState, useEffect } from "react";
import axios from "../axiosInstance/axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageId, setLastMessageId] = useState(null);
  
  // Admin ID and current user info
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const adminId = 1;

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/customer/profile');
        
        if (response.data && response.data.profile) {
          const currentUserId = response.data.profile.user_id;
          setUserId(currentUserId);
          
          // Get user role
          const userResponse = await axios.get(`/api/admin/users/${currentUserId}`);
          if (userResponse.data && userResponse.data.user) {
            const role = userResponse.data.user.role_id === 2 ? "customer" : "admin";
            setUserRole(role);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  // Poll for new messages based on role
  useEffect(() => {
    if (!userRole || !userId) return;
    
    const checkNewMessages = async () => {
      try {
        // Different endpoints for admin vs customer
        const endpoint = userRole === "admin" 
          ? "/api/admin/chats/new" // You'll need to create this endpoint on the backend
          : "/api/customer/chats/1";  // assuming customer checks messages with admin (ID 1)
        
        const response = await axios.get(endpoint);
        
        // If there are messages
        if (response.data && response.data.length > 0) {
          const latestMessage = response.data[response.data.length - 1];
          
          // If this is a new message (we haven't seen before) and it's not from current user
          if (latestMessage.id !== lastMessageId && 
              parseInt(latestMessage.sender_id) !== userId) {
            
            // Create notification for the new message
            addNotification({
              id: latestMessage.id,
              title: "New Message",
              message: latestMessage.message.length > 30 
                ? latestMessage.message.substring(0, 30) + "..."
                : latestMessage.message,
              time: latestMessage.formatted_time || new Date().toLocaleTimeString(),
              read: false,
              type: "message"
            });
            
            // Play notification sound
            const notificationSound = new Audio("/sounds/notification.mp3");
            notificationSound.play();
            
            // Update last message ID
            setLastMessageId(latestMessage.id);
          }
        }
      } catch (err) {
        console.error("Error checking for new messages:", err);
      }
    };
    
    // Initial check
    checkNewMessages();
    
    // Setup polling
    const interval = setInterval(checkNewMessages, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [userRole, userId, lastMessageId]);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notif => !notif.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => {
      // Check if notification with this ID already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      // Add new notification at the beginning of the array
      return [notification, ...prev];
    });
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearNotifications,
        userRole,
        userId
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};