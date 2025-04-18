import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-full bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-transparent border-b-transparent border-l-[#1ebda8] border-r-[#391be2] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-[#ffe604] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Text */}
        <p className="text-lg font-semibold text-[#1d1352] tracking-wide animate-pulse py-3">
          Sedang memuat...
        </p>
      </div>
    </div>
  );
};

export default Loading;
