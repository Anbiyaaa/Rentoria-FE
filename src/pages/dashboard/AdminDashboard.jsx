import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Sidebar from "../../navigation/SidebarAdmin";
import Loading from "../../component/Loading";
import Footer from "../../component/Footer";
import { Chart as ChartJS } from "chart.js/auto";
import AxiosInstance from "../../axiosInstance/axios";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../navigation/AdminHeader";

const Dashboard = () => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(true);
    const navigate = useNavigate();
    const [customersCount, setCustomersCount] = useState(0);
    const [itemsCount, setItemsCount] = useState(0);
    const [items, setItems] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [totalItemValue, setTotalItemValue] = useState(0);
    const [loanedItemsCount, setLoanedItemsCount] = useState(0);
    const [apiResponseReceived, setApiResponseReceived] = useState(false);
    const [activeRentals, setActiveRentals] = useState([]);
    const [totalRentalValue, setTotalRentalValue] = useState(0);
    const [completedRentals, setCompletedRentals] = useState([]);
    const [allRelevantRentals, setAllRelevantRentals] = useState([]);
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
        const fetchCustomerCount = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token tidak ditemukan. User belum login.");
                    return;
                }

                const response = await AxiosInstance.get("/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.users) {
                    const users = response.data.users;
                    const customerCount = users.filter(user => user.role.name === "customer").length;
                    setCustomersCount(customerCount);
                } else {
                    console.error("Unexpected users data structure:", response.data);
                    setCustomersCount(0);
                }
            } catch (error) {
                console.error("Gagal mengambil data customer:", error);
                toast.error('Gagal mengambil data customer');
            }
        };

        fetchCustomerCount();
    }, []);

    useEffect(() => {
        const fetchRentalsData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token tidak ditemukan. User belum login.");
                    return;
                }

                const response = await AxiosInstance.get("/api/rentals", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Rentals API Response:", response.data);

                // Extract rentals array depending on the response structure
                let rentals = [];
                if (Array.isArray(response.data)) {
                    rentals = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    rentals = response.data.data;
                } else if (response.data && Array.isArray(response.data.rentals)) {
                    rentals = response.data.rentals;
                } else if (response.data && typeof response.data === 'object') {
                    // Look for any array property that might contain rentals
                    const arrayProps = Object.keys(response.data).filter(key =>
                        Array.isArray(response.data[key])
                    );
                    if (arrayProps.length > 0) {
                        rentals = response.data[arrayProps[0]];
                    }
                }

                // Filter active/approved rentals
                const approvedRentals = rentals.filter(rental => {
                    const status = rental.status || '';
                    const lowerStatus = String(status).toLowerCase();
                    return lowerStatus === 'approved' ||
                        lowerStatus === 'active' ||
                        lowerStatus === 'disetujui' ||
                        lowerStatus === 'aktif';
                });

                // Filter completed rentals
                const completedRentalsArray = rentals.filter(rental => {
                    const status = rental.status || '';
                    const lowerStatus = String(status).toLowerCase();
                    return lowerStatus === 'completed' ||
                        lowerStatus === 'selesai' ||
                        lowerStatus === 'complete';
                });

                // Combine relevant rentals for price calculation
                const relevantRentals = [...approvedRentals, ...completedRentalsArray];

                console.log("Approved/Active Rentals:", approvedRentals);
                console.log("Completed Rentals:", completedRentalsArray);
                console.log("All Relevant Rentals:", relevantRentals);

                setActiveRentals(approvedRentals);
                setCompletedRentals(completedRentalsArray);
                setAllRelevantRentals(relevantRentals);
                setLoanedItemsCount(approvedRentals.length);

                // Calculate total rental value
                calculateTotalRentalValue(relevantRentals);
            } catch (error) {
                console.error("Gagal mengambil data rental:", error);
                toast.error('Gagal mengambil data rental');
            }
        };

        fetchRentalsData();
    }, []);

    // Function to calculate total rental value
    const calculateTotalRentalValue = (rentals) => {
        try {
            let total = 0;

            rentals.forEach(rental => {
                // Handle different possible field names for price
                let rentalPrice = 0;

                // Try to get price from common field names
                if (rental.price !== undefined) {
                    rentalPrice = parseFloat(rental.price);
                } else if (rental.harga !== undefined) {
                    rentalPrice = parseFloat(rental.harga);
                } else if (rental.total !== undefined) {
                    rentalPrice = parseFloat(rental.total);
                } else if (rental.total_price !== undefined) {
                    rentalPrice = parseFloat(rental.total_price);
                } else if (rental.total_harga !== undefined) {
                    rentalPrice = parseFloat(rental.total_harga);
                }

                // If no direct price field, try to get from item/barang
                if (rentalPrice === 0 || isNaN(rentalPrice)) {
                    const item = rental.item || rental.barang || {};
                    if (item) {
                        if (item.price !== undefined) {
                            rentalPrice = parseFloat(item.price);
                        } else if (item.harga !== undefined) {
                            rentalPrice = parseFloat(item.harga);
                        }

                        // If there's a duration/quantity field, multiply the price
                        const duration = rental.duration || rental.durasi || rental.lama_pinjam || 1;
                        const quantity = rental.quantity || rental.jumlah || 1;
                        rentalPrice = rentalPrice * parseFloat(duration) * parseFloat(quantity);
                    }
                }

                // Add to total if valid
                if (!isNaN(rentalPrice)) {
                    total += rentalPrice;
                } else {
                    console.warn(`Could not determine price for rental ID: ${rental.id}`);
                }
            });

            console.log(`Total rental value: ${total}`);
            setTotalRentalValue(total);
        } catch (error) {
            console.error("Error calculating rental value:", error);
            setTotalRentalValue(0);
        }
    };

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

    useEffect(() => {
        return () => {
            if (chartRef.current && chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, []);

    // Data untuk grafik laporan
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        datasets: [
            {
                label: "Pemasukan",
                data: [100000, 200000, 300000, 150000, 250000, 400000, 350000, 450000, 200000, 500000, 700000, 800000],
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.3,
            },
            {
                label: "Pengeluaran",
                data: [50000, 150000, 250000, 100000, 200000, 300000, 400000, 500000, 250000, 600000, 750000, 850000],
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
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

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return dateString || '-';
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar />

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

                        {/* Statistik */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-200 p-4 rounded-lg text-center">
                                <h2 className="text-xl font-bold">{customersCount}</h2>
                                <p className="text-black">Total Customer</p>
                            </div>
                            <div className="bg-yellow-200 p-4 rounded-lg text-center">
                                <h2 className="text-xl font-bold">{itemsCount}</h2>
                                <p className="dark:text-black">Total Jenis Barang</p>
                            </div>
                            <div className="bg-pink-200 p-4 rounded-lg text-center">
                                <h2 className="text-xl font-bold">{loanedItemsCount}</h2>
                                <p>Total Barang Dipinjam</p>
                            </div>
                            {/*  */}
                            {/* Card baru untuk total nilai rental */}
                            <div className="bg-blue-200 p-4 rounded-lg text-center">
                                <h2 className="text-xl font-bold">{formatCurrency(totalRentalValue)}</h2>
                                <p>Total Pendapatan Rental</p>
                            </div>
                        </div>
                        
                        {/* Rental stats summary
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                            <h2 className="text-xl font-bold mb-4">Informasi Rental</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 border rounded-lg">
                                    <p className="font-medium">Total Rental Aktif</p>
                                    <p className="text-xl">{activeRentals.length}</p>
                                </div>
                                <div className="p-3 border rounded-lg">
                                    <p className="font-medium">Total Rental Selesai</p>
                                    <p className="text-xl">{completedRentals.length}</p>
                                </div>
                                <div className="p-3 border rounded-lg">
                                    <p className="font-medium">Total Pendapatan</p>
                                    <p className="text-xl">{formatCurrency(totalRentalValue)}</p>
                                </div>
                            </div>
                        </div> */}

                        {/* Grafik Laporan */}
                        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                            <h2 className="text-xl font-bold mb-4">Reports</h2>
                            <div style={{ width: "100%", height: "300px" }}>
                                <Line ref={chartRef} data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>

                        {/* Barang Terlaris */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Barang Terlaris</h2>
                            {!apiResponseReceived ? (
                                <p className="text-gray-500">Memuat data barang...</p>
                            ) : topItems.length > 0 ? (
                                topItems.map((item, index) => {
                                    // Calculate percentage (based on price relative to max price)
                                    const maxPrice = Math.max(...topItems.map(i => i.price || 0));
                                    const percentage = maxPrice > 0 ? ((item.price || 0) / maxPrice) * 100 : 50;

                                    // Determine color based on index
                                    const colors = ["bg-blue-500", "bg-red-500", "bg-yellow-500", "bg-purple-500"];

                                    // Check if this item is currently being rented
                                    const isRented = activeRentals.some(rental => {
                                        const rentalItemId = rental.item_id ||
                                            (rental.barang && rental.barang.id) ||
                                            (rental.item && rental.item.id);
                                        return rentalItemId === item.id;
                                    });

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
                                            {isRented && (
                                                <div className="text-xs text-red-500 mt-1">
                                                    Status: Dipinjam
                                                </div>
                                            )}
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;