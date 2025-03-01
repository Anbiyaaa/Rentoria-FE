import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="bg-[#8D6F5E] p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <img src="" alt="" />
                <h1 className="text-2xl font-bold text-white">Rentoria</h1>
                <div className="space-x-4 flex justify-center flex-1">
                    <Link to="/" className="text-white hover:underline">Beranda</Link>
                    <Link to="/about" className="text-white hover:underline">Kategori</Link>
                    <Link to="/contact" className="text-white hover:underline">Kontak</Link>
                </div>
                <div className=''>
                    <Link to="/login" className="text-white border-2 p-2 font-bold hover:text-orange-500 hover:bg-white">Masuk</Link>
                    <Link to="/register" className="text-white border-2 p-2 font-bold hover:text-orange-500 hover:bg-white">Daftar</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar