import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance/axios';
import Loading from "../../component/Loading";
import Header from "../../navigation/Header";
import SidebarUser from "../../navigation/SidebarUser";
import toast, { Toaster } from 'react-hot-toast';

const ProductCatalog = () => {
    const navigate = useNavigate();
    // State untuk menyimpan daftar barang
    const [products, setProducts] = useState([]);
    // State untuk loading
    const [loading, setLoading] = useState(true);
    // State untuk error
    const [error, setError] = useState(null);

    // State untuk checkout dialog
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    // State untuk menyimpan barang yang dipilih
    const [selectedProduct, setSelectedProduct] = useState(null);

    // State untuk menyimpan data rental pengguna yang masih pending
    const [pendingRentals, setPendingRentals] = useState([]);
    // State untuk mengecek apakah sedang memuat data rental
    const [loadingRentals, setLoadingRentals] = useState(false);

    // State untuk form rental
    const [rentalForm, setRentalForm] = useState({
        user_id: 2,
        data_barang_id: "",
        start_date: "",
        durasi: "1_hari",
        tambah_tv: false,
        lokasi_pengantaran: "",
        metode_pengiriman: "dikirim", // Changed to correct enum value
        total_price: 0
    });

    // State untuk durasi yang dipilih
    const [selectedDuration, setSelectedDuration] = useState("1_hari");

    // Ambil data barang dan rental saat component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setLoadingRentals(true);

                // Fetch products
                const productsResponse = await axios.get('/api/barang');
                setProducts(productsResponse.data);

                // Fetch user rentals (assumed user ID is 2 for now)
                const rentalsResponse = await axios.get('/api/rentals/my');
                // Filter rentals with pending status
                const userPendingRentals = rentalsResponse.data.filter(rental => rental.status === 'pending');
                setPendingRentals(userPendingRentals);

                setLoading(false);
                setLoadingRentals(false);
                toast.success('Data produk berhasil dimuat!');
            } catch (err) {
                setError('Gagal memuat data.');
                setLoading(false);
                setLoadingRentals(false);
                console.error('Error fetching data:', err);
                toast.error('Gagal memuat data');
            }
        };

        fetchData();
    }, []);

    // Fungsi untuk mendapatkan harga berdasarkan durasi
    const getPriceByDuration = (product, duration) => {
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

    // Handle pilih barang untuk rental
    const handleRentClick = (product, e) => {
        e.stopPropagation(); // Prevent event bubbling to the parent element

        // Cek apakah user memiliki rental yang masih pending
        if (pendingRentals.length > 0) {
            toast.error(
                <div className="space-y-2">
                    <div className="font-bold">Tidak dapat melakukan checkout!</div>
                    <div>Anda masih memiliki rentak dengan status pending.</div>
                    <div className="text-sm">Silakan tunggu hingga rental disetujui atau ditolak.</div>
                    <div className="text-sm underline cursor-pointer" onClick={() => navigate('/myRental')}>
                        Lihat rental saya
                    </div>
                </div>,
                {
                    duration: 5000,
                    icon: '🚫',
                }
            );
            return;
        }

        setSelectedProduct(product);

        // Set default dates
        const today = new Date();
        const formattedDate = formatDate(today); // This will now be YYYY-MM-DD

        // Menggunakan price_1_hari sebagai default
        const basePrice = product.price_1_hari;

        setRentalForm({
            ...rentalForm,
            data_barang_id: product.id,
            start_date: formattedDate,
            durasi: "1_hari",
            metode_pengiriman: "dikirim", // Set default to correct enum value
            total_price: calculateTotalPrice(basePrice, "1_hari", false, "dikirim")
        });

        setSelectedDuration("1_hari");
        setCheckoutOpen(true);

        toast.success(`${product.name} dipilih untuk disewa!`, {
            icon: '🛒',
        });
    };

    // Handle navigasi ke detail produk
    const handleProductClick = (productId) => {
        navigate(`/catalog/product/${productId}`);
    };

    // Format tanggal ke format YYYY-MM-DD (SQL friendly)
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    // Hitung tanggal akhir berdasarkan durasi
    const calculateEndDate = (startDate, durasi) => {
        // If startDate is already in YYYY-MM-DD format
        const [year, month, day] = startDate.split('-');
        const date = new Date(year, parseInt(month) - 1, day);

        // Parse duration
        const durationParts = durasi.split('_');
        const value = parseInt(durationParts[0]);
        const unit = durationParts[1];

        if (unit === 'jam') {
            // Add hours
            date.setHours(date.getHours() + value);
        } else if (unit === 'hari') {
            // Add days
            date.setDate(date.getDate() + value);
        }

        // Format as YYYY-MM-DD
        return formatDate(date);
    };

    // Hitung total harga berdasarkan durasi dan tambahan TV
    const calculateTotalPrice = (basePrice, durasi, tambahTV, metodePengiriman) => {
        let total = basePrice;

        // Jika durasi selain 12_jam atau 1_hari, maka gunakan harga per 2 hari
        if (durasi !== "12_jam" && durasi !== "1_hari" && selectedProduct) {
            total = selectedProduct.price_2_hari;
        }

        if (tambahTV) {
            total += 20000; // Tambahan biaya TV
        }

        // Biaya pengiriman hanya jika metode adalah "dikirim"
        if (metodePengiriman === "dikirim") {
            total += 15000; // Biaya pengantaran tetap
        }

        return total;
    };

    // Handle perubahan pada form
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setRentalForm(prev => {
                const newForm = { ...prev, [name]: checked };
                // Recalculate total price when checkbox changes
                if (name === 'tambah_tv') {
                    const basePrice = getPriceByDuration(selectedProduct, newForm.durasi);
                    newForm.total_price = calculateTotalPrice(
                        basePrice,
                        newForm.durasi,
                        checked,
                        newForm.metode_pengiriman
                    );

                    // Show toast when TV is added/removed
                    if (checked) {
                        toast.success('TV berhasil ditambahkan!', {
                            icon: '📺',
                        });
                    }
                }
                return newForm;
            });
        } else {
            setRentalForm(prev => {
                const newForm = { ...prev, [name]: value };

                // Recalculate total price when delivery method changes
                if (name === 'metode_pengiriman') {
                    const basePrice = getPriceByDuration(selectedProduct, newForm.durasi);
                    newForm.total_price = calculateTotalPrice(
                        basePrice,
                        newForm.durasi,
                        newForm.tambah_tv,
                        value
                    );

                    // Reset lokasi_pengantaran if method is "diambil sendiri"
                    if (value === "diambil sendiri") {
                        newForm.lokasi_pengantaran = "";
                    }

                    // Show toast when delivery method changes
                    const metodeName = value === 'dikirim' ? 'Dikirim ke alamat' : 'Diambil sendiri';
                    toast.success(`Metode pengiriman diubah ke ${metodeName}`, {
                        icon: '🚚',
                    });
                }

                return newForm;
            });
        }
    };

    // Handle select change
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setRentalForm(prev => {
            const newForm = { ...prev, [name]: value };

            // Recalculate total price when duration changes
            if (name === 'durasi') {
                setSelectedDuration(value);
                const basePrice = getPriceByDuration(selectedProduct, value);
                newForm.total_price = calculateTotalPrice(
                    basePrice,
                    value,
                    newForm.tambah_tv,
                    newForm.metode_pengiriman
                );

                // Show toast when duration changes
                toast.success(`Durasi diubah menjadi ${value.replace('_', ' ')}`, {
                    icon: '⏱️',
                });
            }

            return newForm;
        });
    };

    // Handle submit rental
    const handleRentalSubmit = async () => {
        // Validate form
        if (rentalForm.metode_pengiriman === "dikirim" && !rentalForm.lokasi_pengantaran) {
            toast.error('Mohon isi alamat pengantaran!', {
                icon: '📍',
            });
            return;
        }

        if (!rentalForm.start_date) {
            toast.error('Mohon pilih tanggal mulai sewa!', {
                icon: '📅',
            });
            return;
        }

        // Cek lagi untuk memastikan user tidak memiliki rental yang masih pending
        try {
            const rentalsResponse = await axios.get('/api/rentals/user/2');
            const userPendingRentals = rentalsResponse.data.filter(rental => rental.status === 'pending');

            if (userPendingRentals.length > 0) {
                toast.error(
                    <div className="space-y-2">
                        <div className="font-bold">Tidak dapat melakukan checkout!</div>
                        <div>Anda masih memiliki pesanan dengan status pending.</div>
                        <div className="text-sm">Silakan tunggu hingga pesanan disetujui atau ditolak.</div>
                        <div className="text-sm underline cursor-pointer" onClick={() => navigate('/myRental')}>
                            Lihat pesanan saya
                        </div>
                    </div>,
                    {
                        duration: 5000,
                        icon: '🚫',
                    }
                );
                return;
            }
        } catch (err) {
            console.error('Error checking pending rentals:', err);
        }

        const loadingToast = toast.loading('Memproses penyewaan...');

        try {
            const rentalData = {
                ...rentalForm,
                status: "pending",
                end_date: calculateEndDate(rentalForm.start_date, rentalForm.durasi)
            };

            console.log("Sending rental data:", rentalData); // Log the data being sent

            const response = await axios.post('/api/rentals', rentalData);

            // Close dialog and show success message
            setCheckoutOpen(false);
            toast.dismiss(loadingToast);
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

            // Reset form
            setRentalForm({
                user_id: 2,
                data_barang_id: "",
                start_date: "",
                durasi: "1_hari",
                tambah_tv: false,
                lokasi_pengantaran: "",
                metode_pengiriman: "dikirim",
                total_price: 0
            });

            // Redirect to myRental page after a short delay
            setTimeout(() => {
                navigate('/myRental');
            }, 2000);

        } catch (err) {
            console.error('Error submitting rental:', err);
            console.error('Error response:', err.response?.data); // Log the server error response
            toast.dismiss(loadingToast);
            toast.error(
                <div>
                    <b>Gagal menyewa barang</b>
                    <p>Silakan coba lagi</p>
                </div>,
                {
                    duration: 5000,
                    icon: '❌',
                }
            );
        }
    };

    // Close checkout dialog
    const closeCheckout = () => {
        setCheckoutOpen(false);
        toast('Penyewaan dibatalkan', {
            icon: '⚠️',
        });
    };

    // Render error state
    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
    }

    // Cek ketersediaan barang
    const isAvailable = (product) => {
        return product.jumlah_barang > 0;
    };

    // Cek apakah customer memiliki rental pending
    const hasPendingRental = pendingRentals.length > 0;

    return (
        <div className="flex h-screen bg-gradient-to-b from-blue-50 to-teal-50">
            {/* Add Toaster component at the root level */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#fff',
                        color: '#1E293B',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#059669',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#DC2626',
                            secondary: '#fff',
                        },
                    },
                    loading: {
                        iconTheme: {
                            primary: '#3B82F6',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <SidebarUser />
            <div className="flex-1 flex flex-col overflow-auto">
                <Header />
                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className=" bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                ) : (
                    <div className="container overflow-y-auto mx-auto p-6">
                        <h1 className="text-3xl font-bold mb-8 text-center text-teal-600 drop-shadow-sm">Katalog Produk</h1>

                        {/* Notifikasi jika pengguna memiliki rental pending */}
                        {hasPendingRental && (
                            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            <span className="font-medium">Perhatian:</span> Anda memiliki pesanan dengan status pending. Anda tidak dapat melakukan checkout baru sampai pesanan tersebut disetujui atau ditolak.
                                        </p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => navigate('/myRental')}
                                                className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
                                            >
                                                Lihat pesanan saya
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid produk */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="rounded-xl shadow-lg h-full flex flex-col overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white border-2 border-teal-200 cursor-pointer"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <div className="p-5 border-b border-teal-100 bg-gradient-to-r from-teal-500 to-green-500">
                                        <h2 className="text-xl font-bold text-white">{product.name}</h2>
                                    </div>
                                    <div className="p-5 flex-grow">
                                        {product.gambar && (
                                            <div className="relative mb-5 overflow-hidden rounded-lg">
                                                <img
                                                    src={product.gambar}
                                                    alt={product.name}
                                                    className="w-full h-56 object-cover rounded-lg transition duration-300 hover:brightness-110"
                                                />
                                                <div className="absolute top-2 right-2 bg-teal-400 text-teal-800 px-3 py-1 rounded-full font-bold text-sm shadow-md">
                                                    Rp {product.price_1_hari.toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-gray-700 mb-4">{product.deskripsi}</p>
                                        <div className="bg-gradient-to-r from-teal-100 to-green-100 p-3 rounded-lg mb-4">
                                            <p className="font-bold text-lg text-teal-700">
                                                Rp {product.price_1_hari.toLocaleString()} / hari
                                            </p>
                                            {product.price_12_jam && (
                                                <p className="text-sm font-medium text-teal-600">
                                                    Rp {product.price_12_jam.toLocaleString()} / 12 jam
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {product.category?.name}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable(product) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isAvailable(product) ? 'Tersedia' : 'Kosong'}
                                            </span>
                                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                                                Stok: {product.jumlah_barang}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 border-t border-teal-100 bg-gradient-to-r from-blue-50 to-teal-50">
                                        <div className="flex space-x-3">
                                            <button
                                                className="flex-1 py-3 px-4 rounded-lg font-bold text-teal-600 border-2 border-teal-300 hover:bg-teal-50 transition duration-300"
                                                onClick={(e) => handleProductClick(product.id, e)}
                                            >
                                                Lihat Detail
                                            </button>
                                            <button
                                                className={`flex-1 py-3 px-4 rounded-lg font-bold text-white transition duration-300 focus:outline-none focus:ring-4 ${isAvailable(product) && !hasPendingRental
                                                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:ring-teal-300'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                disabled={!isAvailable(product) || hasPendingRental}
                                                onClick={(e) => handleRentClick(product, e)}
                                            >
                                                {!isAvailable(product) ? 'Stok Habis' : hasPendingRental ? 'Tidak Tersedia' : 'Sewa'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Checkout Modal */}
                        {checkoutOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-sm transition duration-300">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto relative animate-fadeIn border-4 border-teal-200">
                                    {/* Modal Header */}
                                    <div className="sticky top-0 z-10 p-5 border-b border-teal-100 bg-gradient-to-r from-blue-500 to-teal-500">
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
                                                            // Use the standard YYYY-MM-DD format directly
                                                            const dateValue = e.target.value;
                                                            setRentalForm(prev => ({
                                                                ...prev,
                                                                start_date: dateValue
                                                            }));
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
                                                    <label htmlFor="metode_pengiriman" className="block text-sm font-bold text-teal-700 mb-1">
                                                        Metode Pengambilan
                                                    </label>
                                                    <select
                                                        id="metode_pengiriman"
                                                        name="metode_pengiriman"
                                                        value={rentalForm.metode_pengiriman}
                                                        onChange={handleFormChange}
                                                        className="w-full rounded-lg border-2 border-teal-200 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-teal-50 text-slate-800"
                                                    >
                                                        <option value="dikirim">Dikirim ke alamat (+Rp 15.000)</option>
                                                        <option value="diambil sendiri">Diambil sendiri di toko</option>
                                                    </select>
                                                </div>

                                                {/* Show address form only if "dikirim" is selected */}
                                                {rentalForm.metode_pengiriman === "dikirim" && (
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
                                                )}

                                                {/* Total Price Display */}
                                                <div className="mt-6 bg-gradient-to-r from-blue-100 to-teal-100 p-4 rounded-xl border-2 border-teal-200">
                                                    <h4 className="font-bold text-base text-teal-800 mb-2">Ringkasan Pembayaran</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Harga Sewa ({rentalForm.durasi.replace('_', ' ')})</span>
                                                            <span className="font-medium">Rp {getPriceByDuration(selectedProduct, rentalForm.durasi).toLocaleString()}</span>
                                                        </div>
                                                        {rentalForm.tambah_tv && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Tambahan TV</span>
                                                                <span className="font-medium">Rp 20.000</span>
                                                            </div>
                                                        )}
                                                        {rentalForm.metode_pengiriman === "dikirim" && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Biaya Pengiriman</span>
                                                                <span className="font-medium">Rp 15.000</span>
                                                            </div>
                                                        )}
                                                        <div className="border-t border-teal-300 pt-2 mt-2">
                                                            <div className="flex justify-between font-bold text-base text-teal-800">
                                                                <span>Total</span>
                                                                <span>Rp {rentalForm.total_price.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Modal Footer */}
                                    <div className="p-5 border-t border-teal-100 bg-gradient-to-r from-blue-50 to-teal-50">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={closeCheckout}
                                                className="flex-1 py-3 px-4 rounded-lg font-bold text-teal-600 border-2 border-teal-300 hover:bg-teal-50 transition duration-300"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={handleRentalSubmit}
                                                className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;