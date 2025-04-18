import React from 'react'

const Contact = () => {
    return (
        <div className='py-16 px-6 md:px-24 bg-[#F5EBE0]' id="contact">
            <div className='container mx-auto'>
                <h2 className='text-3xl md:text-4xl text-[#8D6F5E] font-bold text-center mb-10'>Hubungi Kami</h2>
                
                {/* Information Section */}
                <div className='mb-10 bg-white p-6 md:p-8 rounded-lg shadow-md max-w-3xl mx-auto'>
                    <h3 className='text-xl md:text-2xl font-semibold mb-6 text-[#8D6F5E] border-b border-[#D2B48C] pb-3'>Informasi Kontak</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex items-start'>
                            <div className='text-[#D2B48C] mr-3 mt-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-medium'>Alamat</h4>
                                <p className='text-gray-600'>Jl. Rental Raya No. 123, Jakarta Selatan, DKI Jakarta 12345</p>
                            </div>
                        </div>
                        <div className='flex items-start'>
                            <div className='text-[#D2B48C] mr-3 mt-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-medium'>Telepon</h4>
                                <p className='text-gray-600'>+62 21 1234 5678</p>
                            </div>
                        </div>
                        <div className='flex items-start'>
                            <div className='text-[#D2B48C] mr-3 mt-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-medium'>Email</h4>
                                <p className='text-gray-600'>info@rentoria.com</p>
                            </div>
                        </div>
                        <div className='flex items-start'>
                            <div className='text-[#D2B48C] mr-3 mt-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-medium'>Jam Operasional</h4>
                                <p className='text-gray-600'>Senin - Jumat: 08.00 - 17.00 WIB</p>
                                <p className='text-gray-600'>Sabtu: 09.00 - 15.00 WIB</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Social Media Links */}
                    <div className='mt-8 pt-6 border-t border-gray-200'>
                        <h3 className='text-xl font-semibold mb-4 text-[#8D6F5E]'>Ikuti Kami</h3>
                        <div className='flex space-x-4'>
                            <a href="#" className='text-[#D2B48C] hover:text-[#8D6F5E] transition-colors'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                </svg>
                            </a>
                            <a href="#" className='text-[#D2B48C] hover:text-[#8D6F5E] transition-colors'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                                </svg>
                            </a>
                            <a href="#" className='text-[#D2B48C] hover:text-[#8D6F5E] transition-colors'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Contact Form Section */}
                <div className='bg-white p-6 md:p-8 rounded-lg shadow-md max-w-3xl mx-auto'>
                    <h3 className='text-xl md:text-2xl font-semibold mb-6 text-[#8D6F5E] border-b border-[#D2B48C] pb-3'>Kirim Pesan</h3>
                    <form className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>Nama Lengkap</label>
                                <input
                                    type="text"
                                    id="name"
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]'
                                    placeholder='Masukkan nama lengkap'
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]'
                                    placeholder='Masukkan alamat email'
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className='block text-sm font-medium text-gray-700 mb-1'>Subjek</label>
                            <input
                                type="text"
                                id="subject"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]'
                                placeholder='Masukkan subjek pesan'
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className='block text-sm font-medium text-gray-700 mb-1'>Pesan</label>
                            <textarea
                                id="message"
                                rows="6"
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2B48C]'
                                placeholder='Tulis pesan Anda di sini'
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className='bg-[#8D6F5E] text-white py-2 px-8 rounded-md hover:bg-[#7D5F4E] transition-colors font-medium'
                            >
                                Kirim Pesan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact  