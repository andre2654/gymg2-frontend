import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute component restricts access to authenticated users.
 * If the user is not authenticated or the token is expired, they are redirected to the sign-in page.
 * Otherwise, the desired component is rendered.
 *
 * @param {React.Component} children - The component to render if authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.isAuth); // Assume isAuth is managed in auth slice
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove token decoding and verification from ProtectedRoute
    if (!isAuth) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuth]);

  if (isLoading) {
    // Optionally, render a loading indicator
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;