import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PublicRoute component restricts access to authenticated users.
 * If the user is authenticated, they are redirected to the /admin page.
 * Otherwise, the desired component is rendered.
 *
 * @param {React.Component} children - The component to render if not authenticated.
 */
const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/admin" replace />; // Ensure path starts with /
  }

  return children;
};

export default PublicRoute;