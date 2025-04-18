import React, { useState, useEffect } from 'react';
import { Eye, Grid, List, ArrowRight, Heart, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Navbar from '../navigation/Navbar';
import Footer from '../component/Footer';
import AxiosInstance from '../axiosInstance/axios';
import Faq from '../component/Faq';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [isMobile, setIsMobile] = useState(false);
  
  const navigate = useNavigate();

  // Check if mobile view based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      // Set products per page based on screen size
      setProductsPerPage(window.innerWidth < 640 ? 4 : 12);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await AxiosInstance.get('/api/barang');

        // Extract unique categories from products
        const uniqueCategories = ['All', ...new Set(
          productsResponse.data.map(product => product.category.name)
        )];

        // Select some products as featured (for example, first 6 products)
        const featured = productsResponse.data.slice(0, 6);

        setProducts(productsResponse.data);
        setFeaturedProducts(featured);
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewProduct = (productId) => {
    // Navigate to product detail page
    navigate(`/product/${productId}`);
  };

  const handleViewAllProducts = () => {
    // Reset category filter to show all products
    setSelectedCategory('All');
    setCurrentPage(1);
    // Scroll to products section
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category.name === selectedCategory);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of products section when page changes
      document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-lime-500 text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-gray-900 to-black py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500">
                Gaming Catalog
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-6">
              Find the perfect console for your gaming experience
            </p>
            <button 
              onClick={handleViewAllProducts}
              className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 rounded-lg font-semibold flex items-center mx-auto"
            >
              Browse Products <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10">
        {/* Featured Products Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 mb-2">Produk Unggulan</h2>
              <p className="text-gray-400">Nikmati pengalaman gaming terbaik dengan konsol premium pilihan kami</p>
            </div>
            <button 
              onClick={handleViewAllProducts}
              className="mt-4 md:mt-0 flex items-center text-lime-500 hover:text-lime-400 font-semibold transition-colors group"
            >
              Lihat Semua <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Featured Products Slider */}
          <div className="bg-gradient-to-b from-gray-800/30 to-black/50 rounded-xl p-4 md:p-6">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              modules={[SwiperPagination, Autoplay]}
              className="produk-unggulan-swiper"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div 
                    className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer group h-full shadow-xl shadow-black/50"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <div className="relative">
                      <div className="overflow-hidden">
                        <img
                          src={product.gambar}
                          alt={product.name}
                          className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Floating status badge */}
                      <div className="absolute top-4 left-4 bg-lime-500 text-black font-bold py-1 px-3 rounded-lg text-sm flex items-center">
                        <Heart size={14} className="mr-1" />
                        Favorit
                      </div>
                      
                      {/* Availability indicator */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm flex items-center">
                        <Clock size={14} className="mr-1" />
                        {product.jumlah_barang > 0 ? 'Tersedia' : 'Habis'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {/* Product category */}
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        {product.category ? product.category.name : 'Gaming Console'}
                      </div>
                      
                      {/* Product name */}
                      <h3 className="text-xl font-bold mb-2 group-hover:text-lime-500 transition-colors line-clamp-1">{product.name}</h3>
                      
                      {/* Price */}
                      <div className="flex items-baseline mb-3">
                        <span className="text-2xl font-bold text-lime-500">Rp {(product.price_1_hari || 0).toLocaleString()}</span>
                        <span className="text-gray-400 text-sm ml-1">/hari</span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.deskripsi}</p>
                      
                      {/* Action link */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProduct(product.id);
                        }}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-lime-500 py-2 rounded flex items-center justify-center group-hover:bg-lime-500 group-hover:text-black transition-colors"
                      >
                        Detail <ArrowRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Products Section */}
        <section id="products-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">All Products</h2>
              <p className="text-gray-400">Discover our complete collection of gaming consoles</p>
            </div>
            
            {/* Mobile filter button */}
            <div className="md:hidden">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Filter size={18} className="mr-2" /> Filters
              </button>
            </div>

            {/* Desktop view controls */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-lime-500 text-black' : 'bg-gray-800 text-white'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-lime-500 text-black' : 'bg-gray-800 text-white'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter categories - Mobile */}
          <div className={`md:hidden mb-6 transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-lime-500 text-black' : 'bg-gray-700 text-white'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Two column layout for filters and products */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter sidebar - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-gray-800/50 rounded-xl p-4 sticky top-4">
                <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-left transition-colors ${selectedCategory === category 
                        ? 'bg-lime-500 text-black font-medium' 
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid/List */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-300 py-12 bg-gray-800/20 rounded-xl">
                  <p className="text-xl">No products found in this category.</p>
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="mt-4 text-lime-500 hover:underline"
                  >
                    Show all products
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid ${viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6' 
                    : 'grid-cols-1 gap-4'}`}
                  >
                    {currentProducts.map(product => (
                      <div
                        key={product.id}
                        className={`bg-gray-800/30 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] 
                          ${viewMode === 'list' ? 'flex items-center' : ''}`}
                      >
                        <div className={`${viewMode === 'list' ? 'w-1/3 flex-shrink-0' : 'w-full'}`}>
                          <img
                            src={product.gambar}
                            alt={product.name}
                            className={`w-full ${viewMode === 'grid' ? 'h-36 sm:h-48 md:h-56' : 'h-40'} object-cover cursor-pointer`}
                            onClick={() => handleViewProduct(product.id)}
                          />
                        </div>
                        <div className="p-3 sm:p-4 md:p-5 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-medium text-lime-500 bg-lime-500/10 px-2 py-1 rounded-full">
                                {product.category ? product.category.name : 'Gaming Console'}
                              </span>
                              <h2 
                                className="text-base sm:text-lg md:text-xl font-bold text-white mt-2 mb-1 line-clamp-1 cursor-pointer hover:text-lime-500 transition-colors"
                                onClick={() => handleViewProduct(product.id)}
                              >
                                {product.name}
                              </h2>
                            </div>
                            {viewMode === 'list' && (
                              <span className="text-xl font-bold text-lime-500">
                                Rp {(product.price_1_hari || 0).toLocaleString()}/hari
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.deskripsi}</p>
                          
                          {viewMode === 'grid' && (
                            <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                              <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-400">12 Jam</span>
                                <span className="font-medium">Rp {(product.price_12_jam ?? 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
                                <span className="text-gray-400">1 Hari</span>
                                <span className="text-lime-500 text-sm sm:text-lg">Rp {(product.price_1_hari ?? 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-400">2 Hari</span>
                                <span className="font-medium">Rp {(product.price_2_hari ?? 0).toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${product.jumlah_barang > 0 ? 'bg-lime-500' : 'bg-red-500'} mr-2`}></div>
                              <span className="text-xs sm:text-sm text-gray-400">Stok: {product.jumlah_barang || 'kosong'}</span>
                            </div>
                            
                            <button 
                              className="bg-lime-500 hover:bg-lime-600 text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center text-xs sm:text-sm font-medium"
                              onClick={() => handleViewProduct(product.id)} 
                            >
                              <Eye className="mr-1" size={16} /> Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <div className="bg-gray-800/50 rounded-xl p-2 flex items-center gap-2">
                        <button 
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        
                        <div className="hidden sm:flex gap-1">
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => paginate(i + 1)}
                              className={`min-w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                                ${currentPage === i + 1 
                                  ? 'bg-lime-500 text-black' 
                                  : 'text-white hover:bg-gray-700'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        
                        {/* Mobile pagination display */}
                        <div className="sm:hidden flex items-center justify-center min-w-16 px-3 rounded-lg bg-gray-700/50">
                          <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                        </div>
                        
                        <button 
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}
                          aria-label="Next page"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      
      <Faq />
      <Footer />
    </div>
  );
};

export default ProductCatalog;