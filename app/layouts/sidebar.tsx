import { Outlet } from "react-router";
import { useNavigate, Link } from "react-router";
import VideoList from "../components/video-list";
import Navbar from "../components/navbar";
import "../styles/sidebar.css";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/auth-context";

export default function ProjectLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if the device is mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Check on initial render
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking overlay on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className={`layout-container ${isMobile ? "mobile" : ""}`}>
        <button
          className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}>
          {sidebarOpen ? "←" : "→"}
        </button>

        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2>Course Videos</h2>
          </div>

          <VideoList />
        </aside>

        {/* Overlay for mobile - closes sidebar when clicked */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
        )}

        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
