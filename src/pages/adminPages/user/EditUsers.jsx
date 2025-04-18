import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../navigation/AdminHeader";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Save, AlertCircle } from "lucide-react";
import SidebarAdmin from "../../../navigation/SidebarAdmin";
import AxiosInstance from "../../../axiosInstance/axios";
import Loading from "../../../component/Loading";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Current userId:", userId);
    
    const fetchUser = async () => {
      // Check if userId is undefined or null
      if (!userId) {
        setError("ID pengguna tidak ditemukan.");
        setFetchLoading(false);
        return;
      }
      
      try {
        const response = await AxiosInstance.get(`/api/admin/users/${userId}`);
        const userData = response.data.user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          password_confirmation: "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Gagal mengambil data pengguna.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nama tidak boleh kosong";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    // Only validate password if it's being changed
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }
      
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Konfirmasi password tidak sesuai";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // Only include password in the request if it's being changed
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }
      
      await AxiosInstance.put(`/api/admin/users/${userId}`, updateData);
      toast.success("Pengguna berhasil diperbarui!", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/admin/user");
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error);
      const responseErrors = error.response?.data?.errors;
      if (responseErrors) {
        setErrors(responseErrors);
      } else {
        toast.error("Gagal memperbarui pengguna");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarAdmin />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarAdmin />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700 max-w-md">
              <AlertCircle size={20} className="mr-2" />
              {error}
              <button
                onClick={() => navigate("/admin/user")}
                className="ml-4 px-3 py-1 bg-white border border-red-300 rounded-md text-red-600 text-sm hover:bg-red-50"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster />
      <SidebarAdmin />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate("/admin/user")}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                Edit Pengguna
              </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="contoh@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Kosongkan password jika tidak ingin mengubahnya
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border ${
                            errors.password ? "border-red-300" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          placeholder="Minimal 6 karakter"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${
                            errors.password_confirmation ? "border-red-300" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          placeholder="Masukkan password yang sama"
                        />
                      </div>
                      {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password_confirmation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/user")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors mr-3"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;