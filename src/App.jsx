import React, { useEffect, useRef } from "react"; // Added useRef import
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUserData, logout, refreshAccessToken, setAuthTokens } from "store/slices/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Profile } from "./routes.js";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { isTokenExpired } from "./utils/tokenUtils";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const hasVerifiedAuth = useRef(false); // Initialize useRef to track verification

  useEffect(() => {
    if (hasVerifiedAuth.current) return; // Exit if already verified
    hasVerifiedAuth.current = true; // Set the ref to true to prevent future runs

    let isMounted = true; // Flag to prevent state updates on unmounted component

    const verifyAndFetchUser = async () => {
      if (token) {
        if (isTokenExpired(token)) {
          if (refreshToken) {
            try {
              const response = await dispatch(refreshAccessToken(refreshToken)).unwrap();
              dispatch(setAuthTokens({ token: response.access, refreshToken: response.refresh || refreshToken }));
              console.log("Access token refreshed successfully.");
            } catch (error) {
              console.error("Token refresh failed:", error);
              if (isMounted) dispatch(logout());
              return;
            }
          } else {
            if (isMounted) dispatch(logout());
            return;
          }
        }

        try {
          const decoded = jwtDecode(token);
          const userId = decoded.user_id;

          if (userId) {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/profile/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (isMounted) dispatch(setUserData(data));
            console.log("User data fetched successfully.");
          } else {
            console.error("User ID not found in token.");
            if (isMounted) dispatch(logout());
          }
        } catch (error) {
          //Disable the error message
          //console.error("Error fetching user data:", error);
          if (isMounted) dispatch(logout());
        }
      } else {
        if (isMounted) dispatch(logout());
      }
    };

    verifyAndFetchUser();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, [dispatch, token, refreshToken]);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/auth/*"
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rtl/*"
            element={
              <ProtectedRoute>
                <RtlLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/admin" replace />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
