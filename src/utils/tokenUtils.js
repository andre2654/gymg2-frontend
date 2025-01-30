import { jwtDecode } from "jwt-decode"; // Correct default import

/**
 * Checks if a JWT token is expired.
 *
 * @param {string} token - The JWT token.
 * @returns {boolean} - True if expired or invalid, false otherwise.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    const expired = decoded.exp < currentTime;
    return expired;
  } catch (error) {
    // Suppress the error message
    //console.error("Failed to decode token:", error.message);
    return true;
  }
};