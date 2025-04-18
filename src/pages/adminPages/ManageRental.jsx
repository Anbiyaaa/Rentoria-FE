import React, { useState, useEffect } from "react";
import Header from "../../navigation/AdminHeader";
import SidebarAdmin from "../../navigation/SidebarAdmin";
import axios from "../../axiosInstance/axios";
import Loading from "../../component/Loading";

const RentalManagement = () => {
  // State for rentals data
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");

  // Status filter state
  const [statusFilter, setStatusFilter] = useState("All");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch rentals data from API
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/rentals');
        setRentals(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch rental data");
        setLoading(false);
        console.error("Error fetching rentals:", err);
      }
    };

    fetchRentals();
  }, []);

  // Filter rentals based on status and search term
  const filteredRentals = rentals
    .filter(rental => statusFilter === "All" || rental.status === statusFilter)
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

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRentals.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to format currency (Indonesian Rupiah)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to handle status change with the correct API endpoint
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Use the correct API endpoint for updating status
      const response = await axios.put(`/api/rentals/${id}/status`, { status: newStatus });

      // Handle the response with the updated rental object
      if (response.data && response.data.rental) {
        // Update just the changed rental in the state
        const updatedRentals = rentals.map(rental =>
          rental.id === id ? response.data.rental : rental
        );
        setRentals(updatedRentals);

        // Show success message
        setStatusUpdateMessage(response.data.message || "Status updated successfully");
        setTimeout(() => setStatusUpdateMessage(""), 3000); // Clear message after 3 seconds
      }
    } catch (err) {
      console.error("Error updating rental status:", err);
      setStatusUpdateMessage("Failed to update status");
      setTimeout(() => setStatusUpdateMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  // Function to handle item return
  const handleReturn = async (id) => {
    try {
      const response = await axios.post(`/api/admin/returns/${id}`);

      if (response.data) {
        // Update the rental status in the state
        const updatedRentals = rentals.map(rental =>
          rental.id === id ? { ...rental, status: 'completed' } : rental
        );
        setRentals(updatedRentals);

        // Show success message
        setStatusUpdateMessage(response.data.message || "Item returned successfully");
        setTimeout(() => setStatusUpdateMessage(""), 3000); // Clear message after 3 seconds
      }
    } catch (err) {
      console.error("Error processing return:", err);
      setStatusUpdateMessage("Failed to process return");
      setTimeout(() => setStatusUpdateMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    return dateString;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {loading ? (
          <Loading />
        ) : error ? (
          <div className=" bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        ) : (

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="container mx-auto px-4">
              {/* Status message notification */}
              {statusUpdateMessage && (
                <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 flex items-center justify-between rounded-md animate-fade-in">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {statusUpdateMessage}
                  </div>
                  <button
                    onClick={() => setStatusUpdateMessage("")}
                    className="text-green-700 hover:text-green-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Main Content */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h1 className="text-2xl font-bold text-gray-800">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Rental Management
                      </span>
                    </h1>
                  </div>

                  {/* Filter and Search Section */}
                  <div className="mt-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1 relative">
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
                    <div className="w-full md:w-auto">
                      <select
                        className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
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
                      <h3 className="text-lg font-medium text-gray-500 mb-1">No rentals found</h3>
                      <p className="text-gray-500">Try changing your search criteria or removing filters</p>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((rental) => (
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(rental.status)}`}>
                                {translateStatus(rental.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(rental.total_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                {rental.status === "completed" ? (
                                  <div className="text-sm text-gray-500 italic px-2 py-1">
                                    Barang Telah Dikembalikan
                                  </div>
                                ) : (
                                  <>
                                    <select
                                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={rental.status}
                                      onChange={(e) => handleStatusChange(rental.id, e.target.value)}
                                      disabled={rental.status === "completed"}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="approved">Approved</option>
                                      <option value="completed">Completed</option>
                                      <option value="rejected">Rejected</option>
                                    </select>

                                    {rental.status === "approved" && (
                                      <button
                                        onClick={() => handleReturn(rental.id)}
                                        className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                        Return
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination Section */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRentals.length)} of {filteredRentals.length} rentals
                    </div>

                    {filteredRentals.length > itemsPerPage && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          Previous
                        </button>

                        {Array.from({ length: Math.ceil(filteredRentals.length / itemsPerPage) }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${currentPage === i + 1
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => paginate(currentPage < Math.ceil(filteredRentals.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                          disabled={currentPage === Math.ceil(filteredRentals.length / itemsPerPage)}
                          className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${currentPage === Math.ceil(filteredRentals.length / itemsPerPage)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
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

export default RentalManagement;