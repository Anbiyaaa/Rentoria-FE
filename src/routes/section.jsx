import React from 'react'
import { Route, Routes } from 'react-router-dom'
import About from '../pages/About'
import Contact from '../pages/Contact'
import News from '../pages/News'
import NewsDetail from '../pages/detail/ProductDetail'
import Users from '../pages/adminPages/Users'
import ManageItems from '../pages/adminPages/ManageItems'
import ManageRental from '../pages/adminPages/ManageRental'
import Login from '../component/Login'
import Register from '../component/Register'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import UserDashboard from '../pages/dashboard/UserDashboard'
import Home from '../pages/Home'
import Faq from '../pages/adminPages/Faq'
import Ticket from '../pages/adminPages/Tickets'
import HistoryRental from '../pages/adminPages/HistoryRental'
import ReportRental from '../pages/adminPages/ReportRental'
import DetailTicket from '../pages/adminPages/ticket/AdminChat'
import ProtectedRoute from '../component/ProtectedRoute'
import CreateItem from '../pages/adminPages/Items/CreateItems'
import EditItems from '../pages/adminPages/Items/EditItems'
import ShowItems from '../pages/adminPages/Items/ShowItems'
import CreateUsers from '../pages/adminPages/user/CreateUsers'
import EditUsers from '../pages/adminPages/user/EditUsers'
import Shop from '../pages/Shop'
import Cart from '../pages/userpages/Cart'
import ProductCatalog from '../pages/userpages/ProductCatalog'
import UserProfile from '../pages/userpages/Profile'
import PaymentPage from "../pages/userpages/PaymentPage";
import ViewProduct from '../pages/userpages/detail/ViewProduct'
import RentalHistoryPage from '../pages/userpages/HistoryPay'
import CustomerChat from '../pages/userpages/Ticket'
import ProductDetail from '../pages/detail/ProductDetail'
import RentalProcedurePage from '../pages/RentalProcedur'
// import AddCategory from '../pages/adminPages/Items/AddCategory'

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/belanja" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/procedur" element={<RentalProcedurePage />} />
      <Route path="/login" element={<Login />} />

      <Route path="/payment/:orderId" element={<PaymentPage />} />

      {/* Rute untuk Cart/Keranjang */}
      <Route path="/catalog" element={
        <ProtectedRoute role="customer">
          <ProductCatalog />
        </ProtectedRoute>
      } />
      <Route path="/catalog/product/:id" element={
        <ProtectedRoute role="customer">
          <ViewProduct />
        </ProtectedRoute>
      } />
      <Route path="/myRental" element={
        <ProtectedRoute role="customer">
          <PaymentPage />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute role="customer">
          <RentalHistoryPage />
        </ProtectedRoute>
      } />

      <Route path="/ticket" element={
        <ProtectedRoute role="customer">
          <CustomerChat />
        </ProtectedRoute>
      } />
      <Route path="/user/profile" element={
        <ProtectedRoute role="customer">
          <UserProfile />
        </ProtectedRoute>
      } />

      {/* Proteksi Halaman Admin */}
      <Route path="/admin/user" element={
        <ProtectedRoute role="admin">
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/admin/users/create" element={
        <ProtectedRoute role="admin">
          <CreateUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/users/edit/:userId" element={
        <ProtectedRoute role="admin">
          <EditUsers />
        </ProtectedRoute>
      } />

      {/* Proteksi Halaman Admin */}
      <Route path="/admin/manageItems" element={
        <ProtectedRoute role="admin">
          <ManageItems />
        </ProtectedRoute>
      } />
      <Route path="/admin/manageItems" element={
        <ProtectedRoute role="admin">
          <ShowItems />
        </ProtectedRoute>
      } />

      {/* Proteksi Halaman Admin */}
      <Route path="/admin/addItems" element={
        <ProtectedRoute role="admin">
          <CreateItem />
        </ProtectedRoute>
      } />
      <Route path="/admin/faq" element={
        <ProtectedRoute role="admin">
          <Faq />
        </ProtectedRoute>
      } />
      <Route path="/admin/ticket" element={
        <ProtectedRoute role="admin">
          <Ticket />
        </ProtectedRoute>
      } />
      <Route path="/admin/rental/history" element={
        <ProtectedRoute role="admin">
          <HistoryRental />
        </ProtectedRoute>
      } />
      <Route path="/admin/rental/report" element={
        <ProtectedRoute role="admin">
          <ReportRental />
        </ProtectedRoute>
      } />
      <Route path="/admin/detailTicket" element={
        <ProtectedRoute role="admin">
          <DetailTicket />
        </ProtectedRoute>
      } />

      <Route path="/admin/editItem/:id" element={
        <ProtectedRoute role="admin">
          <EditItems />
        </ProtectedRoute>
      } />
      <Route path="/admin/viewItem/:id" element={
        <ProtectedRoute role="admin">
          <ShowItems />
        </ProtectedRoute>
      } />

      {/* Proteksi Dashboard */}
      <Route path="/dashboardAdmin" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      {/* Proteksi Dashboard */}
      <Route path="/admin/rental" element={
        <ProtectedRoute role="admin">
          <ManageRental />
        </ProtectedRoute>
      } />

      <Route path="/dashboardUser" element={
        <ProtectedRoute role="customer">
          <UserDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default Routers