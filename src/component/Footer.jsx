import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-10 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Logo & Description */}
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="flex items-center space-x-2">
                            <img src="/Logo R 3.png" height="50" width="50" alt="Logo" />
                            <h2 className="text-2xl font-bold text-[#D4FF00]">Rentoria</h2>
                        </div>
                        <p className="text-gray-400 mt-4 text-center sm:text-left text-sm md:text-base">
                            Sewa konsol game favoritmu mulai dari PS4, PS5 hingga Nintendo Switch. Main hemat, seru maksimal!
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex space-x-4 mt-4 justify-center sm:justify-start">
                            <a href="#" className="text-gray-400 hover:text-[#D4FF00]" title="Facebook">
                                <i className="fab fa-facebook-square text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#D4FF00]" title="Instagram">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#D4FF00]" title="WhatsApp">
                                <i className="fab fa-whatsapp text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#D4FF00]" title="YouTube">
                                <i className="fab fa-youtube text-xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Navigation - Rental Info */}
                    <div className="mt-6 sm:mt-0">
                        <h3 className="text-xl font-bold text-white text-center sm:text-left">Rental</h3>
                        <ul className="mt-4 space-y-2 text-gray-400 text-center sm:text-left">
                            <li><a href="/belanja" className="hover:text-[#D4FF00]">Daftar Konsol</a></li>
                            <li><a href="/procedur" className="hover:text-[#D4FF00]">Cara Sewa</a></li>
                        </ul>
                    </div>

                    {/* Navigation - Support */}
                    <div className="mt-6 md:mt-0">
                        <h3 className="text-xl font-bold text-white text-center sm:text-left">Bantuan</h3>
                        <ul className="mt-4 space-y-2 text-gray-400 text-center sm:text-left">
                            <li><a href="#" className="hover:text-[#D4FF00]">FAQ</a></li>
                            <li><a href="#" className="hover:text-[#D4FF00]">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-[#D4FF00]">Kebijakan Privasi</a></li>
                            <li><a href="#" className="hover:text-[#D4FF00]">Hubungi Kami</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 mt-10 text-sm">
                © {new Date().getFullYear()} Rentoria - Rental Konsol Game
            </div>
        </footer>
    );
};

export default Footer;
