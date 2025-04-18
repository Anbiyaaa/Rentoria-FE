import React, { useState, useEffect, useRef } from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../component/Footer";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram 
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setLoading(true);
      // Simulasi pengiriman form
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); // Reset setelah 3 detik
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1000);
    }
  };

  // Load Google Maps API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_nc468J6U20kwHLWTRHrn28cM_LII0-I&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    window.initMap = function () {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -6.6081, lng: 106.7747 }, // Lokasi SMKN 1 Ciomas, Bogor
          zoom: 15,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          ],
        });

        // Marker untuk SMKN 1 Ciomas, Bogor
        new google.maps.Marker({
          position: { lat: -6.6081, lng: 106.7747 },
          map,
          title: "SMKN 1 Ciomas, Bogor",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#B6FF00",
            fillOpacity: 1,
            strokeWeight: 0
          }
        });
      }
    };
    
    return () => {
      // Cleanup
      window.initMap = undefined;
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black text-white min-h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/your-image.png')] bg-cover bg-center opacity-20"></div>

        <div className="relative text-center max-w-4xl px-6">
          <h1 className="text-5xl text-lime-500 md:text-6xl font-bold uppercase mb-4">
            Kontak
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Kami siap membantu Anda. Silakan hubungi kami melalui formulir di bawah atau informasi kontak kami.
          </p>
        </div>
      </section>

      {/* Contact Content - Redesigned with staggered layout */}
      <section className="p-12 bg-[#0D0D0D]">
        <div className="max-w-screen mx-auto">
          {/* Contact Information - Moved to its own row with offset positioning */}
          <div className="flex md:flex-row mb-16">
            <div className="md:w-screen">
              <h2 className="text-3xl font-bold mb-6">Informasi Kontak</h2>
              <div className="space-y-6 bg-[#151515] p-8 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                  <MapPin className="text-lime-500 w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-semibold">Alamat</h3>
                    <p className="text-gray-400">Bogor, Jawa Barat, Indonesia</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="text-lime-500 w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-semibold">Email</h3>
                    <p className="text-gray-400">info@rentoria.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="text-lime-500 w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-semibold">Telepon</h3>
                    <p className="text-gray-400">+62 123 4567 890</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8 bg-[#151515] p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Ikuti Kami</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-lime-500 transition">
                    <Facebook className="w-8 h-8" />
                  </a>
                  <a href="#" className="text-white hover:text-lime-500 transition">
                    <Twitter className="w-8 h-8" />
                  </a>
                  <a href="#" className="text-white hover:text-lime-500 transition">
                    <Instagram className="w-8 h-8" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Full width but offset to right */}
          <div className="md:ml-auto md:w-screen">
            <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
            
            {submitted && (
              <div className="bg-lime-500/20 border border-lime-500 text-lime-300 p-4 rounded-lg mb-6 flex items-center">
                <span>Pesan Anda berhasil terkirim!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-[#151515] p-8 rounded-lg shadow-lg">
              <div>
                <label className="block mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-500"
                  placeholder="email@contoh.com"
                />
              </div>

              <div>
                <label className="block mb-2">Subjek</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-500"
                  placeholder="Topik pesan Anda"
                />
              </div>

              <div>
                <label className="block mb-2">Pesan</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-500 resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 
                  ${loading 
                    ? 'bg-gray-800 cursor-not-allowed' 
                    : 'bg-lime-500 hover:bg-lime-600 text-black'}`}
              >
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="p-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Lokasi Kami</h2>
          <div className="h-[500px] bg-[#0D0D0D] rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;