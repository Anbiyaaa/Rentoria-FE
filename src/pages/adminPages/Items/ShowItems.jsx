import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaShoppingCart, 
  FaBox, 
  FaCalendarAlt, 
  FaTag,
  FaHistory,
  FaCheckCircle,
  FaEye,
  FaCog
} from "react-icons/fa";
import Header from "../../../navigation/AdminHeader";
import SidebarAdmin from "../../../navigation/SidebarAdmin";
import AxiosInstance from "../../../axiosInstance/axios";

const ViewItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            try {
                const response = await AxiosInstance.get(`/api/barang/${id}`);
                setItem(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching item details:", error);
                setError("Gagal memuat detail barang. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
            try {
                await AxiosInstance.delete(`/api/barang/${id}`);
                navigate("/admin/manageItems");
            } catch (error) {
                console.error("Error deleting item:", error);
                setError("Gagal menghapus barang. Silakan coba lagi.");
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <SidebarAdmin />
            <div className="flex-1 overflow-auto">
                <Header />
                <div className="p-4 max-w-full mx-auto">
                    {/* Admin Breadcrumbs */}
                    <div className="mb-4 flex items-center text-sm text-gray-600">
                        <span onClick={() => navigate("/admin/dashboard")} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                        <span className="mx-2">/</span>
                        <span onClick={() => navigate("/admin/manageItems")} className="cursor-pointer hover:text-blue-600">Inventory</span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800 font-medium">Detail Item</span>
                    </div>

                    {loading ? (
                        <div className="bg-white p-8 rounded-lg shadow-md flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                </svg>
                                {error}
                            </div>
                        </div>
                    ) : item ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column - Item Info Card */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Item Basic Info Card */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="bg-blue-700 px-6 py-4 flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-white">Detail Barang</h2>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/editItem/${id}`)}
                                                className="p-2 bg-yellow-500 rounded text-white hover:bg-yellow-600"
                                                title="Edit Item"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="p-2 bg-red-500 rounded text-white hover:bg-red-600"
                                                title="Delete Item"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        {/* Item Image */}
                                        <div className="w-full aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                                            {item.gambar ? (
                                                <img
                                                    src={item.gambar}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                    <FaBox className="text-gray-400 text-5xl" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Item Details */}
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaTag className="mr-2 text-blue-600" />
                                                <span>ID: {item.id}</span>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FaBox className="text-blue-600 mr-2" />
                                                    <span className="text-gray-700">Stok Tersedia</span>
                                                </div>
                                                <span className="text-xl font-bold text-blue-600">{item.jumlah_barang}</span>
                                            </div>
                                            
                                            <div className="pt-3 border-t">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-600">Tipe</span>
                                                    <span className="font-medium">{item.tipe}</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-gray-600">Kategori</span>
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                        {item.category?.name || "Tidak ada kategori"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">ID Kategori</span>
                                                    <span className="font-medium">{item.category_id || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Quick Actions Panel */}
                                {/* <div className="bg-white rounded-lg shadow-md p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => navigate("/admin/createOrder", { state: { selectedItem: item } })}
                                            className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors"
                                        >
                                            <FaShoppingCart className="text-2xl mb-2" />
                                            <span className="text-sm font-medium">Buat Pesanan</span>
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/admin/editItem/${id}`)}
                                            className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg transition-colors"
                                        >
                                            <FaEdit className="text-2xl mb-2" />
                                            <span className="text-sm font-medium">Edit Item</span>
                                        </button>
                                        <button 
                                            className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors"
                                        >
                                            <FaHistory className="text-2xl mb-2" />
                                            <span className="text-sm font-medium">Riwayat</span>
                                        </button>
                                        <button 
                                            className="flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-4 rounded-lg transition-colors"
                                        >
                                            <FaEye className="text-2xl mb-2" />
                                            <span className="text-sm font-medium">Preview</span>
                                        </button>
                                    </div>
                                </div> */}
                            </div>

                            {/* Right Column - Main Content */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Tabs Navigation */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="flex border-b">
                                        <button 
                                            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                                            onClick={() => setActiveTab("details")}
                                        >
                                            <FaBox className="mr-2" /> Detail
                                        </button>
                                        <button 
                                            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "pricing" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                                            onClick={() => setActiveTab("pricing")}
                                        >
                                            <FaTag className="mr-2" /> Harga
                                        </button>
                                        {/* <button 
                                            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                                            onClick={() => setActiveTab("history")}
                                        >
                                            <FaHistory className="mr-2" /> Riwayat
                                        </button> */}
                                        {/* <button 
                                            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "settings" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                                            onClick={() => setActiveTab("settings")}
                                        >
                                            <FaCog className="mr-2" /> Pengaturan
                                        </button> */}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="p-6">
                                        {activeTab === "details" && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Detail</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                                    <h4 className="text-md font-medium text-gray-700 mb-2">Deskripsi</h4>
                                                    <p className="text-gray-700">{item.deskripsi || "Tidak ada deskripsi tersedia."}</p>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Dibuat pada</h4>
                                                        <div className="flex items-center">
                                                            <FaCalendarAlt className="text-blue-500 mr-2" />
                                                            <span className="font-medium">{formatDate(item.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Diperbarui pada</h4>
                                                        <div className="flex items-center">
                                                            <FaCalendarAlt className="text-blue-500 mr-2" />
                                                            <span className="font-medium">{formatDate(item.updated_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "pricing" && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Harga</h3>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h4 className="text-lg font-semibold text-gray-700">12 Jam</h4>
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Standard</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(item.price_12_jam)}</div>
                                                        <div className="text-sm text-gray-500">Tarif per 12 jam</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-md relative">
                                                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">Popular</div>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h4 className="text-lg font-semibold text-blue-700">1 Hari</h4>
                                                            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">Recommended</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-blue-800 mb-1">{formatCurrency(item.price_1_hari)}</div>
                                                        <div className="text-sm text-blue-600">Tarif per hari</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h4 className="text-lg font-semibold text-gray-700">2 Hari</h4>
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Hemat</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(item.price_2_hari)}</div>
                                                        <div className="text-sm text-gray-500">Tarif per 2 hari</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                                    <div className="flex">
                                                        <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm text-yellow-700">Harga dapat berubah sewaktu-waktu. Harga yang tercantum belum termasuk diskon atau promosi yang sedang berlangsung.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "history" && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Penyewaan</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
                                                    <FaHistory className="text-gray-400 text-2xl mx-auto mb-2" />
                                                    <p className="text-gray-600">Data riwayat penyewaan barang ini akan muncul di sini.</p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "settings" && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Item</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">Status Ketersediaan</h4>
                                                            <p className="text-sm text-gray-600">Mengontrol apakah item ini dapat disewa</p>
                                                        </div>
                                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                                            <input type="checkbox" id="toggle" className="focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                                                            <label htmlFor="toggle" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">Tampilkan di Halaman Utama</h4>
                                                            <p className="text-sm text-gray-600">Menampilkan item ini di bagian highlight</p>
                                                        </div>
                                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                                            <input type="checkbox" id="toggle2" className="focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                            <label htmlFor="toggle2" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Admin ActionBar */}
                                <div className="bg-white rounded-lg shadow-md p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Tindakan Admin</h3>
                                            <p className="text-sm text-gray-600">Kelola item ini dalam sistem</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => navigate(`/admin/editItem/${id}`)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-all"
                                            >
                                                <FaEdit /> Edit Item
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-all"
                                            >
                                                <FaTrash /> Hapus Item
                                            </button>
                                            <button
                                                onClick={() => navigate("/admin/manageItems")}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-all"
                                            >
                                                <FaArrowLeft /> Kembali
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                </svg>
                                Barang tidak ditemukan.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewItem;