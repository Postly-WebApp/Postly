import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ExitToApp from "@mui/icons-material/ExitToApp";
import "./topbar.css";
import noAvatar from "../../Images/noAvatar.png";

export default function Topbar({ setSearchTerm }) {
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const navigate = useNavigate();

  // State for user data
  const [currentUser, setCurrentUser] = useState(null);

  // State for the search term

  // State for search results

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/user", {
        withCredentials: true,
      });
      setCurrentUser(response.data);
      console.log("====================================");
      console.log("currentUser:", response.data);
      console.log("====================================");
    } catch (error) {
      console.error(
        "Error fetching current user:",
        error.response?.data || error.message
      );
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log(" successful");
        window.location.href = "/login";
      } else {
        console.error(" error:", response.data);
      }
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">POSTLY</span>
      </div>
      {currentUser &&
        currentUser.username &&
        currentUser.username.toLowerCase() === "adminadmin" && (
          <Button component={Link} to="/Home/AdminDashboard" color="inherit">
            <span className="admin">Admin Panel</span>
          </Button>
        )}

      <div className="topbarCenter">
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search"
            className="searchInput"
            onChange={handleSearch}
          />
          <Button className="searchButton">
            <SearchIcon className="searchIcon" />
          </Button>
        </div>
      </div>
      <div className="topbarRight">
        <Button onClick={goToProfile} className="userInfo">
          <img
            src={currentUser?.profilePic ? currentUser.profilePic : noAvatar}
            alt="User profile"
            className="topbarImg"
          />
          <span className="user-Name">{currentUser?.username}</span>
        </Button>
        <li className="sidebarListItem">
          <ExitToApp className="sidebarIcon" />
          <span className="sidebarListItemText" onClick={handleLogout}>
            Log out
          </span>
        </li>
      </div>
    </div>
  );
}
