import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaBoxes,
  FaClock,
  FaClipboardList,
  FaShoppingCart,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaSnapchat,
  FaChevronUp,
  FaComments,
  FaChevronDown,
  FaCommentsDollar
} from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import { MdCarRental } from "react-icons/md";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRentalDropdownOpen, setIsRentalDropdownOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    navigate("/login"); // Arahkan ke halaman login
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 flex flex-col justify-between sticky top-0 shadow-lg">
      <div>
        <div className="flex items-center justify-center mb-8 p-2 border-b border-gray-700 pb-4">
          <div className="bg-amber-500 rounded-lg p-2 mr-2">
            <FaHome className="text-xl" />
          </div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex flex-col space-y-1">
          <SidebarItem to="/dashboardAdmin" icon={<FaHome />}>Dashboard</SidebarItem>
          <SidebarItem to="/admin/user" icon={<FaUsers />}>Data Pengguna</SidebarItem>
          <SidebarItem to="/admin/manageItems" icon={<FaBoxes />}>Data Konsol</SidebarItem>
          <div className="px-0">
            <button
              onClick={() => setIsRentalDropdownOpen(!isRentalDropdownOpen)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition duration-200 ${isRentalDropdownOpen
                  ? "bg-amber-600 text-white font-medium shadow-md"
                  : "hover:bg-gray-700 text-gray-300 hover:text-white"
                }`}
            >
              <MdCarRental className="mr-3" />
              <span className="flex-1 text-left">Penyewaan</span>
              {isRentalDropdownOpen ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
            </button>
            {isRentalDropdownOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <SidebarItem to="/admin/rental" icon={< GiConsoleController />}>Data Penyewaan</SidebarItem>
                <SidebarItem to="/admin/rental/history" icon={<FaClock />}>Riwayat Penyewaan</SidebarItem>
                <SidebarItem to="/admin/rental/report" icon={<FaClipboardList />}>Cetak Laporan</SidebarItem>
              </div>
            )}
          </div>
          <SidebarItem to="/admin/ticket" icon={<FaComments />}>Customer Chat</SidebarItem>
          <SidebarItem to="/admin/faq" icon={<FaQuestionCircle />}>FAQ</SidebarItem>
        </nav>
      </div>

      {/* Tombol Logout dengan styling yang lebih baik */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition duration-200 shadow-md"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

      {/* Modal Konfirmasi Logout dengan styling yang lebih modern */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-gray-800 animate-fadeIn">
            <h3 className="text-lg font-bold mb-2">Konfirmasi Logout</h3>
            <p className="text-gray-600">Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaSignOutAlt size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${isActive
        ? "bg-amber-600 text-white font-medium shadow-md"
        : "hover:bg-gray-700 text-gray-300 hover:text-white"
        }`}
    >
      <div className="mr-3">
        {icon}
      </div>
      <span>{children}</span>
      {isActive && <FaChevronRight className="ml-auto text-xs" />}
    </Link>
  );
};

export default SidebarAdmin;