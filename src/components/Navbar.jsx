import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User, LayoutDashboard, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <GraduationCap size={22} />
          </div>
          <span>Examify</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                {isStudent && (
                  <>
                    <li>
                      <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={17} /> Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/student/exams" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <BookOpen size={17} /> Available Exams
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/student/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Clock size={17} /> History
                      </NavLink>
                    </li>
                  </>
                )}

                {isAdmin && (
                  <li>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <ShieldCheck size={17} /> Admin Panel
                    </NavLink>
                  </li>
                )}

                <li>
                  <Link to={isAdmin ? "/admin/dashboard" : "/student/profile"} className="user-badge">
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span>{user.name}</span>
                  </Link>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Student Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
