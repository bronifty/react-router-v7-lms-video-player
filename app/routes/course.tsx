import { useParams } from "react-router";
import { useEffect } from "react";
import { useCourse } from "../context/course-context";
import ProtectedRoute from "../auth/protected-route";

export default function CourseRoute() {
  const { courseId } = useParams();
  const { currentCourse, setCurrentCourseById } = useCourse();

  // Set the current course based on the URL parameter
  useEffect(() => {
    if (courseId) {
      setCurrentCourseById(courseId);
    }
  }, [courseId, setCurrentCourseById]);

  return (
    <ProtectedRoute>
      <div className="course-container">
        <h1>{currentCourse?.title || "Loading course..."}</h1>
        <p className="course-description">{currentCourse?.description}</p>

        <div className="course-info">
          <img
            src={
              currentCourse?.thumbnail ||
              "https://via.placeholder.com/600x338?text=Course+Thumbnail"
            }
            alt={currentCourse?.title}
            className="course-thumbnail"
          />

          <div className="course-instructions">
            <h2>Getting Started</h2>
            <p>
              Select a video from the sidebar to begin watching this course.
            </p>
            <p>
              Videos will automatically play in sequence, or you can navigate
              using the controls below each video.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
