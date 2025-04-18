import React, { useState, useEffect, useRef } from "react";
import Header from "../../navigation/AdminHeader";
import SidebarAdmin from "../../navigation/SidebarAdmin";
import axios from "../../axiosInstance/axios";
import { useReactToPrint } from "react-to-print";

const CompletedRentalsReport = () => {
  // State for rentals data
  const [completedRentals, setCompletedRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Report ref for printing
  const reportRef = useRef(null);
  
  // Fetch completed rentals data from API
  useEffect(() => {
    const fetchCompletedRentals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/rentals?status=completed');
        setCompletedRentals(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch completed rental data");
        setLoading(false);
        console.error("Error fetching completed rentals:", err);
      }
    };

    fetchCompletedRentals();
  }, []);

  // Format date for display and filtering
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    return dateString;
  };

  // Function to format currency (Indonesian Rupiah)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "Completed_Rentals_Report",
    onAfterPrint: () => console.log("Print successful!")
  });

  // Handle date range filter changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter rentals based on date range and search term
  const filteredRentals = completedRentals
    .filter(rental => {
      // Always filter for only completed rentals
      if (rental.status !== "completed") return false;
      
      // Filter by date range if provided
      if (dateRange.startDate && dateRange.endDate) {
        const rentalDate = new Date(rental.end_date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        
        // Reset the time part for accurate date comparison
        rentalDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        return rentalDate >= startDate && rentalDate <= endDate;
      }
      
      return true;
    })
    .filter(rental => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (rental.user?.name || "").toLowerCase().includes(searchLower) ||
        (rental.data_barang?.name || "").toLowerCase().includes(searchLower) ||
        rental.id.toString().includes(searchLower) ||
        (rental.lokasi_pengantaran || "").toLowerCase().includes(searchLower)
      );
    });

  // Calculate total revenue
  const totalRevenue = filteredRentals.reduce(
    (sum, rental) => sum + (rental.total_price || 0), 
    0
  );

  // Loading component
  const Loading = () => (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="p-4 m-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        ) : (
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="container mx-auto px-4">
              {/* Report Control Panel */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h1 className="text-2xl font-bold text-gray-800">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Completed Rentals Report
                      </span>
                    </h1>
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Report
                    </button>
                  </div>

                  {/* Filter and Search Section */}
                  <div className="mt-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <div className="md:w-1/4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={dateRange.startDate}
                        onChange={handleDateRangeChange}
                        className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:w-1/4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={dateRange.endDate}
                        onChange={handleDateRangeChange}
                        className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search by customer, item, ID or location"
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Printable Report Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden" ref={reportRef}>
                {/* Report Header - will show when printed */}
                <div className="p-6 border-b border-gray-200 print:flex print:justify-between print:items-center hidden">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Completed Rentals Report</h1>
                    <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      Filter: {dateRange.startDate ? formatDate(dateRange.startDate) : 'All'} - {dateRange.endDate ? formatDate(dateRange.endDate) : 'All'}
                    </p>
                    <p className="text-gray-600">Total Records: {filteredRentals.length}</p>
                  </div>
                </div>

                {/* Report Summary */}
                <div className="p-6 bg-blue-50 border-b border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Completed Rentals</h3>
                      <p className="text-2xl font-bold text-gray-800">{filteredRentals.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Report Period</h3>
                      <p className="text-lg font-medium text-gray-800">
                        {dateRange.startDate && dateRange.endDate 
                          ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                          : "All Time"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                  {filteredRentals.length === 0 ? (
                    <div className="text-center py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-500 mb-1">No completed rentals found</h3>
                      <p className="text-gray-500">Try changing your search criteria or removing date filters</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Add-Ons</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{rental.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-3">
                                  {(rental.user?.name || "U")[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{rental.user?.name || "Unknown"}</div>
                                  <div className="text-sm text-gray-500">{rental.user?.email || "No email"}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{rental.data_barang?.name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{rental.durasi?.replace("_", " ") || "N/A"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(rental.start_date)}</div>
                              <div className="text-sm text-gray-500">to {formatDate(rental.end_date)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate" title={rental.lokasi_pengantaran}>
                                {rental.lokasi_pengantaran || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rental.tambah_tv ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                TV: {rental.tambah_tv ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(rental.total_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Report Footer */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing {filteredRentals.length} completed rentals
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      Total Revenue: {formatCurrency(totalRevenue)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default CompletedRentalsReport;