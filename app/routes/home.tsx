import type { Route } from "./+types/home";
import ProtectedRoute from "../auth/protected-route";
import { useAuth } from "../auth/auth-context";
import { useCourse } from "../context/course-context";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Video Library" },
    { name: "description", content: "Welcome to the Video Library!" },
  ];
}

function AuthenticatedHome() {
  const { courses } = useCourse();

  return (
    <div className="home-container">
      <h1>Video Library</h1>
      <p>Welcome to the video library! Select a course to start watching.</p>

      <div className="courses-grid">
        {courses.map((course) => (
          <Link
            to={`/course/${course.id}`}
            key={course.id}
            className="course-card">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="course-card-image"
            />
            <div className="course-card-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UnauthenticatedHome() {
  return (
    <div className="home-container">
      <h1>Welcome to Video Library</h1>
      <p>
        Access our collection of educational videos by logging in or creating an
        account.
      </p>
      <div className="home-auth-buttons">
        <Link to="/login" className="home-auth-button">
          Login
        </Link>
        <Link to="/register" className="home-auth-button">
          Register
        </Link>
      </div>
      <div className="home-features">
        <div className="feature-card">
          <h3>Multiple Courses</h3>
          <p>Access our growing library of courses on various topics.</p>
        </div>
        <div className="feature-card">
          <h3>Seamless Playback</h3>
          <p>
            Videos automatically play in sequence for uninterrupted learning.
          </p>
        </div>
        <div className="feature-card">
          <h3>Mobile Friendly</h3>
          <p>Watch on any device with our responsive video player.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <ProtectedRoute>
        <AuthenticatedHome />
      </ProtectedRoute>
    );
  }

  return <UnauthenticatedHome />;
}
