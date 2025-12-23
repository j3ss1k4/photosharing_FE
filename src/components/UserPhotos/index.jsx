import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { getData, handleData } from "../../modelData/api.js";
import "./styles.css";
import { API } from "../../App.js";

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

function UserPhotos({ currentUser, advancedFeatures }) {
  // const user = useParams();
  const { userId, photoId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("Loading ...");
  const [refresh, setRefresh] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    setStatus("Loading ...");
    getData(API + "/api/photo/" + userId)
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data);
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
  }, [userId, refresh]);

  const handleDeletePhoto = (photoId) => {
      handleData(`${API}/api/photo/${photoId}`, "DELETE")
        .then(() => {
          setRefresh(!refresh); 
        })
        .catch((err) => alert("Delete failed: " + err.message));
  };

  const handleCommentChange = (photoId, value) => {
    setCommentInputs((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleSubmitComment = (photoId) => {
    const commentText = commentInputs[photoId];
    if (!commentText || commentText.trim() === "") return;

    const payload = { comment: commentText };

    handleData(`${API}/api/comment/commentsOfPhoto/${photoId}`, "POST", payload)
      .then(() => {
        setCommentInputs((prev) => ({ ...prev, [photoId]: "" }));
        setRefresh(!refresh); // Load lại danh sách
      })
      .catch((err) => alert("Comment failed: " + err.message));
  };

  const handleDeleteComment = (photoId, cmtId) => {
    if (window.confirm("Delete this comment?")) {
      // API xóa comment thường cần biết xóa comment nào của ảnh nào
      // Tùy backend của bạn, có thể gửi body hoặc dùng params
      const payload = { photo_id: photoId, cmt_id: cmtId };

      handleData(`${API}/api/comment`, "DELETE", payload)
        .then(() => {
          setRefresh(!refresh);
        })
        .catch((err) => alert("Delete comment failed: " + err.message));
    }
  };

  // basic
  // return (
  //   <div style={{ padding: "20px" }}>
  //     <Typography variant="h4" gutterBottom style={{ marginBottom: "20px" }}>
  //       Photo Stream
  //     </Typography>

  //     {status === "OK" ? (
  //       photos.length > 0 ? (
  //         photos.map((photo) => (
  //           <Card
  //             key={photo._id}
  //             style={{
  //               marginBottom: "40px",
  //               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  //             }}
  //           >
  //             {/* PHẦN 1: HEADER CỦA ẢNH */}
  //             <CardHeader
  //               avatar={
  //                 <Avatar sx={{ bgcolor: red[500] }} aria-label="photo">
  //                   P
  //                 </Avatar>
  //               }
  //               // KIỂM TRA QUYỀN: Thay IconButton bằng Button chữ "Delete"
  //               action={
  //                 currentUser && currentUser._id === photo.user_id ? (
  //                   <Button
  //                     variant="outlined"
  //                     size="small"
  //                     color="error"
  //                     onClick={() => handleDeletePhoto(photo._id)}
  //                   >
  //                     Delete Photo
  //                   </Button>
  //                 ) : null
  //               }
  //               title={formatDate(photo.date_time)}
  //               subheader={`File: ${photo.file_name}`}
  //             />

  //             {/* PHẦN 2: HÌNH ẢNH CHÍNH */}
  //             <CardMedia
  //               component="img"
  //               image={`${API}/api/photo/images/${photo.file_name}`}
  //               alt={photo.file_name}
  //               style={{
  //                 maxHeight: "500px",
  //                 objectFit: "contain",
  //                 backgroundColor: "#f5f5f5",
  //               }}
  //             />

  //             {/* PHẦN 3: KHUNG COMMENT */}
  //             <CardContent>
  //               <Typography variant="h6" gutterBottom>
  //                 Comments
  //               </Typography>

  //               {photo.comments && photo.comments.length > 0 ? (
  //                 <List sx={{ width: "100%", bgcolor: "background.paper" }}>
  //                   {photo.comments.map((cmt) => (
  //                     <div key={cmt._id}>
  //                       <ListItem
  //                         alignItems="flex-start"
  //                         // KIỂM TRA QUYỀN XÓA COMMENT: Thay icon bằng Button chữ "Delete"
  //                         secondaryAction={
  //                           currentUser &&
  //                           currentUser._id === cmt.user_id._id ? (
  //                             <Button
  //                               size="small"
  //                               color="error"
  //                               onClick={() =>
  //                                 handleDeleteComment(photo._id, cmt._id)
  //                               }
  //                             >
  //                               Delete
  //                             </Button>
  //                           ) : null
  //                         }
  //                       >
  //                         <ListItemAvatar>
  //                           <Avatar alt="User Avatar">
  //                             {cmt.user_id?.first_name?.charAt(0) || "?"}
  //                           </Avatar>
  //                         </ListItemAvatar>

  //                         <ListItemText
  //                           primary={
  //                             <Link
  //                               to={`/users/${cmt.user_id?._id}`}
  //                               style={{
  //                                 textDecoration: "none",
  //                                 fontWeight: "bold",
  //                                 color: "#1976d2",
  //                               }}
  //                             >
  //                               {cmt.user_id
  //                                 ? `${cmt.user_id.first_name} ${cmt.user_id.last_name}`
  //                                 : "Unknown User"}
  //                             </Link>
  //                           }
  //                           secondary={
  //                             <>
  //                               <Typography
  //                                 component="span"
  //                                 variant="body2"
  //                                 color="text.primary"
  //                                 style={{ display: "block", margin: "4px 0" }}
  //                               >
  //                                 {cmt.comment}
  //                               </Typography>
  //                               <Typography
  //                                 variant="caption"
  //                                 color="text.secondary"
  //                               >
  //                                 {formatDate(cmt.date_time)}
  //                               </Typography>
  //                             </>
  //                           }
  //                         />
  //                       </ListItem>
  //                       <Divider variant="inset" component="li" />
  //                     </div>
  //                   ))}
  //                 </List>
  //               ) : (
  //                 <Typography
  //                   variant="body2"
  //                   color="text.secondary"
  //                   style={{ fontStyle: "italic", marginBottom: "15px" }}
  //                 >
  //                   No comments yet. Be the first to comment!
  //                 </Typography>
  //               )}
  //             </CardContent>

  //             {/* PHẦN 4: THÊM COMMENT */}
  //             <CardActions
  //               disableSpacing
  //               style={{ padding: "16px", paddingTop: 0 }}
  //             >
  //               {currentUser ? (
  //                 <Box
  //                   sx={{
  //                     display: "flex",
  //                     alignItems: "center",
  //                     width: "100%",
  //                     gap: 1, // Khoảng cách giữa input và nút
  //                   }}
  //                 >
  //                   <TextField
  //                     fullWidth
  //                     size="small"
  //                     label="Add a comment..."
  //                     variant="outlined"
  //                     value={commentInputs[photo._id] || ""}
  //                     onChange={(e) =>
  //                       handleCommentChange(photo._id, e.target.value)
  //                     }
  //                     onKeyPress={(e) => {
  //                       if (e.key === "Enter") handleSubmitComment(photo._id);
  //                     }}
  //                   />
  //                   {/* Thay SendIcon bằng Button chữ "Send" */}
  //                   <Button
  //                     variant="contained"
  //                     color="primary"
  //                     onClick={() => handleSubmitComment(photo._id)}
  //                     disabled={!commentInputs[photo._id]}
  //                   >
  //                     Send
  //                   </Button>
  //                 </Box>
  //               ) : (
  //                 <Typography variant="body2" color="error">
  //                   Please login to comment.
  //                 </Typography>
  //               )}
  //             </CardActions>
  //           </Card>
  //         ))
  //       ) : (
  //         <Typography>No photos available for this user.</Typography>
  //       )
  //     ) : (
  //       <Typography variant="h6">{status}</Typography>
  //     )}
  //   </div>
  // );

  // advanced
  const getPhotoCard = (photo) => {
    if (!photo) return null;
    return (
      <Card
        key={photo._id}
        style={{
          marginBottom: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardHeader
          // avatar={<Avatar sx={{ bgcolor: red[500] }}>P</Avatar>}
          action={
            currentUser && currentUser._id === photo.user_id ? (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => handleDeletePhoto(photo._id)}
              >
                Delete Photo
              </Button>
            ) : null
          }
          title={formatDate(photo.date_time)}
          subheader={`File: ${photo.file_name}`}
        />
        <CardMedia
          component="img"
          image={`${API}/api/photo/images/${photo.file_name}`}
          alt={photo.file_name}
          style={{
            maxHeight: "500px",
            objectFit: "contain",
            backgroundColor: "#f5f5f5",
          }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          {photo.comments && photo.comments.length > 0 ? (
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {photo.comments.map((cmt) => (
                <div key={cmt._id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      currentUser && currentUser._id === cmt.user_id._id ? (
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteComment(photo._id, cmt._id)
                          }
                        >
                          Delete
                        </Button>
                      ) : null
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt="User Avatar">
                        {cmt.user_id?.first_name?.charAt(0) || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link
                          to={`/users/${cmt.user_id?._id}`}
                          style={{
                            textDecoration: "none",
                            fontWeight: "bold",
                            color: "#1976d2",
                          }}
                        >
                          {cmt.user_id
                            ? `${cmt.user_id.first_name} ${cmt.user_id.last_name}`
                            : "Unknown User"}
                        </Link>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            style={{ display: "block", margin: "4px 0" }}
                          >
                            {cmt.comment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(cmt.date_time)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ fontStyle: "italic", marginBottom: "15px" }}
            >
              No comments yet.
            </Typography>
          )}
        </CardContent>
        <CardActions disableSpacing style={{ padding: "16px", paddingTop: 0 }}>
          {currentUser ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Add a comment..."
                variant="outlined"
                value={commentInputs[photo._id] || ""}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSubmitComment(photo._id);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmitComment(photo._id)}
                disabled={!commentInputs[photo._id]}
              >
                Send
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="error">
              Please login to comment.
            </Typography>
          )}
        </CardActions>
      </Card>
    );
  };

  // --- 4. LOGIC STEPPER (ADVANCED FEATURES) ---
  let content;
  if (status !== "OK") {
    content = <Typography variant="h6">{status}</Typography>;
  } else if (photos.length === 0) {
    content = <Typography>No photos available for this user.</Typography>;
  } else if (advancedFeatures) {
    // --- CHẾ ĐỘ NÂNG CAO (1 ẢNH + STEPPER) ---

    // Tìm ảnh hiện tại dựa trên URL photoId, nếu không có lấy ảnh đầu tiên
    let currentPhoto = photos.find((p) => p._id === photoId);
    if (!currentPhoto) {
      currentPhoto = photos[0];
    }
    const currentIndex = photos.indexOf(currentPhoto);

    // Hàm chuyển ảnh
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            disabled={currentIndex <= 0}
            onClick={handlePrev}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={currentIndex >= photos.length - 1}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
        {/* Chỉ hiển thị 1 ảnh */}
        {getPhotoCard(currentPhoto)}
      </div>
    );
  } else {
    // --- CHẾ ĐỘ THƯỜNG (DANH SÁCH DỌC) ---
    content = photos.map((photo) => getPhotoCard(photo));
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: "20px" }}>
        Photo Stream {advancedFeatures ? "(Advanced)" : ""}
      </Typography>
      {content}
    </div>
  );
}

export default UserPhotos;
