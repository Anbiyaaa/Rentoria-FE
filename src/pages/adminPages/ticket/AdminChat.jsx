import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../../axiosInstance/axios";
import { FaEnvelope, FaEnvelopeOpen, FaSearch, FaUser } from "react-icons/fa";
import AdminHeader from "../../../navigation/AdminHeader";

const AdminChatList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const adminId = 1; // ID untuk admin, sesuaikan dengan sistem Anda

  // Fungsi untuk memuat daftar customer dan pesan terakhir mereka
  const loadCustomersWithChats = async () => {
    try {
      setLoading(true);
      
      // Ambil daftar semua customer
      const usersResponse = await AxiosInstance.get('/api/admin/users', {
        params: { role: 'customer' } // Filter hanya user dengan role customer
      });
      
      if (usersResponse.data && usersResponse.data.users) {
        const customerUsers = usersResponse.data.users;
        
        // Untuk setiap customer, ambil pesan terakhir mereka
        const customersWithLastMessage = await Promise.all(
          customerUsers.map(async (customer) => {
            try {
              // Ambil chat dengan customer ini
              const chatResponse = await AxiosInstance.get(`/api/admin/chats/${customer.id}`);
              
              if (chatResponse.data && chatResponse.data.length > 0) {
                // Urutkan pesan berdasarkan waktu (terbaru di akhir)
                const sortedMessages = chatResponse.data.sort((a, b) => {
                  return new Date(a.created_at) - new Date(b.created_at);
                });
                
                // Ambil pesan terakhir
                const lastMessage = sortedMessages[sortedMessages.length - 1];
                
                // Hitung jumlah pesan yang belum dibaca (dari customer ke admin)
                const unreadCount = sortedMessages.filter(msg => {
                  const msgDate = new Date(msg.created_at);
                  // Pesan dari customer ke admin yang belum dibaca
                  return msg.sender_id === customer.id && 
                         msg.receiver_id === adminId && 
                         msgDate > new Date(customer.last_read_time || 0);
                }).length;
                
                return {
                  ...customer,
                  has_chat: true,
                  last_message: lastMessage.message,
                  last_message_time: lastMessage.created_at,
                  formatted_time: lastMessage.formatted_time || formatDate(lastMessage.created_at),
                  unread_count: unreadCount
                };
              }
              
              // Customer belum memiliki pesan
              return {
                ...customer,
                has_chat: false,
                last_message: null,
                last_message_time: null,
                formatted_time: null,
                unread_count: 0
              };
            } catch (chatErr) {
              console.error(`Error fetching chat for customer ${customer.id}:`, chatErr);
              return {
                ...customer,
                has_chat: false,
                last_message: null,
                last_message_time: null,
                formatted_time: null,
                unread_count: 0
              };
            }
          })
        );
        
        // Urutkan customer: prioritaskan yang memiliki pesan belum dibaca, lalu berdasarkan waktu pesan terakhir
        const sortedCustomers = customersWithLastMessage.sort((a, b) => {
          // Prioritaskan yang memiliki pesan belum dibaca
          if (a.unread_count > 0 && b.unread_count === 0) return -1;
          if (a.unread_count === 0 && b.unread_count > 0) return 1;
          
          // Jika keduanya memiliki pesan belum dibaca atau keduanya tidak memiliki, urutkan berdasarkan waktu pesan terakhir
          if (!a.last_message_time && b.last_message_time) return 1;
          if (a.last_message_time && !b.last_message_time) return -1;
          if (!a.last_message_time && !b.last_message_time) return a.name.localeCompare(b.name);
          
          return new Date(b.last_message_time) - new Date(a.last_message_time);
        });
        
        setCustomers(sortedCustomers);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Gagal memuat daftar customer. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // Memuat daftar customer saat halaman dimuat
  useEffect(() => {
    loadCustomersWithChats();
    
    // Polling untuk memperbarui daftar customer setiap 15 detik
    const interval = setInterval(() => {
      loadCustomersWithChats();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Jika tanggal sama dengan hari ini, tampilkan waktu saja
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Jika tidak, tampilkan tanggal
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter customers berdasarkan pencarian
  const filteredCustomers = customers.filter(customer => {
    const customerName = customer.name || "";
    const lastMessage = customer.last_message || "";
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      customerName.toLowerCase().includes(searchLower) ||
      lastMessage.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <AdminHeader />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h1 className="text-xl font-semibold">Daftar Customer Chat</h1>
          </div>
          
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama customer atau isi pesan..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          
          {/* List Customer */}
          <div className="divide-y">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <Link 
                  key={customer.id}
                  to={`/admin/chats/${customer.id}`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      {customer.unread_count > 0 ? (
                        <div className="relative">
                          <FaEnvelope className="text-2xl text-red-500" />
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {customer.unread_count}
                          </div>
                        </div>
                      ) : customer.has_chat ? (
                        <FaEnvelopeOpen className="text-2xl text-gray-400" />
                      ) : (
                        <FaUser className="text-2xl text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">
                          {customer.name || `Customer #${customer.id}`}
                        </h3>
                        {customer.formatted_time && (
                          <span className="text-sm text-gray-500">
                            {customer.formatted_time}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-1 truncate">
                        {customer.has_chat ? (
                          customer.last_message
                        ) : (
                          "Belum ada percakapan"
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada customer"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatList;