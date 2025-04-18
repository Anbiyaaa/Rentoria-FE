import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Footer from "../../component/Footer";
import { Chart as ChartJS } from "chart.js/auto";
import AxiosInstance from "../../axiosInstance/axios";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../../component/Loading";
import Header from "../../navigation/Header";
import SidebarUser from "../../navigation/SidebarUser"; // Assuming you have a SidebarUser component

const UserDashboard = () => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(true);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [loanedItemsCount, setLoanedItemsCount] = useState(0);
    const [myLoanedItemsCount, setMyLoanedItemsCount] = useState(0);
    const [totalItemValue, setTotalItemValue] = useState(0);
    const [apiResponseReceived, setApiResponseReceived] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        const showLoginSuccess = localStorage.getItem("showLoginSuccess");

        if (showLoginSuccess === "true") {
            toast.success('Login berhasil!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#5C3B2E',
                    color: '#fff',
                    border: '1px solid #D2AB7C',
                },
                icon: '✅',
            });

            localStorage.removeItem("showLoginSuccess");
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            // Set only initial loading to false quickly to show layout
            setTimeout(() => setInitialLoading(false), 100);

            // Content loading will be handled separately
            setTimeout(() => setContentLoading(false), 500);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchItemsData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token tidak ditemukan. User belum login.");
                    return;
                }

                const response = await AxiosInstance.get("/api/barang", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Set flag to indicate API response was received
                setApiResponseReceived(true);

                console.log("=== API Response Structure ===");
                console.log("Full response:", response);
                console.log("Response data:", response.data);

                // Inspect data structure to find items array
                let fetchedItems = [];

                // Try common data structures
                if (Array.isArray(response.data)) {
                    console.log("Response data is an array directly");
                    fetchedItems = response.data;
                }
                else if (response.data && typeof response.data === 'object') {
                    // Find the first array property in the response data
                    const arrayProps = Object.keys(response.data).filter(key =>
                        Array.isArray(response.data[key])
                    );

                    console.log("Possible array properties in data:", arrayProps);

                    if (arrayProps.length > 0) {
                        // Use the first array property found (prioritize data_barang if exists)
                        const targetProp = arrayProps.includes('data_barang')
                            ? 'data_barang'
                            : arrayProps[0];

                        console.log(`Using array from property: ${targetProp}`);
                        fetchedItems = response.data[targetProp];
                    }
                    else if (response.data.data && Array.isArray(response.data.data)) {
                        console.log("Using array from data.data");
                        fetchedItems = response.data.data;
                    }
                    else {
                        console.warn("Could not find array in response data, checking if data itself is an item");
                        // Check if data itself is an item object (single item case)
                        if (response.data.id || response.data.nama || response.data.harga) {
                            console.log("Data appears to be a single item, converting to array");
                            fetchedItems = [response.data];
                        }
                    }
                }

                // Log what we found
                console.log("Processed items array:", fetchedItems);
                console.log("Item count:", fetchedItems.length);

                // Log first item structure if available
                if (fetchedItems.length > 0) {
                    console.log("First item structure:", fetchedItems[0]);
                    // Identify key fields for prices, status, etc.
                    console.log("Potential price fields:",
                        fetchedItems[0].harga !== undefined ? "harga" :
                            fetchedItems[0].price !== undefined ? "price" :
                                fetchedItems[0].nilai !== undefined ? "nilai" : "none");

                    console.log("Potential status fields:",
                        fetchedItems[0].status !== undefined ? "status" :
                            fetchedItems[0].is_borrowed !== undefined ? "is_borrowed" :
                                fetchedItems[0].dipinjam !== undefined ? "dipinjam" : "none");
                }

                // Safety check
                if (!Array.isArray(fetchedItems)) {
                    console.error("Could not find valid items array in the response");
                    setItems([]);
                    setItemsCount(0);
                    return;
                }

                // Set items state
                setItems(fetchedItems);

                // Calculate total items
                setItemsCount(fetchedItems.length);

                // Determine price field name based on first item
                let priceField = 'harga';
                if (fetchedItems.length > 0) {
                    if (fetchedItems[0].harga !== undefined) priceField = 'harga';
                    else if (fetchedItems[0].price !== undefined) priceField = 'price';
                    else if (fetchedItems[0].nilai !== undefined) priceField = 'nilai';
                }

                // Calculate total value
                const totalValue = fetchedItems.reduce((sum, item) => {
                    const itemPrice = parseFloat(item[priceField] || 0);
                    return sum + (isNaN(itemPrice) ? 0 : itemPrice);
                }, 0);
                setTotalItemValue(totalValue);

                // Determine status field name
                let statusField = null;
                let statusBorrowedValue = null;

                if (fetchedItems.length > 0) {
                    if (fetchedItems[0].status !== undefined) {
                        statusField = 'status';
                        // Try to determine what value means "borrowed"
                        const uniqueStatuses = [...new Set(fetchedItems.map(item => item.status))];
                        console.log("Unique status values:", uniqueStatuses);
                        // Guess which status might mean "borrowed"
                        for (const status of uniqueStatuses) {
                            const lowerStatus = String(status).toLowerCase();
                            if (lowerStatus.includes('pinjam') || lowerStatus.includes('borrow')) {
                                statusBorrowedValue = status;
                                break;
                            }
                        }
                    }
                    else if (fetchedItems[0].is_borrowed !== undefined) {
                        statusField = 'is_borrowed';
                        statusBorrowedValue = true;
                    }
                    else if (fetchedItems[0].dipinjam !== undefined) {
                        statusField = 'dipinjam';
                        statusBorrowedValue = true;
                    }
                }

                // Calculate loaned items
                let loanedCount = 0;
                if (statusField && statusBorrowedValue !== null) {
                    loanedCount = fetchedItems.filter(item => item[statusField] === statusBorrowedValue).length;
                } else {
                    // Default guess: 10% of items are borrowed
                    loanedCount = Math.round(fetchedItems.length * 0.1);
                }
                setLoanedItemsCount(loanedCount);

                // Simulate items loaned by the current user (for user dashboard)
                const myLoanedCount = Math.floor(loanedCount * 0.3); // Assume 30% of all loaned items
                setMyLoanedItemsCount(myLoanedCount);

                // Determine name field
                let nameField = 'nama';
                if (fetchedItems.length > 0) {
                    if (fetchedItems[0].nama !== undefined) nameField = 'nama';
                    else if (fetchedItems[0].name !== undefined) nameField = 'name';
                    else if (fetchedItems[0].nama_barang !== undefined) nameField = 'nama_barang';
                }

                // Get top items (most expensive if loan data unavailable)
                const sortedItems = [...fetchedItems]
                    .sort((a, b) => parseFloat(b[priceField] || 0) - parseFloat(a[priceField] || 0))
                    .slice(0, 4);

                // Create display-ready items with the correct fields
                const displayItems = sortedItems.map(item => ({
                    id: item.id,
                    name: item[nameField] || `Item ${item.id || Math.random().toString(36).substr(2, 5)}`,
                    price: parseFloat(item[priceField] || 0),
                    loaned: statusField ? item[statusField] === statusBorrowedValue : false
                }));

                setTopItems(displayItems);

                console.log("Processed display items:", displayItems);

            } catch (error) {
                console.error("Gagal mengambil data Barang:", error);
                toast.error('Gagal mengambil data barang');
                setApiResponseReceived(true); // Still set this so UI shows something
                setItems([]);
                setItemsCount(0);
            }
        };

        fetchItemsData();
    }, []);

    // Fetch user loan history
    useEffect(() => {
        const fetchUserLoanHistory = async () => {
            try {
                // This would typically be an API call to get the user's loan history
                // For now, we'll use mock data
                
                // In a real implementation, you would do something like:
                // const token = localStorage.getItem("token");
                // const response = await AxiosInstance.get("/api/user/loans", {
                //     headers: { Authorization: `Bearer ${token}` },
                // });
                
                // setLoanHistory(response.data.loans);
                
                // For now, just setting a flag to indicate API has been called
                console.log("User loan history would be fetched here");
            } catch (error) {
                console.error("Gagal mengambil riwayat peminjaman:", error);
                toast.error('Gagal mengambil riwayat peminjaman');
            }
        };

        fetchUserLoanHistory();
    }, []);

    useEffect(() => {
        return () => {
            if (chartRef.current && chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, []);

    // Data untuk grafik aktivitas peminjaman user
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        datasets: [
            {
                label: "Peminjaman",
                data: [2, 3, 1, 2, 3, 4, 2, 1, 2, 3, 2, 1],
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.3,
            },
            {
                label: "Pengembalian",
                data: [1, 2, 2, 1, 3, 3, 3, 1, 2, 2, 3, 0],
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                tension: 0.3,
            },
        ],
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <>
            <Toaster />
            <div className="flex h-screen">
                {/* Sidebar */}
                <SidebarUser />

                {/* Dashboard Content */}
                <div className="flex-1 overflow-auto">
                    <Header />

                    {/* Page Content with p-6 */}
                    <div className="p-6 relative">
                        {contentLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 z-10">
                                <Loading />
                            </div>
                        )}

                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg mb-6 text-white">
                            <h1 className="text-2xl font-bold mb-2">Selamat Datang di Dashboard</h1>
                            <p>Pantau aktivitas peminjaman dan barang tersedia</p>
                        </div>

                        {/* Statistik */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
                                <h2 className="text-xl font-bold">{itemsCount}</h2>
                                <p>Total Barang Tersedia</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg text-center shadow">
                                <h2 className="text-xl font-bold">{myLoanedItemsCount}</h2>
                                <p>Barang Saya Pinjam</p>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
                                <h2 className="text-xl font-bold">{loanedItemsCount}</h2>
                                <p>Total Terpinjam</p>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-lg text-center shadow">
                                <h2 className="text-xl font-bold">0</h2>
                                <p>Peminjaman Tertunda</p>
                            </div>
                        </div>

                        {/* Aktivitas Peminjaman Grafik */}
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                            <h2 className="text-xl font-bold mb-4">Aktivitas Peminjaman</h2>
                            <div style={{ width: "100%", height: "300px" }}>
                                <Line ref={chartRef} data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Barang Terpopuler */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold mb-4">Barang Terpopuler</h2>
                                {!apiResponseReceived ? (
                                    <p className="text-gray-500">Memuat data barang...</p>
                                ) : topItems.length > 0 ? (
                                    topItems.map((item, index) => {
                                        // Calculate percentage (based on price relative to max price)
                                        const maxPrice = Math.max(...topItems.map(i => i.price || 0));
                                        const percentage = maxPrice > 0 ? ((item.price || 0) / maxPrice) * 100 : 50;

                                        // Determine color based on index
                                        const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];

                                        return (
                                            <div className="mb-4" key={item.id || index}>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-sm text-gray-600">{formatCurrency(item.price)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className={`${colors[index % colors.length]} h-2 rounded-full`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Status: {item.loaned ? (
                                                        <span className="text-red-500">Dipinjam</span>
                                                    ) : (
                                                        <span className="text-green-500">Tersedia</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>
                                        <p className="text-gray-500 mb-2">Tidak ada data barang tersedia</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                        >
                                            Muat Ulang
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Peminjaman Terbaru */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold mb-4">Peminjaman Terbaru</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                        <div className="bg-blue-200 rounded-full p-2 mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Laptop ASUS</p>
                                            <p className="text-sm text-gray-500">Dipinjam 12 Maret 2025</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Dipinjam</span>
                                    </div>

                                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                        <div className="bg-green-200 rounded-full p-2 mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Proyektor Epson</p>
                                            <p className="text-sm text-gray-500">Dipinjam 10 Maret 2025</p>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Dikembalikan</span>
                                    </div>

                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                        <div className="bg-blue-200 rounded-full p-2 mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Kamera DSLR</p>
                                            <p className="text-sm text-gray-500">Dipinjam 8 Maret 2025</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Dipinjam</span>
                                    </div>

                                    <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200">
                                        Lihat Semua Peminjaman
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;