import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { AuthProvider } from "./context/AuthProvider";
import AuthContext from "./context/AuthContext";

const AppContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <nav>
        <div className="logo">Taskify</div>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/tasks" onClick={() => setIsOpen(false)}>Tasks</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>

        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span><span></span><span></span>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
