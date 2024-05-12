import "./post.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import noAvatar from "../../Images/noAvatar.png";
import { MoreVert } from "@material-ui/icons"; // Import the MoreVert icon
import { Menu, MenuItem } from "@material-ui/core";

export default function Post({ post }) {
  const navigate = useNavigate();
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${post.userID}`,
          {
            withCredentials: true,
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/user",
          {
            withCredentials: true,
          }
        );
        setCurrentUser(response.data);
      } catch (error) {
        console.error(
          "Error fetching current user:",
          error.response?.data || error.message
        );
      }
    };

    getUserData();
    fetchCurrentUser();
  }, []); // Empty dependency array for one-time fetch on component mount

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteUser = (postid) => {
    fetch(`http://localhost:5000/api/posts/${postid}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        console.log("User deleted successfully");
      })
      .catch((error) => console.error("Error deleting user:", error));
    handleClose();
    window.location.reload();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log("Edit post");

    handleClose();
  };

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const PostDetails = () => {
    navigate("/post");
  };

  const humanReadableDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format the date and time as desired
    const formattedDateTime = `${day}/${month}/${year}  /  ${hours}:${minutes}`;
    return formattedDateTime;
  };

  const LikeHandler = (isLike) => {
    if (isLike) {
      setLikeCount((prevCount) => prevCount + 1);
    } else {
      setLikeCount((prevCount) => prevCount - 1);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {userData && (
              <>
                <img
                  className="postProfileImg"
                  src={userData.profilePic || noAvatar}
                  alt=""
                />
                <div className="userInfo">
                  <span className="postUsername">{userData.username}</span>
                  <span className="postDate">
                    {humanReadableDate(post.createdAt)}
                  </span>
                </div>
              </>
            )}
          </div>
          {currentUser &&
            currentUser.username === (userData?.username || null) && (
              <div className="postTopRight">
                <MoreVert className="icon-del" onClick={handleClick} />
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleDeleteUser(post._id)}>
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            )}
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src="assets/like.png"
              onClick={() => LikeHandler(true)}
              alt=""
            />
            <img
              className="likeIcon"
              src="assets/heart.png"
              onClick={() => LikeHandler(true)}
              alt=""
            />
            <span>{likeCount}</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={PostDetails}>
              comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
