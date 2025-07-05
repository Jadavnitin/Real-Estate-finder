import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./Pages/AdminLogin";
import HomePage from "./Pages/HomePage";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminRegister from "./Pages/AdminRegister";
import { AuthContext } from "./context/authContext";

function App() {
  const { isAdmin } = useContext(AuthContext);

 
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route
        path="/admin/dashboard"
        element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
