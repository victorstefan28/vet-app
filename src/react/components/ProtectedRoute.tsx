import { Navigate } from "react-router-dom";
import { useProfile } from "../providers/profile";

const ProtectedRoute = ({ children }: any) => {
  const { selectedProfile } = useProfile();

  if (!selectedProfile) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
