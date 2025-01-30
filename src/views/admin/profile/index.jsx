import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Banner from "./components/Banner";
import General from "./components/General";
import { useSelector } from "react-redux"; // Import useSelector

const ProfileOverview = () => {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.auth.token); // Access token from Redux

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;

        if (userId) {
          fetch(`${process.env.REACT_APP_BASE_URL}/profile/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              setUserData(data); // Changed from data[0] to data
            })
            .catch((error) => console.error("Error fetching user data:", error));
        } else {
          console.error("User ID not found in token.");
        }
      } catch (error) {
        // Suppress the error message
        //console.error("Error decoding token:", error.message);
      }
    } else {
      console.error("No access token found.");
    }
  }, [token]); // Add token as dependency

  useEffect(() => {}, [userData]);

  const handleUpdate = (updatedData) => {
    // Implement the update logic here, e.g., sending a PUT request to the API
    fetch(`${process.env.REACT_APP_BASE_URL}/profile/user/${updatedData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use token from Redux
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data updated:", data);
        setUserData(data);
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner userData={userData} />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General userData={userData} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
