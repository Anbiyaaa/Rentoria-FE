import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance/axios";
import SidebarUser from "../../navigation/SidebarUser";
import Header from "../../navigation/Header";
import Loading from "../../component/Loading";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    id: null,
    user_id: null,
    phone: "",
    address: "",
    avatar: null,
    identity_photo: null,
    name_profile: "",
    created_at: null,
    updated_at: null
  });

  const [editProfile, setEditProfile] = useState({
    phone: "",
    address: "",
    name_profile: "",
    avatar: null,
    identity_photo: null,
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [identityPreview, setIdentityPreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [identityError, setIdentityError] = useState(false);
  const [error, setError] = useState(null);
  const [isEmptyProfile, setIsEmptyProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/customer/profile");
      // Handle either response format
      if (response.data.profile) {
        setProfile(response.data.profile);
        checkProfileCompleteness(response.data.profile);
      } else {
        setProfile(response.data);
        checkProfileCompleteness(response.data);
      }
      // Reset error states
      setAvatarError(false);
      setIdentityError(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsEmptyProfile(true);
    } finally {
      setLoading(false);
    }
  };

  // Check if profile is empty or incomplete
  const checkProfileCompleteness = (profileData) => {
    // Check if profile doesn't exist or is missing required fields
    if (!profileData || !profileData.id || 
        (!profileData.name_profile && !profileData.phone && !profileData.address)) {
      setIsEmptyProfile(true);
      setMessage({ 
        type: "warning", 
        text: "Profil Anda belum lengkap. Harap lengkapi profil terlebih dahulu."
      });
      // Auto enter edit mode if profile is empty
      if (!isEditing) {
        setEditProfile({
          phone: profileData?.phone || "",
          address: profileData?.address || "",
          name_profile: profileData?.name_profile || "",
          avatar: null,
          identity_photo: null,
        });

        setAvatarPreview(profileData?.avatar);
        setIdentityPreview(profileData?.identity_photo);
        setIsEditing(true);
      }
    } else {
      setIsEmptyProfile(false);
    }
  };

  const toggleEditMode = () => {
    if (!isEditing) {
      // Enter edit mode
      setEditProfile({
        phone: profile.phone || "",
        address: profile.address || "",
        name_profile: profile.name_profile || "",
        avatar: null,
        identity_photo: null,
      });

      setAvatarPreview(profile.avatar);
      setIdentityPreview(profile.identity_photo);
    }

    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setEditProfile({ ...editProfile, [name]: file });

      const previewUrl = URL.createObjectURL(file);
      if (name === "avatar") {
        setAvatarPreview(previewUrl);
        setAvatarError(false);
      }
      if (name === "identity_photo") {
        setIdentityPreview(previewUrl);
        setIdentityError(false);
      }
    }
  };

  const handleImageError = (type) => {
    if (type === 'avatar') {
      setAvatarError(true);
    } else if (type === 'identity') {
      setIdentityError(true);
    }
  };

  // Added store profile function
  const storeProfile = async () => {
    setLoading(true);
    setMessage(null);
    
    // Validate required fields
    if (!editProfile.name_profile || !editProfile.phone || !editProfile.address) {
      setMessage({ 
        type: "error", 
        text: "Nama, nomor telepon, dan alamat harus diisi." 
      });
      setLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("name_profile", editProfile.name_profile);
      formData.append("phone", editProfile.phone);
      formData.append("address", editProfile.address);
      
      if (editProfile.avatar instanceof File) {
        formData.append("avatar", editProfile.avatar);
      }
      
      if (editProfile.identity_photo instanceof File) {
        formData.append("identity_photo", editProfile.identity_photo);
      }

      const response = await axios.post("/api/customer/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.message) {
        setMessage({ type: "success", text: response.data.message });
      } else {
        setMessage({ type: "success", text: "Profil berhasil disimpan!" });
      }

      // Update profile with new data
      if (response.data.profile) {
        setProfile(response.data.profile);
        setIsEmptyProfile(false);
      } else {
        await fetchProfile();
      }

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error storing profile:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Gagal menyimpan profil." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editProfile.name_profile || !editProfile.phone || !editProfile.address) {
      setMessage({ 
        type: "error", 
        text: "Nama, nomor telepon, dan alamat harus diisi." 
      });
      return;
    }
    
    // Check if profile exists (has ID)
    if (profile.id) {
      // Update existing profile
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("name_profile", editProfile.name_profile);
        formData.append("phone", editProfile.phone);
        formData.append("address", editProfile.address);
        if (editProfile.avatar instanceof File) {
          formData.append("avatar", editProfile.avatar);
        }
        if (editProfile.identity_photo instanceof File) {
          formData.append("identity_photo", editProfile.identity_photo);
        }

        const response = await axios.post("/api/customer/profile/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.message) {
          setMessage({ type: "success", text: response.data.message });
        } else {
          setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        }

        // Update profile with new data
        if (response.data.profile) {
          setProfile(response.data.profile);
          setIsEmptyProfile(false);
        } else {
          await fetchProfile();
        }

        // Exit edit mode
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        setMessage({ 
          type: "error", 
          text: error.response?.data?.message || "Gagal memperbarui profil." 
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Create new profile using store API
      await storeProfile();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to render user avatar
  const renderAvatar = (src, isPreview = false) => {
    if ((src && !avatarError) || (isPreview && src)) {
      return (
        <img
          src={src}
          alt="Foto Profil"
          className="w-full h-full object-cover"
          onError={() => !isPreview && handleImageError('avatar')}
        />
      );
    } else {
      return (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-400 mt-2 text-sm">Tidak ada foto</span>
        </div>
      );
    }
  };

  // Function to render identity photo
  const renderIdentityPhoto = (src, isPreview = false) => {
    if ((src && !identityError) || (isPreview && src)) {
      return (
        <img
          src={src}
          alt="Foto Identitas"
          className="w-full h-full object-cover"
          onError={() => !isPreview && handleImageError('identity')}
        />
      );
    } else {
      return (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-400 mt-2 text-sm">Tidak ada foto identitas</span>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarUser />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium border ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : message.type === "warning"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-red-100 text-red-800 border-red-300"
              }`}>
                {message.text}
              </div>
            )}

            {isEmptyProfile && !isEditing && (
              <div className="bg-blue-50 border border-blue-300 text-blue-800 p-4 rounded-lg mb-6 shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Profil Belum Lengkap</h3>
                    <div className="mt-2 text-sm">
                      <p>Anda belum mengisi data profil. Harap lengkapi profil Anda terlebih dahulu.</p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={toggleEditMode}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                      >
                        Lengkapi Profil Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 mb-10 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Profil Pengguna</h2>
                {!isEmptyProfile && (
                  <button
                    onClick={toggleEditMode}
                    disabled={loading}
                    className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-200 ${loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isEditing
                        ? "bg-white text-blue-600 hover:bg-gray-100"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    {isEditing ? "Batal" : "Edit Profil"}
                  </button>
                )}
              </div>

              {/* Content Section */}
              {loading ? (
                <Loading />
              ) : error ? (
                <div className="p-6 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Kiri - Foto Profil & Identitas */}
                        <div className="space-y-6">
                          <div>
                            <label className="block mb-2 text-sm text-gray-600 font-bold">Foto Profil</label>
                            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border shadow">
                              {renderAvatar(avatarPreview, true)}
                            </div>
                            <input
                              type="file"
                              name="avatar"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="mt-3 text-sm text-gray-500"
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-sm text-gray-600 font-bold">Foto Identitas</label>
                            <div className="w-full aspect-video rounded-lg overflow-hidden border shadow">
                              {renderIdentityPhoto(identityPreview, true)}
                            </div>
                            <input
                              type="file"
                              name="identity_photo"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="mt-3 text-sm text-gray-500"
                            />
                          </div>
                        </div>

                        {/* Kanan - Form Input */}
                        <div className="space-y-4">
                          <div>
                            <label className="block mb-1 text-gray-600 text-sm font-bold">
                              Nama <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name_profile"
                              value={editProfile.name_profile || ""}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 rounded-md border text-gray-700 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 text-gray-600 text-sm font-bold">
                              Nomor Telepon <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="phone"
                              value={editProfile.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 rounded-md border text-gray-700 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 text-gray-600 text-sm font-bold">
                              Alamat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="address"
                              rows="4"
                              value={editProfile.address}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 rounded-md border text-gray-700 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            ></textarea>
                          </div>

                          <div className="pt-4">
                            <button
                              type="submit"
                              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
                            >
                              {profile.id ? "Simpan Perubahan" : "Buat Profil"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Kiri - Foto */}
                      <div className="space-y-6">
                        <div>
                          <label className="block mb-2 text-sm font-bold text-gray-700">Foto Profil</label>
                          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border shadow">
                            {renderAvatar(profile.avatar)}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-bold text-gray-700">Foto Identitas</label>
                          <div className="w-full aspect-video rounded-lg overflow-hidden border shadow">
                            {renderIdentityPhoto(profile.identity_photo)}
                          </div>
                        </div>
                      </div>

                      {/* Kanan - Detail */}
                      <div className="space-y-4 text-sm text-gray-700">
                        <div>
                          <span className="font-bold text-gray-700">Nama</span><br />
                          <span>{profile.name_profile || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-700">Nomor Telepon:</span><br />
                          <span>{profile.phone || "-"}</span>
                        </div>
                        <div className="max-w-md">
                          <span className="font-bold text-gray-700">Alamat:</span><br />
                          <span className="block break-all">{profile.address || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-700">Dibuat:</span><br />
                          <span>{formatDate(profile.created_at)}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-700">Diperbarui:</span><br />
                          <span>{formatDate(profile.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;