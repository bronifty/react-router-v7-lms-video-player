// Alternative method if the video element is accessible on the page
function downloadVideoFromElement() {
  // Find the video element that's using the blob
  const videoElement = document.querySelector("video");

  if (!videoElement) {
    console.log("No video element found");
    return;
  }

  // Create a MediaRecorder to capture the video
  const stream = videoElement.captureStream();
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "downloaded_video.webm";
    a.click();

    URL.revokeObjectURL(url);
    console.log("Download complete");
  };

  // Start recording for the duration of the video
  console.log("Starting to record...");
  mediaRecorder.start();

  // Stop recording when video ends or after a set duration
  videoElement.onended = () => {
    mediaRecorder.stop();
  };

  // Backup in case video doesn't trigger onended
  setTimeout(() => {
    if (mediaRecorder.state === "recording") {
      console.log("Stopping recording after timeout");
      mediaRecorder.stop();
    }
  }, videoElement.duration * 1000 || 60000); // Use video duration or default to 60 seconds

  // Play the video to capture it
  videoElement.currentTime = 0;
  videoElement.play();
}
