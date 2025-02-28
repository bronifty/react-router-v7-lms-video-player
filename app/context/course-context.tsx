import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import coursesData from "../../data/courses.json";
import cloudFrontVideos from "../../data/cloudfront_videos.json";
import ardanLabsVideos from "../../data/ardanlabsultimateservicewithgo_videos.json";

// Define types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videosFile: string;
}

export interface Video {
  name: string;
  url: string;
}

interface CourseContextType {
  courses: Course[];
  currentCourse: Course | null;
  setCurrentCourseById: (courseId: string) => void;
  isLoading: boolean;
  getVideosForCourse: (courseId: string) => Video[];
}

// Create a map of course IDs to their video data
const videoDataMap: Record<string, Video[]> = {
  "go-programming": cloudFrontVideos.videos.map((video) => ({
    name: video.name,
    url: video.url,
  })),
  "ardanlabs-ultimate-service-with-go": ardanLabsVideos.videos.map((video) => ({
    name: video.file || video.name || "",
    url: video.url,
  })),
};

// Create the context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Provider component
export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load courses on initial render
  useEffect(() => {
    setCourses(coursesData.courses);

    // Set default course
    if (coursesData.courses.length > 0) {
      setCurrentCourse(coursesData.courses[0]);
    }

    setIsLoading(false);
  }, []);

  // Function to set current course by ID
  const setCurrentCourseById = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setCurrentCourse(course);
    }
  };

  // Function to get videos for a specific course
  const getVideosForCourse = (courseId: string): Video[] => {
    return videoDataMap[courseId] || [];
  };

  // Context value
  const value = {
    courses,
    currentCourse,
    setCurrentCourseById,
    isLoading,
    getVideosForCourse,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

// Custom hook to use the course context
export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
}
