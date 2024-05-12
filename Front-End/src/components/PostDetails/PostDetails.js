import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
} from "@mui/material";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [commentAuthors, setCommentAuthors] = useState("");
  const [comments, setComments] = useState([]);
  const [commented, addComment] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postsResponse = await axios.get(
          `http://localhost:5000/api/posts`
        );
        const foundPost = postsResponse.data.find((post) => post._id === id);
        if (foundPost) {
          setPost(foundPost);
          const userResponse = await axios.get(
            `http://localhost:5000/api/users`
          );
          const Creator = userResponse.data.users.find(
            (user) => user._id === foundPost.userID
          );
          setUser(Creator);

          const commentsResponse = await axios.get(
            `http://localhost:5000/api/comments/${id}`
          );
          const commentAuthors = {};
          const comments = commentsResponse.data;
          setComments(comments);

          // Fetch comment authors in parallel
          await Promise.all(
            comments.map(async (comment) => {
              const userResponse = await axios.get(
                `http://localhost:5000/api/users/${comment.author}`
              );
              commentAuthors[comment.author] = userResponse.data.username;
            })
          );

          setCommentAuthors(commentAuthors);
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const data = {
    text: comment,
    postID: id,
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const data = {
        text: comment,
        postID: id,
      };

      const response = await fetch("http://localhost:5000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();
      setComments([...comments, newComment]);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
    window.location.reload();
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
        <div>
          <Typography variant="body2" color="text.secondary">
            By <Link to={`/user/${user.id}`}>{user.username}</Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Typography>
        </div>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        {post.img && (
          <img
            src={post.img}
            onError={(e) => {
              e.target.src =
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
            }}
            alt=""
            className="w-full mb-4 rounded-lg"
          />
        )}
        <Typography variant="body1" component="p" gutterBottom>
          {post.desc}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <Heart size={20} fill="#FF0000" /> {post.likes} Likes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {comments.length} Comments
          </Typography>
        </div>
        <div style={{ marginTop: "20px" }}>
          <TextField
            variant="outlined"
            label="Add a comment..."
            fullWidth
            value={comment}
            onChange={handleCommentChange}
          />
          <Button
            variant="contained"
            type="submit"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handleSubmitComment}
          >
            Add Comment
          </Button>
        </div>
        <List style={{ marginTop: "20px" }}>
          {comments.map((comment) => (
            <ListItem
              key={comment._id}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", marginRight: "5px" }}
              >
                {commentAuthors[comment.author]}:
              </Typography>
              <Typography variant="body2">{comment.text}</Typography>
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
};

export default PostDetails;
