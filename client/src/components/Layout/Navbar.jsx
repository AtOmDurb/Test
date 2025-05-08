import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Школьная система
        </Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">
                Администрирование
              </Link>
            )}
            {user.role === 'teacher' && (
              <Link to="/teacher" className="nav-link">
                Учительская
              </Link>
            )}
            {user.role === 'student' && (
              <Link to="/student" className="nav-link">
                Учебный портал
              </Link>
            )}
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Вход в систему
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;