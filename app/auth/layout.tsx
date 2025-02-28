import { Outlet } from "react-router";
import "../styles/auth.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-background">
        <div className="auth-logo">
          <h1>Video Library</h1>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
