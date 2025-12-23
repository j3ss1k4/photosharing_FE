import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
} from "@mui/material";
import { getData, handleData } from "../../modelData/api.js";
import "./styles.css";
import { API } from "../../App.js";

// --- Format Date ---
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function PhotoComments({ photoId, initialComments, currentUser }) {
  const [comments, setComments] = useState(initialComments || []);
  const [refresh, setRefresh] = useState(false); // 

  const [newCommentText, setNewCommentText] = useState("");
  const [editCmtId, setEditCmtId] = useState(null);
  const [editCmtText, setEditCmtText] = useState("");

  useEffect(() => {
    if (refresh) {
      getData(`${API}/api/comment/${photoId}`)
        .then((data) => {
          setComments(data);
          setRefresh(false); 
        })
        .catch((err) => {
          console.error("Load comments error:", err);
          setRefresh(false);
        });
    }
  }, [refresh, photoId]);

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const payload = { comment: newCommentText };
    handleData(`${API}/api/comment/commentsOfPhoto/${photoId}`, "POST", payload)
      .then(() => {
        setNewCommentText(""); 
        setRefresh(true); 
      })
      .catch((err) => alert("Add failed: " + err.message));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      const data = { photo_id: photoId, cmt_id: commentId };
      handleData(API + "/api/comment", "DELETE", data)
        .then((data) => {
          console.log(data);
          setRefresh(true); 
        })
        .catch((err) => {
          console.log(err);
          alert("Delete failed");
        });
    }
  };

  const handleSaveEdit = (cmtId) => {
    if (!editCmtText.trim()) return;
    const payload = { comment: editCmtText, photo_id: photoId, cmt_id: cmtId };

    handleData(`${API}/api/comment/edit/${cmtId}`, "PUT", payload)
      .then(() => {
        setEditCmtId(null); 
        setRefresh(true); // <--- Trigger load lại danh sách
      })
      .catch((err) => alert("Update failed: " + err.message));
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <h3>Comments</h3>
      
      {comments.length > 0 ? (
        comments.map((cmt) => {
          const isEditing = editCmtId === cmt._id;
          const cmtUser = cmt.user_id || {};
          const isOwner = currentUser && currentUser._id === cmtUser._id;

          return (
            <div key={cmt._id} style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
              {isEditing ? (
                <div>
                  <input 
                    type="text" 
                    value={editCmtText} 
                    onChange={(e) => setEditCmtText(e.target.value)}
                    style={{ width: "70%", padding: "5px", marginRight: "5px" }}
                  />
                  <button onClick={() => handleSaveEdit(cmt._id)}>Save</button>
                  <button onClick={() => setEditCmtId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <div>
                    <Link to={`/users/${cmtUser._id}`} style={{ fontWeight: "bold", textDecoration: "none" }}>
                      {cmtUser.first_name ? `${cmtUser.first_name} ${cmtUser.last_name}` : "Unknown"}
                    </Link>
                    <span style={{ fontSize: "0.8em", color: "gray", marginLeft: "10px" }}>
                      {formatDate(cmt.date_time)}
                    </span>
                  </div>

                  <div style={{ margin: "5px 0" }}>{cmt.comment}</div>

                  {/* {isOwner && (
                    <div>
                      <button 
                        onClick={() => { setEditCmtId(cmt._id); setEditCmtText(cmt.comment); }} 
                        style={{ marginRight: "5px" }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(cmt._id)}>Delete</button>
                    </div>
                  )} */}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p style={{ fontStyle: "italic", color: "gray" }}>No comments yet.</p>
      )}

      {currentUser && (
        <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
            <input 
                type="text"
                placeholder="Add a comment..."
                style={{ flexGrow: 1, padding: "8px" }}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyPress={(e) => { if (e.key === "Enter") handleAddComment(); }}
            />
            <button onClick={handleAddComment} disabled={!newCommentText}>Send</button>
        </div>
      )}
    </div>
  );
}
function UserPhotos({ currentUser, advancedFeatures }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("Loading ...");
  const [likeNum, setLikeNum] = useState({});

  useEffect(() => {
    setStatus("Loading ...");
    getData(API + "/api/photo/" + userId)
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data);
          let likes = {};
          data.forEach(p => likes[p._id] = p.likes ? p.likes.length : 0);
          setLikeNum(likes);
          setStatus("OK");
        } else {
          setPhotos([]);
          setStatus("No photos found");
        }
      })
      .catch((e) => {
        console.error(e);
        setStatus("Error loading photos");
      });
  }, [userId]);

  const handleDeletePhoto = (pId) => {
      handleData(`${API}/api/photo/${pId}`, "DELETE")
        .then(() => {
          setPhotos(prev => prev.filter(p => p._id !== pId));
        })
        .catch((err) => alert("Delete failed: " + err.message));
  };

  const handleLike = (pId) => {
    let currentLike = likeNum[pId] + 1;
    setLikeNum((prev) => ({ ...prev, [pId]: currentLike }));
  };

  const renderPhotoCard = (photo) => {
    if (!photo) return null;
    return (
      <Card key={photo._id} style={{ marginBottom: "30px", padding: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
              <b>{formatDate(photo.date_time)}</b> <br/>
              <small>{photo.file_name}</small>
          </div>
          {/* {currentUser && currentUser._id === photo.user_id && (
              <button onClick={() => handleDeletePhoto(photo._id)}>Delete Photo</button>
          )} */}
        </div>

        <div style={{ margin: "10px 0", textAlign: "center" }}>
            <img 
                src={`${API}/api/photo/images/${photo.file_name}`} 
                alt={photo.file_name}
                style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} 
            />
        </div>

        {/* <div style={{ marginBottom: "10px" }}>
             <button onClick={() => handleLike(photo._id)}>Like</button> 
             <span style={{ marginLeft: "5px" }}>{likeNum[photo._id]} likes</span>
        </div> */}

        <hr />

        <PhotoComments 
            photoId={photo._id} 
            initialComments={photo.comments} 
            currentUser={currentUser} 
        />
      </Card>
    );
  };

  // ADVANCED FEATURES 
  let content;
  if (status !== "OK") {
    content = <Typography variant="h6">{status}</Typography>;
  } else if (photos.length === 0) {
    content = <Typography>No photos available for this user.</Typography>;
  } else if (advancedFeatures) {
    //  STEPPER
    let currentPhoto = photos.find((p) => p._id === photoId);
    if (!currentPhoto && photos.length > 0) currentPhoto = photos[0];

    const currentIndex = photos.indexOf(currentPhoto);

    const handleNext = () => {
      const nextPhoto = photos[currentIndex + 1];
      if (nextPhoto) navigate(`/photos/${userId}/${nextPhoto._id}`);
    };

    const handlePrev = () => {
      const prevPhoto = photos[currentIndex - 1];
      if (prevPhoto) navigate(`/photos/${userId}/${prevPhoto._id}`);
    };

    content = (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Button variant="contained" color="secondary" disabled={currentIndex <= 0} onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="contained" color="secondary" disabled={currentIndex >= photos.length - 1} onClick={handleNext}>
            Next
          </Button>
        </div>
        {renderPhotoCard(currentPhoto)}
      </div>
    );
  } else {
    content = photos.map((photo) => renderPhotoCard(photo));
  }

  return (
    <div>
      <Typography variant="h4">
        Photo Stream {advancedFeatures ? "(Advanced)" : ""}
      </Typography>
      {content}
    </div>
  );
}

export default UserPhotos;