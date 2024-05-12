import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import noAvatar from "../../Images/noAvatar.png";
import "./profile.css";

import Post from "../../components/post/Post";

export default function ProfilePage() {
  // State variables for user data
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [userId, setUserId] = useState([]);

  // Fetch current user data on component mount
  useEffect(() => {
    fetchCurrentUser();
    getUserPosts();
  }, []);

  // Function to fetch current user data
  const fetchCurrentUser = async (userId) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/user", {
        withCredentials: true,
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error(
        "Error fetching current user:",
        error.response?.data || error.message
      );
    }
  };

  // Function to handle profile image change
  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };

      reader.readAsDataURL(file);

      // Make API call to save the profile image
      try {
        console.log(file);
        const response = await axios.put(
          "http://localhost:5000/api/users/user/Pic",
          { profilePic: file.name },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          fetchCurrentUser();
        }
      } catch (error) {
        console.error(
          "Error updating email:",
          error.response?.data || error.message
        );
      }
    }
  };
  // GET /api/posts/user/    // Function to handle cover photo change

  const getUserPosts = async (event) => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts/user", {
        withCredentials: true,
      });
      //    setCurrentUser(response.data);
      setUserPosts(response.data);
      console.log(response);
    } catch (error) {
      console.error(
        "Error fetching current user:",
        error.response?.data || error.message
      );
    }
  };
  const sortedPosts = userPosts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Function to handle email change
  const handleEmailChange = async () => {
    if (newEmail) {
      try {
        const email = {
          email: newEmail,
        };
        const response = await axios.put(
          "http://localhost:5000/api/users/user/email",
          email,
          {
            withCredentials: true,
          }
        );
        // Check the response status and handle accordingly
        if (response.status === 200) {
          console.log("Email updated successfully.");
        }
      } catch (error) {
        console.error(
          "Error updating email:",
          error.response?.data || error.message
        );
      }
    }
  };

  // Function to handle password change
  const handlePasswordChange = async () => {
    if (newPassword) {
      try {
        const password = {
          password: newPassword,
        };
        const response = await axios.put(
          "http://localhost:5000/api/users/user/password",
          password,
          {
            withCredentials: true,
          }
        );

        // Check the response status and handle accordingly
        if (response.status === 200) {
          console.log("Password updated successfully.");
          // Reload the current user data to reflect changes
          fetchCurrentUser();
        }
      } catch (error) {
        console.error(
          "Error updating password:",
          error.response?.data || error.message
        );
      }
    }
  };

  return (
    <div className="cont1">
      <div className="cont">
        <div className="userProfile">
          <div className="profile-info">
            <img
              src={currentUser?.profilePic ? currentUser.profilePic : noAvatar}
              alt="Profile"
              className="profile-picture"
            />
            <div className="user-name">
              <span className="userName">
                {currentUser?.username ? currentUser.username : ""}
              </span>
            </div>

            <div className="profile-button">
              <button
                className="changephoto"
                onClick={() =>
                  document.getElementById("profile-image-upload").click()
                }
              >
                Change Profile Photo
              </button>

              <input
                type="file"
                accept="image/*"
                id="profile-image-upload"
                style={{ display: "none" }}
                onChange={handleProfileImageChange}
              />
            </div>

            <div className="profile-button">
              <button
                className="editInfo"
                onClick={() => setShowEditEmail((prev) => !prev)}
              >
                Edit Email
              </button>
              {showEditEmail && (
                <div>
                  <h3>Edit Email</h3>
                  <input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button onClick={handleEmailChange}>Save Email</button>
                </div>
              )}

              <button
                className="editInfo"
                onClick={() => setShowEditPassword((prev) => !prev)}
              >
                Edit Password
              </button>
              {showEditPassword && (
                <div>
                  <h3>Edit Password</h3>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button onClick={handlePasswordChange}>Save Password</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="postmap">
        {currentUser &&
          currentUser.username &&
          sortedPosts.map((post) => <Post key={post.id} post={post} />)}
      </div>
      <div className="homeContainer"></div>
    </div>
  );
}
