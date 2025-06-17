// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("codeplayground-user");
  return user ? children : <Navigate to="/login" />;
}
