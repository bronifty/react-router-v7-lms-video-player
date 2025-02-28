import VideoPlayer from "../components/video-player";
import ProtectedRoute from "../auth/protected-route";

export default function VideoRoute() {
  return (
    <ProtectedRoute>
      <VideoPlayer />
    </ProtectedRoute>
  );
}
