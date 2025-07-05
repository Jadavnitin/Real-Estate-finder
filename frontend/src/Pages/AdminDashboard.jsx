import axios from "axios";
import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  const [formErrors, setFormErrors] = useState({});

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/all-property");
      setProperties(res.data || []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("admin");
      const username = localStorage.getItem("AdminName");

      if (!username) {
        toast.error("No username found in localStorage");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/admin/logout",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Logged out successfully");
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear field-specific error on input change
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const { name, description, address, latitude, longitude, image } = formData;

    if (!name.trim()) errors.name = "Property name is required.";
    if (!address.trim()) errors.address = "Address is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!latitude.trim()) errors.latitude = "Latitude is required.";
    else if (isNaN(latitude)) errors.latitude = "Latitude must be a number.";
    if (!longitude.trim()) errors.longitude = "Longitude is required.";
    else if (isNaN(longitude)) errors.longitude = "Longitude must be a number.";

    if (image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(image.type)) {
        errors.image = "Only JPG, PNG, WEBP formats allowed.";
      }
      const maxSize = 2 * 1024 * 1024;
      if (image.size > maxSize) {
        errors.image = "Image must be under 2MB.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = new FormData();
      payload.append("propertyName", formData.name);
      payload.append("description", formData.description);
      payload.append("address", formData.address);
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      if (formData.image) {
        payload.append("image", formData.image);
      }

      await axios.post("http://localhost:5000/api/admin/add-property", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Property added successfully");

      setFormData({
        name: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        image: null,
      });
      setFormErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProperties();
    } catch (error) {
      console.error("Add property failed:", error);
      toast.error(error.response?.data?.message || "Failed to add property");
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-indigo-700 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="space-x-4">
            <Link
              to="/"
              className="bg-white text-indigo-700 px-4 py-1 rounded hover:bg-gray-100"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-700 px-4 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto py-10">
          <h2 className="text-3xl text-gray-800 mb-6">Manage Properties</h2>

          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white border rounded-2xl shadow text-gray-600 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Property Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                {formErrors.latitude && <p className="text-red-500 text-sm">{formErrors.latitude}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                {formErrors.longitude && (
                  <p className="text-red-500 text-sm">{formErrors.longitude}</p>
                )}
              </div>
            </div>

            <div>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>

            <div>
              <input
                type="file"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
            </div>

            <button
              type="submit"
              className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800"
            >
              Add Property
            </button>
          </form>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">All Properties</h3>
            {properties.length === 0 ? (
              <p className="text-gray-500">No properties added yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property._id || property.id}
                    className="bg-white p-4 rounded-xl border shadow"
                  >
                    {property.propertyImage?.filename && (
                      <img
                        src={`http://localhost:5000/uploads/${property.propertyImage.filename}`}
                        alt={property.propertyName}
                        className="h-40 w-full object-cover rounded mb-2"
                      />
                    )}
                    <h4 className="text-lg font-bold">{property.propertyName}</h4>
                    <p className="text-sm text-gray-600 mb-1">{property.description}</p>
                    <p className="text-sm text-gray-500">{property.address}</p>
                    <p className="text-sm text-gray-500">
                      📍 ({property.coordinates.latitude}, {property.coordinates.longitude})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
