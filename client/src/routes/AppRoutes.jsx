import { Routes, Route } from "react-router-dom";
import Home from "@/views/Home";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Profile from "@/views/Profile";
import Groups from "@/views/Groups";
import GroupView from "@/views/GroupView";
import JoinGroup from "@/views/JoinGroup";
import ProtectedRoute from "@/components/common/ProtectedRoute";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <GroupView />
          </ProtectedRoute>
        }
      />
      <Route path="/join/:inviteCode" element={<JoinGroup />} />
    </Routes>
  );
}

export default AppRoutes;
