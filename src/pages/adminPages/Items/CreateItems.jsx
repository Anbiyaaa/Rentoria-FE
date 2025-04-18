import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../axiosInstance/axios";
import SidebarAdmin from "../../../navigation/SidebarAdmin";
import Header from "../../../navigation/AdminHeader";

const CreateItems = () => {
    const [formData, setFormData] = useState({
        name: "",
        tipe: "",
        deskripsi: "",
        jumlah_barang: "",
        category_id: "",
        price_12_jam: "",
        price_1_hari: "",
        price_2_hari: ""
    });
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const navigate = useNavigate();

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setFetchingCategories(true);
        try {
            const response = await AxiosInstance.get("/api/categories");
            if (Array.isArray(response.data)) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        category_id: response.data[0].id
                    }));
                }
            } else if (response.data.data && Array.isArray(response.data.data)) {
                setCategories(response.data.data);
                if (response.data.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        category_id: response.data.data[0].id
                    }));
                }
            } else {
                console.error("Unexpected categories data format:", response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setFetchingCategories(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== "") {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Menambahkan file gambar jika ada
            if (imageFile) {
                formDataToSend.append("gambar", imageFile);
            }
            
            const response = await AxiosInstance.post("/api/barang", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log("Success:", response.data);
            navigate("/admin/manageItems");
        } catch (error) {
            console.error("Error creating item:", error);
            if (error.response) {
                console.error("Error details:", error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SidebarAdmin />
            <div className="flex-1 overflow-auto">
                <Header />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Tambah Barang Baru</h2>
                        <button 
                            onClick={() => navigate("/admin/manageItems")}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-500 px-6 py-4">
                            <h3 className="text-white text-lg font-medium">Detail Informasi Barang</h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Nama Barang</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Masukkan nama barang"
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Deskripsi</label>
                                        <textarea 
                                            name="deskripsi" 
                                            value={formData.deskripsi} 
                                            onChange={handleChange} 
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Masukkan deskripsi barang"
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Kategori</label>
                                        {fetchingCategories ? (
                                            <div className="flex items-center space-x-2 text-gray-500">
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Loading categories...</span>
                                            </div>
                                        ) : (
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name || 'Category ' + category.id}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {categories.length === 0 && !fetchingCategories && (
                                            <p className="mt-2 text-sm text-red-600">
                                                Tidak ada kategori tersedia. Silakan tambah kategori terlebih dahulu.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Right column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Upload Gambar</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="image-upload"
                                                required 
                                            />
                                            <label 
                                                htmlFor="image-upload"
                                                className="cursor-pointer flex flex-col items-center justify-center"
                                            >
                                                {imagePreview ? (
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Preview" 
                                                        className="h-40 object-contain mb-2" 
                                                    />
                                                ) : (
                                                    <div className="text-gray-500 mb-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600">
                                                    {imagePreview ? "Ganti Gambar" : "Pilih Gambar"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Jumlah Barang</label>
                                            <div className="relative">
                                                <input 
                                                    type="number" 
                                                    name="jumlah_barang"
                                                    value={formData.jumlah_barang} 
                                                    onChange={handleChange} 
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                    min="1"
                                                    placeholder="0"
                                                    required 
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                                    <span>pcs</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Harga 12 Jam</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                                    <span>Rp</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    name="price_12_jam" 
                                                    value={formData.price_12_jam} 
                                                    onChange={handleChange} 
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                    min="0"
                                                    placeholder="0"
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Harga 1 Hari</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                                    <span>Rp</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    name="price_1_hari" 
                                                    value={formData.price_1_hari} 
                                                    onChange={handleChange} 
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                    min="0"
                                                    placeholder="0"
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Harga 2 Hari</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                                    <span>Rp</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    name="price_2_hari" 
                                                    value={formData.price_2_hari} 
                                                    onChange={handleChange} 
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                    min="0"
                                                    placeholder="0"
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 mt-8 pt-5 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => navigate("/admin/manageItems")} 
                                    className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading || categories.length === 0} 
                                    className={`px-5 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${(loading || categories.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </span>
                                    ) : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateItems;