import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/sidebar.tsx", [
    index("routes/home.tsx"),
    route("about", "./about.tsx"),
    route("course/:courseId", "./routes/course.tsx"),
    route("course/:courseId/video/:videoName", "./routes/video.tsx"),
    route("video/:videoName", "./routes/legacy-video.tsx"),
  ]),
  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),
] satisfies RouteConfig;
