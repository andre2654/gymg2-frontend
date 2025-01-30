import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("trainer");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  // Add state for messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Add state for field-specific errors
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "first_name") setFirstName(value);
    if (name === "last_name") setLastName(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = { username, email, password, role, first_name, last_name };
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/profile/user`, formData);
      setSuccessMessage("Registration successful!");
      setErrorMessage("");
      setErrors({}); // Clear previous errors
      navigate("/auth/sign-in"); // Redirect to sign-in page
      // Handle successful registration
    } catch (error) {
      console.error("Registration error:", error.response.data);
      if (error.response && error.response.data) {
        setErrorMessage("Registration failed. Please fix the errors below.");
        setErrors(error.response.data); // Set field-specific errors
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      // Handle registration error
    }
  };

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Register section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Register
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your details to register!
        </p>
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Register with Google
          </h5>
        </div>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        <form onSubmit={handleRegister}>
          {/* First Name */}
          <div className="mb-3">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name*
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={first_name}
              onChange={handleInputChange}
              placeholder="Tiago"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name*
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={last_name}
              onChange={handleInputChange}
              placeholder="Fernandes"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
            )}
          </div>

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
              placeholder="tiago"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="mail@simmmple.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          <button type="submit" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Register
          </button>
        </form>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <a
            href="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
