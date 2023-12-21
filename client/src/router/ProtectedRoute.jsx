import useAuth from "hooks/useAuth";
import { Navigate, useLocation } from "react-router";

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    if (!user) {
      return (
        <Navigate
          replace
          to={`/auth/login${
            pathname ? `?url=${window.encodeURIComponent(pathname)}` : ""
          }`}
        />
      );
    } else {
      return children;
    }
  }
};

export default ProtectedRoute;
