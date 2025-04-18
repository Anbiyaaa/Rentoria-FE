import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance/axios';
import Loading from "../../component/Loading";
import Header from "../../navigation/AdminHeader";
import SidebarUser from "../../navigation/SidebarAdmin";
import { useNavigate } from 'react-router-dom';

const RentalHistoryPage = () => {
    const [rentals, setRentals] = useState([]);
    const [completedRentals, setCompletedRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch rentals when component mounts
    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await axios.get('/api/rentals');
                setRentals(response.data);

                // Filter only completed rentals
                const filtered = response.data.filter(rental =>
                    rental.status.toLowerCase() === 'completed'
                );
                setCompletedRentals(filtered);

                setLoading(false);
            } catch (err) {
                setError('Gagal memuat data riwayat rental.');
                setLoading(false);
                console.error('Error fetching rentals:', err);
            }
        };

        fetchRentals();
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
                return 'bg-emerald-100 text-emerald-700';
            case 'rejected':
                return 'bg-rose-100 text-rose-700';
            case 'complete':
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            case 'pending':
                return 'bg-amber-100 text-amber-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Fungsi untuk mentranslate status ke Bahasa Indonesia
    const translateStatus = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'approved':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            case 'complete':
            case 'completed':
                return 'Selesai';
            case 'pending':
                return 'Menunggu';
            default:
                return status;
        }
    };
    if (error) {
        return (
            <div className="flex h-screen bg-slate-50">
                <SidebarUser />
                <div className="flex-1 overflow-auto">
                    <Header />
                    <div className="container mx-auto p-6">
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <SidebarUser />
            <div className="flex-1 flex flex-col overflow-auto">
                <Header />
                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className="bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                ) : (
                    <div className="container mx-auto p-4 md:p-6">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
                                <h1 className="text-2xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Riwayat Rental Selesai
                                </h1>
                            </div>

                            {completedRentals.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="mb-6 text-6xl text-indigo-500">📋</div>
                                    <h2 className="text-2xl font-bold text-indigo-700 mb-4">Belum Ada Riwayat Rental Selesai</h2>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Anda belum memiliki rental yang telah selesai. Mulai sewa barang untuk melihat riwayat di sini.</p>
                                    <button
                                        onClick={() => navigate('/catalog')}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-300 flex items-center mx-auto"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                        Lihat Katalog
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-100 text-left">
                                                <th className="py-4 px-6 font-semibold text-slate-700">Barang</th>
                                                <th className="py-4 px-6 font-semibold text-slate-700">Periode Sewa</th>
                                                <th className="py-4 px-6 font-semibold text-slate-700">Total</th>
                                                <th className="py-4 px-6 font-semibold text-slate-700">Status</th>
                                                <th className="py-4 px-6 font-semibold text-slate-700">Tanggal Selesai</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {completedRentals.map((rental) => (
                                                <tr key={rental.id} className="hover:bg-slate-50 transition duration-150">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-4">
                                                            {rental.data_barang?.gambar && (
                                                                <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                                                    <img
                                                                        src={rental.data_barang.gambar}
                                                                        alt={rental.data_barang.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-medium text-slate-800 text-lg">{rental.data_barang?.name || 'Barang Rental'}</div>
                                                                <div className="text-sm text-slate-500 truncate max-w-xs mt-1">
                                                                    {rental.data_barang?.deskripsi?.substring(0, 60) || 'Deskripsi tidak tersedia'}
                                                                    {rental.data_barang?.deskripsi?.length > 60 ? '...' : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex flex-col text-slate-600">
                                                            <div className="flex items-center space-x-2">
                                                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span>{formatDisplayDate(rental.start_date)}</span>
                                                            </div>
                                                            <div className="text-slate-400 text-sm my-1">hingga</div>
                                                            <div className="flex items-center space-x-2">
                                                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span>{formatDisplayDate(rental.end_date)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="font-bold text-slate-800">
                                                            {formatCurrency(rental.total_price)}
                                                        </div>
                                                        {rental.tambah_tv && (
                                                            <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded mt-1 inline-block">
                                                                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                Termasuk TV
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1.5 ${getStatusBadgeClass(rental.status)} rounded-full text-xs font-semibold inline-flex items-center`}>
                                                            <span className={`w-2 h-2 mr-1.5 rounded-full ${rental.status.toLowerCase() === 'completed' ? 'bg-blue-500' : 'bg-current'}`}></span>
                                                            {translateStatus(rental.status)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="text-slate-600 flex items-center">
                                                            <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            {rental.completed_date ?
                                                                formatDisplayDate(rental.completed_date) :
                                                                formatDisplayDate(rental.end_date)
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {completedRentals.length > 0 && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-sm text-indigo-700 flex items-start shadow-sm">
                                <svg className="w-6 h-6 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <div className="font-medium mb-1">Informasi Riwayat Rental:</div>
                                    <p>Halaman ini menampilkan semua rental Anda yang telah selesai. Terima kasih telah menggunakan layanan kami.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RentalHistoryPage;