import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array, handle case with many pages
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate range of pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust when near first page
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      }
      
      // Adjust when near last page
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Show ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Show ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {/* Informasi Item yang Ditampilkan */}
        <div className="text-sm text-gray-500">
          Menampilkan {totalItems > 0 ? indexOfFirstItem : 0}-{indexOfLastItem} dari {totalItems} item
        </div>

        {/* Navigasi Pagination */}
        <div className="flex items-center space-x-1">
          {/* Tombol Previous */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-8 h-8 rounded ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Daftar Halaman */}
          {pageNumbers.map((number, index) => (
            number === "..." ? (
              <span key={`ellipsis-${index}`} className="flex items-center justify-center w-8 h-8">
                ...
              </span>
            ) : (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`flex items-center justify-center w-8 h-8 rounded ${
                  currentPage === number
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            )
          ))}
          
          {/* Tombol Next */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;