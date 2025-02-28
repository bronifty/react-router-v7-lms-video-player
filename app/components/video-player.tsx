import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { useCourse } from "../context/course-context";
import type { Video } from "../context/course-context";

export default function VideoPlayer() {
  const { videoName, courseId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [videos, setVideos] = useState<Video[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { currentCourse, setCurrentCourseById, getVideosForCourse } =
    useCourse();

  // Load videos based on current course or courseId param
  useEffect(() => {
    // If courseId param exists and differs from current course, update current course
    if (courseId && (!currentCourse || currentCourse.id !== courseId)) {
      setCurrentCourseById(courseId);
    }

    if (currentCourse) {
      setVideos(getVideosForCourse(currentCourse.id));
    } else if (courseId) {
      setVideos(getVideosForCourse(courseId));
    }
  }, [currentCourse, courseId, setCurrentCourseById, getVideosForCourse]);

  // Find current video index and set video URL
  useEffect(() => {
    if (videoName && videos.length > 0) {
      const index = videos.findIndex((v) => v.name === videoName);
      if (index !== -1) {
        setCurrentVideoIndex(index);
        setVideoUrl(videos[index].url);
      }
    }
  }, [videoName, videos]);

  // Handle video end - play next video
  const handleVideoEnded = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextVideo = videos[currentVideoIndex + 1];
      navigate(
        `/course/${currentCourse?.id || courseId}/video/${nextVideo.name}`
      );
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!videoUrl) {
    return (
      <div className="video-placeholder">
        Select a video from the sidebar to start watching
      </div>
    );
  }

  return (
    <div className="video-player">
      <h2>{videoName?.replace(/_/g, " ").replace(".mp4", "")}</h2>
      <div className="video-container">
        <video
          ref={videoRef}
          controls
          autoPlay
          width="100%"
          src={videoUrl}
          playsInline
          onEnded={handleVideoEnded}>
          Your browser does not support the video tag.
        </video>
        <div className="video-controls">
          <button
            className="fullscreen-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <div className="video-progress">
            {currentVideoIndex + 1} of {videos.length}
          </div>
        </div>
      </div>
      <div className="video-navigation">
        <button
          className="nav-button prev"
          disabled={currentVideoIndex <= 0}
          onClick={() => {
            if (currentVideoIndex > 0) {
              const prevVideo = videos[currentVideoIndex - 1];
              navigate(
                `/course/${currentCourse?.id || courseId}/video/${
                  prevVideo.name
                }`
              );
            }
          }}>
          Previous Video
        </button>
        <button
          className="nav-button next"
          disabled={currentVideoIndex >= videos.length - 1}
          onClick={() => {
            if (currentVideoIndex < videos.length - 1) {
              const nextVideo = videos[currentVideoIndex + 1];
              navigate(
                `/course/${currentCourse?.id || courseId}/video/${
                  nextVideo.name
                }`
              );
            }
          }}>
          Next Video
        </button>
      </div>
    </div>
  );
}
