import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance/axios';
import Loading from "../../component/Loading";
import Header from "../../navigation/Header";
import SidebarUser from "../../navigation/SidebarUser";
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [rentals, setRentals] = useState([]);
    const [pendingRentals, setPendingRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const navigate = useNavigate();

    // Fetch rentals when component mounts
    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await axios.get('/api/rentals/my');
                setRentals(response.data);

                // Filter hanya status: pending, approved, rejected
                const filtered = response.data.filter(rental =>
                    ['pending', 'approved', 'rejected'].includes(rental.status.toLowerCase())
                );
                setPendingRentals(filtered);

                setLoading(false);
            } catch (err) {
                setError('Gagal memuat data rental.');
                setLoading(false);
                console.error('Error fetching rentals:', err);
            }
        };

        fetchRentals();
    }, []);


    // Load Midtrans script
    useEffect(() => {
        if (!document.querySelector("script[src='https://app.sandbox.midtrans.com/snap/snap.js']")) {
            const script = document.createElement("script");
            script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute("data-client-key", "SB-Mid-client-fdbzfMseqvX6M_Ti");
            script.async = true;
            script.onload = () => console.log("Snap.js Loaded!");
            document.body.appendChild(script);
        }
    }, []);

    // Format date to display in Indonesia format (DD-MM-YYYY)
    const formatDisplayDate = (dateString) => {
        if (!dateString) return "-";
        const datePart = dateString.split(" ")[0];
        const [year, month, day] = datePart.split("-");
        return `${day}-${month}-${year}`;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `Rp ${Number(amount).toLocaleString('id-ID')}`;
    };

    // Get status badge color based on status
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            case 'complete':
                return 'bg-blue-100 text-blue-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Handle payment process
    const handlePayment = async (rental) => {
        setProcessingPayment(true);
        setSelectedRental(rental);

        try {
            const response = await axios.post(`/api/customer/payments/generate/${rental.id}`);

            if (response.data.token) {
                window.snap.pay(response.data.token, {
                    onSuccess: async function (result) {
                        alert("Pembayaran berhasil!");
                        const updatedResponse = await axios.get('/api/rentals/my');
                        setRentals(updatedResponse.data);

                        // Update pending rentals after successful payment
                        const filtered = updatedResponse.data.filter(rental =>
                            rental.status.toLowerCase() === 'pending'
                        );
                        setPendingRentals(filtered);

                        setProcessingPayment(false);
                    },
                    onPending: function (result) {
                        alert("Menunggu pembayaran.");
                        setProcessingPayment(false);
                    },
                    onError: function (result) {
                        alert("Pembayaran gagal.");
                        setProcessingPayment(false);
                    },
                    onClose: function () {
                        setProcessingPayment(false);
                    }
                });
            } else {
                alert("Gagal memproses pembayaran. Token tidak diterima.");
                setProcessingPayment(false);
            }
        } catch (err) {
            console.error("Error processing payment:", err);
            alert("Gagal memproses pembayaran. Silakan coba lagi.");
            setProcessingPayment(false);
        }
    };

    if (error) {
        return (
            <div className="flex h-screen bg-gradient-to-b from-blue-50 to-teal-50">
                <SidebarUser />
                <div className="flex-1 overflow-auto">
                    <Header />
                    <div className="container mx-auto p-6">
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-b from-blue-50 to-teal-50">
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
                    <div className="container mx-auto p-4 md:p-6">
                        <>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="bg-gradient-to-r from-teal-500 to-green-500 py-3 px-4">
                                    <h1 className="text-xl font-bold text-white">Daftar Pembayaran Rental Status Pending</h1>
                                </div>

                                {pendingRentals.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="mb-4 text-5xl text-teal-500">✓</div>
                                        <h2 className="text-xl font-bold text-teal-700 mb-4">Tidak Ada Rental dengan Status Pending</h2>
                                        <p className="text-gray-600 mb-6">Semua rental Anda telah diproses atau Anda belum memiliki rental dengan status pending.</p>
                                        <button
                                            onClick={() => navigate('/catalog')}
                                            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition duration-300"
                                        >
                                            Lihat Katalog
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 text-left">
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Barang</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Periode Sewa</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Total</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {pendingRentals.map((rental) => (
                                                    <tr key={rental.id} className="hover:bg-gray-50">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center space-x-3">
                                                                {rental.barang?.gambar && (
                                                                    <img
                                                                        src={rental.data_barang.gambar}
                                                                        alt={rental.data_barang.name}
                                                                        className="h-12 w-12 object-cover rounded"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div className="font-medium text-gray-800">{rental.data_barang?.name || 'Barang Rental'}</div>
                                                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                                                        {rental.data_barang?.deskripsi?.substring(0, 60) || 'Deskripsi tidak tersedia'}
                                                                        {rental.data_barang?.deskripsi?.length > 60 ? '...' : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="text-sm text-slate-600">
                                                                <div>{formatDisplayDate(rental.start_date)}</div>
                                                                <div className="text-gray-500">s/d</div>
                                                                <div>{formatDisplayDate(rental.end_date)}</div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="font-medium text-gray-900">
                                                                {formatCurrency(rental.total_price)}
                                                            </div>
                                                            {rental.tambah_tv && (
                                                                <div className="text-xs text-gray-500">Termasuk TV</div>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2 py-1 ${getStatusBadgeClass(rental.status)} rounded-full text-xs font-medium`}>
                                                                {rental.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <button
                                                                onClick={() => handlePayment(rental)}
                                                                disabled={processingPayment && selectedRental?.id === rental.id}
                                                                className={`px-3 py-1.5 text-sm rounded-lg font-medium text-white transition duration-300 ${processingPayment && selectedRental?.id === rental.id
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600'
                                                                    }`}
                                                            >
                                                                {processingPayment && selectedRental?.id === rental.id
                                                                    ? 'Memproses...'
                                                                    : 'Bayar Sekarang'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>

                        {pendingRentals.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                <div className="font-medium mb-1">Informasi Pengantaran:</div>
                                <p>Barang akan diantar ke alamat yang sudah Anda daftarkan setelah pembayaran berhasil.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;