import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaFileImport, FaFileExport, FaPlus, FaList, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../navigation/AdminHeader";
import SidebarAdmin from "../../navigation/SidebarAdmin";
import AxiosInstance from "../../axiosInstance/axios";
import Pagination from "../../component/Pagination";

const ImportDataPopup = ({ show, onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setLoading(true);
        try {
            // Create FormData to send the file
            const formData = new FormData();
            formData.append('file', file);

            // Call the import function passed from parent
            await onImport(formData);
            onClose();
        } catch (err) {
            setError("Gagal mengimpor data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                style={{ animation: "modalAppear 0.3s ease-out forwards" }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Import Data Barang</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-6">
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {file ? (
                            <div>
                                <div className="text-green-500 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 font-medium">{file.name}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                                <button
                                    onClick={() => setFile(null)}
                                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                                >
                                    Pilih file lain
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label
                                    htmlFor="excel-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <div className="text-blue-500 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        Klik untuk pilih file Excel
                                    </span>
                                    <span className="text-gray-500 text-sm mt-1">
                                        Format yang didukung: XLSX, XLS
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    id="excel-upload"
                                    className="hidden"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Memproses file...</p>
                    </div>
                )}

                <div className="flex flex-col mt-6">
                    <p className="text-sm text-gray-600 mb-4">
                        <strong>Catatan:</strong> Format Excel harus sesuai dengan kolom: nama barang, jumlah, kategori, harga per hari.
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleImport}
                            disabled={!file || loading}
                            className={`
                                px-4 py-2 rounded-lg transition-colors text-white
                                ${(!file || loading) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                            `}
                        >
                            Import Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
// CategoryListPopup Component
const CategoryListPopup = ({ show, onClose, categories, onEdit, onDelete, onRefresh }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                style={{ animation: "modalAppear 0.3s ease-out forwards" }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Daftar Kategori</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        &times;
                    </button>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Belum ada kategori.</p>
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            onClick={onRefresh}
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">Nama</th>
                                    <th className="p-2 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{category.id}</td>
                                        <td className="p-2 font-medium">{category.name}</td>
                                        <td className="p-2">
                                            <div className="flex justify-center gap-2">
                                                {/* <button
                                                    onClick={() => onEdit(category)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Edit Kategori"
                                                >
                                                    <FaEdit />
                                                </button> */}
                                                <button
                                                    onClick={() => onDelete(category.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Hapus Kategori"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// AddCategoryPopup Component
const AddCategoryPopup = ({ show, onClose, onSubmit, editCategory }) => {
    const [categoryName, setCategoryName] = useState(editCategory ? editCategory.name : "");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (editCategory) {
            setCategoryName(editCategory.name);
            setImagePreview(editCategory.gambar || null);
        } else {
            setCategoryName("");
            setImageFile(null);
            setImagePreview(null);
        }
    }, [editCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (categoryName.trim()) {
            onSubmit(categoryName.trim(), imageFile);
            setCategoryName("");
            setImageFile(null);
            setImagePreview(null);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                style={{ animation: "modalAppear 0.3s ease-out forwards" }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        {editCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="categoryName" className="block text-gray-700 mb-2">
                            Nama Kategori:
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan nama kategori"
                            required
                        />
                    </div>

                    {/* Image Upload Field */}
                    <div className="mb-4">
                        <label htmlFor="categoryImage" className="block text-gray-700 mb-2">
                            Gambar Kategori:
                        </label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4">
                            {imagePreview ? (
                                <div className="relative w-full">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mx-auto max-h-32 object-contain mb-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                        <div className="text-blue-500 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            Klik untuk unggah gambar
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="gambar/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImagePreview(reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Format yang didukung: JPG, PNG. Ukuran maks: 2MB
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {editCategory ? "Perbarui" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageItems = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [fadeItems, setFadeItems] = useState({});
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [showCategoryPopup, setShowCategoryPopup] = useState(false);
    const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [showImportPopup, setShowImportPopup] = useState(false);

    const navigate = useNavigate();

    const handleCategorySubmit = async (categoryName, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('name', categoryName);

            if (imageFile) {
                formData.append('gambar', imageFile);
            }

            if (editingCategory) {
                await AxiosInstance.put(`/api/categories/${editingCategory.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showNotification("Kategori berhasil diperbarui!");
            } else {
                await AxiosInstance.post(`/api/categories/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showNotification("Kategori baru berhasil ditambahkan!");
            }

            // Refresh categories and close popup
            fetchCategories();
            setShowAddCategoryPopup(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Error saving category:", error);
            showNotification("Gagal menyimpan kategori. Silakan coba lagi.", "error");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            try {
                await AxiosInstance.delete(`/api/categories/${categoryId}`);
                fetchCategories();
                showNotification("Kategori berhasil dihapus!");
            } catch (error) {
                console.error("Error deleting category:", error);
                showNotification("Gagal menghapus kategori. Mungkin masih ada barang dengan kategori ini.", "error");
            }
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowAddCategoryPopup(true);
        setShowCategoryPopup(false); // Close the category list popup
    };

    const handleImportData = async (formData) => {
        try {
            const response = await AxiosInstance.post("/api/barang/import", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            fetchProducts();

            showNotification(
                response.data.message ||
                `${response.data.imported || 'Semua'} barang berhasil diimpor!`
            );
        } catch (error) {
            console.error("Error importing data:", error);
            showNotification(
                error.response?.data?.message ||
                error.response?.data?.details ||
                "Gagal mengimpor data. Silakan coba lagi.",
                "error"
            );
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await AxiosInstance.get("/api/barang");
            setProducts(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Gagal memuat data barang. Silakan coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await AxiosInstance.get("/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            showNotification("Gagal memuat kategori. Silakan refresh halaman.", "error");
        }
    };

    const showNotification = (message, type = "success") => {
        setNotification({
            show: true,
            message,
            type
        });
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
            try {
                await AxiosInstance.delete(`/api/barang/${id}`);

                setFadeItems(prev => ({ ...prev, [`product-${id}`]: true }));

                setTimeout(() => {
                    setProducts(products.filter(item => item.id !== id));
                    showNotification("Barang berhasil dihapus!");
                }, 300);
            } catch (error) {
                console.error("Error deleting product:", error);
                showNotification("Gagal menghapus barang.", "error");
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

    // Filter products based on selected category
    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(item => item.category?.name === selectedCategory);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset to page 1 when category filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    return (
        <div className="flex h-screen">
            <SidebarAdmin />
            <div className="flex-1 overflow-auto bg-gray-50">
                <Header />
                <div className="p-6">
                    {notification.show && (
                        <div
                            className={`fixed top-16 right-4 p-3 rounded shadow-lg transition-all duration-300 ease-in-out 
                                ${notification.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
                                ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                        >
                            <div className="flex items-center gap-2">
                                <span>{notification.message}</span>
                                <button
                                    onClick={() => setNotification({ ...notification, show: false })}
                                    className="ml-2 text-white hover:text-gray-200"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Data Barang</h2>
                        <div className="flex gap-3 flex-wrap md:flex-nowrap">
                            {/* Existing buttons */}
                            <button onClick={() => setShowImportPopup(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md">
                                <FaFileImport /> Import Data
                            </button>
                            {/* <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md">
                                <FaFileExport /> Export Data
                            </button> */}
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md"
                                onClick={() => {
                                    setEditingCategory(null);
                                    setShowAddCategoryPopup(true);
                                }}
                            >
                                <FaPlus /> Tambah Kategori
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md"
                                onClick={() => navigate("/admin/addItems")}
                            >
                                <FaPlus /> Tambah Barang
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md"
                                onClick={() => setShowCategoryPopup(true)}
                            >
                                <FaList /> Lihat Kategori
                            </button>
                        </div>
                    </div>

                    {/* Category Filter Section */}
                    <div className="mb-8 bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center gap-2 text-gray-700">
                                <FaFilter className="text-blue-500" />
                                <span className="font-semibold">Filter Kategori:</span>
                            </div>
                            <div className="relative flex-grow max-w-xs">
                                <select
                                    className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-700 cursor-pointer shadow-sm outline-none transition-all duration-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 pl-4 pr-10"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Dropdown icon */}
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="hidden sm:block text-sm text-gray-500">
                                {filteredProducts.length} barang ditemukan
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center p-8 bg-white rounded-lg shadow-md">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Memuat data...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4 flex justify-between animate-pulse shadow-md">
                            <p>{error}</p>
                            <button
                                onClick={fetchProducts}
                                className="text-red-700 font-bold hover:underline transition-all duration-200"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                            <tr>
                                                <th className="p-3 text-left font-semibold">ID</th>
                                                <th className="p-3 text-left font-semibold">Gambar</th>
                                                <th className="p-3 text-left font-semibold">Nama Barang</th>
                                                <th className="p-3 text-left font-semibold">Tipe</th>
                                                <th className="p-3 text-left font-semibold">Jumlah</th>
                                                <th className="p-3 text-left font-semibold">Kategori</th>
                                                <th className="p-3 text-left font-semibold">Harga 1 Hari</th>
                                                <th className="p-3 text-center font-semibold">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="p-6 text-center text-gray-500">
                                                        <div className="flex flex-col items-center justify-center py-8">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                            </svg>
                                                            <p className="text-lg">Tidak ada data barang yang tersedia.</p>
                                                            <p className="text-sm text-gray-400 mt-1">Coba pilih kategori lain atau tambahkan barang baru.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItems.map((item, index) => (
                                                    <tr
                                                        key={item.id}
                                                        className={`
                                                            ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} 
                                                            hover:bg-blue-100 transition-all duration-150 ease-in-out
                                                            ${fadeItems[`product-${item.id}`] ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}
                                                        `}
                                                    >
                                                        <td className="border-b border-gray-200 p-3 text-gray-700">{item.id}</td>
                                                        <td className="border-b border-gray-200 p-3">
                                                            {item.gambar ? (
                                                                <div className="relative group">
                                                                    <img
                                                                        src={item.gambar}
                                                                        alt={item.name}
                                                                        className="w-16 h-16 object-cover rounded-lg shadow-sm transition-all duration-300 group-hover:scale-110"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                                                                    <span className="text-gray-400 text-xs">No Image</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="border-b border-gray-200 p-3 font-medium text-gray-800">{item.name}</td>
                                                        <td className="border-b border-gray-200 p-3 text-gray-700">{item.tipe}</td>
                                                        <td className="border-b border-gray-200 p-3 text-gray-700">
                                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                                {item.jumlah_barang}
                                                            </span>
                                                        </td>
                                                        <td className="border-b border-gray-200 p-3 text-gray-700">
                                                            {item.category?.name ? (
                                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                                    {item.category.name}
                                                                </span>
                                                            ) : (
                                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                                                    Tidak ada kategori
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="border-b border-gray-200 p-3 font-semibold text-gray-900">
                                                            {formatCurrency(item.price_1_hari)}
                                                        </td>
                                                        <td className="border-b border-gray-200 p-3 text-center">
                                                            <div className="flex justify-center gap-3">
                                                                <button
                                                                    className="text-blue-500 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                                                    onClick={() => navigate(`/admin/viewItem/${item.id}`)}
                                                                    title="Lihat Detail"
                                                                >
                                                                    <FaEye />
                                                                </button>
                                                                <button
                                                                    className="text-yellow-500 bg-yellow-100 hover:bg-yellow-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                                                    onClick={() => navigate(`/admin/editItem/${item.id}`)}
                                                                    title="Edit Barang"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="text-red-500 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                                                    onClick={() => handleDeleteProduct(item.id)}
                                                                    title="Hapus Barang"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredProducts.length}
                                    currentPage={currentPage}
                                    onPageChange={paginate}
                                />
                            </div>
                        </>
                    )}
                    {/* Existing Popups remain the same */}
                    <CategoryListPopup
                        show={showCategoryPopup}
                        onClose={() => setShowCategoryPopup(false)}
                        categories={categories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        onRefresh={fetchCategories}
                    />

                    <AddCategoryPopup
                        show={showAddCategoryPopup}
                        onClose={() => {
                            setShowAddCategoryPopup(false);
                            setEditingCategory(null);
                        }}
                        onSubmit={handleCategorySubmit}
                        editCategory={editingCategory}
                    />

                    {/* Import Data Popup */}
                    <ImportDataPopup
                        show={showImportPopup}
                        onClose={() => setShowImportPopup(false)}
                        onImport={handleImportData}
                    />
                </div>
            </div>
            {/* CSS for animations */}
            <style jsx>{`
                @keyframes modalAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ManageItems;