import store from "../store";
import { refreshAccessToken, logout } from "../store/slices/auth";
import { isTokenExpired } from "./tokenUtils"; // Import isTokenExpired

const authFetch = async (url, options = {}) => {
  // Define authentication endpoints that do not require token checks
  const authEndpoints = ["/authentication/token", "/profile/user"];

  // If the request is to an auth endpoint, skip token validation
  if (authEndpoints.includes(url)) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL_AUTH}${url}`, { // Ensure using REACT_APP_BASE_URL_AUTH
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("authFetch error (auth endpoint):", error);
      throw error;
    }
  }

  let state = store.getState();
  let token = state.auth.token;
  const refreshToken = state.auth.refreshToken;

  // Validate token expiration
  if (isTokenExpired(token)) {
    console.log("Token is expired.");
    if (refreshToken) {
      console.log("Attempting to refresh token...");
      // Attempt to refresh the token
      const refreshResult = await store.dispatch(refreshAccessToken(refreshToken));
      if (refreshAccessToken.fulfilled.match(refreshResult)) {
        token = refreshResult.payload.access;
        console.log("Token refreshed successfully:", token);
      } else {
        // Refresh token failed, perform logout
        console.error("Token refresh failed:", refreshResult.payload);
        store.dispatch(logout());
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      // No refresh token available, perform logout
      console.error("No refresh token available.");
      store.dispatch(logout());
      throw new Error("Session expired. Please log in again.");
    }
  } else {
    console.log("Token is valid.");
  }

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  try {
    let response = await fetch(`${process.env.REACT_APP_BASE_URL_AUTH}${url}`, { // Ensure using REACT_APP_BASE_URL_AUTH
      ...options,
      headers,
    });


    if (response.status === 401) {
      const errorData = await response.json();
      console.error("Unauthorized access:", errorData);
      if (errorData.code === "token_not_valid") {
        if (refreshToken) {
          console.log("Attempting to refresh token after 401 response...");
          // Attempt to refresh the token
          const refreshResult = await store.dispatch(refreshAccessToken(refreshToken));
          if (refreshAccessToken.fulfilled.match(refreshResult)) {
            // Retry the original request with the new token
            token = refreshResult.payload.access;
            headers.Authorization = `Bearer ${token}`;
            console.log("Token refreshed successfully. Retrying original request...");
            response = await fetch(`${process.env.REACT_APP_BASE_URL_AUTH}${url}`, { // Ensure using REACT_APP_BASE_URL_AUTH
              ...options,
              headers,
            });
            return response;
          } else {
            // Refresh token failed, perform logout
            console.error("Token refresh failed after 401 response:", refreshResult.payload);
            store.dispatch(logout());
            return response;
          }
        } else {
          // No refresh token available, perform logout
          console.error("No refresh token available after 401 response.");
          store.dispatch(logout());
          return response;
        }
      }
    }

    return response;
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
};

export default authFetch;
