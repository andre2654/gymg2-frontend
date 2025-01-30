import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useDispatch } from "react-redux";
import { setAuthTokens, setUserData } from "store/slices/auth"; // Import setUserData
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Username and Password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL_AUTH}/profile/authentication/token`;
      const response = await axios.post(apiUrl, {
        username,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000",
        }
      });

      // Axios automatically throws for status codes outside the 2xx range
      const { access, refresh } = response.data;

      // Ensure that the tokens are valid JWTs
      if (access && refresh) {
        dispatch(setAuthTokens({ token: access, refreshToken: refresh })); // Dispatch setAuthTokens

        // Decode the access token to get the user ID
        const decoded = jwtDecode(access);
        const userId = decoded.user_id;

        // Fetch user data using the user ID
        const userResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        dispatch(setUserData(userResponse.data)); // Dispatch setUserData
        navigate("/admin");
      } else {
        setError("Invalid tokens received from server.");
        console.error("Invalid tokens:", response.data);
      }
    } catch (error) {
      console.error("Login failed", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.detail || "Login failed. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        setError("No response from server. Please try again later.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Sign In</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">Enter your username and password to sign in!</p>
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">Sign In with Google</h5>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">or</p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username*
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Min. 8 characters"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">Keep me logged In</p>
            </div>
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href="/forgot-password"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && (
            <div className="mb-4 text-red-500" role="alert">
              {error}
            </div>
          )}
        </form>
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">Not registered yet?</span>
          <a href="/auth/register" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
