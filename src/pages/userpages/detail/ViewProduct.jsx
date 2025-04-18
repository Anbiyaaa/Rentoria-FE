import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaShoppingCart,
    FaBox,
    FaCalendarAlt,
    FaTag,
    FaHeart,
    FaShare,
    FaCheckCircle,
    FaStar,
    FaInfoCircle
} from "react-icons/fa";
import Header from "../../../navigation/Header";
import Sidebar from "../../../navigation/SidebarUser";
import Loading from "../../../component/Loading";
import AxiosInstance from "../../../axiosInstance/axios";
import toast, { Toaster } from 'react-hot-toast'; // Import Hot Toast

const UserViewItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [rentalDuration, setRentalDuration] = useState("1_hari"); // Default to 1 day
    const [isFavorite, setIsFavorite] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    // Calculate total price based on selected duration and quantity
    const getTotalPrice = () => {
        if (!item) return 0;

        let price;
        switch (rentalDuration) {
            case "12_jam":
                price = item.price_12_jam;
                break;
            case "1_hari":
                price = item.price_1_hari;
                break;
            case "2_hari":
                price = item.price_2_hari;
                break;
            default:
                price = item.price_1_hari;
        }

        return price * quantity;
    };

    // State for rental form
    const [rentalForm, setRentalForm] = useState({
        user_id: 2, // Replace with actual user ID from auth
        data_barang_id: "",
        start_date: "",
        durasi: "1_hari",
        tambah_tv: false,
        lokasi_pengantaran: "",
        total_price: 0
    });

    const [selectedDuration, setSelectedDuration] = useState("1_hari");

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
                toast.error("Gagal memuat detail barang. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(!isFavorite ? "Ditambahkan ke favorit" : "Dihapus dari favorit", {
            icon: !isFavorite ? '❤️' : '💔'
        });
    };

    const getPriceByDuration = (product, duration) => {
        if (!product) return 0;

        switch (duration) {
            case "12_jam":
                return product.price_12_jam;
            case "1_hari":
                return product.price_1_hari;
            case "2_hari":
                return product.price_2_hari;
            default:
                return product.price_1_hari;
        }
    };

    const handleRentClick = (product, e) => {
        e.stopPropagation();
        setSelectedProduct(product);

        const today = new Date();
        const formattedDate = formatDate(today);

        const basePrice = product.price_1_hari;

        setRentalForm({
            ...rentalForm,
            data_barang_id: product.id,
            start_date: formattedDate,
            durasi: "1_hari",
            total_price: calculateTotalPrice(basePrice, "1_hari", false)
        });

        setSelectedDuration("1_hari");
        setCheckoutOpen(true);

        // Show toast notification when rent button is clicked
        toast.success('Membuka formulir penyewaan', {
            icon: '📝',
            position: 'top-right'
        });
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const calculateEndDate = (startDate, durasi) => {
        const [year, month, day] = startDate.split('-');
        const date = new Date(year, parseInt(month) - 1, day);

        const durationParts = durasi.split('_');
        const value = parseInt(durationParts[0]);
        const unit = durationParts[1];

        if (unit === 'jam') {
            date.setHours(date.getHours() + value);
        } else if (unit === 'hari') {
            date.setDate(date.getDate() + value);
        }

        return formatDate(date);
    };

    const calculateTotalPrice = (basePrice, durasi, tambahTV) => {
        let total = basePrice;

        if (durasi !== "12_jam" && durasi !== "1_hari" && selectedProduct) {
            total = selectedProduct.price_2_hari;
        }

        if (tambahTV) {
            total += 20000;
        }

        return total;
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setRentalForm(prev => {
                const newForm = { ...prev, [name]: checked };
                if (name === 'tambah_tv') {
                    const basePrice = getPriceByDuration(selectedProduct, newForm.durasi);
                    newForm.total_price = calculateTotalPrice(
                        basePrice,
                        newForm.durasi,
                        checked
                    );
                    // Show toast when TV is added/removed
                    toast(checked ? 'TV ditambahkan (+Rp 20.000)' : 'TV dihapus', {
                        icon: checked ? '📺➕' : '📺➖',
                        duration: 1500
                    });
                }
                return newForm;
            });
        } else {
            setRentalForm(prev => {
                const newForm = { ...prev, [name]: value };

                if (name === 'durasi') {
                    setSelectedDuration(value);
                    const basePrice = getPriceByDuration(selectedProduct, value);
                    newForm.total_price = calculateTotalPrice(
                        basePrice,
                        value,
                        newForm.tambah_tv
                    );
                }

                return newForm;
            });
        }
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setRentalForm(prev => {
            const newForm = { ...prev, [name]: value };

            if (name === 'durasi') {
                setSelectedDuration(value);
                const basePrice = getPriceByDuration(selectedProduct, value);
                newForm.total_price = calculateTotalPrice(
                    basePrice,
                    value,
                    newForm.tambah_tv
                );
                // Show toast when duration changes
                toast(`Durasi diubah: ${value === "12_jam" ? "12 Jam" : value === "1_hari" ? "1 Hari" : "2 Hari"}`, {
                    icon: '⏱️',
                    duration: 1500
                });
            }

            return newForm;
        });
    };

    const handleRentalSubmit = async () => {
        if (!rentalForm.lokasi_pengantaran) {
            toast.error('Mohon isi alamat pengantaran.', {
                icon: '📍'
            });
            return;
        }

        if (!rentalForm.start_date) {
            toast.error('Mohon pilih tanggal mulai sewa.', {
                icon: '📅'
            });
            return;
        }

        try {
            const rentalData = {
                ...rentalForm,
                status: "pending",
                end_date: calculateEndDate(rentalForm.start_date, rentalForm.durasi)
            };

            const loadingToast = toast.loading('Memproses penyewaan...');

            const response = await AxiosInstance.post('/api/rentals', rentalData);

            toast.dismiss(loadingToast);
            setCheckoutOpen(false);

            toast.success(
                <div>
                    <b>Berhasil menyewa barang!</b>
                    <p>Mengalihkan ke halaman pembayaran...</p>
                </div>,
                {
                    duration: 3000,
                    icon: '🎉',
                }
            );

            setRentalForm({
                user_id: 2,
                data_barang_id: "",
                start_date: "",
                durasi: "1_hari",
                tambah_tv: false,
                lokasi_pengantaran: "",
                total_price: 0
            });

            // Redirect to myRental page after a short delay
            setTimeout(() => {
                navigate('/myRental');
            }, 2000);

        } catch (err) {
            console.error('Error submitting rental:', err);
            toast.error('Gagal menyewa barang. Silakan coba lagi.', {
                icon: '❌'
            });
        }
    };

    const closeCheckout = () => {
        setCheckoutOpen(false);
        toast('Formulir penyewaan ditutup', {
            icon: '👋'
        });
    };

    const isAvailable = (product) => {
        return product.jumlah_barang > 0;
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <Header />
                {/* Add Toaster component for notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        // Define default options
                        className: '',
                        duration: 3000,
                        style: {
                            background: '#ffffff',
                            color: '#1f2937',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '14px',
                        },
                        // Default options for specific types
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#ffffff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#ffffff',
                            },
                        },
                        loading: {
                            duration: 0, // Infinite until manually dismissed
                        },
                    }}
                />
                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className=" bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                ) : (
                    <div className="container mx-auto p-6 max-w-7xl">
                        <button
                            onClick={() => navigate("/catalog")}
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            <span>Kembali ke Katalog</span>
                        </button>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">{error}</div>
                        ) : item ? (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* LEFT */}
                                    <div className="p-6 lg:p-8">
                                        <div className="relative">
                                            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
                                                {item.gambar ? (
                                                    <img src={item.gambar} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <FaBox className="text-gray-400 text-5xl" />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={toggleFavorite}
                                                className={`absolute top-4 right-4 p-2 rounded-full shadow-md ${isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:text-red-500"
                                                    }`}
                                            >
                                                <FaHeart className="text-xl" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                                                {item.tipe}
                                            </span>
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                                                {item.category?.name || "Uncategorized"}
                                            </span>
                                            {item.jumlah_barang > 0 ? (
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                                    <FaCheckCircle className="mr-1" />
                                                    Tersedia
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                                                    Tidak Tersedia
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-6 border-t pt-4">
                                            <button
                                                className="flex items-center text-gray-600 hover:text-blue-600"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    toast.success('Link berhasil disalin!', {
                                                        icon: '🔗'
                                                    });
                                                }}
                                            >
                                                <FaShare className="mr-2" />
                                                Bagikan
                                            </button>
                                            <div className="flex items-center">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm text-gray-600">(24 ulasan)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="p-6 lg:p-8 bg-gray-50 border-t lg:border-t-0 lg:border-l">
                                        <div className="mb-6">
                                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h1>
                                            <div className="flex items-baseline mt-4">
                                                <span className="text-3xl font-bold text-blue-600">
                                                    {formatCurrency(getPriceByDuration(item, rentalDuration))}
                                                </span>
                                                <span className="ml-2 text-gray-600">
                                                    / {rentalDuration === "12_jam" ? "12 jam" : rentalDuration === "1_hari" ? "1 hari" : "2 hari"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi</h3>
                                            <p className="text-gray-700">{item.deskripsi || "Tidak ada deskripsi tersedia."}</p>
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pilihan Durasi Sewa</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {["12_jam", "1_hari", "2_hari"].map((durasi) => (
                                                    <button
                                                        key={durasi}
                                                        onClick={() => {
                                                            setRentalDuration(durasi);
                                                            toast(`Durasi sewa diubah: ${durasi === "12_jam" ? "12 Jam" : durasi === "1_hari" ? "1 Hari" : "2 Hari"}`, {
                                                                icon: '⏱️',
                                                                duration: 1500
                                                            });
                                                        }}
                                                        className={`p-3 rounded-lg border-2 text-center transition-all ${rentalDuration === durasi
                                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                                            : "border-gray-200 hover:border-blue-200"
                                                            }`}
                                                    >
                                                        <div className="font-medium text-blue-400">
                                                            {durasi === "12_jam" ? "12 Jam" : durasi === "1_hari" ? "1 Hari" : "2 Hari"}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatCurrency(item[`price_${durasi}`])}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Jumlah</h3>
                                            <div className="flex items-center text-black">
                                                <button
                                                    onClick={() => {
                                                        setQuantity(Math.max(1, quantity - 1));
                                                        toast(`Jumlah: ${Math.max(1, quantity - 1)}`, {
                                                            duration: 1000
                                                        });
                                                    }}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={item.jumlah_barang}
                                                    value={quantity}
                                                    onChange={(e) => {
                                                        const newQuantity = Math.min(item.jumlah_barang, Math.max(1, parseInt(e.target.value) || 1));
                                                        setQuantity(newQuantity);
                                                        toast(`Jumlah: ${newQuantity}`, {
                                                            duration: 1000
                                                        });
                                                    }}
                                                    className="w-16 text-center py-2 border-t border-b border-gray-200"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newQuantity = Math.min(item.jumlah_barang, quantity + 1);
                                                        setQuantity(newQuantity);
                                                        toast(`Jumlah: ${newQuantity}`, {
                                                            duration: 1000
                                                        });
                                                    }}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                                                >
                                                    +
                                                </button>
                                                <span className="ml-3 text-sm text-gray-600">{item.jumlah_barang} tersedia</span>
                                            </div>
                                        </div>

                                        {item.jumlah_barang <= 5 && item.jumlah_barang > 0 && (
                                            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                                <div className="flex">
                                                    <FaInfoCircle className="text-yellow-500 mr-3" />
                                                    <p className="text-sm text-yellow-700">
                                                        Stok terbatas! Hanya tersisa {item.jumlah_barang} unit.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-8 bg-white p-4 rounded-lg border">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-700">Total Harga:</span>
                                                <span className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(getTotalPrice())}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => handleRentClick(item, e)}
                                                disabled={!isAvailable(item)}
                                                className={`py-3 px-6 rounded-lg font-medium transition-colors w-full ${isAvailable(item)
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                                            >
                                                {isAvailable(item) ? "Sewa Sekarang" : "Tidak Tersedia"}
                                            </button>
                                        </div>

                                        <div className="mt-6 text-sm text-gray-600 flex items-start">
                                            <FaInfoCircle className="text-gray-500 mr-2 mt-0.5" />
                                            <p>Barang harus dikembalikan dalam kondisi yang sama. Keterlambatan pengembalian akan dikenakan biaya tambahan.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tambahan: Syarat & Cara Menyewa */}
                                <div className="border-t px-6 py-8">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Syarat & Ketentuan</h3>
                                    <ul className="list-disc ml-6 text-gray-700 space-y-2">
                                        <li>Pengembalian tepat waktu sangat dianjurkan untuk menghindari denda keterlambatan.</li>
                                        <li>Kerusakan atau kehilangan barang selama masa sewa menjadi tanggung jawab penyewa.</li>
                                        <li>Barang harus dikembalikan dalam kondisi yang sama seperti saat diterima.</li>
                                    </ul>

                                    <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Cara Menyewa</h3>
                                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                                        <li>Pilih durasi sewa dan jumlah barang.</li>
                                        <li>Klik tombol <strong>"Sewa Sekarang"</strong>.</li>
                                        <li>Lakukan konfirmasi dan pembayaran melalui halaman sewa Anda.</li>
                                        <li>Tunggu konfirmasi dari admin dan ambil barang sesuai jadwal.</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
                                Barang tidak ditemukan.
                            </div>
                        )}
                    </div>
                )}
                {/* Checkout Modal */}
                {checkoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-sm transition duration-300">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-fadeIn border-4 border-teal-200">
                            {/* Modal Header */}
                            <div className="p-5 border-b border-teal-100 bg-gradient-to-r from-blue-500 to-teal-500">
                                <h3 className="text-xl font-bold text-white">Checkout Sewa Barang</h3>
                                <button
                                    onClick={closeCheckout}
                                    className="absolute top-4 right-4 text-white hover:text-teal-200 transition duration-300 text-xl"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Modal Body */}
                            {selectedProduct && (
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-teal-50 p-3 rounded-xl">
                                        {selectedProduct.gambar && (
                                            <img
                                                src={selectedProduct.gambar}
                                                alt={selectedProduct.name}
                                                className="w-20 h-20 object-cover rounded-lg shadow-md"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg text-teal-700">{selectedProduct.name}</h3>
                                            <p className="text-blue-600">Rp {selectedProduct.price_1_hari.toLocaleString()} / hari</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="start_date" className="block text-sm font-bold text-slate-700 mb-1">
                                                Tanggal Mulai Sewa
                                            </label>
                                            <input
                                                id="start_date"
                                                name="start_date"
                                                type="date"
                                                value={rentalForm.start_date ? rentalForm.start_date : ''}
                                                onChange={(e) => {
                                                    const dateValue = e.target.value;
                                                    setRentalForm(prev => ({
                                                        ...prev,
                                                        start_date: dateValue
                                                    }));
                                                    toast.success(`Tanggal sewa: ${dateValue}`, {
                                                        icon: '📅'
                                                    });
                                                }}
                                                className="w-full rounded-lg border-2 border-teal-200 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-teal-50 text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="durasi" className="block text-sm font-bold text-teal-700 mb-1">
                                                Durasi Sewa
                                            </label>
                                            <select
                                                id="durasi"
                                                name="durasi"
                                                value={rentalForm.durasi}
                                                onChange={handleSelectChange}
                                                className="w-full rounded-lg border-2 border-teal-200 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-teal-50 text-slate-800"
                                            >
                                                {selectedProduct.price_12_jam && (
                                                    <option value="12_jam">12 Jam</option>
                                                )}
                                                <option value="1_hari">1 Hari</option>
                                                <option value="2_hari">2 Hari</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border-2 border-green-100">
                                            <input
                                                type="checkbox"
                                                id="tambah_tv"
                                                name="tambah_tv"
                                                checked={rentalForm.tambah_tv}
                                                onChange={handleFormChange}
                                                className="h-5 w-5 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                                            />
                                            <label htmlFor="tambah_tv" className="text-sm font-bold text-green-700">
                                                Tambah TV (+Rp 20.000)
                                            </label>
                                        </div>

                                        <div>
                                            <label htmlFor="lokasi_pengantaran" className="block text-sm font-bold text-teal-700 mb-1">
                                                Alamat Pengantaran
                                            </label>
                                            <input
                                                id="lokasi_pengantaran"
                                                name="lokasi_pengantaran"
                                                type="text"
                                                value={rentalForm.lokasi_pengantaran}
                                                onChange={handleFormChange}
                                                placeholder="Masukkan alamat lengkap"
                                                className="w-full rounded-lg border-2 border-teal-200 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-teal-50 text-slate-800"
                                            />
                                        </div>

                                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-teal-100 border border-teal-200 shadow-inner">
                                            <h4 className="font-bold text-blue-800 mb-3 text-lg">Ringkasan Biaya</h4>
                                            <div className="flex justify-between mb-2 text-teal-700">
                                                <span className="font-medium">
                                                    {selectedDuration === "12_jam" ? "12 Jam" :
                                                        `${selectedDuration.split('_')[0]} Hari`}
                                                </span>
                                                <span className="font-bold">
                                                    Rp {getPriceByDuration(selectedProduct, selectedDuration).toLocaleString()}
                                                </span>
                                            </div>
                                            {rentalForm.tambah_tv && (
                                                <div className="flex justify-between mb-2 text-teal-700">
                                                    <span className="font-medium">Tambahan TV</span>
                                                    <span className="font-bold">Rp 20.000</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold mt-3 pt-3 border-t border-teal-300 text-lg text-blue-900">
                                                <span>Total</span>
                                                <span>Rp {rentalForm.total_price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="p-5 border-t border-teal-100 bg-gradient-to-r from-blue-50 to-teal-50 flex justify-end space-x-3">
                                <button
                                    onClick={closeCheckout}
                                    className="py-3 px-6 rounded-lg font-bold text-teal-700 bg-white border-2 border-teal-300 shadow-sm hover:bg-teal-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleRentalSubmit}
                                    className="py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserViewItem;