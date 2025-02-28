import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/auth-context";
import { useCourse } from "../context/course-context";
import type { Video } from "../context/course-context";

export default function VideoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const { videoName, courseId } = useParams();
  const { isAuthenticated } = useAuth();
  const { currentCourse, getVideosForCourse } = useCourse();

  // Load videos based on current course
  useEffect(() => {
    if (currentCourse) {
      setVideos(getVideosForCourse(currentCourse.id));
    }
  }, [currentCourse, getVideosForCourse]);

  // Filter videos based on search term
  const filteredVideos = videos.filter((video) =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not authenticated, show a message about the first video
  if (!isAuthenticated) {
    return (
      <div className="video-list">
        <div className="video-preview">
          <h3>Featured Video</h3>
          <div className="preview-item">
            <img
              src={
                currentCourse?.thumbnail ||
                "https://via.placeholder.com/300x169?text=Video+Preview"
              }
              alt="Video Preview"
              className="preview-image"
            />
            <p>{videos[0]?.name || "Sample Video"}</p>
            <p className="preview-description">
              Login to access our full library of {videos.length} videos!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-list">
      <h2>Video Library</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="videos-container">
        {filteredVideos.map((video) => (
          <Link
            key={video.name}
            to={`/course/${currentCourse?.id || "go-programming"}/video/${
              video.name
            }`}
            className={`video-link ${
              video.name === videoName ? "active" : ""
            }`}>
            {video.name.replace(/_/g, " ").replace(".mp4", "")}
            {video.name === videoName && (
              <span className="now-playing">▶ Now Playing</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
