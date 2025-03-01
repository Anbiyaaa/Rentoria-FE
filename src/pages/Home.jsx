import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../navigation/Navbar'
import SearchBar from '../component/SearchBar'
import { AxiosInstance } from '../axiosInstance/axios'
import Footer from '../component/Footer'

const Home = () => {

  const [items, setItems] = useState([])
  const limitedItems = items.slice(0, 3)

  const FetchDataItems = async () => {
    const response = await AxiosInstance.get('/posts')
    const { data: result } = response
    setItems(result)
    return result
  }

  useEffect(() => {
    FetchDataItems()
  })

  return (
    <>
      <Navbar />
      <div className='bg-[#D2B48C]'>
        <div className='container grid grid-cols-2 h-screen mx-auto pt-10 '>
          <div className='px-24 my-10'>
            <h1 className='text-7xl text-white font-bold'>Sewa Barang dengan Mudah Di <img src="" alt="" /> Rentoria</h1>
            <p className='text-3xl text-white mt-5 w-100'>Temukan & Sewa Barang yang Anda Butuhkan dalam Sekejap!</p>
            <Link to='/about' className='bg-[#8D6F5E] text-white py-2 px-4 mt-5 inline-block'>Lihat Kategori</Link>
          </div>
          <div className='px-24'>
            <img src="src\assets\home.png" alt="" />
          </div>
        </div>
        <hr className='mb-10' />
        <SearchBar />
        <div className='py-20'>
          <h1 className='text-4xl text-white text-center font-bold'>Barang TerFavorit</h1>
          <div className='container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mx-auto py-10 justify-items-center items-center'>
            {limitedItems.map((items, index) => (
              <div key={index} className='bg-white rounded-2xl shadow-md overflow-hidden max-w-xs'>
                <img src="src\assets\Logo R 3.jpg" alt={items.title} className='w-full h-40 object-cover' />
                <div className='p-4'>
                  <h3 className='text-lg font-semibold text-gray-800 line-clamp-1'>{items.title}</h3>
                  <p className='text-gray-600 text-sm mt-2 line-clamp-4'>{items.body}</p>
                  <div className='flex justify-center'>
                    <Link to={`/news/${items.id}`}>
                      <button className='mt-4 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 cursor-pointer'>Lihat Detail</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home