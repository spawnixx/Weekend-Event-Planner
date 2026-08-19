import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import { Compass } from "lucide-react";
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
    <nav className="flex w-full items-center justify-between border-b border-[#E4E4E1] bg-white px-3 py-1">
      <Link to="/groups" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8492C]">
          <Compass className="h-4 w-4 text-white" />
        </div>

        <span className="font-display text-xl font-semibold tracking-tight text-[#17171A]">
          Weekender
        </span>
      </Link>
      <div className="flex items-center gap-4 ">
        {user && (
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.firstName || user?.firstname}
          </span>
        )}
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
