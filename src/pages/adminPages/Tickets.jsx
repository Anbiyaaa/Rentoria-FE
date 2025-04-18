import React, { useState, useEffect, useRef } from "react";
import Header from "../../navigation/AdminHeader";
import SidebarAdmin from "../../navigation/SidebarAdmin";
import axios from "../../axiosInstance/axios";
import { FaPaperPlane, FaArrowLeft, FaUser, FaCircle } from "react-icons/fa";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [unreadCustomers, setUnreadCustomers] = useState([]);
  const [lastCheck, setLastCheck] = useState(new Date());

  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef({});
  const notificationAudio = new Audio("/sounds/notification.mp3");
  
  // Hidden admin ID
  const adminId = 1;

  useEffect(() => {
    fetchCustomers();
    
    // Set up polling for new messages from any customer
    const checkNewMessagesInterval = setInterval(checkNewMessages, 10000);
    return () => clearInterval(checkNewMessagesInterval);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchMessages(selectedCustomer.id);

      const intervalId = setInterval(() => {
        fetchMessages(selectedCustomer.id, true);
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [selectedCustomer]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to check for new messages from all customers
  const checkNewMessages = async () => {
    try {
      // Get all customers to check for new messages
      const customersToCheck = customers.filter(c => c.id !== adminId);
      
      // Loop through each customer
      for (const customer of customersToCheck) {
        // Skip the currently selected customer as we're already polling it
        if (selectedCustomer && customer.id === selectedCustomer.id) continue;
        
        const response = await axios.get(`/api/admin/chats/${customer.id}`);
        const newMessages = response.data;
        
        // Get previous message count or default to 0
        const prevCount = prevMessageCountRef.current[customer.id] || 0;
        
        // Update the count for this customer
        prevMessageCountRef.current[customer.id] = newMessages.length;
        
        // Check if there are new messages (and we're not on first load)
        if (prevCount > 0 && newMessages.length > prevCount) {
          // Only notify about messages from customers (not from admin)
          const latestMessages = newMessages.slice(prevCount);
          const newCustomerMessages = latestMessages.filter(msg => 
            parseInt(msg.sender_id) !== adminId
          );
          
          if (newCustomerMessages.length > 0) {
            // Play notification sound
            notificationAudio.play();
            
            // Add to unread customers list
            setUnreadCustomers(prev => 
              prev.includes(customer.id) ? prev : [...prev, customer.id]
            );
            
            // Update customer object with has_new_message flag
            setCustomers(prev => 
              prev.map(c => c.id === customer.id ? { ...c, has_new_message: true } : c)
            );
          }
        }
      }
      
      // Update last check timestamp
      setLastCheck(new Date());
      
    } catch (err) {
      console.error("Error checking for new messages:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      setCustomerLoading(true);
      const response = await axios.get("/api/admin/users");
      console.log("Customer response:", response.data);

      // Make sure we're setting an array
      const customersArray = Array.isArray(response.data) ? response.data :
        (response.data.customers || response.data.users || []);

      // Filter out any admin users if needed
      const filteredCustomers = customersArray.filter(user =>
        user.role !== 'admin' && user.id !== adminId
      );

      setCustomers(filteredCustomers);
      setCustomerLoading(false);
      
      // Initialize the prevMessageCountRef with zeros
      const counts = {};
      filteredCustomers.forEach(c => {
        counts[c.id] = 0;
      });
      prevMessageCountRef.current = counts;
      
      // Check for new messages immediately after fetching customers
      checkNewMessages();
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomerLoading(false);
    }
  };

  const fetchMessages = async (customerId, isPolling = false) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/chats/${customerId}`);
      const data = response.data;
  
      // Check if this is polling and if there are new messages
      if (
        isPolling &&
        prevMessageCountRef.current[customerId] !== undefined &&
        data.length > prevMessageCountRef.current[customerId]
      ) {
        // Only notify about messages from customers (not from admin)
        const newMessages = data.slice(prevMessageCountRef.current[customerId]);
        const newCustomerMessages = newMessages.filter(msg => 
          parseInt(msg.sender_id) !== adminId
        );
        
        if (newCustomerMessages.length > 0) {
          notificationAudio.play();
        }
      }
  
      // Update the previous message count for this customer
      prevMessageCountRef.current[customerId] = data.length;
      
      setMessages(data);
      setError(null);
      
      // If we're viewing this customer, remove from unread list
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setUnreadCustomers(prev => prev.filter(id => id !== customerId));
        
        // Update customer object to remove has_new_message flag
        setCustomers(prev => 
          prev.map(c => c.id === customerId ? { ...c, has_new_message: false } : c)
        );
      }
    } catch (err) {
      setError("Failed to load messages.");
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer) return;

    try {
      const messageData = {
        sender_id: adminId,
        receiver_id: selectedCustomer.id.toString(),
        message: newMessage
      };

      await axios.post("/api/admin/chats/send", messageData);
      setNewMessage("");
      fetchMessages(selectedCustomer.id); // Refresh messages after sending
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", err);
    }
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setMessages([]);
    setError(null);

    // Remove from unread customers list
    setUnreadCustomers(prev => prev.filter(id => id !== customer.id));
    
    // Update customer object to remove has_new_message flag
    setCustomers(prev =>
      prev.map(c => c.id === customer.id ? { ...c, has_new_message: false } : c)
    );
    
    // Fetch messages for this customer
    fetchMessages(customer.id);
  };

  // Format timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <SidebarAdmin />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Support Dashboard
              </span>
            </h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              {!selectedCustomer ? (
                // Customer List View
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-semibold text-slate-700">Customer Conversations</h2>
                    <div className="text-sm text-slate-500 flex items-center">
                      <div className="mr-2 h-2 w-2 bg-green-400 rounded-full"></div>
                      Last checked: {lastCheck.toLocaleTimeString()}
                    </div>
                  </div>

                  {customerLoading ? (
                    <div className="flex justify-center items-center py-16">
                      <div className="flex space-x-2">
                        <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                      </div>
                      <p className="text-slate-600 text-lg font-medium">No active customer conversations</p>
                      <p className="text-slate-400 mt-2">Conversations will appear here when customers message you</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {customers.map((customer) => {
                        const hasUnread = unreadCustomers.includes(customer.id) || customer.has_new_message;
                        return (
                          <div
                            key={customer.id}
                            className={`relative ${hasUnread ? 'border-2 border-indigo-500' : 'border border-slate-200'} 
                              rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 bg-white 
                              transform hover:-translate-y-1`}
                          >
                            <div className={`${hasUnread ? 'bg-indigo-50' : 'bg-white'} px-5 py-4 flex justify-between items-center`}>
                              <div>
                                <div className="font-medium text-slate-800 flex items-center">
                                  {customer.name || `Customer ${customer.id}`}
                                  {hasUnread && (
                                    <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                                  )}
                                </div>
                                <div className="text-sm text-slate-500 truncate">
                                  {customer.email || "No email provided"}
                                </div>
                              </div>
                              
                              {hasUnread && (
                                <div className="h-3 w-3 bg-indigo-600 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            
                            <div className="p-5">
                              <button
                                onClick={() => selectCustomer(customer)}
                                className={`w-full ${hasUnread ? 
                                  'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600' : 
                                  'bg-slate-800 hover:bg-slate-900'} 
                                  text-white py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none 
                                  focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 font-medium`}
                              >
                                {hasUnread ? 'View New Messages' : 'View Conversation'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Chat View
                <div className="flex flex-col h-[calc(100vh-16rem)]">
                  <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
                        {(selectedCustomer.name || "C")[0].toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800">
                          {selectedCustomer.name || `Customer ${selectedCustomer.id}`}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {selectedCustomer.email || `ID: ${selectedCustomer.id}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <FaArrowLeft className="h-3 w-3 mr-2" />
                      Back to Customers
                    </button>
                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                    {loading && messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="flex space-x-2">
                          <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100 max-w-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-red-600 font-medium">{error}</p>
                          <button
                            onClick={() => fetchMessages(selectedCustomer.id)}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Try again
                          </button>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium text-lg">No messages in this conversation yet</p>
                          <p className="text-slate-400 mt-2">Send a message below to get started</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {messages.map((msg, index) => {
                          // Check if we need to show date separator
                          const currentDate = new Date(msg.created_at).toLocaleDateString();
                          const previousDate = index > 0 
                            ? new Date(messages[index-1].created_at).toLocaleDateString() 
                            : null;
                          const showDate = index === 0 || currentDate !== previousDate;
                          
                          const isFromAdmin = parseInt(msg.sender_id) === adminId;
                          
                          return (
                            <div key={msg.id || index}>
                              {showDate && (
                                <div className="flex justify-center my-6">
                                  <div className="bg-white shadow-sm rounded-full px-4 py-1.5 text-xs text-slate-500 border border-slate-200">
                                    {new Date(msg.created_at).toLocaleDateString('id-ID', {
                                      weekday: 'long',
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              <div className={`flex ${isFromAdmin ? "justify-end" : "justify-start"} group`}>
                                {!isFromAdmin && (
                                  <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-semibold text-sm mr-2 flex-shrink-0 self-end mb-1">
                                    {selectedCustomer.name ? selectedCustomer.name[0].toUpperCase() : "C"}
                                  </div>
                                )}
                                
                                <div
                                  className={`max-w-sm md:max-w-md rounded-2xl px-4 py-3 ${isFromAdmin
                                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-br-none shadow-md"
                                    : "bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                  <div className={`text-xs mt-1.5 opacity-70 ${isFromAdmin ? "text-blue-100" : "text-slate-400"}`}>
                                    {msg.formatted_time || formatTime(msg.created_at)}
                                  </div>
                                </div>
                                
                                {isFromAdmin && (
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-semibold text-sm ml-2 flex-shrink-0 self-end mb-1">
                                    A
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message input */}
                  <div className="border-t border-slate-200 p-4 bg-white">
                    <form onSubmit={sendMessage} className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-slate-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`${!newMessage.trim() ? 'bg-slate-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600'} text-white px-6 py-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center`}
                      >
                        <FaPaperPlane className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminChat;