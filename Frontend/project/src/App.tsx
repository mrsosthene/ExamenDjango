import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profil from "./components/Profil";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/admin/statistique" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
