import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to refresh access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/profile/authentication/token/refresh`,
        {
          refresh: refreshToken,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : { detail: "Token refresh failed" });
    }
  }
);

const initialState = {
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  account: null,
  status: 'idle', // new field to track refresh status
  error: null,    // new field to track refresh errors
  userData: null, // Added userData to state
  isAuth: false, // Add isAuth to track authentication status
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuth = true; // Set isAuth to true upon setting tokens
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    logout(state) {
      state.account = null;
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      state.userData = null; // Clear userData on logout
      state.isAuth = false; // Set isAuth to false upon logout
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.log("User logged out.");
    },
    setUserData: (state, action) => { // Ensure setUserData correctly sets userData
      state.userData = action.payload;
      state.isAuth = true; // Maintain isAuth status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        console.log("Refreshing token..."); // Debugging
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh || state.refreshToken; // Update refreshToken if provided
        state.isAuth = true; // Maintain isAuth upon successful refresh
        localStorage.setItem("token", action.payload.access);
        if (action.payload.refresh) {
          localStorage.setItem("refreshToken", action.payload.refresh);
        }
        state.status = 'succeeded';
        console.log("Token refreshed and state updated."); // Debugging
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.detail || "Failed to refresh token";
        console.error("Failed to refresh token:", state.error);
        // Trigger logout if refresh fails
        state.account = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuth = false; // Set isAuth to false upon failed refresh
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        console.log("User logged out due to failed token refresh."); // Debugging
      });
  },
});

export const { setAuthTokens, setAccount, logout, setUserData } = authSlice.actions; // Export setUserData
export default authSlice.reducer; // Export the reducer

