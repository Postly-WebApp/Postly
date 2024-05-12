import React, { useState } from 'react';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import CancelIcon from '@mui/icons-material/Cancel'; 
import "./share.css";

export default function Share() {
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [feedPosts, setFeedPosts] = useState([]);

    const handlePost = () => {
        console.log("Post content:", postContent);
    
        const data = {
          desc: postContent,
          img: selectedFile ? selectedFile.name : null,
        };
    
        fetch("http://localhost:5000/api/posts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Post in API:", data);
            setFeedPosts([data, ...feedPosts]);
            // Refresh the page after successful API request
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error storing post in API:", error);
          });
    
        setPostContent("");
        setSelectedFile(null);
        setPostImage(null);
      };

       

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setPostImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleRemovePicture = () => {
        setPostImage(null);
        setSelectedFile(null);
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    
                    <input
                        placeholder="What's in your mind?"
                        className="shareInput"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                </div>
                <hr className="shareHr"/>
                <div className="shareBottom">
                    <div className="shareOptions">
                        <div className="shareOption">
                            <PermMediaIcon htmlColor="tomato" className="shareIcon"/>
                            <label htmlFor="fileInput" className="shareOptionText">Photo or Video</label>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*, video/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </div>
                        {postImage && (
                            <div className="selectedImageContainer">
                                <img src={postImage} alt="Selected" className="selectedImage" />
                                <button className="removeButton" onClick={handleRemovePicture}>
                                    <CancelIcon />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <button className="shareButton" onClick={handlePost}>Share</button>
                </div>
            </div>
            <div className="feed">
                {feedPosts.map((post, index) => (
                    <div key={index} className="post">
                        <p>{post.content}</p>
                        {post.image && <img src={post.image} alt="Post" />}
                    </div>
                ))}
            </div>
        </div>
    );
}