import { Link, useNavigate } from "react-router";
import { useCourse } from "../context/course-context";
import { useAuth } from "../auth/auth-context";
import "../styles/navbar.css";

export default function Navbar() {
  const { courses, currentCourse, setCurrentCourseById } = useCourse();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCourseChange = (courseId: string) => {
    setCurrentCourseById(courseId);
    navigate(`/course/${courseId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Video Library
        </Link>
      </div>

      {isAuthenticated && (
        <div className="navbar-courses">
          <span className="navbar-label">Courses:</span>
          <div className="course-selector">
            <select
              value={currentCourse?.id || ""}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="course-select">
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="navbar-button logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button login">
              Login
            </Link>
            <Link to="/register" className="navbar-button register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
