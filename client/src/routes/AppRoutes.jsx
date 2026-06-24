import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import Profile from "../views/Profile";
import Dashboard from "../views/Dashboard";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
