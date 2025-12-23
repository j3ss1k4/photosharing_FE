import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Button,
  Alert,
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getData } from "../../modelData/api.js";
import { API } from "../../App.js";
// import "./styles.css";

// Hàm format ngày tháng cho đẹp
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function UserComments() {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    
    getData(`${API}/api/comment/commentsOfUser/${userId}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
          setStatus("OK");
        } else {
          setComments([]);
          setStatus("No comments found");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("Error loading comments");
      });
  }, [userId]);

  const handleCommentClick = (photoOwnerId, photoId) => {
    
    navigate(`/photos/${photoOwnerId}/${photoId}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Button
        variant="contained" 
        color="primary"     
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        User Comments History
      </Typography>

      <Paper elevation={3} style={{ padding: "10px" }}>
        {status !== "OK" ? (
          <Typography variant="body1" style={{ padding: "20px" }}>
            {status}
          </Typography>
        ) : comments.length === 0 ? (
          <Alert severity="info">This user has not commented on any photos.</Alert>
        ) : (
          <List>
            {comments.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  button 
                  onClick={() => handleCommentClick(item.photo_owner_id, item.photo_id)}
                  style={{ cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={`${API}/api/photo/images/${item.file_name}`}
                      alt="Photo thumbnail"
                      sx={{ width: 60, height: 60, marginRight: 2 }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold", color: "#1976d2" }}
                      >
                        "{item.comment}"
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          on photo: {item.file_name}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.date_time)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
}

export default UserComments;