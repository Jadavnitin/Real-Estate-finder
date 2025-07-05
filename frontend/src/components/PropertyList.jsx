// src/components/PropertyList.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyList = ({ properties }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  console.log("dwihduhwd",properties);
  
  
  const currentProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      {currentProperties.length === 0 ? (
        <div className="text-center text-lg text-gray-500 py-12">
          No properties found.
        </div>
      ) : (
        <>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {currentProperties.map((prop) => (
          <div
            key={prop._id || prop.id}
            onClick={() => navigate(`/property/${prop._id }`)}
            className="cursor-pointer bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300"
          >
            <img
               src={`http://localhost:5000/uploads/${prop.propertyImage.filename}`}
               alt={prop.propertyName}
              className="rounded-xl h-52 w-full object-cover mb-4 shadow-lg"
            />
            <h2 className="text-xl font-bold text-indigo-700 mb-1">{prop.propertyName}</h2>
            <p className="text-slate-600 mb-1">{prop.description}</p>
            <p className="text-slate-500 text-sm">{prop.address}</p>
          </div>
        ))}
      </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  currentPage === index + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-indigo-700 border-indigo-300'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PropertyList;
