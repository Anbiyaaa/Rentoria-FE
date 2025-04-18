import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Calendar } from 'lucide-react';
import Navbar from '../../navigation/SidebarUser';

import AxiosInstance from '../../axiosInstance/axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rentDurations, setRentDurations] = useState({});
  const [startDates, setStartDates] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  // Cek status autentikasi user saat komponen dimuat
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          navigate('/login'); // Redirect ke login jika tidak ada token
          return;
        }

        // Validasi token dengan backend
        const response = await AxiosInstance.get('/api/user/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          fetchCartItems();
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          navigate('/login'); // Redirect ke login jika token tidak valid
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        navigate('/login'); // Redirect ke login jika terjadi error autentikasi
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Ambil data keranjang dari API/localStorage
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      
      // Gunakan API jika sudah terintegrasi dengan backend
      const response = await AxiosInstance.get('/api/cart');
      const items = response.data;
      
      // Inisialisasi durasi sewa untuk setiap item (default: 12 jam)
      const initialDurations = {};
      const initialDates = {};
      
      items.forEach(item => {
        initialDurations[item.id] = '12_jam';
        initialDates[item.id] = formatDate(new Date());
      });
      
      setCartItems(items);
      setRentDurations(initialDurations);
      setStartDates(initialDates);
      calculateSubtotal(items, initialDurations);
      
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Gagal memuat keranjang. Silakan coba lagi nanti.');
      
      // Fallback ke data lokal jika API gagal
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
      
      // Inisialisasi durasi sewa
      const initialDurations = {};
      const initialDates = {};
      
      localCart.forEach(item => {
        initialDurations[item.id] = '12_jam';
        initialDates[item.id] = formatDate(new Date());
      });
      
      setRentDurations(initialDurations);
      setStartDates(initialDates);
      calculateSubtotal(localCart, initialDurations);
    } finally {
      setLoading(false);
    }
  };

  // Format tanggal ke format YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Hitung subtotal berdasarkan item dan durasi
  const calculateSubtotal = (items, durations) => {
    let total = 0;
    
    items.forEach(item => {
      const duration = durations[item.id];
      switch (duration) {
        case '12_jam':
          total += (item.price_12_jam || 0);
          break;
        case '1_hari':
          total += (item.price_1_hari || 0);
          break;
        case '2_hari':
          total += (item.price_2_hari || 0);
          break;
        default:
          total += (item.price_12_jam || 0);
      }
    });
    
    setSubtotal(total);
  };

  // Handle perubahan durasi sewa
  const handleDurationChange = (itemId, duration) => {
    const newDurations = { ...rentDurations, [itemId]: duration };
    setRentDurations(newDurations);
    calculateSubtotal(cartItems, newDurations);
  };

  // Handle perubahan tanggal mulai sewa
  const handleDateChange = (itemId, date) => {
    setStartDates({ ...startDates, [itemId]: date });
  };

  // Handle menghapus item dari keranjang
  const handleRemoveItem = async (itemId) => {
    try {
      await AxiosInstance.delete(`/api/cart/${itemId}`);
      
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      
      // Update local storage juga
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      // Recalculate subtotal
      calculateSubtotal(updatedItems, rentDurations);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Gagal menghapus item. Silakan coba lagi.');
      
      // Fallback to local removal if API fails
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      calculateSubtotal(updatedItems, rentDurations);
    }
  };

  // Handle checkout proses
  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          barangId: item.id,
          duration: rentDurations[item.id],
          startDate: startDates[item.id]
        })),
        totalAmount: subtotal
      };
      
      const response = await AxiosInstance.post('/api/orders', orderData);
      
      if (response.status === 201) {
        // Redirect ke halaman pembayaran/konfirmasi
        navigate('/checkout/confirmation', { state: { orderId: response.data.id } });
        
        // Kosongkan keranjang
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Gagal melakukan checkout. Silakan coba lagi nanti.');
    }
  };

  // Tampilkan loading screen
  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-lime-500 text-2xl">Loading...</div>
      </div>
    );
  }

  // Tampilkan halaman keranjang dengan item
  if (isAuthenticated) {
    // Tampilkan pesan keranjang kosong jika tidak ada item
    if (cartItems.length === 0) {
      return (
        <div className="bg-black text-white min-h-screen">
          <Navbar />
          <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <ShoppingBag className="mx-auto text-lime-500 mb-4" size={64} />
              <h2 className="text-3xl font-bold text-lime-500 mb-4">Keranjang Kosong</h2>
              <p className="text-gray-300 mb-6">
                Anda belum menambahkan barang apapun ke keranjang penyewaan.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 rounded font-bold"
              >
                Lihat Katalog Produk
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Tampilkan halaman keranjang dengan item
    return (
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        <div className="container mx-auto p-8">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-lime-500 mb-4">Keranjang Penyewaan</h1>
            <p className="text-gray-300">Review dan atur barang-barang yang ingin Anda sewa</p>
          </header>

          {error && (
            <div className="mb-6 bg-red-900 text-white p-4 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              {cartItems.map(item => (
                <div key={item.id} className="bg-[#0D0D0D] rounded-lg mb-6 overflow-hidden shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    <img 
                      src={item.gambar} 
                      alt={item.name}
                      className="w-full md:w-48 h-48 object-cover"
                    />
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-lime-500 mb-2">{item.name}</h2>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-gray-300 mb-4 line-clamp-2">{item.deskripsi}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Durasi Sewa</label>
                          <select 
                            value={rentDurations[item.id]} 
                            onChange={(e) => handleDurationChange(item.id, e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-gray-700 rounded p-2 text-white"
                          >
                            <option value="12_jam">12 Jam (Rp {(item.price_12_jam || 0).toLocaleString()})</option>
                            <option value="1_hari">1 Hari (Rp {(item.price_1_hari || 0).toLocaleString()})</option>
                            <option value="2_hari">2 Hari (Rp {(item.price_2_hari || 0).toLocaleString()})</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Tanggal Mulai</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                              type="date"
                              value={startDates[item.id]}
                              onChange={(e) => handleDateChange(item.id, e.target.value)}
                              min={formatDate(new Date())}
                              className="w-full bg-[#1A1A1A] border border-gray-700 rounded p-2 pl-10 text-white"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-right">
                        <span className="text-lg font-semibold text-lime-500">
                          {rentDurations[item.id] === '12_jam' && `Rp ${(item.price_12_jam || 0).toLocaleString()}`}
                          {rentDurations[item.id] === '1_hari' && `Rp ${(item.price_1_hari || 0).toLocaleString()}`}
                          {rentDurations[item.id] === '2_hari' && `Rp ${(item.price_2_hari || 0).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => navigate('/products')}
                className="text-lime-500 hover:underline flex items-center mb-8"
              >
                <ArrowLeft size={16} className="mr-1" /> Lanjutkan Melihat Produk
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-[#0D0D0D] rounded-lg p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-lime-500 mb-6">Ringkasan Pesanan</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-300">Jumlah Item</span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-semibold">Rp {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-300">Biaya Admin</span>
                    <span className="font-semibold">Rp 5.000</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg text-lime-500 font-bold">Rp {(subtotal + 5000).toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="bg-lime-500 hover:bg-lime-600 text-black px-4 py-3 rounded flex items-center justify-center w-full font-bold"
                >
                  <ShoppingBag className="mr-2" size={20} /> Lanjutkan ke Pembayaran
                </button>
                
                <div className="mt-6 text-sm text-gray-400">
                  <p>Dengan melanjutkan, Anda menyetujui syarat dan ketentuan sewa kami.</p>
                  <p className="mt-2">Pembayaran dapat dilakukan melalui transfer bank atau e-wallet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jika sampai disini, berarti terjadi kesalahan saat autentikasi
  // useEffect akan menangani redirect ke halaman login
  return null;
};

export default Cart;