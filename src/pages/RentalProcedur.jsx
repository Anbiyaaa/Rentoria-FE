import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/axios";
import {
    Gamepad,
    PhoneCall,
    Calendar,
    CreditCard,
    MapPin,
    CheckCircle,
    Clock,
    ArrowRight,
    Heart,
    Star,
    ShoppingCart,
    User,
    CreditCard as Payment,
    Truck
} from "lucide-react";
import Navbar from "../navigation/Navbar";
import Footer from "../component/Footer";
import Faq from "../component/Faq";

export default function RentalProcedurePage() {
    const [consoleData, setConsoleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch console data from API
        const fetchConsoleData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/api/barang");
                setConsoleData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching console data:", err);
                setError("Failed to load console pricing. Please try again later.");
                setLoading(false);
            }
        };

        fetchConsoleData();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen overflow-x-hidden">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-black text-white min-h-[50vh] flex items-center justify-center py-12 px-4">
                <div className="absolute inset-0 bg-[url('/your-image.png')] bg-cover bg-center opacity-20"></div>

                <div className="relative max-w-6xl mx-auto text-center px-4 md:px-8 lg:px-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">
                        Cara <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500">Penyewaan</span> Konsol
                    </h1>
                    <p className="text-gray-300 mt-4 text-base md:text-lg max-w-3xl mx-auto">
                        Ikuti panduan langkah demi langkah untuk menyewa konsol game favorit Anda dengan mudah dan cepat melalui website kami
                    </p>
                </div>
            </section>

            {/* Banner Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-[#0D0D0D] to-black text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-bold text-lime-500 mb-4">Nikmati Pengalaman Gaming Terbaik Tanpa Perlu Membeli Konsol</h2>
                            <p className="text-gray-300 text-lg">
                                Ikuti langkah-langkah mudah di bawah ini untuk menyewa konsol game impian Anda secara online melalui website kami!
                            </p>
                            <a href="#steps" className="mt-6 bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center inline-block">
                                Mulai Sewa Sekarang
                                <Gamepad className="inline-block ml-2" />
                            </a>
                        </div>
                        <div className="w-full md:w-2/5">
                            <img
                                src="/images/sunny.jpg"
                                alt="Rental konsol game"
                                className="rounded-lg shadow-lg border border-gray-800"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section id="steps" className="py-16 px-4 bg-[#0D0D0D]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 mb-2 pb-3">Langkah-Langkah Penyewaan Online</h2>
                        <p className="text-gray-400 max-w-lg mx-auto">Proses mudah untuk menyewa konsol game melalui website kami</p>
                    </div>

                    <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                        {/* Step 1 */}
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-lime-500 transition-all group">
                            <div className="flex justify-center mb-4">
                                <div className="bg-lime-500/20 p-3 rounded-full">
                                    <User size={32} className="text-lime-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3 group-hover:text-lime-500 transition-colors">1. Buat Akun atau Login</h3>
                            <p className="text-gray-400">
                                Buat akun baru atau login ke akun yang sudah ada di website kami. Pastikan data profil Anda lengkap untuk mempermudah proses penyewaan.
                            </p>
                            <div className="mt-4 bg-black/50 p-3 rounded-md">
                                <p className="text-sm text-lime-500">
                                    <strong>Tip:</strong> Verifikasi email Anda untuk mempercepat proses approval
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-lime-500 transition-all group">
                            <div className="flex justify-center mb-4">
                                <div className="bg-lime-500/20 p-3 rounded-full">
                                    <Gamepad size={32} className="text-lime-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3 group-hover:text-lime-500 transition-colors">2. Pilih Konsol & Durasi</h3>
                            <p className="text-gray-400">
                                Browse katalog konsol kami, pilih konsol yang ingin disewa beserta durasi penyewaan yang diinginkan (per 12 Jam, 1 Hari atau 2 Hari).
                            </p>
                            <div className="mt-4 bg-black/50 p-3 rounded-md">
                                <p className="text-sm text-lime-500">
                                    <strong>Pilihan Populer:</strong> PS5, PS4, Xbox Series X, Nintendo Switch
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-lime-500 transition-all group">
                            <div className="flex justify-center mb-4">
                                <div className="bg-lime-500/20 p-3 rounded-full">
                                    <CreditCard size={32} className="text-lime-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3 group-hover:text-lime-500 transition-colors">3. Unggah Dokumen & Data</h3>
                            <p className="text-gray-400">
                                Unggah foto KTP/SIM sebagai verifikasi identitas Di Dashboard Profil. Data ini akan digunakan untuk verifikasi dan keamanan transaksi.
                            </p>
                            <div className="mt-4 bg-black/50 p-3 rounded-md">
                                <p className="text-sm text-lime-500">
                                    <strong>Dokumen:</strong> KTP/SIM harus jelas dan masih berlaku
                                </p>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-lime-500 transition-all group">
                            <div className="flex justify-center mb-4">
                                <div className="bg-lime-500/20 p-3 rounded-full">
                                    <Payment size={32} className="text-lime-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3 group-hover:text-lime-500 transition-colors">4. Pembayaran</h3>
                            <p className="text-gray-400">
                                Lakukan pembayaran sewa secara online dalam web kami. Kami menerima berbagai metode pembayaran termasuk transfer bank dan e-wallet.
                            </p>
                            <div className="mt-4 bg-black/50 p-3 rounded-md">
                                <p className="text-sm text-lime-500">
                                    <strong>Deposit:</strong> Pastikan barang yang ingin disewa tersedia dan pastikan untuk selalu mengecek status pembayaran
                                </p>
                            </div>
                        </div>

                        {/* Step 6 */}
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-lime-500 transition-all group">
                            <div className="flex justify-center mb-4">
                                <div className="bg-lime-500/20 p-3 rounded-full">
                                    <Truck size={32} className="text-lime-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-center mb-3 group-hover:text-lime-500 transition-colors">5. Pengiriman & Pengembalian</h3>
                            <p className="text-gray-400">
                                Pilih metode pengambilan (self-pickup di toko atau pengiriman). Untuk pengembalian, gunakan fitur "Schedule Return" di dashboard akun Anda.
                            </p>
                            <div className="mt-4 bg-black/50 p-3 rounded-md">
                                <p className="text-sm text-lime-500">
                                    <strong>Pengiriman:</strong> Gratis untuk area tertentu, atau dengan biaya tambahan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Price Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-black to-[#0D0D0D]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 pb-3 mb-2">Harga Penyewaan</h2>
                        <p className="text-gray-400 max-w-lg mx-auto">Pilihan harga terbaik untuk setiap kebutuhan gaming Anda</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400">Memuat data harga konsol...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-red-900/20 border border-red-800 rounded-xl">
                            <p className="text-red-400">{error}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white text-sm"
                                onClick={() => window.location.reload()}
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-4 px-4 text-left text-lime-500">Konsol</th>
                                        <th className="py-4 px-4 text-center text-lime-500">Per 12 Jam</th>
                                        <th className="py-4 px-4 text-center text-lime-500">Per Hari (24 jam)</th>
                                        <th className="py-4 px-4 text-center text-lime-500">Per 2 Hari</th>
                                        <th className="py-4 px-4 text-center text-lime-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consoleData.length > 0 ? (
                                        consoleData.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                                <td className="py-4 px-4 font-medium">{item.name}</td>
                                                <td className="py-4 px-4 text-center">Rp {item.price_12_jam.toLocaleString('id-ID')}</td>
                                                <td className="py-4 px-4 text-center">Rp {item.price_1_hari.toLocaleString('id-ID')}</td>
                                                <td className="py-4 px-4 text-center">Rp {item.price_2_hari.toLocaleString('id-ID')}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${item.jumlah_barang > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                        {item.jumlah_barang > 0 ? 'Tersedia' : 'Kosong'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-400">Tidak ada data konsol tersedia</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* What's included Section */}
            <section className="py-16 px-4 bg-[#0D0D0D]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500 pb-3 mb-2">Apa yang Anda Dapatkan</h2>
                        <p className="text-gray-400 max-w-lg mx-auto">Paket lengkap untuk pengalaman gaming maksimal</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center">
                            <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                                <Gamepad size={28} className="text-lime-500" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Konsol Game</h3>
                            <p className="text-gray-400 text-sm">Konsol game pilihan Anda dalam kondisi prima dan terawat dengan baik</p>
                        </div>

                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center">
                            <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                    <path d="M12 10v4" />
                                    <path d="M10 12h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">2 Controller</h3>
                            <p className="text-gray-400 text-sm">Dua controller original dalam kondisi baik untuk bermain bersama teman</p>
                        </div>

                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center">
                            <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500">
                                    <path d="M3 8h18m-18 8h18M8 3v18m8-18v18" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">2 Game Pilihan</h3>
                            <p className="text-gray-400 text-sm">Dua game digital atau fisik sesuai pilihan Anda dari katalog kami</p>
                        </div>

                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center">
                            <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500">
                                    <path d="M5 4h14" />
                                    <path d="M5 12h14" />
                                    <path d="M5 20h14" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Kabel & Aksesoris</h3>
                            <p className="text-gray-400 text-sm">Semua kabel yang diperlukan (HDMI, power) dan aksesoris tambahan</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <Faq />

            {/* CTA Section */}
            <section className="py-12 px-4 bg-gradient-to-b from-lime-700 to-green-800 text-white">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Siap Untuk Bermain Game?</h2>
                    <p className="text-lg md:text-xl mb-8 text-gray-100">Sewa sekarang dan nikmati pengalaman gaming terbaik di rumah Anda!</p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <a href="/belanja" className="bg-black text-white hover:bg-gray-900 py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 w-full md:w-auto">
                            <Gamepad size={20} />
                            <span>Lihat Katalog Konsol</span>
                        </a>
                        <a href="/register" className="bg-lime-500 hover:bg-lime-600 text-black py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 w-full md:w-auto">
                            <span>Daftar Sekarang</span>
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Operating Hours */}
            <section className="py-8 px-4 bg-black text-white border-t border-gray-800">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center items-center gap-2 mb-3">
                        <Clock size={24} className="text-lime-500" />
                        <h3 className="text-xl font-bold text-lime-500">Jam Operasional Customer Service</h3>
                    </div>
                    <p className="text-gray-400">Senin - Jumat: 10:00 - 22:00</p>
                    <p className="text-gray-400">Sabtu - Minggu: 09:00 - 23:00</p>
                    <p className="text-gray-400 mt-2">(Website tersedia 24/7 untuk penyewaan online)</p>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}