// src/pages/Home.js
import { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';
import PropertyList from '../components/PropertyList';
import PropertyMap from '../components/PropertyMap';
import axios from "axios"
import { AuthContext } from "../context/authContext";


const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { isAdmin } = useContext(AuthContext);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-property');
      setProperties(res.data || []);
      setFiltered(res.data || []);  // <-- important
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);




  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFiltered(properties); // Reset to all if search is empty
      return;
    }

    const filteredResults = properties.filter(
      (p) =>
        p.propertyName?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.address?.toLowerCase().includes(term)
    );

    setFiltered(filteredResults);
  };


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Real Estate Finder</h1>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/admin/login"}
                className="hover:underline"
              >
                Admin
              </Link>
            </li>

          </ul>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-indigo-50 py-20 text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-4">Find Your Dream Property</h2>
        <p className="text-lg text-gray-600">Explore listings and view them on a live map in seconds.</p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-6 px-4">
        <input
          type="text"
          placeholder="Search by name, address, or description..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Tabs with Listing and Map */}
      <div className="max-w-7xl mx-auto py-10 px-4">
        <Tabs defaultActiveKey="1" centered size="large">
          <Tabs.TabPane tab="Listing" key="1">
            <PropertyList properties={filtered} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Map" key="2">
            <PropertyMap properties={filtered} />
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white text-center py-6 mt-12">
        <p>&copy; 2025 Real Estate Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;


