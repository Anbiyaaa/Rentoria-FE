import React from 'react'

const Footer = () => {
    return (
        <><div className='bg-[#6B4C3B] text-white py-5'>
            <div className='container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mx-auto py-5'>
                {/* Grid 1 (Tetap di atas) */}
                <div className="flex px-20">
                    <ul>
                        <li className="text-5xl font-bold flex items-end">
                            <img src="/Logo R 3.png" height="60" width="60" alt="" />
                            entoria
                        </li>
                        <li className="text-lg leading-9">Jl. Raya Bogor, Jakarta</li>
                        <li className="text-lg leading-9">Indonesia</li>
                    </ul>
                </div>

                {/* Grid 2 (Diturunkan) */}
                <div className='flex px-20 py-8'>
                    <ul>
                        <li className='text-3xl font-bold  leading-9'>Tentang Kami</li>
                        <li className='text-lg leading-9'>Syarat & Ketentuan</li>
                        <li className='text-lg leading-9'>Kebijakan Pengembalian</li>
                        <li className='text-lg leading-9'>FAQ</li>
                    </ul>
                </div>

                {/* Grid 3 (Diturunkan) */}
                <div className='flex py-8 '>
                    <ul>
                        <li className='text-3xl font-bold leading-9'>Hubungi Kami</li>
                        <li className='text-lg leading-9'>Instagram:</li>
                        <a href='https://www.instagram.com/' className='text-lg leading-9'>@rentoria</a>
                    </ul>
                </div>
            </div>
        </div>
            <div className='bg-white py-2 text-black flex justify-center'> © Copyright 2025 - Rentoria</div>

        </>
    )
}

export default Footer