import { Navigate, Routes, Route } from "react-router-dom";
import Profile from "@/views/Profile";
import Groups from "@/views/Groups";
import GroupView from "@/views/GroupView";
import JoinGroup from "@/views/JoinGroup";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AuthPage from "@/views/AuthPage";
import { useAuth } from "@/context/AuthContext";
function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/groups" : "/auth"} replace />}
      />
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
