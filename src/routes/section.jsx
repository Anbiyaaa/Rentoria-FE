import React from 'react'
import { Route, Routes } from 'react-router-dom'
import About from '../pages/About'
import Contact from '../pages/Contact'
import News from '../pages/News'
import NewsDetail from '../pages/detail/NewsDetail'
import Users from '../pages/Users'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'

const Routers = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user" element={<Users />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
    </Routes>
  )
}

export default Routers