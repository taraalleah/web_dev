import { Link } from "react-router-dom";

function Navbar({ setIsAuthenticated, isAuthenticated }) {
  const handleClick = () => {
    // remove user from storage
    localStorage.removeItem("user");
    // sessionStorage.removeItem("user");
    setIsAuthenticated(false);
  };

const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav>
      {isAuthenticated && (
        <div>
          <span>Welcome, {user.email}!</span>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleClick}>Log out</button>
        </div>
      )}
      {!isAuthenticated && (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

