import React from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../component/Footer";

const About = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/wp.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white text-center px-6">
          <h1 className="text-5xl font-bold">Sewa Barang dengan Mudah & Murah</h1>
          <p className="mt-4 text-lg text-gray-300">
            Dari alat elektronik hingga perlengkapan acara, semua tersedia untuk disewa dengan harga terjangkau.
          </p>
        </div>

        {/* Form "Minta Penawaran" */}
        <div className="absolute right-10 top-1/3 bg-black/50 p-6 rounded-lg text-white w-80">
          <h3 className="text-xl font-bold mb-4">Minta Penawaran</h3>
          <input
            type="text"
            placeholder="Nama Anda"
            className="w-full px-4 py-2 mb-3 bg-gray-800 border border-gray-600 rounded-lg"
          />
          <input
            type="text"
            placeholder="Nomor Telepon"
            className="w-full px-4 py-2 mb-3 bg-gray-800 border border-gray-600 rounded-lg"
          />
          <textarea
            placeholder="Barang yang ingin disewa"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
          ></textarea>
          <button className="mt-4 w-full bg-yellow-500 text-black font-bold py-2 rounded-lg">
            Kirim Permintaan
          </button>
        </div>
      </section>

      {/* Kenapa Memilih Kami? */}
      <section className="py-20 bg-gray-900 text-white px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Kenapa Memilih Kami?</h2>
            <p className="text-gray-300">
              Kami menyediakan layanan penyewaan barang dengan harga kompetitif dan kemudahan dalam transaksi.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-500 text-black flex items-center justify-center rounded-md text-lg font-bold">✓</span>
                Proses sewa mudah & cepat
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-500 text-black flex items-center justify-center rounded-md text-lg font-bold">✓</span>
                Harga terbaik & transparan
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-500 text-black flex items-center justify-center rounded-md text-lg font-bold">✓</span>
                Pilihan barang lengkap & berkualitas
              </li>
            </ul>
          </div>
          <img
            src="/images/wp.jpg"
            alt="Proses Penyewaan"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Kategori Barang */}
      <section className="py-20 bg-gray-800 text-white px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-10">Kategori Barang</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Elektronik</h3>
            <p className="text-gray-400 mt-2">Laptop, kamera, proyektor</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Peralatan Acara</h3>
            <p className="text-gray-400 mt-2">Tenda, kursi, sound system</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Alat Berat</h3>
            <p className="text-gray-400 mt-2">Genset, mesin konstruksi</p>
          </div>
        </div>
      </section>

      {/* Penawaran Spesial */}
      <section className="py-16 bg-gray-900 text-white px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-10">Penawaran Spesial</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Diskon 10% Sewa Laptop</h3>
            <p className="text-gray-400 mt-2">Untuk sewa 7 hari atau lebih</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Gratis Ongkir</h3>
            <p className="text-gray-400 mt-2">Khusus area kota tertentu</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold">Paket Sewa Acara</h3>
            <p className="text-gray-400 mt-2">Sound system + lighting diskon 15%</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;
