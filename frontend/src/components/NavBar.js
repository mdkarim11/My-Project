import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('blogUser') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('blogToken');
    localStorage.removeItem('blogUser');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="brand">
        <Link to="/">Leafy Blog</Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/new" className="button secondary">New Post</Link>
            <button type="button" onClick={handleLogout} className="button outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="button outline">Login</Link>
            <Link to="/register" className="button">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
