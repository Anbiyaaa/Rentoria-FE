import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  CalendarRange, 
  Info, 
  Check, 
  X, 
  Heart,
  Share,
  Star,
  Box
} from 'lucide-react';
import Navbar from '../../navigation/Navbar';
import Footer from '../../component/Footer';
import AxiosInstance from '../../axiosInstance/axios';
import toast, { Toaster } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('1_hari');
  const [quantity, setQuantity] = useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Calculate total price based on selected options
  const getTotalPrice = () => {
    if (!product) return 0;
    
    let price;
    switch (selectedDuration) {
      case "12_jam":
        price = product.price_12_jam;
        break;
      case "1_hari":
        price = product.price_1_hari;
        break;
      case "2_hari":
        price = product.price_2_hari;
        break;
      default:
        price = product.price_1_hari;
    }
    
    return price * quantity;
  };

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get(`/api/barang/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Failed to load product details');
        setLoading(false);
        toast.error('Failed to load product details. Please try again.');
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Fetch random similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoadingSimilar(true);
        // Adding a timestamp to make sure we get different products on each reload
        const timestamp = new Date().getTime();
        // Limit to 2 products for mobile, 4 for desktop
        const limit = isMobile ? 2 : 4;
        const response = await AxiosInstance.get(`/api/barang?limit=${limit}&random=true&_t=${timestamp}`);
        
        // Filter out the current product if it's in the results
        const filteredProducts = response.data.filter(item => item.id !== id);
        
        // Take only the first 2 or 4 products depending on device
        setSimilarProducts(filteredProducts.slice(0, limit));
        setLoadingSimilar(false);
      } catch (err) {
        console.error('Error fetching similar products:', err);
        setLoadingSimilar(false);
      }
    };

    if (!loading && product) {
      fetchSimilarProducts();
    }
  }, [loading, product, id, isMobile]);

  const handleRentNow = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      // If user is logged in, redirect to /catalog/product/:id
      navigate(`/catalog/product/${id}`);
      toast.success('Proceeding to item details', {
        icon: '📝',
      });
    } else {
      // If user is not logged in, show login prompt
      setShowLoginPrompt(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        redirectTo: `/barang/${id}`,
        message: 'Please log in to rent this item'
      } 
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites", {
      icon: !isFavorite ? '❤️' : '💔'
    });
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    
    toast(`Rental duration set to: ${duration === "12_jam" ? "12 Hours" : duration === "1_hari" ? "1 Day" : "2 Days"}`, {
      icon: '⏱️',
      duration: 1500
    });
  };
  
  const durationOptions = [
    { value: '12_jam', label: '12 Hours', icon: <Clock size={20} />, priceKey: 'price_12_jam' },
    { value: '1_hari', label: '1 Day', icon: <Calendar size={20} />, priceKey: 'price_1_hari' },
    { value: '2_hari', label: '2 Days', icon: <CalendarRange size={20} />, priceKey: 'price_2_hari' },
  ];
  
  const isAvailable = () => {
    return product && product.jumlah_barang > 0;
  };

  // Navigate to a similar product
  const navigateToProduct = (productId) => {
    navigate(`/barang/${productId}`);
    // Force a refresh to make sure everything loads properly
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-lime-500 rounded-full mb-4"></div>
          <div className="text-lime-500 text-xl">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-900/30 p-6 rounded-full mb-4">
          <X size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          {error ? 'Error Loading Product' : 'Product Not Found'}
        </h2>
        <p className="text-gray-300 mb-6 max-w-md">
          {error || 'The product you are looking for does not exist or may have been removed.'}
        </p>
        <button
          onClick={goBack}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F1F1F',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          }
        }}
      />
      
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D0D0D] rounded-xl max-w-md w-full p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-lime-500">Login Required</h3>
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <Info className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-300">
                  You need to login before renting this item. Please login or create an account to continue.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoginRedirect}
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Login Now
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        <button 
          onClick={goBack}
          className="flex items-center text-gray-300 hover:text-lime-500 mb-6 transition-colors group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
          <span>Back to Products</span>
        </button>

        <div className="bg-[#0D0D0D] rounded-xl shadow-lg overflow-hidden border border-gray-800">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 lg:w-2/5 relative">
              <img 
                src={product.gambar} 
                alt={product.name} 
                className="w-full h-64 md:h-[32rem] object-cover object-center"
              />
              <button
                onClick={toggleFavorite}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors ${
                  isFavorite 
                    ? "bg-red-500 text-white" 
                    : "bg-gray-900/80 text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart size={20} />
              </button>
              {isAvailable() ? (
                <div className="absolute top-4 left-4 bg-green-900/80 text-green-400 px-3 py-1 rounded-full flex items-center text-sm">
                  <Check size={16} className="mr-1" /> Available ({product.jumlah_barang})
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-red-900/80 text-red-400 px-3 py-1 rounded-full flex items-center text-sm">
                  <X size={16} className="mr-1" /> Not Available
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 md:w-1/2 lg:w-3/5">
              <div className="mb-6">
                <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-300 mr-2 mb-2">
                  {product.category?.name || 'Uncategorized'}
                </span>
                {product.tipe && (
                  <span className="inline-block bg-lime-900/30 text-lime-500 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                    {product.tipe}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-300">Deskripsi</h3>
                <p className="text-gray-400 leading-relaxed">{product.deskripsi || "No description available."}</p>
              </div>

              {/* Rental Duration Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-300">Durasi Rental</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {durationOptions.map((option) => (
                    product[option.priceKey] && (
                      <button
                        key={option.value}
                        onClick={() => handleDurationSelect(option.value)}
                        className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all
                          ${selectedDuration === option.value 
                            ? 'border-lime-500 bg-lime-500/10 text-white shadow-lg shadow-lime-500/10' 
                            : 'border-gray-800 hover:border-gray-600 text-gray-300 hover:bg-gray-800/50'
                          }`}
                      >
                        <div className="flex items-center mb-2">
                          {option.icon}
                          <span className="ml-2 font-medium">{option.label}</span>
                        </div>
                        <span className="text-xl font-bold">
                          {formatCurrency(product[option.priceKey])}
                        </span>
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Low stock warning */}
              {product.jumlah_barang <= 5 && product.jumlah_barang > 0 && (
                <div className="mb-6 bg-yellow-900/20 border-l-4 border-yellow-600 p-4 rounded-lg">
                  <div className="flex">
                    <Info className="text-yellow-500 mr-3 flex-shrink-0" />
                    <p className="text-yellow-200 text-sm">
                      Stok terbatas! Tersedia {product.jumlah_barang} unit lagi.
                    </p>
                  </div>
                </div>
              )}

              {/* Rating Display */}
              <div className="flex items-center mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18}
                      fill={i < 4 ? "currentColor" : "none"}
                      className={i < 4 ? "text-yellow-400" : "text-gray-600"} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">(24 reviews)</span>
              </div>

              {/* Price and Rent Button */}
              <div className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total Harga:</span>
                  <span className="text-2xl font-bold text-lime-500">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
                
                <button
                  onClick={handleRentNow}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center transition-all
                    ${isAvailable() 
                      ? 'bg-lime-500 hover:bg-lime-600 text-black font-bold shadow-lg hover:shadow-lime-500/30'
                      : 'bg-gray-700 cursor-not-allowed text-gray-400 opacity-70'
                    }`}
                  disabled={!isAvailable()}
                >
                  <ShoppingBag className="mr-2" size={20} />
                  {isAvailable() ? 'Sewa Sekarang' : 'Stok Kosong'}
                </button>
              </div>

              {/* Share Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link berhasil di salin!', {
                      icon: '🔗'
                    });
                  }}
                  className="inline-flex items-center text-gray-400 hover:text-lime-500 transition-colors"
                >
                  <Share size={16} className="mr-2" />
                  Bagikan Produk Ini
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section - Responsive */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Kamu Mungkin Juga Suka</h2>
          {/* Grid layout - Always 2 columns on mobile, and 4 on larger screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {loadingSimilar ? (
              // Loading placeholders - show 2 on mobile, 4 on desktop
              [...Array(isMobile ? 2 : 4)].map((_, index) => (
                <div key={index} className="bg-gray-900/50 h-48 md:h-64 rounded-lg animate-pulse"></div>
              ))
            ) : similarProducts.length > 0 ? (
              // Actual similar products - limited based on screen size
              similarProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#0D0D0D] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-lime-500/5 cursor-pointer"
                  onClick={() => navigateToProduct(item.id)}
                >
                  <div className="relative">
                    <img 
                      src={item.gambar} 
                      alt={item.name} 
                      className="w-full h-28 sm:h-32 md:h-40 object-cover object-center"
                    />
                    {item.jumlah_barang > 0 ? (
                      <div className="absolute top-2 right-2 bg-green-900/80 text-green-400 px-2 py-0.5 rounded-full text-xs">
                        Tersedia
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 bg-red-900/80 text-red-400 px-2 py-0.5 rounded-full text-xs">
                        Kosong
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="text-xs text-gray-400 mb-1 truncate">
                      {item.category?.name || 'Uncategorized'}
                    </div>
                    <h3 className="font-medium text-sm sm:text-base text-gray-200 mb-2 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lime-500 font-bold text-sm sm:text-base">
                        {formatCurrency(item.price_1_hari)}
                      </span>
                      <span className="text-xs text-gray-500">
                        /hari
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No similar products found
              <div className="col-span-2 lg:col-span-4 text-center text-gray-400 py-8">
                Tidak ada produk serupa yang tersedia saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;