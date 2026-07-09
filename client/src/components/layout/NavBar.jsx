import { Link } from "react-router-dom";
import { Button } from "../ui/button";

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
function NavBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      {user && <Button onClick={handleLogout}>Logout</Button>}
    </nav>
  );
}

export default NavBar;
