import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isApproved } = useAuth();

  return isApproved ? children : <Navigate to="/"/>;
}
