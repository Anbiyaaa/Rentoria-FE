// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AxiosInstance from "../../../axiosInstance/axios";
// import SidebarAdmin from "../../../navigation/SidebarAdmin";
// import Header from "../../../navigation/Header";

// const AddCategory = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: "",
//         gambar: null
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         setFormData({ ...formData, gambar: e.target.files[0] });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         try {
//             const data = new FormData();
//             data.append("name", formData.name);
//             if (formData.gambar) {
//                 data.append("gambar", formData.gambar);
//             }

//             const response = await AxiosInstance.post("/api/categories", data, {
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 }
//             });

//             setSuccess("Kategori berhasil ditambahkan!");
//             console.log("Kategori Ditambahkan:", response.data);
            
//             setTimeout(() => {
//                 navigate("/admin/manageCategories");
//             }, 2000);
//         } catch (error) {
//             console.error("Error adding category:", error);
//             setError("Gagal menambahkan kategori. Silakan coba lagi.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex h-screen">
//             <SidebarAdmin />
//             <div className="flex-1 overflow-auto">
//                 <Header />
//                 <div className="p-6">
//                     <h2 className="text-2xl font-bold mb-6">Tambah Kategori</h2>
//                     {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//                     {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
//                     <div className="bg-white p-6 rounded-lg shadow">
//                         <form onSubmit={handleSubmit}>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Nama Kategori</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     className="w-full border rounded px-3 py-2"
//                                     required
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Gambar Kategori</label>
//                                 <input
//                                     type="file"
//                                     name="gambar"
//                                     onChange={handleFileChange}
//                                     className="w-full border rounded px-3 py-2"
//                                     accept="image/*"
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-3 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => navigate("/admin/manageCategories")}
//                                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//                                 >
//                                     Batal
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                                     disabled={loading}
//                                 >
//                                     {loading ? "Menyimpan..." : "Simpan Kategori"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddCategory;
