import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
function NavBar() {
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/auth", {
      state: {
        tab: "login",
      },
    });
  };
  return (
    <nav className="ml-auto items-center justify-end gap-4 pr-5">
      {user && (
        <span className="text-sm text-muted-foreground">
          Welcome, {user?.firstName || user?.firstname}
        </span>
      )}
      <div className="flex w-full items-center justify-end gap-4 pr-5">
        {user ? (
          <>
            <Link to="/groups">Groups</Link>
            <Link to="/profile">Profile</Link>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
