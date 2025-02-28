import { useParams, Navigate } from "react-router";
import { useCourse } from "../context/course-context";

// This component redirects from the old /video/:videoName route to the new /course/:courseId/video/:videoName route
export default function LegacyVideoRoute() {
  const { videoName } = useParams();
  const { currentCourse } = useCourse();

  // Redirect to the new URL format
  return (
    <Navigate
      to={`/course/${currentCourse?.id || "go-programming"}/video/${videoName}`}
      replace
    />
  );
}
