import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "../../axiosInstance/axios";
import SidebarUser from "../../navigation/SidebarUser";
import Header from "../../navigation/Header";

const CustomerChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Fixed chat ID as per requirement
  const chatId = 1;

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/customer/chats/${chatId}`);
      
      if (response.data) {
        setMessages(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
      setLoading(false);
    }
  };

  // Send a message - adjusted for correct API format
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      
      // Try different payload format to match your API requirements
      // First attempt: Using "content" instead of "message" field
      await axios.post('/api/customer/chats/send', {
        receiver_id: chatId,
        message: message // Changed from "message" to "content"
      });
      
      // Clear the input and refresh messages
      setMessage("");
      fetchMessages();
      setLoading(false);
    } catch (err1) {
      console.error("Error sending message:", err1);
      
      try {
        // Second attempt: If first format fails, try with "text" field
        await axios.post('/api/customer/chats/send', {
          chat_id: chatId,
          text: message
        });
        
        // If successful, clear and refresh
        setMessage("");
        fetchMessages();
        setLoading(false);
      } catch (err2) {
        console.error("Error sending message with alternate format:", err2);
        setError("Failed to send message. Please try again.");
        setLoading(false);
      }
    }
  };

  // Initialize - fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 6000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determine if a message is from the customer (sender_id is not 1)
  const isFromCustomer = (message) => {
    return message.sender_id !== 1; // Assuming admin has ID 1
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarUser />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Main chat container */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Chat header with improved design */}
          <div className="bg-white shadow-sm px-6 py-4 border-b flex-shrink-0">
            <div className="flex items-center ">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg mr-3">
                A
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Support Team</h2>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
          </div>
          
          {/* Chat Messages area with updated styling */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-100">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-16">
                <div className="bg-white shadow-md rounded-lg px-5 py-3 text-gray-500">
                  Loading conversation...
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-500 rounded-lg shadow-sm">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 text-center">
                  <p className="text-gray-600 mb-2">No messages yet</p>
                  <p className="text-sm text-gray-500">Start the conversation with our support team!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg, index) => {
                  // Check if we need to show date separator
                  const currentDate = new Date(msg.created_at).toLocaleDateString();
                  const previousDate = index > 0 
                    ? new Date(messages[index-1].created_at).toLocaleDateString() 
                    : null;
                  const showDate = index === 0 || currentDate !== previousDate;
                  
                  const isCustomer = isFromCustomer(msg);
                  
                  return (
                    <div key={msg.id || index}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <div className="bg-white shadow-sm rounded-full px-4 py-1 text-xs text-gray-600">
                            {new Date(msg.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                        {!isCustomer && (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm mr-2 flex-shrink-0 self-end mb-1">
                            A
                          </div>
                        )}
                        
                        <div 
                          className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-sm ${
                            isCustomer 
                              ? 'bg-indigo-600 text-white rounded-br-none' 
                              : 'bg-white text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <div className={`text-sm ${isCustomer ? 'text-white' : 'text-gray-700'}`}>
                            {msg.message || msg.content || msg.text}
                          </div>
                          <div className={`text-xs mt-1 text-right ${
                            isCustomer ? 'text-indigo-200' : 'text-gray-400'
                          }`}>
                            {msg.formatted_time || new Date(msg.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        {isCustomer && (
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm ml-2 flex-shrink-0 self-end mb-1">
                            U
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
          
          {/* Message Input with improved design */}
          <div className="border-t bg-white p-4 flex-shrink-0 z-40">
            <form onSubmit={sendMessage} className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border-0 bg-gray-100 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className={`ml-3 bg-indigo-600 text-white rounded-full p-3 shadow-md ${
                  loading || !message.trim() ? 'opacity-50' : 'hover:bg-indigo-700'
                }`}
              >
                <FaPaperPlane className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;