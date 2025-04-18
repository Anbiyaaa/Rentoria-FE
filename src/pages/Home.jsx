import React, { useEffect, useState } from 'react';
import { AxiosInstance } from '../axiosInstance/axios';
import Footer from '../component/Footer';
import Navbar from '../navigation/Navbar';
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import {
  Gamepad,
  LogIn,
  Facebook,
  Twitter,
  Instagram,
  ChevronDown,
  Heart,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';
import Faq from '../component/Faq';

const GamefyLandingPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await AxiosInstance.get('/api/categories');
        setCategories(categoryResponse.data);

        const productResponse = await AxiosInstance.get('/api/barang');
        setProducts(productResponse.data);

        const faqResponse = await AxiosInstance.get('/api/faq');
        setFaqs(faqResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Enhanced handleProductClick function
  const handleProductClick = (productId) => {
    // Navigate to the product detail page
    navigate(`/product/${productId}`);
  };

  // Function to handle "View all products" button
  const handleViewAllProducts = () => {
    navigate('/products');
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black text-white min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="absolute inset-0 bg-[url('/your-image.png')] bg-cover bg-center opacity-20"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4 md:px-8 lg:px-12">
          {/* Text Content */}
          <div className="max-w-lg text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">
              Sewa, <br /> Mainkan, <br />Dan Nikmati <br /> Bersama Kami
            </h1>
            <p className="text-gray-300 mt-4 text-base md:text-lg">
              Kami menyediakan berbagai konsol game seperti PlayStation, Nintendo, dan Xbox yang dapat Anda sewa dengan mudah untuk pengalaman bermain terbaik.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105" 
                onClick={() => navigate('/belanja')}
              >
                Mulai Sewa
                <Gamepad className="inline-block ml-2" />
              </button>
            </div>
          </div>

          {/* Portal Image */}
          <div className="relative mt-10 md:mt-0">
            <img
              src="src/assets/rrr.png"
              alt="Portal"
              className="w-[280px] sm:w-[350px] md:w-[300px] lg:w-[400px] glow-effect mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0D0D0D] to-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 mb-2">Produk Unggulan</h2>
              <p className="text-gray-400 max-w-lg">Nikmati pengalaman gaming terbaik dengan konsol premium pilihan kami</p>
            </div>
            <button 
              onClick={handleViewAllProducts}
              className="mt-4 md:mt-0 flex items-center text-lime-500 hover:text-lime-400 font-semibold transition-colors hover:underline"
            >
              Lihat Semua <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          {/* Container for Slider */}
          <Swiper
            spaceBetween={30}
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
            modules={[Pagination, Autoplay]}
            className="produk-unggulan-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index}>
                <div 
                  className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer group h-full"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative">
                    <div className="overflow-hidden">
                      <img
                        src={product.gambar}
                        alt={product.nama}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Floating status badge */}
                    <div className="absolute top-4 left-4 bg-lime-500 text-black font-bold py-1 px-3 rounded-lg text-sm flex items-center">
                      <Heart size={14} className="mr-1" fill="black" />
                      Favorit
                    </div>
                    
                    {/* Availability indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm flex items-center">
                      <Clock size={14} className="mr-1" />
                      {product.jumlah_barang > 0 ? 'Tersedia' : 'Habis'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Product category */}
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      {categories.find(cat => cat.id === product.kategori_id)?.name || 'Gaming Console'}
                    </div>
                    
                    {/* Product name */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-lime-500 transition-colors">{product.nama}</h3>
                    
                    {/* Price */}
                    <div className="flex items-baseline mb-4">
                      <span className="text-2xl font-bold text-lime-500">Rp {product.price_1_hari.toLocaleString('id-ID')}</span>
                      <span className="text-gray-400 text-sm ml-1">/hari</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.deskripsi}</p>
                    
                    {/* Action link */}
                    <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-lime-500 mr-2"></div>
                        <span className="text-sm text-gray-400">Stok: {product.jumlah_barang}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent onClick
                          handleProductClick(product.id);
                        }}
                        className="text-lime-500 font-medium flex items-center group-hover:translate-x-1 transition-transform"
                      >
                        Detail 
                        <ArrowRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <hr className="border-gray-800" />

      {/* About Us Section */}
      <section className="bg-[#0D0D0D] py-12 md:py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-12">
            <img
              src="public/images/sunny.jpg"
              alt="About Gamefy"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Tentang Kami</h2>
            <p className="text-gray-300 mb-4 text-center md:text-left">
              Kami adalah penyedia layanan penyewaan konsol game terbaik, menghadirkan berbagai perangkat dari PlayStation, Nintendo, hingga Xbox dengan harga terjangkau.
            </p>
            <p className="text-gray-300 text-center md:text-left">
              Dengan berbagai pilihan game dan layanan berkualitas, kami siap memberikan pengalaman bermain yang seru untuk Anda dan teman-teman.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              {/* <button 
                className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/about')}
              >
                Pelajari Lebih Lanjut
              </button> */}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-800" />

      {/* FAQ Section */}
      <Faq/>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GamefyLandingPage;