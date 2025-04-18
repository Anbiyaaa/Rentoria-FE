import React, { useEffect, useState } from "react";
import { AxiosInstance } from "../../axiosInstance/axios";
import { Link } from "react-router-dom";
import Sidebar from "../../navigation/SidebarAdmin";
import Header from "../../navigation/AdminHeader";
import Loading from "../../component/Loading";
import Pagination from "../../component/Pagination"; // Import komponen pagination terpisah
import toast, { Toaster } from "react-hot-toast";
import { Search, UserPlus, Edit, Trash2, AlertCircle } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);

  const fetchDataUsers = async () => {
    try {
      const response = await AxiosInstance.get("/api/admin/users");
      setUsers(response.data?.users || []);
    } catch (error) {
      setError("Gagal mengambil data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataUsers();
  }, []);

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDeleteUser = async (userId) => {
    try {
      await AxiosInstance.delete(`/api/admin/users/${userId}`);
      toast.success("Pengguna berhasil dihapus!", {
        duration: 3000,
        position: "top-center",
      });
      setUsers(users.filter((user) => user.id !== userId));
      setDeleteUserId(null);
    } catch (error) {
      toast.error("Gagal menghapus pengguna.");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handler for page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Manajemen Pengguna
              </h1>
              <Link
                to="/admin/users/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
              >
                <UserPlus size={18} className="mr-2" />
                Tambah Pengguna
              </Link>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loading />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari pengguna..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <AlertCircle size={24} className="text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">Tidak ada pengguna yang ditemukan</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Coba gunakan kata kunci pencarian yang berbeda atau tambahkan pengguna baru
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th 
                              className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
                              onClick={() => handleSort("name")}
                            >
                              <div className="flex items-center">
                                Nama
                                <span className="ml-1 text-gray-400">
                                  {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                                </span>
                              </div>
                            </th>
                            <th 
                              className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSort("email")}
                            >
                              <div className="flex items-center">
                                Email
                                <span className="ml-1 text-gray-400">
                                  {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
                                </span>
                              </div>
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{user.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                <Link
                                  to={`/admin/users/edit/${user.id}`}
                                  className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                                >
                                  <Edit size={16} className="mr-1" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => setDeleteUserId(user.id)}
                                  className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 size={16} className="mr-1" />
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  {/* Menggunakan komponen Pagination terpisah */}
                  {filteredUsers.length > usersPerPage && (
                    <Pagination
                    currentPage={currentPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={usersPerPage}
                    onPageChange={handlePageChange}
                    />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center mb-4">
              <div className="mr-4 bg-red-100 rounded-full p-2">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Konfirmasi Hapus</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteUser(deleteUserId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;