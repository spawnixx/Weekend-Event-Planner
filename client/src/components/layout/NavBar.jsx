import { Link } from "react-router-dom";
function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
}

export default NavBar;
