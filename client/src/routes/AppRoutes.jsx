import { Navigate, Routes, Route } from "react-router-dom";
import Home from "@/views/Home";
import Profile from "@/views/Profile";
import Groups from "@/views/Groups";
import GroupView from "@/views/GroupView";
import JoinGroup from "@/views/JoinGroup";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AuthPage from "@/views/AuthPage";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />
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
